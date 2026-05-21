import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { ActionMotionType } from './ActionMotion.presets';

/**
 * Action Motion Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces and component types for `ActionMotion`.
 * Extends `MotionProps` and integrates with `ActionMotionType` presets.
 */

export type ActionAnimationType = ActionMotionType | 'none' | false;

/**
 * Base props for `ActionMotion`.
 *
 * ### Notes
 * `ActionMotion` is uncontrolled. It reacts to hover/tap/focus gesture
 * state emitted by Framer Motion and does not store pressed or hovered state in React.
 *
 * ### AI Usage
 * - **DO**: Keep business events on the semantic child, especially when using `asChild`.
 * - **DON'T**: Use `disabled` alone to communicate native button disabled semantics;
 *   prefer a disabled child button when the element is a button.
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
