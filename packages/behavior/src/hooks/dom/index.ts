/**
 * Moves to an adjacent composed-tree tab stop, optionally excluding a portalled surface.
 *
 * It honors positive tabindex ordering, open shadow roots/slots, hidden/inert/disabled elements,
 * and radio-group tab-stop behavior.
 */
export { focusAdjacentTabStop } from './focusAdjacentTabStop';
export type { FocusAdjacentTabStopOptions } from './focusAdjacentTabStop';
/** Resolves the owning Document or ShadowRoot without crossing a shadow boundary. */
export { getDOMTreeRoot } from './domTree';

/** Finds an id only inside the supplied node's own Document or ShadowRoot scope. */
export { getTreeElementById } from './domTree';

/** Follows nested open shadow roots to the deepest active element. */
export { getDeepActiveElement } from './domTree';
export type { DOMTreeRoot } from './domTree';
/**
 * Captures an associated form's `formdata` or `reset` event from the anchor's current tree root.
 *
 * Form ownership is resolved when the event fires, so late/replaced external forms are supported.
 */
export { subscribeToFormAssociatedEvent } from './subscribeToFormAssociatedEvent';

/** Runs an uncancelled form reset callback in a microtask after all reset handlers decide cancellation. */
export { subscribeToFormReset } from './subscribeToFormAssociatedEvent';
export type {
  FormAssociatedElement,
  FormAssociatedEventType,
} from './subscribeToFormAssociatedEvent';
/**
 * Measures an element's offset dimensions, reattaching when `ref.current` changes.
 *
 * Without ResizeObserver it remeasures on the element's owner-window resize only.
 */
export { useDimensions } from './useDimensions';

/** Element offset-dimension contract. */
export type { Dimensions } from './useDimensions.types';

/**
 * Attaches a window event listener with latest-callback protection and automatic cleanup.
 *
 * Supply `null` targetWindow or `false` `shouldAttach` to keep it detached.
 */
export { useEventListener } from './useEventListener';

/** Tracks viewport dimensions for the global or explicitly supplied window. */
export { useWindowSize } from './useWindowSize';

/** Viewport size contract. */
export type { WindowSize } from './useWindowSize.types';
