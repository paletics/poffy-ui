import type { MotionPrimitiveProps } from '@/types/motion';
import { SelectionTransitionType } from './SelectionTransition.presets';

/**
 * Public preset names supported by `SelectionTransition`.
 */
export type SelectionAnimationType = SelectionTransitionType;

/**
 * Base props for `SelectionTransition`.
 *
 * ### Notes
 * This is a controlled indicator transition. The owning input, option,
 * or menu item remains responsible for selected/checked state and semantics.
 *
 * ### AI Usage
 * - **DO**: Use for checkmarks, radio dots, and active item markers.
 * - **DON'T**: Store selection state in this component.
 */
export interface SelectionTransitionBaseProps {
  /**
   * Whether the selected indicator should be visible.
   */
  isSelected: boolean;
  /**
   * Animation preset to apply.
   *
   * @defaultValue `'check'`
   */
  animationType?: SelectionAnimationType;
  /**
   * Optional key used when swapping selected indicator content.
   */
  transitionKey?: string | number;
  /**
   * Keeps the indicator mounted and toggles hidden state instead of removing it.
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
}

/**
 * Props for `SelectionTransition`.
 */
export type SelectionTransitionProps = MotionPrimitiveProps<'span', SelectionTransitionBaseProps>;
