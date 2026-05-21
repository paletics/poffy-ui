import { forwardRef } from 'react';
import type { HTMLAttributes, KeyboardEventHandler, PointerEventHandler } from 'react';
import { ChevronDownIcon } from '@/components/media/Icon/icons';

interface ListboxSelectTriggerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onKeyDown' | 'onPointerDown'
> {
  activeDescendant?: string;
  ariaDescribedBy?: string;
  ariaErrorMessage?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  className?: string;
  disabled: boolean;
  error: boolean;
  iconClassName?: string;
  isOpen: boolean;
  listId: string;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  selectedLabel: string;
  tabIndex?: number;
  triggerId: string;
}

/**
 * Renders the visible combobox trigger for `ListboxSelect`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS field/icon classes and custom combobox semantics
 * - **Props**: Resolved ARIA wiring, open state, selected label, and trigger events
 *
 * ### Design Tokens
 * - **spacing**: inherited from `listboxSelect.field`
 * - **color**: inherited field, icon, disabled, and invalid semantic colors
 *
 * ### Variant Logic
 * - **isOpen**: Drives `aria-expanded` and the icon data state.
 * - **error**: Drives `aria-invalid` on the interactive combobox surface.
 *
 * ### Accessibility
 * - **Role**: combobox
 * - **Pattern**: WAI-ARIA Combobox with Listbox Popup
 * - **Keyboard**: The root handles Arrow/Home/End/Enter/Space/Escape and passes the handler here.
 *
 * ### AI Usage
 * - **DO**: Keep ARIA attributes resolved by the root so IDs remain stable.
 * - **DON'T**: Add native form attributes here; the hidden select owns form integration.
 *
 * @example Internal trigger
 * ```tsx
 * <ListboxSelectTrigger selectedLabel="Apple" isOpen={false} />
 * ```
 *
 * @example Invalid trigger
 * ```tsx
 * <ListboxSelectTrigger selectedLabel="" error isOpen={false} />
 * ```
 */
export const ListboxSelectTrigger = forwardRef<HTMLDivElement, ListboxSelectTriggerProps>(
  (
    {
      activeDescendant,
      ariaDescribedBy,
      ariaErrorMessage,
      ariaLabel,
      ariaLabelledBy,
      className,
      disabled,
      error,
      iconClassName,
      isOpen,
      listId,
      onKeyDown,
      onPointerDown,
      selectedLabel,
      tabIndex,
      triggerId,
      ...triggerProps
    },
    ref,
  ) => (
    <div
      {...triggerProps}
      ref={ref}
      id={triggerId}
      className={className}
      role="combobox"
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-errormessage={ariaErrorMessage}
      aria-controls={listId}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-invalid={error ? true : undefined}
      aria-activedescendant={activeDescendant}
      aria-disabled={disabled ? true : undefined}
      data-disabled={disabled ? '' : undefined}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <span>{selectedLabel}</span>
      <span
        className={iconClassName}
        data-select-icon
        data-state={isOpen ? 'open' : 'closed'}
        aria-hidden="true"
      >
        <ChevronDownIcon />
      </span>
    </div>
  ),
);

ListboxSelectTrigger.displayName = 'ListboxSelectTrigger';
