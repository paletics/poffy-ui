import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { LayoutTransitionType } from './LayoutTransition.presets';

/** Named layout-transition preset. */
export type LayoutAnimationType = LayoutTransitionType;

/**
 * Props for a transition that animates layout changes caused by its parent.
 * @typeParam C - Custom data accepted by the selected preset.
 */
export interface LayoutTransitionBaseProps<C extends CustomData = CustomData> {
  /**
   * Animation preset type.
   *
   * @defaultValue `'reorder'`
   */
  animationType?: LayoutAnimationType;

  /**
   * Custom values passed to the animation variants.
   */
  customData?: C;

  /** Layout measurement mode. Defaults to `true` while motion is enabled. */
  layout?: true | false | 'position' | 'size' | 'preserve-aspect';

  /** Shared layout identity for coordinating a transition between elements. */
  layoutId?: string;
}

/**
 * LayoutTransition props.
 */
export type LayoutTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  LayoutTransitionBaseProps<C>
>;
