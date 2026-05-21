import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { CollapseTransitionType } from './CollapseTransition.presets';

/**
 * Public preset names supported by `CollapseTransition`.
 */
export type CollapseAnimationType = CollapseTransitionType;

/**
 * Base props for `CollapseTransition`.
 *
 * ### Notes
 * This is a controlled transition. The parent owns `isOpen`; the
 * component only animates the mounted/open state it receives.
 *
 * ### AI Usage
 * - **DO**: Pair with a trigger that owns `aria-expanded` and, when applicable, `aria-controls`.
 * - **DON'T**: Use this as an accordion state manager; use it as the animated panel only.
 *
 * ### Generic Parameters
 * - **C**: Custom data shape accepted by preset resolvers.
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
   * Closed persistent content receives `aria-hidden`.
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
