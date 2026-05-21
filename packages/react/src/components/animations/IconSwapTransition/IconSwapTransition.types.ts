import type { MotionPrimitiveProps } from '@/types/motion';
import { IconSwapTransitionType } from './IconSwapTransition.presets';

/**
 * Public preset names supported by `IconSwapTransition`.
 */
export type IconSwapAnimationType = IconSwapTransitionType;

/**
 * Base props for `IconSwapTransition`.
 *
 * ### Notes
 * This is a keyed transition. The parent owns the current icon/status
 * state and must update `transitionKey` when the visible child changes.
 *
 * ### AI Usage
 * - **DO**: Use for compact status/icon swaps where enter and exit should be synchronized.
 * - **DON'T**: Use for full panel changes; use `ContentTransition`.
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
