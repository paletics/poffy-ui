import type { MotionPrimitiveProps } from '@/types/motion';
import { HTMLMotionProps } from 'motion/react';
import { CustomData } from '../types';
import { RevealTransitionType } from './RevealTransition.presets';

/** Named viewport-reveal transition preset. */
export type RevealAnimationType = RevealTransitionType;

/**
 * Props for viewport-triggered content reveal.
 * @typeParam C - Custom data accepted by the selected preset.
 */
export interface RevealTransitionBaseProps<C extends CustomData = CustomData> {
  /**
   * Custom values passed to the animation variants.
   */
  customData?: C;
  /**
   * Animation preset type.
   *
   * @defaultValue `'fade-up'`
   */
  animationType?: RevealAnimationType;
  /**
   * Framer Motion viewport configuration.
   */
  viewport?: HTMLMotionProps<'div'>['viewport'];
  /**
   * Threshold for the intersection observer (0.0 - 1.0).
   *
   * @defaultValue `0.2`
   */
  threshold?: number;
  /**
   * Whether the animation should only trigger once.
   *
   * @defaultValue `true`
   */
  once?: boolean;
  /**
   * Entrance animation delay.
   *
   * @defaultValue `0`
   */
  delay?: number;
  /**
   * Overrides the preset duration in seconds.
   */
  duration?: number;
  /**
   * Initial blur radius in pixels for the `blur` animation preset.
   *
   * @defaultValue preset-defined blur radius
   */
  blurAmount?: number;
}

/**
 * RevealTransition props.
 */
export type RevealTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  RevealTransitionBaseProps<C>
>;
