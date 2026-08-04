/**
 * A synchronous state update captured by the browser View Transition API.
 * Keep asynchronous work outside this callback; it is flushed synchronously when native capture
 * is available.
 */
export type ViewTransitionUpdate = () => void;

/**
 * Result returned after requesting a browser View Transition.
 * `supported` is false when the update used the synchronous non-animated fallback, including
 * server/hydration, policy-disabled, and unsupported-document cases.
 */
export interface ViewTransitionResult {
  /** Whether the native browser transition was started. */
  supported: boolean;
  /** Resolves after the browser finishes the transition or the fallback update completes. */
  finished: Promise<void>;
}

/** API returned by `useViewTransition` for its current owner document and animation policy. */
export interface UseViewTransitionReturn {
  /** Whether the active document supports `document.startViewTransition`. */
  isSupported: boolean;
  /** Captures the supplied synchronous UI update in a native View Transition when permitted. */
  startViewTransition: (update: ViewTransitionUpdate) => ViewTransitionResult;
}
