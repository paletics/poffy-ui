import type { ReactNode } from 'react';

/** Explicit portal destination, `null` to suppress the portal, or a post-commit resolver. */
export type PortalContainer =
  | Element
  | DocumentFragment
  | null
  | (() => Element | DocumentFragment | null);

/** Document used by the default body portal when no container is configured. */
export type PortalOwnerDocument = Document | null | (() => Document | null);

/** Public props for Portal. */
export interface PortalProps {
  /** Content rendered into the target container. */
  children?: ReactNode;

  /**
   * Target portal container. Defaults to `document.body` after mount. A resolver is re-evaluated
   * after each React commit, allowing it to return a target that mounts later.
   */
  container?: PortalContainer;

  /**
   * Owner document for the default portal body. A resolver is re-evaluated after commits.
   * An explicit `container`, including `null`, always takes precedence.
   * Supply this or `container` when the React tree renders into an iframe document.
   */
  ownerDocument?: PortalOwnerDocument;

  /**
   * Renders children in place instead of creating a portal.
   * @defaultValue false
   */
  disabled?: boolean;

  /**
   * Recreates the current motion, brand, color mode, locale, direction, and
   * runtime token override scopes at the portal destination.
   * Adds a neutral wrapper and is therefore opt-in for this low-level portal.
   * @defaultValue false
   */
  scopeProviders?: boolean;
}
