import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { LoopEffectType } from './LoopEffect.presets';

/**
 * Loop Effect Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces and component types for `LoopEffect`.
 * Extends `MotionProps` and integrates with `LoopEffectType` presets.
 */

export type LoopAnimationType = LoopEffectType;

/**
 * Base props for LoopEffect component.
 *
 * ### Notes
 * `LoopEffect` is intentionally ambient. Prefer pausing or disabling
 * it for hidden/offscreen content and avoid tying important state meaning to
 * continuous motion alone.
 *
 * ### AI Usage
 * - **DO**: Use for small decorative or feedback elements.
 * - **DON'T**: Apply to large containers or primary reading content.
 */
export interface LoopEffectBaseProps<C extends CustomData = CustomData> {
  /**
   * Animation preset type for continuous loop animations.
   * Choose from predefined presets for different looping effects.
   *
   * @defaultValue `'float'`
   */
  animationType?: LoopAnimationType;

  /**
   * Custom values passed to animation variants for dynamic behavior.
   * Allows fine-tuning animation parameters like distance, scale, delay, etc.
   */
  customData?: C;

  /**
   * Custom duration in seconds to override the preset's default duration.
   * Useful for synchronizing multiple animations or adjusting animation speed.
   */
  duration?: number;

  /**
   * Pause flag to stop the animation and render as a static element.
   * Useful for conditional animations based on user preferences or state.
   *
   * @defaultValue `false`
   */
  isPaused?: boolean;
}

/**
 * LoopEffect props.
 */
export type LoopEffectProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  LoopEffectBaseProps<C>
>;
