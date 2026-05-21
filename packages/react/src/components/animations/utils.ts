import { m, MotionProps } from 'motion/react';
import { ComponentType, ElementType, RefObject, Ref, RefCallback } from 'react';

/**
 * Extracts a typed value from a `CustomData` record with a fallback.
 * Ensures type safety when resolving preset-specific parameters.
 */
export const getCustomValue = <T>(
  custom: Record<string, unknown> | undefined,
  key: string,
  defaultValue: T,
): T => {
  const value = custom?.[key];
  return typeof value === typeof defaultValue ? (value as T) : defaultValue;
};

type MotionComponentType = ComponentType<MotionProps & Record<string, unknown>>;

const mComponentCache = new Map<ElementType, MotionComponentType>();

/**
 * Retrieves a stable Motion component for the given HTML tag or custom component.
 * Uses caching to prevent unnecessary re-renders and ensure reference stability.
 *
 * @param Component - The HTML element tag name (e.g., 'div', 'span') or custom component to wrap
 * @returns A stable Motion-wrapped component from cache
 */
export const getMotionComponent = <T extends ElementType>(Component: T): MotionComponentType => {
  if (typeof Component === 'string') {
    const mElements = m as unknown as Record<string, MotionComponentType>;
    const mElement = mElements[Component];
    if (mElement) return mElement;

    if (!mComponentCache.has(Component)) {
      mComponentCache.set(Component, m.create(Component as Parameters<typeof m.create>[0]));
    }
  }

  if (!mComponentCache.has(Component)) {
    mComponentCache.set(Component, m.create(Component as Parameters<typeof m.create>[0]));
  }

  const cached = mComponentCache.get(Component);
  if (!cached) {
    throw new Error(`[UI] Failed to resolve motion component for: ${String(Component)}`);
  }

  return cached;
};

/**
 * Composes multiple refs into a single RefCallback.
 * Handles function refs, object refs, and null/undefined.
 *
 * @param refs - List of refs to compose
 * @returns A stable RefCallback that updates all provided refs
 */
export const composeRefs =
  <T>(...refs: (Ref<T> | RefObject<T | null> | null | undefined)[]): RefCallback<T> =>
  (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as RefObject<T | null>).current = node;
      }
    });
  };
