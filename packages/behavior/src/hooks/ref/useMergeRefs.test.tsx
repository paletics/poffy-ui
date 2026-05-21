import { createRef } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { assignRef, useMergeRefs } from './useMergeRefs';

describe('assignRef', () => {
  it('assigns to callback refs and object refs', () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const node = document.createElement('div');

    assignRef(callbackRef, node);
    assignRef(objectRef, node);

    expect(callbackRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });

  it('ignores nullish refs', () => {
    expect(() => assignRef(null, 'value')).not.toThrow();
    expect(() => assignRef(undefined, 'value')).not.toThrow();
  });
});

describe('useMergeRefs', () => {
  it('returns null when every ref is nullish', () => {
    const { result } = renderHook(() => useMergeRefs<HTMLDivElement>(null, undefined));
    expect(result.current).toBeNull();
  });

  it('writes the same node into all refs', () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const node = document.createElement('div');
    const { result } = renderHook(() => useMergeRefs<HTMLDivElement>(callbackRef, objectRef));

    result.current?.(node);

    expect(callbackRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });
});
