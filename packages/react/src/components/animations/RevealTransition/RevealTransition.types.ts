import type { MotionPrimitiveProps } from '@/types/motion';
import { HTMLMotionProps } from 'motion/react';
import { CustomData } from '../types';
import { RevealTransitionType } from './RevealTransition.presets';

/**
 * Reveal Transition Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces and component types for `RevealTransition`.
 * Leverages Framer Motion's `whileInView` for scroll-triggered animations.
 */

export type RevealAnimationType = RevealTransitionType;

/**
 * Base props for RevealTransition.
 *
 * ### Notes
 * Reveal timing is viewport-driven through Framer Motion's
 * intersection observer integration. Use `once` when content should not replay
 * as users scroll back and forth.
 *
 * ### AI Usage
 * - **DO**: Use for scroll-enter content and marketing/editorial reveals.
 * - **DON'T**: Use for content that must be visible immediately for measurement or SEO-critical layout.
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
}

/**
 * RevealTransition props.
 */
export type RevealTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  RevealTransitionBaseProps<C>
>;
