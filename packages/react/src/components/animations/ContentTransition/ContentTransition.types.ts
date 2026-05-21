import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { ContentTransitionType } from './ContentTransition.presets';

/** Named content transition preset. */
export type ContentAnimationType = ContentTransitionType;

/**
 * Base props for `ContentTransition`.
 *
 * ### Notes
 * This is a keyed, controlled transition. Change `transitionKey` when
 * the displayed content identity changes; changing children without changing the
 * key may skip enter/exit animation.
 *
 * ### AI Usage
 * - **DO**: Use for route panels, tab panels, wizard steps, and other mutually exclusive content.
 * - **DON'T**: Use for list item add/remove animations; use `ReorderTransition` or `ListTransition`.
 */
export interface ContentTransitionBaseProps {
  /**
   * Animation preset to apply
   *
   * @defaultValue `'fade'`
   */
  animationType?: ContentAnimationType;

  /**
   * Mode for AnimatePresence
   * - 'wait': Wait for exit animation to finish before entering
   * - 'sync': Animate enter and exit simultaneously (overlap)
   * - 'popLayout': Exit elements are popped out of the layout (good for overlap without layout shift)
   *
   * @defaultValue `'wait'`
   */
  mode?: 'wait' | 'sync' | 'popLayout';

  /**
   * Unique key for the content.
   * Changing this key triggers the transition.
   */
  transitionKey?: string | number;

  /**
   * Custom data for animation parameters
   */
  customData?: CustomData;

  /**
   * Whether to animate on initial mount
   *
   * @defaultValue `true`
   */
  initial?: boolean;
}

/** Props for `ContentTransition`. */
export type ContentTransitionProps = MotionPrimitiveProps<'div', ContentTransitionBaseProps>;
