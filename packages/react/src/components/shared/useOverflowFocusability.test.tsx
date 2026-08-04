import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useOverflowFocusability } from './useOverflowFocusability';

/**
 * ### Test Strategy: useOverflowFocusability
 * - **Focus**: Incremental child observation and animation-frame coalescing for
 *   dynamic scroll-region content.
 * - **DON'T**: Do not test browser overflow geometry; component browser tests own
 *   rendered scroll and focus behavior.
 */
describe('useOverflowFocusability', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('observes at most the root and one unambiguous direct content owner', () => {
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    const mutationDisconnect = vi.fn();
    let notifyMutation: MutationCallback = () => undefined;
    class ResizeObserverMock {
      disconnect = disconnect;
      observe = observe;
      unobserve = unobserve;
    }
    class MutationObserverMock {
      constructor(callback: MutationCallback) {
        notifyMutation = callback;
      }
      disconnect = mutationDisconnect;
      observe = vi.fn();
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('MutationObserver', MutationObserverMock);
    const requestAnimationFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1);
    const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');

    const Probe = ({ phase }: { phase: 'many' | 'one-a' | 'one-b' }) => {
      const [ref, tabIndex] = useOverflowFocusability<HTMLDivElement>({});
      return (
        <div ref={ref} tabIndex={tabIndex} data-testid="root">
          {phase !== 'one-b' ? (
            <div key="owner-a" data-testid="owner-a">
              <span data-testid="deep-a" />
            </div>
          ) : null}
          {phase !== 'one-a' ? (
            <div key="owner-b" data-testid="owner-b">
              <span data-testid="deep-b" />
            </div>
          ) : null}
        </div>
      );
    };
    const { getByTestId, queryByTestId, rerender, unmount } = render(<Probe phase="many" />);
    const root = getByTestId('root');
    const ownerA = getByTestId('owner-a');
    const deepA = getByTestId('deep-a');
    let ownerB = getByTestId('owner-b');
    let deepB = getByTestId('deep-b');

    expect(observe).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledWith(root);

    rerender(<Probe phase="one-a" />);
    notifyMutation(
      [
        {
          addedNodes: [],
          removedNodes: [ownerB],
          target: root,
          type: 'childList',
        } as unknown as MutationRecord,
      ],
      {} as MutationObserver,
    );

    rerender(<Probe phase="many" />);
    ownerB = getByTestId('owner-b');
    deepB = getByTestId('deep-b');
    notifyMutation(
      [
        {
          addedNodes: [ownerB],
          removedNodes: [],
          target: root,
          type: 'childList',
        } as unknown as MutationRecord,
      ],
      {} as MutationObserver,
    );

    rerender(<Probe phase="one-b" />);
    expect(queryByTestId('owner-a')).not.toBeInTheDocument();
    notifyMutation(
      [
        {
          addedNodes: [],
          removedNodes: [ownerA],
          target: root,
          type: 'childList',
        } as unknown as MutationRecord,
      ],
      {} as MutationObserver,
    );
    notifyMutation(
      [
        {
          addedNodes: [],
          removedNodes: [],
          target: deepB,
          type: 'characterData',
        } as unknown as MutationRecord,
      ],
      {} as MutationObserver,
    );

    expect(disconnect).not.toHaveBeenCalled();
    expect(observe).toHaveBeenCalledWith(root);
    expect(observe).toHaveBeenCalledWith(ownerA);
    expect(observe).toHaveBeenCalledWith(ownerB);
    expect(observe).not.toHaveBeenCalledWith(deepA);
    expect(observe).not.toHaveBeenCalledWith(deepB);
    expect(observe).toHaveBeenCalledTimes(3);
    expect(unobserve).toHaveBeenCalledOnce();
    expect(unobserve).toHaveBeenCalledWith(ownerA);
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(mutationDisconnect).toHaveBeenCalledOnce();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it('coalesces deep media, transition, and owner-document font changes', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerWindow = iframe.contentWindow;
    const ownerDocument = iframe.contentDocument;
    if (!ownerWindow || !ownerDocument) throw new Error('Expected an iframe realm');

    const mount = ownerDocument.createElement('div');
    ownerDocument.body.append(mount);
    const observe = vi.fn();
    const resizeDisconnect = vi.fn();
    const mutationDisconnect = vi.fn();
    class ResizeObserverMock {
      disconnect = resizeDisconnect;
      observe = observe;
      unobserve = vi.fn();
    }
    class MutationObserverMock {
      disconnect = mutationDisconnect;
      observe = vi.fn();
    }
    Object.defineProperty(ownerWindow, 'ResizeObserver', {
      configurable: true,
      value: ResizeObserverMock,
    });
    Object.defineProperty(ownerWindow, 'MutationObserver', {
      configurable: true,
      value: MutationObserverMock,
    });
    let runAnimationFrame: FrameRequestCallback | undefined;
    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      runAnimationFrame = callback;
      return 7;
    });
    const cancelAnimationFrame = vi.fn();
    Object.defineProperty(ownerWindow, 'requestAnimationFrame', {
      configurable: true,
      value: requestAnimationFrame,
    });
    Object.defineProperty(ownerWindow, 'cancelAnimationFrame', {
      configurable: true,
      value: cancelAnimationFrame,
    });
    const fontSet = new ownerWindow.EventTarget();
    const removeFontListener = vi.spyOn(fontSet, 'removeEventListener');
    Object.defineProperty(ownerDocument, 'fonts', {
      configurable: true,
      value: fontSet,
    });

    const Probe = () => {
      const [ref, tabIndex] = useOverflowFocusability<HTMLDivElement>({});
      return (
        <div ref={ref} tabIndex={tabIndex} data-testid="root">
          <div>
            <img alt="" data-testid="deep-image" />
            <span data-testid="deep-transition" />
          </div>
        </div>
      );
    };
    const { getByTestId, unmount } = render(<Probe />, { container: mount });

    fireEvent.load(getByTestId('deep-image'));
    fireEvent.transitionEnd(getByTestId('deep-transition'));
    fontSet.dispatchEvent(new ownerWindow.Event('loadingdone'));

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    runAnimationFrame?.(0);
    fireEvent.loadedMetadata(getByTestId('deep-image'));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);

    unmount();
    expect(resizeDisconnect).toHaveBeenCalledOnce();
    expect(mutationDisconnect).toHaveBeenCalledOnce();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(7);
    expect(removeFontListener).toHaveBeenCalledWith('loadingdone', expect.any(Function));
    iframe.remove();
  });
});
