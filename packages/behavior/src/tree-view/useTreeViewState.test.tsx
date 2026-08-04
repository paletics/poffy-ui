import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTreeViewState } from './useTreeViewState';

describe('useTreeViewState', () => {
  it('owns independent uncontrolled expansion and selection', () => {
    const onExpandedChange = vi.fn();
    const onSelectedChange = vi.fn();
    const { result } = renderHook(() =>
      useTreeViewState({
        defaultExpandedIds: ['branch'],
        defaultSelectedIds: ['first'],
        onExpandedChange,
        onSelectedChange,
      }),
    );

    act(() => result.current.toggleNode('branch'));
    act(() => result.current.toggleSelection('parent', true, ['child']));

    expect([...result.current.expandedIds]).toEqual([]);
    expect([...result.current.selectedIds]).toEqual(['first', 'parent', 'child']);
    expect(onExpandedChange).toHaveBeenCalledWith([]);
    expect(onSelectedChange).toHaveBeenCalledWith(['first', 'parent', 'child']);
  });

  it('notifies without mutating controlled state', () => {
    const onExpandedChange = vi.fn();
    const onSelectedChange = vi.fn();
    const { result } = renderHook(() =>
      useTreeViewState({
        expandedIds: ['branch'],
        onExpandedChange,
        onSelectedChange,
        selectedIds: ['first'],
      }),
    );

    act(() => result.current.toggleNode('branch'));
    act(() => result.current.toggleSelection('first', false));

    expect([...result.current.expandedIds]).toEqual(['branch']);
    expect([...result.current.selectedIds]).toEqual(['first']);
    expect(onExpandedChange).toHaveBeenCalledWith([]);
    expect(onSelectedChange).toHaveBeenCalledWith([]);
  });
});
