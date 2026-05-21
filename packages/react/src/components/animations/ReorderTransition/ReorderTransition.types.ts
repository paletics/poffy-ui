import type { MotionPrimitiveProps } from '@/types/motion';
import { AnimatePresenceProps } from 'motion/react';
import { OrderItemAnimationType } from './ReorderTransition.presets';

/**
 * ReorderTransition Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces for ReorderTransition (container) and ReorderTransition.Item.
 * This component is designed for runtime mutations (add/remove/reorder), not initial mount stagger.
 * Use StaggerTransition for one-time entrance animations.
 */

export type { OrderItemAnimationType };

/**
 * Base props for `ReorderTransition`.
 *
 * ### Notes
 * The parent controls the item array and ordering. This component
 * requires stable React keys to animate add/remove/reorder changes correctly.
 *
 * ### AI Usage
 * - **DO**: Use for runtime collection mutations.
 * - **DON'T**: Use index keys; identity must survive sorting and filtering.
 */
export interface ReorderTransitionBaseProps {
  /**
   * Default enter/exit animation preset applied to all child items.
   * Override per-item via `<ReorderTransition.Item animationType="..." />`.
   *
   * @defaultValue `'pop'`
   */
  animationType?: OrderItemAnimationType;
  /**
   * AnimatePresence exit strategy.
   * - `'popLayout'`: Immediately removes the exiting element from layout flow (recommended).
   *   Other items animate to their new positions without waiting for exit to finish.
   * - `'sync'`: Waits for exit animation to complete before reflowing remaining items.
   *
   * @defaultValue `'popLayout'`
   */
  exitMode?: AnimatePresenceProps['mode'];
}

/**
 * Base props for `ReorderTransition.Item`.
 *
 * ### Notes
 * Must be rendered as a keyed child of `ReorderTransition`.
 */
export interface ReorderTransitionItemBaseProps {
  /**
   * Per-item animation preset. Overrides the parent container's `animationType`.
   */
  animationType?: OrderItemAnimationType;
}

/** Props for `ReorderTransition`. */
export type ReorderTransitionProps = MotionPrimitiveProps<'div', ReorderTransitionBaseProps>;

/** Props for `ReorderTransition.Item`. */
export type ReorderTransitionItemProps = MotionPrimitiveProps<
  'div',
  ReorderTransitionItemBaseProps
>;
