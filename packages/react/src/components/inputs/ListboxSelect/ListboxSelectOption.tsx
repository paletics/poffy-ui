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
