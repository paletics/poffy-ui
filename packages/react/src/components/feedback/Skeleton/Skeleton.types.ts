import type { MotionPrimitiveProps } from '@/types/motion';

/**
 * Semantic tint alias for Skeleton placeholders.
 *
 * ### Notes
 * Most app code should leave this unset and control perceived loading
 * hierarchy with `shape`, `width`, and `height`.
 *
 * ### AI Context & Architecture
 * - SkeletonVariant maps to semantic token keys in variants.* token group.
 */
export type SkeletonVariant =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

/**
 * Shape of the skeleton placeholder.
 *
 * ### Notes
 * Match the shape to the content being replaced: text for lines,
 * circle for avatars, and rect for media or cards.
 */
export type SkeletonShape = 'text' | 'circle' | 'rect';

/**
 * Animation type for the skeleton.
 *
 * ### Notes
 * Both `pulse` and `shimmer` use CSS keyframes only.
 */
export type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

/**
 * Base props for the Skeleton component.
 *
 * @example
 * ```tsx
 * import { Skeleton } from '@poffy-ui/react/feedback';
 *
 * <Skeleton shape="text" width="12rem" />
 * <Skeleton shape="circle" width={40} />
 * ```
 *
 * ### Notes
 * Do: mark the real loading region with `aria-busy` or status text when users
 * need an announcement.
 * Don't: put meaningful text inside Skeleton; the component is `aria-hidden`.
 *
 * ### AI Usage
 * - Use to reserve layout while data loads.
 * - Prefer dimensions that match the eventual content to avoid layout shift.
 */
export interface SkeletonBaseProps {
  /** Legacy semantic tint alias. Prefer the shape axis as the primary public API. */
  variant?: SkeletonVariant;
  /** The geometric shape. */
  shape?: SkeletonShape;
  /** The animation style. */
  animation?: SkeletonAnimation;
  /**
   * Width of the skeleton. Applied through `--skeleton-width` so the recipe can map
   * sizing to each shape. Numeric values are converted to px.
   */
  width?: string | number;
  /**
   * Height of the skeleton. Applied through `--skeleton-height`.
   * For `shape="circle"`, defaults to `width` when omitted.
   * Numeric values are converted to px.
   */
  height?: string | number;
}

/**
 * Props for the Skeleton component.
 *
 * ### AI Context & Architecture
 * Uses `MotionPrimitiveProps` (not `PrimitiveProps`) because the root element is
 * `motion.span`. This resolves drag/animation event type conflicts between React's
 * `DragEventHandler` and framer-motion's `PanInfo`-based signatures.
 *
 * Related: `SkeletonBaseProps`
 */
export type SkeletonProps = MotionPrimitiveProps<'span', SkeletonBaseProps>;
