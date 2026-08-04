import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  areStringArraysEqual,
  normalizeStringArray,
  useCanonicalStringArray,
} from './normalizeStringArray';

describe('normalizeStringArray', () => {
  it('fails closed for non-arrays and removes malformed and duplicate entries', () => {
    expect(normalizeStringArray(null)).toEqual([]);
    expect(normalizeStringArray('one')).toEqual([]);
    expect(normalizeStringArray(['one', 2, 'one', 'two', null])).toEqual(['one', 'two']);
  });

  it('copies valid input and compares canonical arrays by ordered content', () => {
    const source = ['one', 'two'];
    const normalized = normalizeStringArray(source);

    expect(normalized).toEqual(source);
    expect(normalized).not.toBe(source);
    expect(areStringArraysEqual(normalized, ['one', 'two'])).toBe(true);
    expect(areStringArraysEqual(normalized, ['two', 'one'])).toBe(false);
  });

  it('retains its reference for semantically equal fresh arrays', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: unknown }) => useCanonicalStringArray(value),
      { initialProps: { value: ['one', 'one', 'two'] } },
    );
    const first = result.current;

    rerender({ value: ['one', 'two'] });
    expect(result.current).toBe(first);

    rerender({ value: ['two', 'one'] });
    expect(result.current).not.toBe(first);
    expect(result.current).toEqual(['two', 'one']);
  });
});
