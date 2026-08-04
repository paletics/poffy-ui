import { act, renderHook } from '@testing-library/react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useSplitButton } from './useSplitButton';

describe('useSplitButton', () => {
  it('toggles menu state in uncontrolled mode', () => {
    const { result } = renderHook(() =>
      useSplitButton({
        items: [],
      }),
    );

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('ignores toggle while disabled', () => {
    const { result } = renderHook(() =>
      useSplitButton({
        disabled: true,
        items: [],
      }),
    );

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('closes and prevents menu-item activation when disabled after opening', () => {
    const onClick = vi.fn();
    const { result, rerender } = renderHook(
      ({ disabled }: { disabled: boolean }) => useSplitButton({ disabled, items: [{ onClick }] }),
      { initialProps: { disabled: false } },
    );

    act(() => {
      result.current.toggleMenu();
      result.current.setFocusedIndex(0);
    });
    expect(result.current.isOpen).toBe(true);

    rerender({ disabled: true });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.focusedIndex).toBe(-1);

    act(() => {
      result.current.onMenuItemClick(0);
    });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('moves focus across enabled items only', () => {
    const { result } = renderHook(() =>
      useSplitButton({
        items: [{}, { disabled: true }, {}],
      }),
    );

    act(() => {
      result.current.onMenuKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as ReactKeyboardEvent<HTMLElement>);
    });

    expect(result.current.focusedIndex).toBe(0);

    act(() => {
      result.current.onMenuKeyDown({
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as ReactKeyboardEvent<HTMLElement>);
    });

    expect(result.current.focusedIndex).toBe(2);

    act(() => {
      result.current.onMenuKeyDown({
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as ReactKeyboardEvent<HTMLElement>);
    });

    expect(result.current.focusedIndex).toBe(0);
  });

  it('activates the focused item and closes the menu', () => {
    const onClick = vi.fn();
    const { result } = renderHook(() =>
      useSplitButton({
        items: [{ onClick }, {}],
      }),
    );

    act(() => {
      result.current.toggleMenu();
      result.current.setFocusedIndex(0);
    });

    act(() => {
      result.current.onMenuKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as ReactKeyboardEvent<HTMLElement>);
    });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.focusedIndex).toBe(-1);
  });

  it('closes when clicking outside the root element', () => {
    const { result } = renderHook(() =>
      useSplitButton({
        items: [],
      }),
    );

    const root = document.createElement('div');
    document.body.appendChild(root);

    act(() => {
      result.current.rootRef.current = root;
      result.current.toggleMenu();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(result.current.isOpen).toBe(false);
    document.body.removeChild(root);
  });

  it('keeps the menu open when clicking inside the portalled menu', () => {
    const { result } = renderHook(() => useSplitButton({ items: [] }));
    const root = document.createElement('div');
    const menu = document.createElement('div');
    const item = document.createElement('button');
    menu.appendChild(item);
    document.body.append(root, menu);

    act(() => {
      result.current.rootRef.current = root;
      result.current.menuRef.current = menu;
      result.current.toggleMenu();
    });
    act(() => {
      item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(result.current.isOpen).toBe(true);
    root.remove();
    menu.remove();
  });

  it('closes when escape is pressed while open', () => {
    const { result } = renderHook(() =>
      useSplitButton({
        items: [],
      }),
    );

    act(() => {
      result.current.toggleMenu();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(result.current.isOpen).toBe(false);
  });
});
