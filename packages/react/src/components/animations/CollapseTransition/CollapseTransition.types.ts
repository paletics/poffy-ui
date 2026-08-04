import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { CollapseTransitionType } from './CollapseTransition.presets';

/**
 * Public preset names supported by `CollapseTransition`.
 */
export type CollapseAnimationType = CollapseTransitionType;

/**
 * Props for a controlled collapse transition; the parent owns `isOpen` and trigger semantics.
 * @typeParam C - Custom data accepted by the selected preset.
 */
export interface CollapseTransitionBaseProps<C extends CustomData = CustomData> {
  /**
   * Whether the collapsible content is open.
   */
  isOpen: boolean;
  /**
   * Animation preset to apply.
   *
   * @defaultValue `'height-fade'`
   */
  animationType?: CollapseAnimationType;
  /**
   * Keeps the element mounted and toggles hidden state instead of removing it.
   * Closed persistent content receives `aria-hidden`. With `animationType="scale-y"`,
   * the closed element retains its layout space; use a height animation to collapse flow.
   *
   * @defaultValue `false`
   */
  keepMounted?: boolean;
  /**
   * Whether initial mount should animate.
   *
   * @defaultValue `false`
   */
  initial?: boolean;
  /**
   * Custom values passed to the animation variants.
   */
  customData?: C;
}

/**
 * Props for `CollapseTransition`.
 */
export type CollapseTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  CollapseTransitionBaseProps<C>
>;
