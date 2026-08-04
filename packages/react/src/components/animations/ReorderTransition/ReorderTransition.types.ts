import type { MotionPrimitiveProps } from '@/types/motion';
import { AnimatePresenceProps } from 'motion/react';
import { OrderItemAnimationType } from './ReorderTransition.presets';

export type { OrderItemAnimationType };

/**
 * Props for collection mutation animations. Children need stable React keys across reorders.
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

/** Public props for ReorderTransition. */
export type ReorderTransitionProps = MotionPrimitiveProps<'div', ReorderTransitionBaseProps>;

/** Public props for ReorderTransitionItem. */
export type ReorderTransitionItemProps = MotionPrimitiveProps<
  'div',
  ReorderTransitionItemBaseProps
>;
