import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { ActionMotionType } from './ActionMotion.presets';

/** Named interaction-motion preset. */
export type ActionAnimationType = ActionMotionType | 'none' | false;

/**
 * Props for `ActionMotion`; gesture state is handled by Motion rather than React state.
 * @typeParam C - Custom data accepted by the selected preset.
 */
export interface ActionMotionBaseProps<C extends CustomData = CustomData> {
  /**
   * Whether the interaction is disabled.
   * Stops hover/tap/focus motion without changing the rendered element's
   * semantic disabled state.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * ARIA disabled state forwarded to the rendered element.
   * Use when the child is not a native disabled form control.
   */
  'aria-disabled'?: boolean | 'true' | 'false';
  /**
   * Animation preset type. Use `false` or `'none'` to render without
   * interaction motion.
   *
   * @defaultValue `'press'`
   */
  animationType?: ActionAnimationType;
  /**
   * Custom values passed to the animation variants (e.g., shadowSize, shadowColor).
   */
  customData?: C;
}

/**
 * ActionMotion props.
 */
export type ActionMotionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  ActionMotionBaseProps<C>
>;
