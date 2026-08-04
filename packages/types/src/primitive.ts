import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/**
 * Base type for components that wrap a fixed HTML element without polymorphism.
 * Use this for semantic elements whose tag never changes (e.g., `<img>`, `<audio>`, `<video>`).
 *
 * @typeParam T - The fixed HTML element type, such as `'img'` or `'audio'`.
 * @typeParam P - Component-specific props that override matching native props.
 */
export type NativeProps<T extends ElementType, P = object> = P &
  Omit<ComponentPropsWithoutRef<T>, keyof P>;

/**
 * Base type for components that support the `asChild` (Slot) pattern.
 *
 * `PrimitiveProps` describes the default host only. When `asChild` is true, refs and event
 * targets are the supplied child host at runtime; this utility does not infer that host type.
 *
 * @typeParam T - The default HTML element type, such as `'button'` or `'div'`.
 * @typeParam P - Component-specific props that override matching native props.
 */
export type PrimitiveProps<T extends ElementType, P = object> = P &
  Omit<ComponentPropsWithoutRef<T>, keyof P | 'asChild'> & {
    /**
     * When true, the component will not render its own DOM element.
     * Instead, it merges its props onto its immediate child.
     *
     * @defaultValue `false`
     */
    asChild?: boolean;
    children?: ReactNode;
  };
