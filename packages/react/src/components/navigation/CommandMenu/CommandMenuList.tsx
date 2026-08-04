'use client';

import { getCommandMenuOptionId, groupCommandMenuItems } from '@poffy-ui/behavior/command-menu';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { useEffect, type MouseEvent, type MutableRefObject } from 'react';
import type { commandMenu } from '@/styled-system/recipes';
import type { CommandMenuItem } from './CommandMenu.types';

interface CommandMenuListProps {
  classes: ReturnType<typeof commandMenu>;
  emptyMessage: string;
  filteredItems: CommandMenuItem[];
  highlightedIndex: number;
  listId: string;
  resultsLabel: string;
  optionIdPrefix: string;
  optionRefs: MutableRefObject<Map<string, HTMLElement>>;
  registerOption: (id: string, node: HTMLElement | null) => void;
  selectItem: (item: CommandMenuItem) => void;
  setHighlightedIndex: (index: number) => void;
}

export const CommandMenuList = ({
  classes,
  emptyMessage,
  filteredItems,
  highlightedIndex,
  listId,
  resultsLabel,
  optionIdPrefix,
  optionRefs,
  registerOption,
  selectItem,
  setHighlightedIndex,
}: CommandMenuListProps) => {
  const highlightedOptionId =
    highlightedIndex >= 0 ? getCommandMenuOptionId(optionIdPrefix, highlightedIndex) : undefined;

  useEffect(() => {
    if (!highlightedOptionId) return;
    optionRefs.current.get(highlightedOptionId)?.scrollIntoView?.({
      block: 'nearest',
      inline: 'nearest',
    });
  }, [highlightedOptionId, optionRefs]);

  return (
    <>
      <div id={listId} role="listbox" aria-label={resultsLabel} className={classes.list}>
        {filteredItems.length > 0 &&
          groupCommandMenuItems(filteredItems.map((item, index) => ({ ...item, index }))).map(
            (group, groupIndex) => {
              const groupLabelId = group.label ? `${listId}-group-${groupIndex}` : undefined;
              return (
                <div
                  key={group.id}
                  className={classes.group}
                  role="group"
                  aria-labelledby={groupLabelId}
                >
                  {group.label ? (
                    <div id={groupLabelId} className={classes.groupLabel}>
                      {group.label}
                    </div>
                  ) : null}
                  {group.items.map((item) => {
                    const itemIndex = item.index;
                    const isHighlighted = itemIndex === highlightedIndex;
                    const optionId = getCommandMenuOptionId(optionIdPrefix, itemIndex);
                    return (
                      <div
                        key={`${item.id}-${itemIndex}`}
                        id={optionId}
                        ref={(node) => registerOption(optionId, node)}
                        role="option"
                        tabIndex={-1}
                        aria-selected={isHighlighted}
                        aria-disabled={item.disabled ? true : undefined}
                        data-highlighted={isHighlighted ? '' : undefined}
                        data-disabled={item.disabled ? '' : undefined}
                        className={classes.item}
                        onMouseMove={() => {
                          if (!item.disabled) setHighlightedIndex(itemIndex);
                        }}
                        onMouseDown={(event: MouseEvent<HTMLDivElement>) => event.preventDefault()}
                        onKeyDown={(event) => {
                          if (!item.disabled && (event.key === 'Enter' || event.key === ' ')) {
                            event.preventDefault();
                            selectItem(filteredItems[itemIndex]);
                          }
                        }}
                        onClick={() => selectItem(filteredItems[itemIndex])}
                      >
                        {item.icon ? (
                          <span aria-hidden="true" className={classes.itemIcon}>
                            {getSafeInteractiveContent(item.icon, { preserveOpaque: true })}
                          </span>
                        ) : null}
                        <span className={classes.itemText}>
                          <span className={classes.itemLabel}>{item.label}</span>
                          {item.description ? (
                            <span className={classes.itemDescription}>{item.description}</span>
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            },
          )}
      </div>
      {filteredItems.length === 0 ? (
        <div role="status" aria-live="polite" className={classes.empty}>
          {emptyMessage}
        </div>
      ) : null}
    </>
  );
};
