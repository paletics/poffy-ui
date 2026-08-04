import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { domMax, type FeatureBundle, type LazyFeatureBundle } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@/styled-system/styles.css';
import { Button } from '@/components/inputs/Button';
import { ButtonGroup } from '@/components/inputs/ButtonGroup';
import { AnimationProvider, useAnimation } from '@/providers/AnimationProvider';
import { MotionProvider } from '@/providers/MotionProvider';
import { ActionMotion } from './ActionMotion/ActionMotion';
import { ListTransition } from './ListTransition/ListTransition';
import { PathDrawTransition } from './PathDrawTransition/PathDrawTransition';
import { StaggerTransition } from './StaggerTransition/StaggerTransition';
import { useHydrated } from './useHydrated';
import {
  collectTerminalFrames,
  createDeferred,
  expectTerminalMotionPromptly,
  isActiveMotionFrame,
  isTerminalMotionFrame,
  observeMotionUntilSettled,
  readMotionFrame,
  readDrawProgress,
  waitForActiveMotion,
  waitForTerminalMotion,
} from './tests/animationBrowserTestUtils';

const Providers = ({
  children,
  features,
}: {
  children: ReactNode;
  features: FeatureBundle | LazyFeatureBundle;
}) => (
  <AnimationProvider global={false}>
    <MotionProvider features={features}>{children}</MotionProvider>
  </AnimationProvider>
);

const HydrationProbe = () => {
  const isHydrated = useHydrated();
  return <output aria-label="Hydration state">{String(isHydrated)}</output>;
};

const PolicyControls = () => {
  const { setAnimationEnabled } = useAnimation();
  return (
    <>
      <button type="button" onClick={() => setAnimationEnabled(false)}>
        Disable animation
      </button>
      <button type="button" onClick={() => setAnimationEnabled(true)}>
        Enable animation
      </button>
    </>
  );
};

const ToggleDrawing = () => {
  const [visible, setVisible] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setVisible((current) => !current)}>
        Toggle drawing
      </button>
      <PathDrawTransition role="img" aria-label="Drawing" isVisible={visible}>
        <PathDrawTransition.Polyline points="20 6 9 17 4 12" />
      </PathDrawTransition>
    </>
  );
};

beforeEach(() => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * ### Test Strategy: animation resilience
 * - **Focus**: Real Motion behavior across delayed features, policy interruption, and variant trees.
 * - **DON'T**: Assert exact durations or private implementation callbacks.
 */
describe('animation resilience', () => {
  it('plays a List entrance after deferred LazyMotion features become available', async () => {
    const deferred = createDeferred<FeatureBundle>();
    const loadFeatures = () => deferred.promise;
    try {
      render(
        <Providers features={loadFeatures}>
          <HydrationProbe />
          <ListTransition aria-label="Deferred list">
            <ListTransition.Item animationType="fade">First item</ListTransition.Item>
            <ListTransition.Item animationType="fade">Second item</ListTransition.Item>
          </ListTransition>
        </Providers>,
      );

      await waitFor(() =>
        expect(screen.getByRole('status', { name: 'Hydration state' })).toHaveTextContent('true'),
      );
      const items = within(screen.getByRole('list', { name: 'Deferred list' })).getAllByRole(
        'listitem',
      );
      items.forEach((item) => expect(readMotionFrame(item).opacity).toBe(1));

      const observation = observeMotionUntilSettled(items);
      deferred.resolve(domMax);
      const histories = await observation;
      items.forEach((item) => {
        expect(histories.get(item)?.some(isActiveMotionFrame)).toBe(true);
        expect(isTerminalMotionFrame(readMotionFrame(item))).toBe(true);
      });
    } finally {
      deferred.resolve(domMax);
    }
  });

  it('isolates List and Stagger variants while preserving ButtonGroup Action stagger', async () => {
    const deferred = createDeferred<FeatureBundle>();
    const loadFeatures = () => deferred.promise;
    try {
      render(
        <Providers features={loadFeatures}>
          <ListTransition aria-label="Action list">
            <ListTransition.Item animationType="fade">
              <StaggerTransition aria-label="Nested stagger">
                <StaggerTransition.Item animationType="fade">
                  <ActionMotion asChild>
                    <button type="button">List action</button>
                  </ActionMotion>
                </StaggerTransition.Item>
              </StaggerTransition>
            </ListTransition.Item>
          </ListTransition>
          <ButtonGroup aria-label="Grouped actions">
            <Button>First action</Button>
            <Button>Second action</Button>
            <Button>Third action</Button>
          </ButtonGroup>
        </Providers>,
      );

      const isolatedAction = screen.getByRole('button', { name: 'List action' });
      const listItem = isolatedAction.closest('li');
      expect(listItem).not.toBeNull();
      if (!listItem) return;
      const staggerItem = isolatedAction.parentElement;
      expect(staggerItem).not.toBeNull();
      if (!staggerItem) return;
      const groupButtons = within(
        screen.getByRole('group', { name: 'Grouped actions' }),
      ).getAllByRole('button');
      const observed = [listItem, staggerItem, isolatedAction, ...groupButtons];
      const observation = observeMotionUntilSettled(observed, [
        listItem,
        staggerItem,
        ...groupButtons,
      ]);
      deferred.resolve(domMax);
      const histories = await observation;

      expect(histories.get(isolatedAction)?.every(isTerminalMotionFrame)).toBe(true);
      groupButtons.forEach((button) =>
        expect(histories.get(button)?.some(isActiveMotionFrame)).toBe(true),
      );
    } finally {
      deferred.resolve(domMax);
    }
  });

  it('settles an interrupted entrance and does not replay it when re-enabled', async () => {
    const deferred = createDeferred<FeatureBundle>();
    const loadFeatures = () => deferred.promise;
    try {
      render(
        <Providers features={loadFeatures}>
          <HydrationProbe />
          <PolicyControls />
          <ListTransition aria-label="Policy list" customData={{ stagger: 0.4 }}>
            <ListTransition.Item animationType="fade">First policy item</ListTransition.Item>
            <ListTransition.Item animationType="fade">Second policy item</ListTransition.Item>
            <ListTransition.Item animationType="fade">Third policy item</ListTransition.Item>
          </ListTransition>
        </Providers>,
      );

      await waitFor(() =>
        expect(screen.getByRole('status', { name: 'Hydration state' })).toHaveTextContent('true'),
      );
      const items = within(screen.getByRole('list', { name: 'Policy list' })).getAllByRole(
        'listitem',
      );
      const activeMotion = waitForActiveMotion(items);
      deferred.resolve(domMax);
      await activeMotion;
      fireEvent.click(screen.getByRole('button', { name: 'Disable animation' }));
      await expectTerminalMotionPromptly(items);

      fireEvent.click(screen.getByRole('button', { name: 'Enable animation' }));
      const frames = await collectTerminalFrames(items);
      expect(frames.flat().every(isTerminalMotionFrame)).toBe(true);
    } finally {
      deferred.resolve(domMax);
    }
  });

  it('settles an interrupted Action stagger and does not replay it when re-enabled', async () => {
    const deferred = createDeferred<FeatureBundle>();
    const loadFeatures = () => deferred.promise;
    try {
      render(
        <Providers features={loadFeatures}>
          <PolicyControls />
          <ActionMotion asChild animationType="stagger" customData={{ staggerChildren: 0.4 }}>
            <div role="group" aria-label="Policy actions">
              <ActionMotion asChild>
                <button type="button">First policy action</button>
              </ActionMotion>
              <ActionMotion asChild>
                <button type="button">Second policy action</button>
              </ActionMotion>
              <ActionMotion asChild>
                <button type="button">Third policy action</button>
              </ActionMotion>
            </div>
          </ActionMotion>
        </Providers>,
      );

      const actions = within(screen.getByRole('group', { name: 'Policy actions' })).getAllByRole(
        'button',
      );
      const activeMotion = waitForActiveMotion(actions);
      deferred.resolve(domMax);
      await activeMotion;

      fireEvent.click(screen.getByRole('button', { name: 'Disable animation' }));
      await expectTerminalMotionPromptly(actions);

      fireEvent.click(screen.getByRole('button', { name: 'Enable animation' }));
      const frames = await collectTerminalFrames(actions);
      expect(frames.flat().every(isTerminalMotionFrame)).toBe(true);
    } finally {
      deferred.resolve(domMax);
    }
  });

  it('stops and resumes ambient Action motion with animation policy', async () => {
    const deferred = createDeferred<FeatureBundle>();
    const loadFeatures = () => deferred.promise;
    try {
      render(
        <Providers features={loadFeatures}>
          <PolicyControls />
          <ActionMotion asChild animationType="pulse">
            <button type="button">Pulse action</button>
          </ActionMotion>
        </Providers>,
      );

      const action = screen.getByRole('button', { name: 'Pulse action' });
      const initialMotion = waitForActiveMotion([action]);
      deferred.resolve(domMax);
      await initialMotion;

      fireEvent.click(screen.getByRole('button', { name: 'Disable animation' }));
      await expectTerminalMotionPromptly([action]);

      fireEvent.click(screen.getByRole('button', { name: 'Enable animation' }));
      await waitForActiveMotion([action]);
    } finally {
      deferred.resolve(domMax);
    }
  });

  it('reaches hidden and shown terminal states when PathDraw visibility toggles', async () => {
    render(
      <Providers features={domMax}>
        <ToggleDrawing />
      </Providers>,
    );
    const drawing = screen.getByRole('img', { name: 'Drawing' });
    const path = drawing.querySelector('polyline');
    expect(path).not.toBeNull();
    if (!path) return;
    await waitForTerminalMotion([path]);
    expect(readDrawProgress(readMotionFrame(path))).toBeGreaterThanOrEqual(0.999);

    fireEvent.click(screen.getByRole('button', { name: 'Toggle drawing' }));
    await waitFor(() => expect(readMotionFrame(path).opacity).toBeLessThanOrEqual(0.001));
    expect(readDrawProgress(readMotionFrame(path))).toBeLessThanOrEqual(0.001);

    const observation = observeMotionUntilSettled([path]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle drawing' }));
    const histories = await observation;
    expect(histories.get(path)?.some(({ opacity }) => opacity > 0.001 && opacity < 0.999)).toBe(
      true,
    );
    expect(
      histories
        .get(path)
        ?.some((frame) => readDrawProgress(frame) > 0.001 && readDrawProgress(frame) < 0.999),
    ).toBe(true);
    expect(readDrawProgress(readMotionFrame(path))).toBeGreaterThanOrEqual(0.999);
  });
});
