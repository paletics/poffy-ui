import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getCommandMenuKeyboardIntent, useCommandMenuState } from './useCommandMenuState';

const items = [
  { id: 'open', label: 'Open project' },
  { id: 'disabled', label: 'Disabled command', disabled: true },
  { id: 'settings', label: 'Settings', keywords: ['preferences'] },
];

describe('useCommandMenuState', () => {
  it('owns filtering, highlighting, keyboard intent, and selection', () => {
    const onSelectItem = vi.fn();
    const { result } = renderHook(() =>
      useCommandMenuState({ defaultOpen: true, items, onSelectItem }),
    );

    act(() => result.current.setQuery('preferences'));
    expect(result.current.filteredItems.map((item) => item.id)).toEqual(['settings']);
    expect(result.current.highlightedIndex).toBe(0);

    act(() => result.current.selectItem(result.current.filteredItems[0]!));
    expect(onSelectItem).toHaveBeenCalledWith(items[2]);
    expect(result.current.open).toBe(false);
  });

  it('preserves controlled query and highlight until the consumer commits', () => {
    const onQueryChange = vi.fn();
    const { result } = renderHook(() =>
      useCommandMenuState({
        items,
        onOpenChange: () => undefined,
        onQueryChange,
        open: true,
        query: '',
      }),
    );

    act(() => result.current.setQuery('settings'));
    expect(onQueryChange).toHaveBeenCalledWith('settings');
    expect(result.current.query).toBe('');
    expect(result.current.filteredItems).toHaveLength(items.length);
    expect(result.current.highlightedIndex).toBe(0);
  });

  it('falls back independently to values supplied with non-function handlers', () => {
    const { result } = renderHook(() =>
      useCommandMenuState({
        defaultOpen: false,
        defaultQuery: 'ignored',
        items,
        onOpenChange: 'invalid',
        onQueryChange: 'invalid',
        open: true,
        query: 'open',
      } as never),
    );

    expect(result.current.open).toBe(true);
    expect(result.current.query).toBe('open');
    act(() => {
      result.current.setOpen(false);
      result.current.setQuery('settings');
    });
    expect(result.current.open).toBe(false);
    expect(result.current.query).toBe('settings');
  });

  it('closes on disable and requests one close for controlled state', () => {
    const onOpenChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ disabled }) => useCommandMenuState({ disabled, items, onOpenChange, open: true }),
      { initialProps: { disabled: false } },
    );

    rerender({ disabled: true });
    expect(result.current.open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    rerender({ disabled: true });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('maps supported keys while ignoring composition', () => {
    expect(getCommandMenuKeyboardIntent({ key: 'ArrowDown' })).toEqual({
      type: 'move',
      direction: 'next',
    });
    expect(getCommandMenuKeyboardIntent({ key: 'Enter' })).toEqual({ type: 'select' });
    expect(getCommandMenuKeyboardIntent({ isComposing: true, key: 'Enter' })).toBeNull();
    expect(getCommandMenuKeyboardIntent({ key: 'Enter', keyCode: 229 })).toBeNull();
  });
});
