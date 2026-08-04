/**
 * Resolves an explicitly supplied window or, when omitted, the ambient browser window.
 *
 * Passing `null` intentionally keeps the target detached. Server rendering and environments
 * without a global `window` also resolve to `null`.
 *
 * @internal Shared by hooks that support iframe and owner-window targeting.
 */
export const resolveTargetWindow = (targetWindow: Window | null | undefined): Window | null => {
  if (targetWindow !== undefined) return targetWindow;
  if (typeof window !== 'undefined') return window;
  return null;
};
