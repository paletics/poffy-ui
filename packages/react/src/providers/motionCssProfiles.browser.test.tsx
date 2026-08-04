import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@/styled-system/styles.css';
import { Button } from '@/components/inputs/Button';
import { LayoutTransition } from '@/components/animations/LayoutTransition';
import { LoopEffect } from '@/components/animations/LoopEffect';
import { OverlayTransition } from '@/components/animations/OverlayTransition';
import { ReorderTransition } from '@/components/animations/ReorderTransition';
import { CollapseTransition } from '@/components/animations/CollapseTransition';
import { TextRevealTransition } from '@/components/animations/TextRevealTransition';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Spinner } from '@/components/feedback/Spinner';
import { CircleProgress } from '@/components/feedback/CircleProgress';
import { ProgressBar } from '@/components/feedback/ProgressBar';
import { Modal, ModalContent, ModalTitle } from '@/components/overlay/Modal';
import { Portal } from '@/components/overlay/Portal';
import { AnimationProvider, useAnimation } from './AnimationProvider';
import { ThemeProvider } from './ThemeProvider';

const getAnimationDuration = (name: string): string =>
  getComputedStyle(screen.getByRole('button', { name })).animationDuration;

const MotionStyleControl = () => {
  const { setMotionStyle } = useAnimation();

  return (
    <>
      <button type="button" onClick={() => setMotionStyle('subtle')}>
        Set subtle
      </button>
      <Button glow>Dynamic profile</Button>
    </>
  );
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/**
 * ### Test Strategy: Motion CSS profiles
 * - **Focus**: Browser CSS cascade behavior for nested profile boundaries and portalled content.
 * - **DON'T**: Duplicate unit coverage for provider state, attributes, or portal mounting.
 */
describe('Motion CSS profiles', () => {
  it('suppresses glow at the nearest subtle profile beneath an outer pop profile', () => {
    render(
      <ThemeProvider global={false} defaultMotionStyle="pop">
        <ThemeProvider global={false} defaultMotionStyle="subtle">
          <Button glow>Inner subtle</Button>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Inner subtle' })).animationName,
    ).toBe('none');
  });

  it('uses the nearest pop profile instead of an outer subtle profile', () => {
    render(
      <ThemeProvider global={false} defaultMotionStyle="subtle">
        <ThemeProvider global={false} defaultMotionStyle="pop">
          <Button glow>Inner pop</Button>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(getAnimationDuration('Inner pop')).toBe('1.131s');
  });

  it('uses standard timing at an inner standard boundary', () => {
    render(
      <ThemeProvider global={false} defaultMotionStyle="pop">
        <ThemeProvider global={false} defaultMotionStyle="standard">
          <Button glow>Inner standard</Button>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(getAnimationDuration('Inner standard')).toBe('2s');
  });

  it('suppresses glow at the nearest subtle profile after a portal boundary', async () => {
    render(
      <ThemeProvider global={false} defaultMotionStyle="pop">
        <ThemeProvider global={false} defaultMotionStyle="subtle">
          <Portal scopeProviders>
            <Button glow>Portalled subtle</Button>
          </Portal>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(await screen.findByRole('button', { name: 'Portalled subtle' })).toBeInTheDocument();
    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Portalled subtle' })).animationName,
    ).toBe('none');
  });

  it('suppresses glow at the nearest subtle profile through a FloatingPortal overlay', () => {
    render(
      <ThemeProvider global={false} defaultMotionStyle="pop">
        <ThemeProvider global={false} defaultMotionStyle="subtle">
          <Modal open>
            <ModalContent>
              <ModalTitle>Scoped modal</ModalTitle>
              <Button glow>Floating subtle</Button>
            </ModalContent>
          </Modal>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Floating subtle' })).animationName,
    ).toBe('none');
  });

  it('allows an inner enabled scope to override an outer disabled scope', () => {
    render(
      <ThemeProvider global={false} defaultAnimationEnabled={false}>
        <ThemeProvider global={false} defaultMotionStyle="standard">
          <Button glow>Enabled inner scope</Button>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Enabled inner scope' })).animationName,
    ).toBe('glow');
  });

  it('suppresses an inner none scope beneath an enabled scope', () => {
    render(
      <ThemeProvider global={false} defaultMotionStyle="pop">
        <ThemeProvider global={false} defaultMotionStyle="none">
          <Button glow>Disabled inner scope</Button>
        </ThemeProvider>
      </ThemeProvider>,
    );

    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Disabled inner scope' })).animationName,
    ).toBe('none');
  });

  it('suppresses CSS-only animation in a scoped low-level provider', () => {
    render(
      <AnimationProvider global={false} scope defaultAnimationEnabled={false}>
        <Button glow>Scoped low-level provider</Button>
      </AnimationProvider>,
    );

    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Scoped low-level provider' }))
        .animationName,
    ).toBe('none');
  });

  it('uses the fallback selector for a disabled scoped ThemeProvider', async () => {
    vi.stubGlobal('CSSScopeRule', undefined);
    render(
      <ThemeProvider global={false} defaultAnimationEnabled={false}>
        <Button glow>Fallback scoped theme</Button>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(
        screen
          .getByRole('button', { name: 'Fallback scoped theme' })
          .closest('[data-theme-boundary]'),
      ).toHaveAttribute('data-motion-scope-fallback', 'disabled');
    });
    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Fallback scoped theme' })).animationName,
    ).toBe('none');
  });

  it('makes Skeleton static when a local provider disables motion without CSS scope', () => {
    render(
      <ThemeProvider global={false} defaultAnimationEnabled={false}>
        <Skeleton data-testid="disabled-skeleton" animation="pulse" />
      </ThemeProvider>,
    );

    expect(getComputedStyle(screen.getByTestId('disabled-skeleton')).animationName).toBe('none');
  });

  it('overrides inline Skeleton animation styles in a context-only disabled provider', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <Skeleton data-testid="root-skeleton" style={{ animation: 'glow 1s infinite' }} />
        <Skeleton asChild>
          <span data-testid="child-skeleton" style={{ animation: 'glow 1s infinite' }} />
        </Skeleton>
      </AnimationProvider>,
    );

    expect(getComputedStyle(screen.getByTestId('root-skeleton')).animationName).toBe('none');
    expect(getComputedStyle(screen.getByTestId('child-skeleton')).animationName).toBe('none');
  });

  it('makes feedback CSS and inline styles static in a context-only disabled provider', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <Spinner
          data-testid="disabled-spinner"
          style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
        />
        <CircleProgress
          value={50}
          data-testid="disabled-progress"
          style={{ animation: 'glow 1s infinite', transition: 'stroke-dashoffset 1s ease' }}
        />
      </AnimationProvider>,
    );

    expect(getComputedStyle(screen.getByTestId('disabled-spinner')).animationName).toBe('none');
    expect(getComputedStyle(screen.getByTestId('disabled-spinner')).transitionProperty).toBe(
      'none',
    );
    expect(getComputedStyle(screen.getByTestId('disabled-progress')).animationName).toBe('none');
    expect(getComputedStyle(screen.getByTestId('disabled-progress')).transitionProperty).toBe(
      'none',
    );
  });

  it('makes ProgressBar visual animation static while preserving indeterminate semantics', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <ProgressBar
          animationType="load"
          data-testid="disabled-progress-bar"
          style={{ animation: 'glow 1s infinite', transition: 'width 1s ease' }}
        />
      </AnimationProvider>,
    );

    const container = screen.getByTestId('disabled-progress-bar');
    const progressbar = screen.getByRole('progressbar');
    const bar = screen.getByTestId('progress-bar-bar');
    expect(progressbar).toHaveAttribute('data-progressbar-animation', 'none');
    expect(progressbar).not.toHaveAttribute('aria-valuenow');
    expect(getComputedStyle(container).animationName).toBe('none');
    expect(getComputedStyle(container).transitionProperty).toBe('none');
    expect(getComputedStyle(bar).animationName).toBe('none');
    expect(getComputedStyle(bar).transitionProperty).toBe('none');
  });

  it('overrides inline OverlayTransition animation styles in a context-only disabled provider', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <OverlayTransition
          isVisible
          data-testid="root-overlay"
          style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
        >
          Root overlay
        </OverlayTransition>
        <OverlayTransition isVisible asChild>
          <span
            data-testid="child-overlay"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Child overlay
          </span>
        </OverlayTransition>
      </AnimationProvider>,
    );

    expect(getComputedStyle(screen.getByTestId('root-overlay')).animationName).toBe('none');
    expect(getComputedStyle(screen.getByTestId('root-overlay')).transitionProperty).toBe('none');
    expect(getComputedStyle(screen.getByTestId('child-overlay')).animationName).toBe('none');
    expect(getComputedStyle(screen.getByTestId('child-overlay')).transitionProperty).toBe('none');
  });

  it('makes collapse, loop, and text wrappers static in a context-only disabled provider', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <CollapseTransition
          isOpen
          data-testid="collapse-transition"
          style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
        >
          Collapse
        </CollapseTransition>
        <CollapseTransition isOpen asChild>
          <section
            data-testid="collapse-transition-child"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Collapse child
          </section>
        </CollapseTransition>
        <LoopEffect
          data-testid="loop-effect"
          style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
        >
          Loop
        </LoopEffect>
        <LoopEffect asChild>
          <span
            data-testid="loop-effect-child"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Loop child
          </span>
        </LoopEffect>
        <TextRevealTransition
          data-testid="text-reveal-transition"
          style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
        >
          Text reveal
        </TextRevealTransition>
        <TextRevealTransition asChild>
          <h2
            data-testid="text-reveal-transition-child"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Text reveal child
          </h2>
        </TextRevealTransition>
      </AnimationProvider>,
    );

    for (const testId of [
      'collapse-transition',
      'collapse-transition-child',
      'loop-effect',
      'loop-effect-child',
      'text-reveal-transition',
      'text-reveal-transition-child',
    ]) {
      const styles = getComputedStyle(screen.getByTestId(testId));
      expect(styles.animationName).toBe('none');
      expect(styles.transitionProperty).toBe('none');
      expect(styles.scrollBehavior).toBe('auto');
    }
  });

  it('keeps layout and reorder wrapper styles static in a context-only disabled provider', () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <LayoutTransition
          data-testid="layout-transition"
          style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
        >
          Layout
        </LayoutTransition>
        <LayoutTransition asChild>
          <span
            data-testid="layout-transition-child"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Layout child
          </span>
        </LayoutTransition>
        <ReorderTransition
          data-testid="reorder-transition"
          style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
        >
          <ReorderTransition.Item
            data-testid="reorder-item"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Item
          </ReorderTransition.Item>
        </ReorderTransition>
        <ReorderTransition asChild>
          <div
            data-testid="reorder-transition-child"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Reorder child
          </div>
        </ReorderTransition>
        <ReorderTransition.Item asChild>
          <span
            data-testid="reorder-item-child"
            style={{ animation: 'glow 1s infinite', transition: 'opacity 1s ease' }}
          >
            Item child
          </span>
        </ReorderTransition.Item>
      </AnimationProvider>,
    );

    for (const testId of [
      'layout-transition',
      'layout-transition-child',
      'reorder-transition',
      'reorder-transition-child',
      'reorder-item',
      'reorder-item-child',
    ]) {
      const styles = getComputedStyle(screen.getByTestId(testId));
      expect(styles.animationName).toBe('none');
      expect(styles.transitionProperty).toBe('none');
      expect(styles.scrollBehavior).toBe('auto');
    }
  });

  it('suppresses glow when the selected profile changes to subtle', () => {
    render(
      <AnimationProvider global={false} scope defaultMotionStyle="standard">
        <MotionStyleControl />
      </AnimationProvider>,
    );

    expect(getAnimationDuration('Dynamic profile')).toBe('2s');
    fireEvent.click(screen.getByRole('button', { name: 'Set subtle' }));
    expect(
      getComputedStyle(screen.getByRole('button', { name: 'Dynamic profile' })).animationName,
    ).toBe('none');
  });
});
