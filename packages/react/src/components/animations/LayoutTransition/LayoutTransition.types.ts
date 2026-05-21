import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { LayoutTransitionType } from './LayoutTransition.presets';

/**
 * Layout Transition Type Definitions
 *
 * ### AI Context & Architecture
 * Defines prop interfaces and component types for `LayoutTransition`.
 * Extends `MotionProps` and integrates with `LayoutTransitionType` presets.
 */

export type LayoutAnimationType = LayoutTransitionType;

/**
 * Base props for LayoutTransition.
 *
 * ### Notes
 * Uses Framer Motion layout measurement. The parent controls whether
 * the layout changes; this component only animates the geometry delta.
 *
 * ### AI Usage
 * - **DO**: Wrap elements whose size or position changes in response to React state.
 * - **DON'T**: Use for enter/exit mounting animation; use `ContentTransition` or `ReorderTransition`.
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
}

/**
 * LayoutTransition props.
 */
export type LayoutTransitionProps<C extends CustomData = CustomData> = MotionPrimitiveProps<
  'div',
  LayoutTransitionBaseProps<C>
>;
