import { act, renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useDimensions } from './useDimensions';

describe('useDimensions', () => {
  it('measures the current node', () => {
    const ref = createRef<HTMLDivElement>();
    const node = document.createElement('div');

    Object.defineProperty(node, 'offsetWidth', { configurable: true, value: 320 });
    Object.defineProperty(node, 'offsetHeight', { configurable: true, value: 180 });
    ref.current = node;

    const { result } = renderHook(() => useDimensions(ref));

    expect(result.current).toEqual({ width: 320, height: 180 });
  });

  it('re-measures when ref.current points to a new node', () => {
    const ref = createRef<HTMLDivElement>();
    const first = document.createElement('div');
    const second = document.createElement('div');

    Object.defineProperty(first, 'offsetWidth', { configurable: true, value: 200 });
    Object.defineProperty(first, 'offsetHeight', { configurable: true, value: 100 });
    Object.defineProperty(second, 'offsetWidth', { configurable: true, value: 480 });
    Object.defineProperty(second, 'offsetHeight', { configurable: true, value: 240 });

    ref.current = first;
    const { result, rerender } = renderHook(() => useDimensions(ref));
    expect(result.current).toEqual({ width: 200, height: 100 });

    act(() => {
      ref.current = second;
      rerender();
    });

    expect(result.current).toEqual({ width: 480, height: 240 });
  });
});
