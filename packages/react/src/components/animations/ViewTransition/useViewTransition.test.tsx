import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnimationProvider } from '@/providers/AnimationProvider';
import * as hydratedModule from '../useHydrated';
import { useViewTransition } from './useViewTransition';

const originalStartViewTransition = Object.getOwnPropertyDescriptor(
  document,
  'startViewTransition',
);

afterEach(() => {
  vi.restoreAllMocks();
  if (originalStartViewTransition) {
    Object.defineProperty(document, 'startViewTransition', originalStartViewTransition);
  } else {
    delete (document as { startViewTransition?: unknown }).startViewTransition;
  }
});

const SupportStatus = () => <span>{String(useViewTransition().isSupported)}</span>;

/**
 * ### Test Strategy: useViewTransition
 *
 * ### Focus
 * - Native support detection, synchronous update capture, and the animation-policy fallback.
 *
 * ### DON'T
 * - Do not test browser pseudo-element rendering; that belongs in browser visual coverage.
 */
describe('useViewTransition', () => {
  it('keeps native support detection static during server rendering', () => {
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: vi.fn(),
    });

    expect(renderToString(<SupportStatus />)).toContain('false');
  });

  it('uses the native API when animation is enabled', async () => {
    const start = vi.fn((update: () => void) => {
      update();
      return { finished: Promise.resolve() };
    });
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
    const update = vi.fn();
    const { result } = renderHook(() => useViewTransition());

    let transition: ReturnType<typeof result.current.startViewTransition> | undefined;
    act(() => {
      transition = result.current.startViewTransition(update);
    });

    expect(transition?.supported).toBe(true);
    expect(start).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledOnce();
    await expect(transition?.finished).resolves.toBeUndefined();
  });

  it('uses an explicitly supplied owner document', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument;
    if (!ownerDocument) throw new Error('Expected an iframe document');
    const start = vi.fn((update: () => void) => {
      update();
      return { finished: Promise.resolve() };
    });
    Object.defineProperty(ownerDocument, 'startViewTransition', {
      configurable: true,
      value: start,
    });
    const update = vi.fn();
    const { result, unmount } = renderHook(() => useViewTransition(ownerDocument));

    act(() => {
      expect(result.current.isSupported).toBe(true);
      expect(result.current.startViewTransition(update).supported).toBe(true);
    });
    expect(start).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledOnce();

    unmount();
    iframe.remove();
  });

  it('updates without native motion when the animation policy disables it', () => {
    const start = vi.fn();
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
    const update = vi.fn();
    const { result } = renderHook(() => useViewTransition(), {
      wrapper: ({ children }) => (
        <AnimationProvider defaultAnimationEnabled={false}>{children}</AnimationProvider>
      ),
    });

    act(() => {
      expect(result.current.startViewTransition(update).supported).toBe(false);
    });
    expect(start).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });

  it('does not start native motion before hydration completes', () => {
    vi.spyOn(hydratedModule, 'useHydrated').mockReturnValue(false);
    const start = vi.fn();
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
    const update = vi.fn();
    const { result } = renderHook(() => useViewTransition());

    act(() => {
      expect(result.current.isSupported).toBe(false);
      expect(result.current.startViewTransition(update).supported).toBe(false);
    });

    expect(start).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });

  it('falls back to a normal update when the native API throws', () => {
    const start = vi.fn(() => {
      throw new Error('transition unavailable');
    });
    Object.defineProperty(document, 'startViewTransition', { configurable: true, value: start });
    const update = vi.fn();
    const { result } = renderHook(() => useViewTransition());

    act(() => {
      expect(result.current.startViewTransition(update).supported).toBe(false);
    });

    expect(start).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledOnce();
  });

  it('normalizes a rejected native completion promise', async () => {
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: vi.fn(() => ({ finished: Promise.reject(new Error('cancelled')) })),
    });
    const { result } = renderHook(() => useViewTransition());

    let transition: ReturnType<typeof result.current.startViewTransition> | undefined;
    act(() => {
      transition = result.current.startViewTransition(vi.fn());
    });

    await expect(transition?.finished).resolves.toBeUndefined();
  });

  it('observes update callback failures through the native completion result', async () => {
    const updateError = new Error('update failed');
    let rejectFinished: (reason?: unknown) => void = () => undefined;
    const finished = new Promise<never>((_, reject) => {
      rejectFinished = reject;
    });
    const updateCallbackDone = Promise.reject(updateError);

    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: vi.fn(() => ({ finished, updateCallbackDone })),
    });
    const { result } = renderHook(() => useViewTransition());

    let transition: ReturnType<typeof result.current.startViewTransition> | undefined;
    act(() => {
      transition = result.current.startViewTransition(() => undefined);
    });
    rejectFinished(updateError);

    await expect(transition?.finished).resolves.toBeUndefined();
  });
});
