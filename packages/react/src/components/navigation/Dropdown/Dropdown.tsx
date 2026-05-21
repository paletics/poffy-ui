'use client';

import type { DropdownRootProps } from './Dropdown.types';
import { DropdownContext } from './DropdownContext';
import { useDropdown } from './useDropdown';

/**
 * Root container for the Dropdown menu suite. Manages open/close state and Floating UI
 * positioning; renders only a `DropdownContext.Provider` with no DOM node of its own.
 *
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: dropdown), Floating UI
 *   (`useFloating`, `useClick`, `useDismiss`, `useListNavigation`, `useTypeahead`),
 *   DropdownContext. `forwardRef` is intentionally omitted: no DOM node to expose.
 * ### Design Tokens
 * - spacing: silver-ratio tokens (padding/gap on items and menu)
 * ### Variant Logic
 *   - `sm` / `md` (default) / `lg`: Controls item font-size and padding density
 *     via the dropdown recipe's size variant.
 *
 * @example
 * ```tsx
 * import {
 *   Dropdown,
 *   DropdownItem,
 *   DropdownMenu,
 *   DropdownSeparator,
 *   DropdownTrigger,
 * } from '@poffy-ui/react/navigation';
 *
 * <Dropdown>
 *   <DropdownTrigger>Actions ▼</DropdownTrigger>
 *   <DropdownMenu>
 *     <DropdownItem onSelect={() => console.log('Edit')}>Edit</DropdownItem>
 *     <DropdownSeparator />
 *     <DropdownItem disabled>Delete</DropdownItem>
 *   </DropdownMenu>
 * </Dropdown>
 * ```
 * ### Notes
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled modes.
 *   In controlled mode, resetting `activeIndex` is deferred to avoid silently dropping
 *   keyboard focus while the menu remains open.
 * ### Accessibility
 * - Follows WAI-ARIA Menu pattern. Uses `role="menu"` on the floating container,
 *   `role="menuitem"` on items, and `role="separator"` on dividers. Full keyboard
 *   navigation (Arrow keys, Home/End, Escape, typeahead) is handled by Floating UI.
 * ### AI Usage
 * - Use when a button needs to reveal a list of discrete actions.
 *   For navigation links, prefer `Navbar` or `Sidebar`. Do NOT use for form select inputs.
 *
 * @example Controlled state
 * ```tsx
 * import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@poffy-ui/react/navigation';
 *
 * <Dropdown open={open} onOpenChange={setOpen}>
 *   <DropdownTrigger>Actions</DropdownTrigger>
 *   <DropdownMenu>
 *     <DropdownItem onSelect={handleArchive}>Archive</DropdownItem>
 *   </DropdownMenu>
 * </Dropdown>
 * ```
 */
export const Dropdown = (props: DropdownRootProps) => {
  const { children } = props;
  const dropdownState = useDropdown(props);

  return <DropdownContext.Provider value={dropdownState}>{children}</DropdownContext.Provider>;
};

Dropdown.displayName = 'Dropdown.Root';
