import { ListboxPopoverContent } from '@/components/overlay/ListboxPopover';
import { ListboxSelectOption } from './ListboxSelectOption';
import { getListboxSelectOptionId, type ListboxSelectOptionRecord } from './ListboxSelect.utils';

interface ListboxSelectPopupProps {
  contentClassName?: string;
  highlightedIndex: number;
  itemClassName?: string;
  itemTextClassName?: string;
  listId: string;
  onHighlight: (index: number) => void;
  onSelect: (index: number) => void;
  options: ListboxSelectOptionRecord[];
  selectedValue: string;
}

/**
 * Renders the popup listbox and its option rows for `ListboxSelect`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: `ListboxPopoverContent`, `ListboxSelectOption`, Panda CSS listbox classes
 * - **Props**: Flattened native options and root-managed selection/highlight state
 *
 * ### Design Tokens
 * - **spacing**: popup padding and option gaps from `listboxSelect.content` and `item`
 * - **color**: highlighted, selected, disabled, and popup surface semantic recipe values
 *
 * ### Variant Logic
 * - **highlightedIndex**: Marks one active option for pointer and keyboard navigation.
 * - **selectedValue**: Marks the committed value for `aria-selected`.
 *
 * ### Accessibility
 * - **Role**: listbox containing option rows.
 * - **Pattern**: WAI-ARIA Listbox popup controlled by the root combobox.
 * - **Keyboard**: Option rows support Enter / Space when reached; root owns combobox navigation.
 *
 * ### AI Usage
 * - **DO**: Pass flattened native options from `ListboxSelect.utils`.
 * - **DON'T**: Render when there are no options; the root controls empty popup behavior.
 *
 * @example Internal popup
 * ```tsx
 * <ListboxSelectPopup listId="fruit-list" options={options} selectedValue="apple" />
 * ```
 *
 * @example Highlighted option
 * ```tsx
 * <ListboxSelectPopup highlightedIndex={1} options={options} selectedValue="pear" />
 * ```
 */
export const ListboxSelectPopup = ({
  contentClassName,
  highlightedIndex,
  itemClassName,
  itemTextClassName,
  listId,
  onHighlight,
  onSelect,
  options,
  selectedValue,
}: ListboxSelectPopupProps) => (
  <ListboxPopoverContent
    id={listId}
    role="listbox"
    aria-labelledby={undefined}
    aria-describedby={undefined}
    className={contentClassName}
  >
    <ul role="presentation">
      {options.map((option, index) => (
        <ListboxSelectOption
          id={getListboxSelectOptionId(listId, option)}
          key={`${option.value}-${index}`}
          className={itemClassName}
          itemTextClassName={itemTextClassName}
          option={option}
          isHighlighted={index === highlightedIndex}
          isSelected={option.value === selectedValue}
          onSelect={() => {
            onSelect(index);
          }}
          onHighlight={() => {
            onHighlight(index);
          }}
        />
      ))}
    </ul>
  </ListboxPopoverContent>
);
