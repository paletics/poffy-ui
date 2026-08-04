import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAnimationPause } from './useAnimationPause';

/**
 * ### Test Strategy: useAnimationPause
 *
 * ### Focus
 * - Explicit, document-visibility, and IntersectionObserver pause conditions.
 *
 * ### DON'T
 * - Do not test the browser's observer scheduling; invoke the observer callback directly.
 */
describe('useAnimationPause', () => {
  const originalVisibilityState = Object.getOwnPropertyDescriptor(document, 'visibilityState');

  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalVisibilityState)
      Object.defineProperty(document, 'visibilityState', originalVisibilityState);
  });

  it('pauses when explicitly disabled', () => {
    const { result } = renderHook(() => useAnimationPause({ disabled: true }));
    expect(result.current).toBe(true);
  });

  it('pauses when the document becomes hidden', () => {
    let visibilityState: DocumentVisibilityState = 'visible';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibilityState,
    });
    const { result } = renderHook(() => useAnimationPause());
    expect(result.current).toBe(false);

    act(() => {
      visibilityState = 'hidden';
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(true);
  });

  it('clears document visibility state when document observation is disabled', () => {
    let visibilityState: DocumentVisibilityState = 'visible';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibilityState,
    });
    const initialProps: { targetDocument: Document | null } = { targetDocument: document };
    const { result, rerender } = renderHook(
      ({ targetDocument }: { targetDocument: Document | null }) =>
        useAnimationPause({ targetDocument }),
      { initialProps },
    );

    act(() => {
      visibilityState = 'hidden';
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(true);

    rerender({ targetDocument: null });
    expect(result.current).toBe(false);
  });

  it('pauses when the observed target leaves the viewport', () => {
    let callback: IntersectionObserverCallback | undefined;
    class IntersectionObserverMock {
      constructor(next: IntersectionObserverCallback) {
        callback = next;
      }
      disconnect = vi.fn();
      observe = vi.fn();
      root = null;
      rootMargin = '0px';
      thresholds = [0];
      takeRecords = () => [];
      unobserve = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    const target = document.createElement('div');
    const { result } = renderHook(() => useAnimationPause({ target, pauseWhenOffscreen: true }));

    act(() => {
      callback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(result.current).toBe(true);
  });

  it('observes visibility and intersections in the target owner document', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerWindow = iframe.contentWindow;
    const ownerDocument = iframe.contentDocument;
    if (!ownerWindow || !ownerDocument) throw new Error('Expected an iframe document');

    let visibilityState: DocumentVisibilityState = 'visible';
    Object.defineProperty(ownerDocument, 'visibilityState', {
      configurable: true,
      get: () => visibilityState,
    });
    let callback: IntersectionObserverCallback | undefined;
    class IntersectionObserverMock {
      constructor(next: IntersectionObserverCallback) {
        callback = next;
      }
      disconnect = vi.fn();
      observe = vi.fn();
      root = null;
      rootMargin = '0px';
      thresholds = [0];
      takeRecords = () => [];
      unobserve = vi.fn();
    }
    Object.defineProperty(ownerWindow, 'IntersectionObserver', {
      configurable: true,
      value: IntersectionObserverMock,
    });
    const target = ownerDocument.createElement('div');
    ownerDocument.body.append(target);
    const { result, unmount } = renderHook(() =>
      useAnimationPause({ target, pauseWhenOffscreen: true }),
    );

    act(() => {
      visibilityState = 'hidden';
      ownerDocument.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(true);

    act(() => {
      visibilityState = 'visible';
      ownerDocument.dispatchEvent(new Event('visibilitychange'));
      callback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(result.current).toBe(true);

    unmount();
    iframe.remove();
  });
});
