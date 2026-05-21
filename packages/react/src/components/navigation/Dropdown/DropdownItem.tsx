'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useId, useLayoutEffect, useState } from 'react';
import type { HTMLProps, MouseEvent, RefObject } from 'react';
import type { DropdownItemProps } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';

/**
 * An actionable item within a DropdownMenu. Supports keyboard navigation, typeahead,
 * and disabled state. Calls `onSelect` on activation and closes the menu automatically.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion (press), Radix Slot (asChild),
 *   Floating UI (list navigation, typeahead via `getItemProps`).
 * ### Design Tokens
 * - spacing: silver-ratio tokens, colors: brand.surface (hover/focus)
 * ### Variant Logic
 *   - Standard: Actionable menu item — high contrast hover state signals interactivity.
 *   - Disabled: `aria-disabled` + reduced opacity; excluded from keyboard navigation.
 * ### Notes
 * Uses `useLayoutEffect` to register itself in the Floating UI `listRef` after
 * mount. Handles its own index discovery; do not manually assign indices.
 * ### Accessibility
 * - Renders with `role="menuitem"` and correct `tabIndex` for roving tabindex.
 * - Disabled items remain in the DOM with `aria-disabled="true"` but are skipped
 *   during keyboard navigation via `disabledIndices`.
 * ### AI Usage
 * - **DO**: Place inside `DropdownMenu` only.
 * - **DO**: For navigation links, use `asChild` with a router `Link` component.
 * - **DON'T**: Use for selectable listbox options; use select or listbox
 *   primitives for persistent selection state.
 *
 * @example Action items
 * ```tsx
 * import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@poffy-ui/react/navigation';
 *
 * <Dropdown>
 *   <DropdownTrigger>Actions</DropdownTrigger>
 *   <DropdownMenu>
 * <DropdownItem onSelect={() => handleEdit()}>Edit</DropdownItem>
 * <DropdownItem disabled>Delete (unavailable)</DropdownItem>
 *   </DropdownMenu>
 * </Dropdown>
 * ```
 *
 * @example Router link item
 * ```tsx
 * import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@poffy-ui/react/navigation';
 *
 * <Dropdown>
 *   <DropdownTrigger>Account</DropdownTrigger>
 *   <DropdownMenu>
 *     <DropdownItem asChild>
 *       <NextLink href="/settings">Settings</NextLink>
 *     </DropdownItem>
 *   </DropdownMenu>
 * </Dropdown>
 * ```
 */
export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  ({ asChild, className, disabled = false, onSelect, onClick, children, ...props }, propRef) => {
    const {
      getItemProps,
      listRef,
      listItemsRef,
      activeIndex,
      onOpenChange,
      setDisabledIndex,
      classes,
    } = useDropdownContext();

    const itemId = useId();
    const [index, setIndex] = useState(-1);

    const handleRef = (node: HTMLElement | null) => {
      if (node) {
        node.id = itemId;
        if (!listRef.current.includes(node)) {
          listRef.current.push(node);
          listItemsRef.current.push(node.textContent ?? '');
        }
      } else {
        const indexToClear = listRef.current.findIndex((el) => el?.id === itemId);
        if (indexToClear !== -1) {
          listRef.current.splice(indexToClear, 1);
          listItemsRef.current.splice(indexToClear, 1);
        }
      }

      if (typeof propRef === 'function') {
        propRef(node);
      } else if (propRef) {
        (propRef as RefObject<HTMLElement | null>).current = node;
      }
    };

    useLayoutEffect(() => {
      const foundIndex = listRef.current.findIndex((el) => el?.id === itemId);
      setIndex(foundIndex);
    }, [itemId, listRef]);

    useLayoutEffect(() => {
      if (index < 0) return;
      setDisabledIndex(index, disabled);
      return () => setDisabledIndex(index, false);
    }, [index, disabled, setDisabledIndex]);

    useLayoutEffect(() => {
      if (index >= 0) {
        listItemsRef.current[index] = listRef.current[index]?.textContent?.trim() ?? '';
      }
    }, [index, children, listItemsRef, listRef]);

    const isActive = activeIndex === index && index >= 0;

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
      if (!disabled) {
        onSelect?.();
        onOpenChange(false);
      }
    };

    const Component = asChild ? Slot : 'button';

    return (
      <ActionMotion asChild animationType="press" disabled={disabled}>
        <Component
          id={itemId}
          ref={handleRef}
          type={asChild ? undefined : 'button'}
          role="menuitem"
          disabled={asChild ? undefined : disabled}
          aria-disabled={disabled ? true : undefined}
          tabIndex={isActive ? 0 : -1}
          className={cx(classes.item, className)}
          {...getItemProps({ ...(props as HTMLProps<HTMLElement>), onClick: handleClick })}
        >
          {children}
        </Component>
      </ActionMotion>
    );
  },
);

DropdownItem.displayName = 'Dropdown.Item';
