import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { ListContainerType, ListItemType } from './ListTransition.presets';

/**
 * List Transition Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces and component types for `ListTransition` and `ListTransitionItem`.
 * Manages staggered entry for collections of items.
 */

export type ListAnimationType = ListContainerType;

/** Named list item transition preset. */
export type ListItemAnimationType = ListItemType;

/**
 * Base props for ListTransition (Container).
 *
 * ### Notes
 * `ListTransition` is an entrance orchestration wrapper for a stable
 * list. It does not manage item identity, sorting, or add/remove exit motion.
 *
 * ### AI Usage
 * - **DO**: Use with `ListTransitionItem` children for first-render or reveal-in-view lists.
 * - **DON'T**: Use for dynamic reorder operations; use `ReorderTransition`.
 */
export interface ListTransitionBaseProps<C extends CustomData = CustomData> {
  /**
   * Custom values passed to the orchestration variants.
   */
  customData?: C;
  /**
   * Container animation preset type.
   *
   * @defaultValue `'flow'`
   */
  animationType?: ListAnimationType;
}

/**
 * ListTransition props.
 */
export type ListTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'ul',
  ListTransitionBaseProps<C>
>;

/**
 * Base props for ListTransitionItem (Individual items).
 *
 * ### Notes
 * Must be rendered under a `ListTransition` container so Framer Motion
 * can dispatch the matching `hidden` and `visible` variant labels.
 */
export interface ListTransitionItemBaseProps {
  /**
   * Item animation preset type.
   *
   * @defaultValue `'pop'`
   */
  animationType?: ListItemAnimationType;
}

/**
 * ListTransitionItem props.
 */
export type ListTransitionItemProps = MotionPrimitiveProps<'li', ListTransitionItemBaseProps>;
