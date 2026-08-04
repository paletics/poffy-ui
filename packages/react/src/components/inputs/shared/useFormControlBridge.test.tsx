import { act, render, screen, waitFor } from '@testing-library/react';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { StrictMode, useLayoutEffect, useRef, useState, type RefCallback } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  useFormAssociatedEventRef,
  useFormControlBridge,
  useFormParticipationInvalidation,
  useFormReset,
} from './useFormControlBridge';
import type { FormAssociatedEventType } from '@poffy-ui/behavior/hooks';

interface BridgeHarnessProps {
  disabled?: boolean;
  form?: string;
  onReset?: () => void;
}

const BridgeHarness = ({ disabled, form, onReset }: BridgeHarnessProps) => {
  const bridge = useFormControlBridge({ disabled, form });
  const resetRef = useFormReset<HTMLFieldSetElement>(onReset);
  const anchorRef = useMergeRefs(bridge.anchorRef, resetRef);

  return (
    <div
      data-testid="bridge-state"
      data-associated-form={bridge.associatedForm?.dataset.version ?? ''}
      data-disabled={String(bridge.effectivelyDisabled)}
    >
      <fieldset {...bridge.anchorProps} ref={anchorRef} />
    </div>
  );
};

const SelectorBridgeHarness = () => {
  const bridge = useFormControlBridge();
  const [watchedInput, setWatchedInput] = useState<HTMLInputElement | null>(null);
  const isWatchedInputDisabled = watchedInput?.matches(':disabled') ?? false;
  useFormParticipationInvalidation(
    bridge.participationAnchor,
    () => watchedInput?.matches(':disabled') ?? false,
    watchedInput,
  );
  return (
    <div data-testid="selector-state" data-disabled={String(isWatchedInputDisabled)}>
      <fieldset {...bridge.anchorProps} />
      <input ref={setWatchedInput} />
    </div>
  );
};

const ParentLayoutResetHarness = ({ onReset }: Pick<BridgeHarnessProps, 'onReset'>) => {
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    formRef.current?.reset();
  }, []);

  return (
    <form ref={formRef}>
      <BridgeHarness onReset={onReset} />
    </form>
  );
};

const ResetRefChurnHarness = ({ onReset }: Pick<BridgeHarnessProps, 'onReset'>) => {
  const [version, setVersion] = useState(0);
  const resetRef = useFormReset<HTMLFieldSetElement>(onReset);
  const anchorRef = useMergeRefs(resetRef, (_anchor: HTMLFieldSetElement | null) => {
    void version;
  });

  return (
    <form onReset={() => setVersion((current) => current + 1)}>
      <fieldset ref={anchorRef} />
    </form>
  );
};

const CapturedFormEventRefHarness = ({
  eventType = 'formdata',
  onEvent,
  onRef,
}: {
  eventType?: FormAssociatedEventType;
  onEvent: (event: Event) => void;
  onRef: (ref: RefCallback<HTMLFieldSetElement>) => void;
}) => {
  const eventRef = useFormAssociatedEventRef<HTMLFieldSetElement>(eventType, onEvent);
  useLayoutEffect(() => onRef(eventRef), [eventRef, onRef]);
  return <fieldset ref={eventRef} />;
};

/**
 * ### Test Strategy: useFormControlBridge
 * - **Focus**: Native form-owner changes, same-id form replacement, reset rebinding, and effective
 *   disabledness inherited from fieldsets.
 * - **DON'T**: Do not test component-specific serialization or interaction behavior here.
 */
describe('useFormControlBridge', () => {
  it('shares one participation observer across controls in the same owner tree', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerWindow = iframe.contentWindow;
    const ownerDocument = iframe.contentDocument;
    if (!ownerWindow || !ownerDocument) throw new Error('Expected an iframe document');

    const construct = vi.fn();
    const observe = vi.fn();
    class MutationObserverMock {
      constructor(_: MutationCallback) {
        void _;
        construct();
      }
      disconnect = vi.fn();
      observe = observe;
      takeRecords = () => [];
    }
    Object.defineProperty(ownerWindow, 'MutationObserver', {
      configurable: true,
      value: MutationObserverMock,
    });

    const { unmount } = render(
      <>
        <BridgeHarness />
        <SelectorBridgeHarness />
      </>,
      { container: ownerDocument.body },
    );

    expect(construct).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledOnce();
    expect(observe).toHaveBeenCalledWith(ownerDocument, {
      attributeFilter: ['disabled', 'form', 'id'],
      attributes: true,
      childList: true,
      subtree: true,
    });

    unmount();
    iframe.remove();
  });

  it('keeps one live participation observer through StrictMode', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerWindow = iframe.contentWindow;
    const ownerDocument = iframe.contentDocument;
    if (!ownerWindow || !ownerDocument) throw new Error('Expected an iframe document');

    const instances: Array<{ callback: MutationCallback; disconnect: ReturnType<typeof vi.fn> }> =
      [];
    class MutationObserverMock {
      disconnect = vi.fn();
      observe = vi.fn();
      takeRecords = () => [];
      constructor(callback: MutationCallback) {
        instances.push({ callback, disconnect: this.disconnect });
      }
    }
    Object.defineProperty(ownerWindow, 'MutationObserver', {
      configurable: true,
      value: MutationObserverMock,
    });

    const { unmount } = render(
      <StrictMode>
        <SelectorBridgeHarness />
      </StrictMode>,
      { container: ownerDocument.body },
    );

    expect(instances).toHaveLength(1);
    expect(instances[0]?.disconnect).not.toHaveBeenCalled();

    act(() => {
      instances[0]?.callback([], instances[0] as never);
    });
    unmount();
    expect(instances[0]?.disconnect).toHaveBeenCalledOnce();
    iframe.remove();
  });

  it('resubscribes a selector when the same anchor moves to a shadow root', async () => {
    const { container, unmount } = render(<SelectorBridgeHarness />);
    const selectorRoot = screen.getByTestId('selector-state');
    const watchedInput = selectorRoot.querySelector('input')!;
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    document.body.append(host);

    act(() => {
      shadowRoot.append(selectorRoot);
    });
    await waitFor(() => expect(selectorRoot.getRootNode()).toBe(shadowRoot));

    act(() => {
      watchedInput.disabled = true;
    });
    await waitFor(() => expect(selectorRoot).toHaveAttribute('data-disabled', 'true'));

    act(() => {
      container.append(selectorRoot);
    });
    unmount();
    host.remove();
  });

  it('subscribes before a parent layout effect can reset the form', async () => {
    const onReset = vi.fn();

    render(<ParentLayoutResetHarness onReset={onReset} />);

    await waitFor(() => expect(onReset).toHaveBeenCalledOnce());
  });

  it('binds reset handling when an external form mounts late and when it is replaced', async () => {
    const onReset = vi.fn();
    const { container, rerender } = render(<BridgeHarness form="target-form" onReset={onReset} />);

    expect(screen.getByTestId('bridge-state')).toHaveAttribute('data-associated-form', '');

    rerender(
      <>
        <form id="target-form" data-version="first" />
        <BridgeHarness form="target-form" onReset={onReset} />
      </>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('bridge-state')).toHaveAttribute('data-associated-form', 'first'),
    );
    const firstForm = container.querySelector<HTMLFormElement>('form')!;

    rerender(
      <>
        <form key="replacement" id="target-form" data-version="second" />
        <BridgeHarness form="target-form" onReset={onReset} />
      </>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('bridge-state')).toHaveAttribute('data-associated-form', 'second'),
    );
    const secondForm = container.querySelector<HTMLFormElement>('form')!;

    act(() => firstForm.reset());
    await Promise.resolve();
    expect(onReset).not.toHaveBeenCalled();

    act(() => secondForm.reset());
    await waitFor(() => expect(onReset).toHaveBeenCalledOnce());
  });

  it('keeps an accepted reset when an inline merged ref reattaches the same anchor', async () => {
    const onReset = vi.fn();
    const { container } = render(<ResetRefChurnHarness onReset={onReset} />);

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(onReset).toHaveBeenCalledOnce();
  });

  it('drops an accepted reset when its anchor actually unmounts', async () => {
    const onReset = vi.fn();
    const { container, unmount } = render(
      <form>
        <BridgeHarness onReset={onReset} />
      </form>,
    );
    (container.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('reset', { bubbles: true, cancelable: true }),
    );

    unmount();
    await Promise.resolve();

    expect(onReset).not.toHaveBeenCalled();
  });

  it('resubscribes when the same anchor reattaches in a different tree root', () => {
    const onEvent = vi.fn();
    let eventRef: RefCallback<HTMLFieldSetElement> | undefined;
    const captureRef = (nextRef: RefCallback<HTMLFieldSetElement>) => {
      eventRef = nextRef;
    };
    const { container } = render(
      <CapturedFormEventRefHarness onEvent={onEvent} onRef={captureRef} />,
    );
    const anchor = container.querySelector('fieldset')!;
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const shadowForm = document.createElement('form');
    shadowRoot.append(shadowForm);
    document.body.append(host);

    act(() => {
      eventRef?.(null);
      shadowForm.append(anchor);
      eventRef?.(anchor);
    });
    shadowForm.dispatchEvent(new Event('formdata'));
    expect(onEvent).toHaveBeenCalledOnce();

    act(() => {
      eventRef?.(null);
      container.append(anchor);
      eventRef?.(anchor);
    });
    host.remove();
  });

  it('resubscribes when the event type changes on the same anchor', async () => {
    const onEvent = vi.fn();
    const { container, rerender } = render(
      <form>
        <CapturedFormEventRefHarness onEvent={onEvent} onRef={() => undefined} />
      </form>,
    );
    const form = container.querySelector('form')!;
    form.dispatchEvent(new Event('formdata'));
    expect(onEvent).toHaveBeenCalledOnce();

    rerender(
      <form>
        <CapturedFormEventRefHarness eventType="reset" onEvent={onEvent} onRef={() => undefined} />
      </form>,
    );
    await act(async () => {
      form.reset();
      await Promise.resolve();
    });
    expect(onEvent).toHaveBeenCalledTimes(2);
  });

  it('tracks disabled fieldset participation through the native anchor', async () => {
    const { rerender } = render(
      <fieldset disabled>
        <BridgeHarness />
      </fieldset>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('bridge-state')).toHaveAttribute('data-disabled', 'true'),
    );

    rerender(
      <fieldset>
        <BridgeHarness />
      </fieldset>,
    );
    await waitFor(() =>
      expect(screen.getByTestId('bridge-state')).toHaveAttribute('data-disabled', 'false'),
    );
  });
});
