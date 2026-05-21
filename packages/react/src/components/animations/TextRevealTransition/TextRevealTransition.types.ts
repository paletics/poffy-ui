import type { MotionPrimitiveProps } from '@/types/motion';
import { HTMLMotionProps } from 'motion/react';
import { CustomData } from '../types';
import { TextRevealTransitionType } from './TextRevealTransition.presets';

/**
 * Text Transition Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces and component types for `TextRevealTransition`.
 * Supports character-level and word-level splitting for cinematic text entrance.
 */

export type TextAnimationType = TextRevealTransitionType;

/**
 * Base props for TextRevealTransition.
 *
 * ### Notes
 * Splits a short string into animated spans. Use for headings and hero
 * copy, not arbitrary rich text or long localized paragraphs.
 *
 * ### AI Usage
 * - **DO**: Pass plain string children or an `asChild` element with a single text node.
 * - **DON'T**: Use when preserving exact text node structure is required.
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
