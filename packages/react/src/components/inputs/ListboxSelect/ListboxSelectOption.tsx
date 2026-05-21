import { forwardRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ListboxSelectOptionRecord } from './ListboxSelect.utils';

interface ListboxSelectOptionProps {
  className?: string;
  id: string;
  isHighlighted: boolean;
  isSelected: boolean;
  itemTextClassName?: string;
  onHighlight: () => void;
  onSelect: () => void;
  option: ListboxSelectOptionRecord;
}

/**
 * Renders a single option row inside `ListboxSelect`'s custom popup.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS classes supplied by `ListboxSelect.recipe`, native listbox semantics
 * - **Props**: Internal option record plus highlight and selection callbacks
 *
 * ### Design Tokens
 * - **spacing**: inherited from `listboxSelect.item` and `listboxSelect.itemText`
 * - **color**: inherited semantic option colors for highlighted, selected, and disabled states
 *
 * ### Variant Logic
 * - **isHighlighted**: Mirrors keyboard or pointer focus so the popup has one active option.
 * - **isSelected**: Mirrors the committed select value and drives `aria-selected`.
 *
 * ### Accessibility
 * - **Role**: option
 * - **Pattern**: WAI-ARIA Listbox option within a combobox popup
 * - **Keyboard**: Enter / Space selects the current option when focus reaches the row.
 *
 * ### AI Usage
 * - **DO**: Keep this component internal to `ListboxSelect` and pass option state from the root.
 * - **DON'T**: Use directly as a public option API; native `<option>` children remain the public API.
 *
 * @example Internal rendering
 * ```tsx
 * <ListboxSelectOption option={option} isSelected={false} isHighlighted={false} />
 * ```
 *
 * @example Disabled option
 * ```tsx
 * <ListboxSelectOption option={{ disabled: true, id: '0', label: 'Disabled', value: 'x' }} />
 * ```
 */
export const ListboxSelectOption = forwardRef<HTMLLIElement, ListboxSelectOptionProps>(
  (
    { className, id, isHighlighted, isSelected, itemTextClassName, onHighlight, onSelect, option },
    ref,
  ) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect();
      }
    };

    return (
      <li
        ref={ref}
        id={id}
        className={className}
        data-highlighted={isHighlighted ? '' : undefined}
        data-selected={isSelected ? '' : undefined}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled ? 'true' : undefined}
        tabIndex={-1}
        onPointerDown={(event) => {
          event.preventDefault();
        }}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        onPointerMove={() => {
          if (!option.disabled) onHighlight();
        }}
      >
        <span className={itemTextClassName}>{option.label}</span>
      </li>
    );
  },
);

ListboxSelectOption.displayName = 'ListboxSelectOption';
