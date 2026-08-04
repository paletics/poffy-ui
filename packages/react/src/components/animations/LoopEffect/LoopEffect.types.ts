import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { LoopEffectType } from './LoopEffect.presets';

/** Named looping-animation preset. */
export type LoopAnimationType = LoopEffectType;

/**
 * Props for an ambient looping animation.
 * @typeParam C - Custom data accepted by the selected preset.
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
