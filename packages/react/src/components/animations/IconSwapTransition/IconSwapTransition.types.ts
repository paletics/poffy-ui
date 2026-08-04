import type { MotionPrimitiveProps } from '@/types/motion';
import { IconSwapTransitionType } from './IconSwapTransition.presets';

/**
 * Public preset names supported by `IconSwapTransition`.
 */
export type IconSwapAnimationType = IconSwapTransitionType;

/**
 * Props for a keyed icon transition. Update `transitionKey` when the visible child changes.
 */
export interface IconSwapTransitionBaseProps {
  /**
   * Unique key for the currently displayed icon/content.
   */
  transitionKey: string | number | boolean;
  /**
   * Animation preset to apply.
   *
   * @defaultValue `'pop'`
   */
  animationType?: IconSwapAnimationType;
  /**
   * Whether initial mount should animate.
   *
   * @defaultValue `false`
   */
  initial?: boolean;
}

/**
 * Props for `IconSwapTransition`.
 */
export type IconSwapTransitionProps = MotionPrimitiveProps<'span', IconSwapTransitionBaseProps>;
