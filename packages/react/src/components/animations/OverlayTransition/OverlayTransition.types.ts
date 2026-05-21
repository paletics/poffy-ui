import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { OverlayTransitionType } from './OverlayTransition.presets';

/**
 * Overlay Transition Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces and component types for `OverlayTransition`.
 * Orchestrates entrance and exit animations for modals, popovers, and drawers.
 * Integration with `AnimatePresence` is expected for most presets.
 */

export type OverlayAnimationType = OverlayTransitionType;

/**
 * Base props for OverlayTransition.
 *
 * ### Notes
 * This is a controlled visual wrapper. The owning overlay component
 * controls `isVisible`, focus management, dismissal, and ARIA dialog/menu semantics.
 *
 * ### AI Usage
 * - **DO**: Use inside Modal, Drawer, Popover, Tooltip, and menu surfaces that already own state.
 * - **DON'T**: Treat this as an overlay primitive by itself; it only animates visibility.
 */
export interface OverlayTransitionBaseProps<C extends CustomData = CustomData> {
  /** Visibility state of the overlay. */
  isVisible: boolean;
  /**
   * Animation preset type.
   *
   * @defaultValue `'fade'`
   */
  animationType?: OverlayAnimationType;
  /**
   * Whether to keep the component in the DOM when hidden.
   *
   * @defaultValue `false`
   */
  keepMounted?: boolean;
  /** Custom values passed to the animation variants. */
  customData?: C;
}

/**
 * OverlayTransition props.
 *
 * Uses `MotionPrimitiveProps`; the project-standard base type for framer-motion
 * components that support `asChild`. See `src/types/Polymorphic.ts` for rationale.
 */
export type OverlayTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  OverlayTransitionBaseProps<C>
>;
