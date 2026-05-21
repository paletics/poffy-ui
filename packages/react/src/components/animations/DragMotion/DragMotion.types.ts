import { RefObject } from 'react';
import type { MotionPrimitiveProps } from '@/types/motion';

/**
 * Base props for `DragMotion`.
 *
 * ### Notes
 * `DragMotion` delegates gesture state to Framer Motion. The parent
 * may constrain motion with `dragConstraints`, but this type does not expose a
 * controlled position API.
 *
 * ### AI Usage
 * - **DO**: Use for draggable handles, cards, sliders, and reorder affordances.
 * - **DON'T**: Use for native HTML drag-and-drop file/data transfer.
 */
export interface DragMotionBaseProps {
  /**
   * Dragging axis constraint
   *
   * @defaultValue `true`
   */
  drag?: boolean | 'x' | 'y';

  /**
   * Whether to use inertia for momentum based dragging
   *
   * @defaultValue `true`
   */
  inertia?: boolean;

  /**
   * Drag constraints (optional bounds)
   */
  dragConstraints?:
    | { top?: number; left?: number; right?: number; bottom?: number }
    | RefObject<Element>;

  /**
   * Drag elastic property
   *
   * @defaultValue `0.5`
   */
  dragElastic?: number | { top?: number; left?: number; right?: number; bottom?: number };

  /**
   * Whether to snap back to origin
   *
   * @defaultValue `false`
   */
  snapToOrigin?: boolean;

  /**
   * Propagation control
   *
   * @defaultValue `false`
   */
  dragPropagation?: boolean;
}

/** Props for `DragMotion`. */
export type DragMotionProps = MotionPrimitiveProps<'div', DragMotionBaseProps>;
