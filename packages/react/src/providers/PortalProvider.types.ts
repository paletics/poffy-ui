import type { ReactNode } from 'react';

/**
 * DOM root supported by every Poffy UI floating portal.
 *
 * When the target is a ShadowRoot, the consumer must also install the Poffy UI
 * stylesheet in that shadow tree. Document-level styles do not cross a shadow boundary.
 * Viewport-fixed components such as Modal, Drawer, AlertDialog, and Puff also require
 * the target and its ancestors not to establish a CSS fixed-position containing block
 * (for example via transform, filter, containment, container-type, or
 * content-visibility).
 */
export type PortalProviderTarget = HTMLElement | ShadowRoot;

/** A portal root or a lazy resolver evaluated after the component mounts. */
export type PortalProviderContainer =
  | PortalProviderTarget
  | null
  | (() => PortalProviderTarget | null);

/** Additive target override used by components that own a portal. */
export interface PortalTargetProps {
  portalContainer?: PortalProviderContainer;
}

/** Props for a subtree-wide portal target. */
export interface PortalProviderProps {
  children?: ReactNode;
  /**
   * Portal root for this subtree. `null` intentionally suppresses portals.
   * A lazy resolver is useful when the root is held by a React ref.
   * ShadowRoot containers must include `@poffy-ui/react/styles.css` in that tree.
   * This selects DOM ownership only. It does not make viewport-fixed overlays
   * container-scoped; avoid transformed, filtered, perspective, or paint/layout-contained
   * roots for Modal, Drawer, AlertDialog, and Puff.
   */
  container: PortalProviderContainer;
}
