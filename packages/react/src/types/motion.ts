import { HTMLMotionProps } from 'motion/react';

/**
 * Base type for framer-motion components that support the `asChild` (Slot) pattern.
 * Use this instead of `PrimitiveProps<T>` when the component's render output is a
 * framer-motion element (e.g. `motion.div`).
 *
 * `PrimitiveProps<T>` composes `ComponentPropsWithoutRef<T>` (React HTML events) with
 * `MotionProps` (motion gesture events) manually. This causes type conflicts on shared
 * event names such as `onDrag`, `onDragStart`, and `onDragEnd`, whose signatures differ
 * between React's `DragEventHandler<T>` and motion's `(event, info: PanInfo) => void`.
 * `HTMLMotionProps<T>` is framer-motion's own solution — it merges both sets of props
 * and resolves those conflicts internally, making it the correct base for this type.
 *
 * ### AI Context
 * - **Domain**: Type Utility / Motion / Polymorphism
 * - **Side Effects**: Pure function
 *
 * ### AI Usage
 * - **DO**: Use when the component renders a `motion.*` element as its root.
 * - **DO**: Use when the component supports `asChild` / Slot delegation.
 * - **DON'T**: Do not use `PrimitiveProps` for motion components — event handler type conflicts (`onDrag` etc.) will occur.
 *
 * @param T - The underlying HTML element tag (e.g., `'div'`, `'span'`). Constrained to
 *   `keyof HTMLElementTagNameMap` because motion components always render HTML elements;
 *   arbitrary React component types are handled via the `asChild` Slot pattern instead.
 * @param P - Custom component-specific props that take priority over HTMLMotionProps.
 */
export type MotionPrimitiveProps<T extends keyof HTMLElementTagNameMap = 'div', P = object> = Omit<
  HTMLMotionProps<T>,
  keyof P | 'asChild'
> &
  P & {
    /**
     * When true, the component will not render its own DOM element.
     * Instead, it merges its props onto its immediate child.
     */
    asChild?: boolean;
  };
