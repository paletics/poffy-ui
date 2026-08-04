/** Minimal form-associated element shape accepted by the form-event subscriptions. */
export interface FormAssociatedElement extends Element {
  readonly form: HTMLFormElement | null;
}

/** Form events that are captured from the associated form's tree root. */
export type FormAssociatedEventType = 'formdata' | 'reset';

/**
 * Delegates a form event from the anchor's tree root and resolves form
 * ownership when the event fires. This keeps subscriptions valid when an
 * external form mounts late or is replaced with another form using the same
 * id. The caller must reattach when moving the anchor imperatively to a
 * different document or shadow root.
 */
export const subscribeToFormAssociatedEvent = (
  anchor: FormAssociatedElement,
  type: FormAssociatedEventType,
  listener: (event: Event) => void,
): (() => void) => {
  const treeRoot = anchor.getRootNode();
  const handleEvent: EventListener = (event) => {
    if (event.target === anchor.form) listener(event);
  };

  treeRoot.addEventListener(type, handleEvent, true);
  return () => treeRoot.removeEventListener(type, handleEvent, true);
};

/**
 * Runs a reset callback after cancellation has been decided by all reset
 * handlers. Cleanup also invalidates a reset already queued for the component.
 */
export const subscribeToFormReset = (
  anchor: FormAssociatedElement,
  listener: () => void,
): (() => void) => {
  let active = true;
  const unsubscribe = subscribeToFormAssociatedEvent(anchor, 'reset', (event) => {
    queueMicrotask(() => {
      if (active && !event.defaultPrevented) listener();
    });
  });

  return () => {
    active = false;
    unsubscribe();
  };
};
