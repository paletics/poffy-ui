'use client';

import { RefObject, useMemo, type RefCallback } from 'react';
import type { ReactRef } from './useMergeRefs.types';

/**
 * Assigns a value to a callback or mutable object ref.
 *
 * This is the imperative primitive behind `useMergeRefs`. It is intended for
 * React ref plumbing only; callers should pass the exact node/value React is
 * assigning and let errors surface when a readonly ref is provided.
 *
 * @param ref - The ref to assign to.
 * @param value - The value to assign.
 * @returns The callback ref cleanup, when the callback provides one.
 */
export const assignRef = <T>(
  ref: ReactRef<T> | null | undefined,
  value: T | null,
): ReturnType<RefCallback<T>> => {
  if (ref == null) return;

  if (typeof ref === 'function') {
    return ref(value);
  }

  try {
    (ref as RefObject<T | null>).current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}': ${error}`, { cause: error });
  }
};

/**
 * Creates a callback that assigns the same node to every supplied ref.
 * Use this outside React hooks when callback identity is managed by the caller.
 * React 19 callback cleanups run in input order; refs without a cleanup are
 * cleared with `null`. The first thrown error is propagated.
 */
export const mergeRefs =
  <T>(...refs: (ReactRef<T> | null | undefined)[]): RefCallback<T> =>
  (node) => {
    const cleanups = refs.map((ref) => assignRef(ref, node));

    if (node === null || cleanups.every((cleanup) => typeof cleanup !== 'function')) {
      return;
    }

    return () => {
      refs.forEach((ref, index) => {
        const cleanup = cleanups[index];

        if (typeof cleanup === 'function') {
          cleanup();
        } else {
          assignRef(ref, null);
        }
      });
    };
  };

/**
 * Merges multiple refs into a single callback ref.
 *
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

    return mergeRefs(...refs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
};
