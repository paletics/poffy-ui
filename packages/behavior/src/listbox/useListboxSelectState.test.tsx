import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useListboxSelectState } from './useListboxSelectState';

const options = [
  { label: 'First', value: 'same' },
  { label: 'Second', value: 'same' },
  { disabled: true, label: 'Blocked', value: 'blocked' },
  { label: 'Last', value: 'last' },
];

describe('useListboxSelectState', () => {
  it('preserves an uncontrolled duplicate occurrence across collection reorder', () => {
    const { result, rerender } = renderHook(
      ({ items }) =>
        useListboxSelectState({
          defaultValue: 'same',
          options: items,
        }),
      { initialProps: { items: options } },
    );

    act(() => result.current.handleSelectionChange('same', 1));
    expect(result.current.selectedIndex).toBe(1);

    const reordered = [options[3]!, options[0]!, options[1]!, options[2]!];
    rerender({ items: reordered });
    expect(result.current.selectedIndex).toBe(2);
  });

  it('keeps a controlled orphan value while displaying the first enabled fallback', () => {
    const { result } = renderHook(() =>
      useListboxSelectState({
        defaultValue: '',
        options,
        value: 'missing',
      }),
    );

    expect(result.current.selectedValue).toBe('missing');
    expect(result.current.selectedIndex).toBe(0);
  });

  it('owns keyboard open, highlight, and selection requests without DOM events', () => {
    const onRequestSelection = vi.fn();
    const { result } = renderHook(() =>
      useListboxSelectState({
        defaultValue: 'same',
        onRequestSelection,
        options,
      }),
    );

    act(() => {
      expect(result.current.handleKeyDown({ key: 'ArrowDown' })).toBe(true);
    });
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.handleKeyDown({ key: 'End' }));
    act(() => result.current.handleKeyDown({ key: 'Enter' }));
    expect(onRequestSelection).toHaveBeenCalledWith(3);
    expect(result.current.isOpen).toBe(false);
  });

  it('blocks interaction and restores the latest default selection on reset', () => {
    const onRequestSelection = vi.fn();
    const { result, rerender } = renderHook(
      ({ blocked, defaultValue }) =>
        useListboxSelectState({
          defaultValue,
          interactionBlocked: blocked,
          onRequestSelection,
          options,
        }),
      { initialProps: { blocked: false, defaultValue: 'same' } },
    );

    act(() => result.current.handleSelectionChange('last', 3));
    rerender({ blocked: true, defaultValue: 'same' });
    act(() => {
      expect(result.current.handleKeyDown({ key: 'ArrowDown' })).toBe(false);
      expect(result.current.selectIndex(0)).toBe(false);
    });
    expect(onRequestSelection).not.toHaveBeenCalled();

    rerender({ blocked: false, defaultValue: 'last' });
    act(() => result.current.reset());
    expect(result.current.selectedValue).toBe('last');
    expect(result.current.selectedIndex).toBe(3);
  });

  it('checks event-time blocking before opening or changing selection', () => {
    let blockedNow = false;
    const onRequestSelection = vi.fn();
    const { result } = renderHook(() =>
      useListboxSelectState({
        defaultValue: 'same',
        isInteractionBlockedNow: () => blockedNow,
        onRequestSelection,
        options,
      }),
    );

    blockedNow = true;
    act(() => {
      result.current.setOpen(true);
      expect(result.current.handleKeyDown({ key: 'ArrowDown' })).toBe(false);
      expect(result.current.selectIndex(3)).toBe(false);
      expect(result.current.handleSelectionChange('last', 3)).toBe(false);
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedValue).toBe('same');
    expect(onRequestSelection).not.toHaveBeenCalled();
  });
});
