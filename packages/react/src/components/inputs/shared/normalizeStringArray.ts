import { useRef } from 'react';

/**
 * Returns a stable-order set of string values from an untrusted collection.
 *
 * The returned array never aliases the supplied array so a later uncontrolled
 * handoff or form reset cannot observe consumer-side mutation.
 */
export const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const normalized: string[] = [];
  value.forEach((item) => {
    if (typeof item !== 'string' || seen.has(item)) return;
    seen.add(item);
    normalized.push(item);
  });
  return normalized;
};

/** Ordered semantic equality for selection arrays. */
export const areStringArraysEqual = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index]);

/**
 * Keeps a canonical collection reference stable across semantically equal renders.
 */
export const useCanonicalStringArray = (value: unknown): string[] => {
  const candidate = normalizeStringArray(value);
  const canonicalRef = useRef(candidate);

  if (!areStringArraysEqual(canonicalRef.current, candidate)) {
    canonicalRef.current = candidate;
  }

  return canonicalRef.current;
};
