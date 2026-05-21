'use client';

import { RefObject, useMemo } from 'react';
import type { ReactRef } from './useMergeRefs.types';

/**
 * Assigns a value to a callback or mutable object ref.
 *
 * ### Notes
 * This is the imperative primitive behind `useMergeRefs`. It is intended for
 * React ref plumbing only; callers should pass the exact node/value React is
 * assigning and let errors surface when a readonly ref is provided.
 *
 * @param ref - The ref to assign to.
 * @param value - The value to assign.
 */
export const assignRef = <T>(ref: ReactRef<T> | null | undefined, value: T) => {
  if (ref == null) return;

  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  try {
    (ref as RefObject<T>).current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}': ${error}`, { cause: error });
  }
};

/**
 * Merges multiple refs into a single callback ref.
 *
 * ### Notes
 * Returns `null` when every input ref is nullish, allowing components to avoid
 * attaching unnecessary ref callbacks. Use in React components that need to
 * forward a public ref while also retaining an internal DOM ref.
 *
 * @param refs - List of refs to merge.
 * @returns A single callback ref to pass to an element, or `null` when no refs are provided.
 */
export const useMergeRefs = <T>(...refs: (ReactRef<T> | null | undefined)[]) => {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (node: T) => {
      refs.forEach((ref) => {
        assignRef(ref, node);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
};
