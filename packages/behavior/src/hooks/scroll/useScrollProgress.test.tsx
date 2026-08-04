import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScrollProgress } from './useScrollProgress';

/**
 * ### Test Strategy: useScrollProgress
 *
 * ### Focus
 * - Normalized metrics for a supplied scroll container, axis selection, and disabled state.
 *
 * ### DON'T
 * - Do not test browser layout or scroll physics; jsdom supplies only deterministic metrics.
 */
describe('useScrollProgress', () => {
  afterEach(() => vi.restoreAllMocks());

  it('reports normalized vertical progress for a scroll container', () => {
    const element = document.createElement('div');
    Object.defineProperties(element, {
      clientHeight: { configurable: true, value: 200 },
      scrollHeight: { configurable: true, value: 1_000 },
      scrollTop: { configurable: true, writable: true, value: 400 },
    });
    let scheduledFrame: FrameRequestCallback | undefined;
    const requestFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        scheduledFrame = callback;
        return 1;
      });

    const { result } = renderHook(() => useScrollProgress({ container: element }));
    expect(result.current).toEqual({ position: 400, maxPosition: 800, progress: 0.5 });

    act(() => {
      element.scrollTop = 800;
      element.dispatchEvent(new Event('scroll'));
      scheduledFrame?.(0);
    });
    expect(result.current.progress).toBe(1);
    expect(requestFrame).toHaveBeenCalledOnce();
  });

  it('returns static zero metrics while disabled', () => {
    const element = document.createElement('div');
    Object.defineProperties(element, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 500 },
      scrollTop: { configurable: true, writable: true, value: 200 },
    });

    const { result } = renderHook(() => useScrollProgress({ container: element, disabled: true }));
    expect(result.current).toEqual({ position: 0, maxPosition: 0, progress: 0 });
  });

  it('uses the scroll container owner window for scheduled updates', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerWindow = iframe.contentWindow;
    const ownerDocument = iframe.contentDocument;
    if (!ownerWindow || !ownerDocument) throw new Error('Expected an iframe document');

    const element = ownerDocument.createElement('div');
    Object.defineProperties(element, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 500 },
      scrollTop: { configurable: true, writable: true, value: 0 },
    });
    ownerDocument.body.append(element);
    let scheduledFrame: FrameRequestCallback | undefined;
    const requestFrame = vi
      .spyOn(ownerWindow, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        scheduledFrame = callback;
        return 1;
      });

    const { result, unmount } = renderHook(() => useScrollProgress({ container: element }));
    act(() => {
      element.scrollTop = 200;
      element.dispatchEvent(new Event('scroll'));
      scheduledFrame?.(0);
    });
    expect(result.current.progress).toBe(0.5);
    expect(requestFrame).toHaveBeenCalledOnce();

    unmount();
    iframe.remove();
  });

  it('subscribes to viewport scrolling when no container is supplied', () => {
    const originalScrollingElement = Object.getOwnPropertyDescriptor(document, 'scrollingElement');
    const root = document.documentElement;
    Object.defineProperties(root, {
      clientHeight: { configurable: true, value: 250 },
      scrollHeight: { configurable: true, value: 1_000 },
      scrollTop: { configurable: true, writable: true, value: 0 },
    });
    Object.defineProperty(document, 'scrollingElement', { configurable: true, value: root });
    let scheduledFrame: FrameRequestCallback | undefined;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      scheduledFrame = callback;
      return 1;
    });

    const { result, unmount } = renderHook(() => useScrollProgress());
    act(() => {
      root.scrollTop = 375;
      window.dispatchEvent(new Event('scroll'));
      scheduledFrame?.(0);
    });
    expect(result.current).toEqual({ position: 375, maxPosition: 750, progress: 0.5 });
    unmount();

    if (originalScrollingElement) {
      Object.defineProperty(document, 'scrollingElement', originalScrollingElement);
    } else {
      delete (document as { scrollingElement?: Element }).scrollingElement;
    }
  });

  it('clears metrics when document observation is disabled', () => {
    const originalScrollingElement = Object.getOwnPropertyDescriptor(document, 'scrollingElement');
    const root = document.documentElement;
    Object.defineProperties(root, {
      clientHeight: { configurable: true, value: 250 },
      scrollHeight: { configurable: true, value: 1_000 },
      scrollTop: { configurable: true, writable: true, value: 375 },
    });
    Object.defineProperty(document, 'scrollingElement', { configurable: true, value: root });

    const initialProps: { targetDocument: Document | null } = { targetDocument: document };
    const { result, rerender, unmount } = renderHook(
      ({ targetDocument }: { targetDocument: Document | null }) =>
        useScrollProgress({ targetDocument }),
      { initialProps },
    );
    expect(result.current).toEqual({ position: 375, maxPosition: 750, progress: 0.5 });

    rerender({ targetDocument: null });
    expect(result.current).toEqual({ position: 0, maxPosition: 0, progress: 0 });
    unmount();

    if (originalScrollingElement) {
      Object.defineProperty(document, 'scrollingElement', originalScrollingElement);
    } else {
      delete (document as { scrollingElement?: Element }).scrollingElement;
    }
  });
});
