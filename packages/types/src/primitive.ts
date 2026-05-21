import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/**
 * Base type for components that wrap a fixed HTML element without polymorphism.
 * Use this for semantic elements whose tag never changes (e.g., `<img>`, `<audio>`, `<video>`).
 *
 * ### AI Context
 * - **Domain**: Type Utility / Polymorphism
 * - **Side Effects**: None; compile-time prop helper only
 *
 * ### AI Usage
 * - **DO**: Use when the component does NOT support `asChild` / Slot pattern.
 * - **DO**: Use when the underlying HTML element is fixed and semantically meaningful (media, form elements, etc.).
 * - **DON'T**: Do not use when the component needs `asChild` delegation; use `PrimitiveProps` instead.
 *
 * @param T - The fixed HTML element type (e.g., `'img'`, `'audio'`).
 * @param P - Custom component-specific props.
 */
export type NativeProps<T extends ElementType, P = object> = P &
  Omit<ComponentPropsWithoutRef<T>, keyof P>;

/**
 * Base type for components that support the `asChild` (Slot) pattern.
 * Use this when the component can delegate rendering to a child element via Radix UI Slot.
 *
 * ### AI Context
 * - **Domain**: Type Utility / Polymorphism
 * - **Side Effects**: None; compile-time prop helper only
 *
 * ### AI Usage
 * - **DO**: Use when the component implements `asChild` with `@radix-ui/react-slot`.
 * - **DO**: Use when the component is a style/behavior wrapper whose element can be swapped by the consumer.
 * - **DON'T**: Do not use when the underlying HTML element is fixed; use `NativeProps` instead.
 *
 * @param T - The default HTML element type (e.g., `'button'`, `'div'`).
 * @param P - Custom component-specific props.
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
