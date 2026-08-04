import { ListboxPopoverContent } from '@/components/overlay/ListboxPopover';
import { getTreeElementById } from '@poffy-ui/behavior/hooks';
import { useEffect, useRef } from 'react';
import { ListboxSelectOption } from './ListboxSelectOption';
import { getListboxSelectOptionId, type ListboxSelectOptionRecord } from './ListboxSelect.utils';

interface ListboxSelectPopupProps {
  contentClassName?: string;
  highlightedIndex: number;
  itemClassName?: string;
  itemTextClassName?: string;
  listId: string;
  triggerId: string;
  onHighlight: (index: number) => void;
  onSelect: (index: number) => void;
  options: ListboxSelectOptionRecord[];
  selectedIndex: number;
}


export const ListboxSelectPopup = ({
  contentClassName,
  highlightedIndex,
  itemClassName,
  itemTextClassName,
  listId,
  triggerId,
  onHighlight,
  onSelect,
  options,
  selectedIndex,
}: ListboxSelectPopupProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedIndex < 0) return;
    const highlightedOption = options[highlightedIndex];
    if (!highlightedOption) return;
    const option = listRef.current
      ? getTreeElementById(listRef.current, getListboxSelectOptionId(listId, highlightedOption))
      : null;
    if (option && listRef.current?.contains(option)) {
      option.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  }, [highlightedIndex, listId, options]);

  return (
    <ListboxPopoverContent
      ref={listRef}
      id={listId}
      aria-labelledby={triggerId}
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
            isSelected={index === selectedIndex}
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
};
