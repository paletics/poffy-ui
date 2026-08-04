import { RefObject } from 'react';
import type { MotionPrimitiveProps } from '@/types/motion';

/**
 * Props for Motion-managed dragging with optional bounds; does not provide controlled position state.
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

/** Public props for DragMotion. */
export type DragMotionProps = MotionPrimitiveProps<'div', DragMotionBaseProps>;
