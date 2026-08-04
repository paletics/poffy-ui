import { createElement, createRef, type RefCallback } from 'react';
import { render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { assignRef, mergeRefs, useMergeRefs } from './useMergeRefs';

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

  it('returns the cleanup from a callback ref', () => {
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);
    const node = document.createElement('div');

    expect(assignRef(callbackRef, node)).toBe(cleanup);
  });

  it('ignores nullish refs', () => {
    expect(() => assignRef(null, 'value')).not.toThrow();
    expect(() => assignRef(undefined, 'value')).not.toThrow();
  });

  it('clears object and callback refs when React unmounts a node', () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();

    assignRef(callbackRef, null);
    assignRef(objectRef, null);

    expect(callbackRef).toHaveBeenCalledWith(null);
    expect(objectRef.current).toBeNull();
  });
});

describe('mergeRefs', () => {
  it('assigns and clears all refs without requiring a hook', () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const node = document.createElement('div');
    const mergedRef = mergeRefs(callbackRef, objectRef);

    mergedRef(node);
    mergedRef(null);

    expect(callbackRef).toHaveBeenNthCalledWith(1, node);
    expect(callbackRef).toHaveBeenNthCalledWith(2, null);
    expect(objectRef.current).toBeNull();
  });

  it('aggregates callback cleanup and clears refs without cleanup', () => {
    const cleanupOrder: string[] = [];
    const firstCleanup = vi.fn(() => {
      cleanupOrder.push('first');
    });
    const secondCleanup = vi.fn(() => {
      cleanupOrder.push('second');
    });
    const firstCleanupRef = vi.fn(() => firstCleanup);
    const secondCleanupRef = vi.fn(() => secondCleanup);
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const node = document.createElement('div');
    const mergedRef = mergeRefs(firstCleanupRef, callbackRef, secondCleanupRef, objectRef);

    const detach = mergedRef(node);
    expect(detach).toBeTypeOf('function');

    detach?.();

    expect(firstCleanup).toHaveBeenCalledOnce();
    expect(secondCleanup).toHaveBeenCalledOnce();
    expect(cleanupOrder).toEqual(['first', 'second']);
    expect(firstCleanupRef).toHaveBeenCalledOnce();
    expect(secondCleanupRef).toHaveBeenCalledOnce();
    expect(firstCleanupRef).not.toHaveBeenCalledWith(null);
    expect(secondCleanupRef).not.toHaveBeenCalledWith(null);
    expect(callbackRef).toHaveBeenNthCalledWith(1, node);
    expect(callbackRef).toHaveBeenNthCalledWith(2, null);
    expect(objectRef.current).toBeNull();
  });

  it('preserves null-based cleanup when callbacks return no cleanup', () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const node = document.createElement('div');
    const mergedRef = mergeRefs(callbackRef, objectRef);

    expect(mergedRef(node)).toBeUndefined();
    expect(objectRef.current).toBe(node);
    mergedRef(null);

    expect(callbackRef).toHaveBeenNthCalledWith(2, null);
    expect(objectRef.current).toBeNull();
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

  it('runs callback cleanup and clears object refs on unmount', () => {
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);
    const objectRef = createRef<HTMLDivElement>();

    const Target = () => createElement('div', { ref: useMergeRefs(callbackRef, objectRef) });
    const { unmount } = render(createElement(Target));

    expect(callbackRef).toHaveBeenCalledOnce();
    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);

    unmount();

    expect(cleanup).toHaveBeenCalledOnce();
    expect(callbackRef).toHaveBeenCalledOnce();
    expect(objectRef.current).toBeNull();
  });

  it('cleans up the previous callback before attaching a replacement ref', () => {
    const firstCleanup = vi.fn();
    const secondCleanup = vi.fn();
    const firstRef = vi.fn(() => firstCleanup);
    const secondRef = vi.fn(() => secondCleanup);
    const objectRef = createRef<HTMLDivElement>();

    const Target = ({ callbackRef }: { callbackRef: RefCallback<HTMLDivElement> }) =>
      createElement('div', { ref: useMergeRefs(callbackRef, objectRef) });
    const { rerender, unmount } = render(createElement(Target, { callbackRef: firstRef }));
    const node = objectRef.current;

    rerender(createElement(Target, { callbackRef: secondRef }));

    expect(firstCleanup).toHaveBeenCalledOnce();
    expect(firstRef).toHaveBeenCalledOnce();
    expect(secondRef).toHaveBeenCalledOnce();
    expect(objectRef.current).toBe(node);

    unmount();

    expect(secondCleanup).toHaveBeenCalledOnce();
    expect(secondRef).toHaveBeenCalledOnce();
    expect(objectRef.current).toBeNull();
  });
});
