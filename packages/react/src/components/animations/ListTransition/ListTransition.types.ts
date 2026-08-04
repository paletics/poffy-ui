import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { ListContainerType, ListItemType } from './ListTransition.presets';

/** Named list-container transition preset. */
export type ListAnimationType = ListContainerType;

/** Named list item transition preset. */
export type ListItemAnimationType = ListItemType;

/**
 * Props for initial entrance animation of a stable list; item identity and mutations remain parent-owned.
 * @typeParam C - Custom data accepted by the selected preset.
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
 * can dispatch the matching `enter` variant label.
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
