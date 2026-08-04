import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { OverlayTransitionType } from './OverlayTransition.presets';

/** Named overlay-transition preset. */
export type OverlayAnimationType = OverlayTransitionType;

/**
 * Props for a controlled overlay animation. The caller owns visibility, focus, dismissal, and ARIA semantics.
 * @typeParam C - Custom data accepted by the selected preset.
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
  /** Enables Motion layout coordination for this controlled overlay root. */
  layout?: true | false | 'position' | 'size' | 'preserve-aspect';
  /** Shared layout identity for coordinating a transition between overlay roots. */
  layoutId?: string;
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
