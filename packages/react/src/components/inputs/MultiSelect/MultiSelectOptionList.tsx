'use client';

import { CheckIcon } from '@/components/media/Icon';
import { ListboxPopoverContent } from '@/components/overlay/ListboxPopover';
import { forwardRef } from 'react';
import type { MultiSelectClasses, MultiSelectOption } from './MultiSelect.types';

/**
 * Props for the dropdown option list.
 */
interface MultiSelectOptionListProps {
  listId: string;
  labelledBy?: string;
  optionIdPrefix: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  highlightedIndex: number;
  onSelect: (value: string) => void;
  classes: MultiSelectClasses;
}

/**
 * Dropdown listbox for MultiSelect — renders filtered options with
 * highlighted and selected state indicators.
 *
 * ### AI Context & Architecture
 * - Extracted from MultiSelect to keep that file under 200 lines.
 * Renders pure UI driven entirely by parent state; no internal state.
 *
 * ### Accessibility
 * - **Role**: `listbox` containing `option` rows.
 * - **States**: Each option sets `aria-selected`; disabled options set `aria-disabled`.
 * - **Required**: Keep `labelledBy` pointed at the combobox input id.
 *
 * ### AI Usage
 * - Internal use only; prefer `MultiSelect` for public composition.
 *
 * @example Internal option list
 * ```tsx
 * import { MultiSelectOptionList } from './MultiSelectOptionList';
 *
 * <MultiSelectOptionList {...listProps} />
 * ```
 */
export const MultiSelectOptionList = forwardRef<HTMLUListElement, MultiSelectOptionListProps>(
  (
    {
      listId,
      labelledBy,
      optionIdPrefix,
      options,
      selectedValues,
      highlightedIndex,
      onSelect,
      classes,
    },
    ref,
  ) => (
    <ListboxPopoverContent
      id={listId}
      role="listbox"
      aria-labelledby={labelledBy}
      aria-describedby={undefined}
      className={classes.content}
    >
      <ul ref={ref} role="presentation">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <li
              id={`${optionIdPrefix}-${index}`}
              key={option.value}
              className={classes.item}
              data-highlighted={index === highlightedIndex ? '' : undefined}
              data-selected={isSelected ? '' : undefined}
              role="option"
              aria-selected={isSelected}
              aria-disabled={option.disabled ? 'true' : undefined}
              onClick={() => !option.disabled && onSelect(option.value)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !option.disabled) {
                  e.preventDefault();
                  onSelect(option.value);
                }
              }}
            >
              <span className={classes.itemText}>{option.label}</span>
              {isSelected && (
                <span className={classes.itemIndicator}>
                  <CheckIcon />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </ListboxPopoverContent>
  ),
);

MultiSelectOptionList.displayName = 'MultiSelectOptionList';
