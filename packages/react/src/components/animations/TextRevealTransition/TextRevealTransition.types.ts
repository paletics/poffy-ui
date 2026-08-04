import type { MotionPrimitiveProps } from '@/types/motion';
import { HTMLMotionProps } from 'motion/react';
import { CustomData } from '../types';
import { TextRevealTransitionType } from './TextRevealTransition.presets';

/** Named text-reveal transition preset. */
export type TextAnimationType = TextRevealTransitionType;

/**
 * Props for a text reveal that splits a short plain-text child into animated spans.
 * @typeParam C - Custom data accepted by the selected preset.
 */
export interface TextRevealTransitionBaseProps<C extends CustomData = CustomData> {
  /**
   * Stagger delay between characters or words.
   *
   * @defaultValue `0.057`
   */
  staggerDelay?: number;
  /**
   * Animation preset type.
   *
   * @defaultValue `'bounce'`
   */
  animationType?: TextAnimationType;
  /**
   * Framer Motion viewport configuration.
   */
  viewport?: HTMLMotionProps<'div'>['viewport'];
  /**
   * Custom values passed to the animation variants.
   */
  customData?: C;
}

/**
 * TextRevealTransition props.
 */
export type TextRevealTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  TextRevealTransitionBaseProps<C>
>;
