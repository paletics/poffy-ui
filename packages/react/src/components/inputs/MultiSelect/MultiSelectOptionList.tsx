'use client';

import { CheckIcon } from '@/components/media/Icon';
import { ListboxPopoverContent } from '@/components/overlay/ListboxPopover';
import { getTreeElementById } from '@poffy-ui/behavior/hooks';
import { forwardRef, useEffect, useRef } from 'react';
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
    <MultiSelectOptionListContent
      classes={classes}
      highlightedIndex={highlightedIndex}
      labelledBy={labelledBy}
      listId={listId}
      optionIdPrefix={optionIdPrefix}
      ref={ref}
      options={options}
      selectedValues={selectedValues}
      onSelect={onSelect}
    />
  ),
);

type MultiSelectOptionListContentProps = Omit<MultiSelectOptionListProps, 'ref'>;

const MultiSelectOptionListContent = forwardRef<
  HTMLUListElement,
  MultiSelectOptionListContentProps
>(
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
  ) => {
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (highlightedIndex < 0) return;
      const option = listRef.current
        ? getTreeElementById(listRef.current, `${optionIdPrefix}-${highlightedIndex}`)
        : null;
      if (option && listRef.current?.contains(option)) {
        option.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      }
    }, [highlightedIndex, optionIdPrefix, options]);

    return (
      <ListboxPopoverContent
        ref={listRef}
        id={listId}
        aria-multiselectable
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
    );
  },
);

MultiSelectOptionList.displayName = 'MultiSelectOptionList';
MultiSelectOptionListContent.displayName = 'MultiSelectOptionListContent';
