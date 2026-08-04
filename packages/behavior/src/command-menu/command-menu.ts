import {
  filterListboxOptions,
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from '../listbox';
import type { CommandMenuBehaviorItem, CommandMenuGroup } from './command-menu.types';

interface SearchableCommandMenuItem extends CommandMenuBehaviorItem {
  label: string;
}

/** Joins the label, description, group, and keywords used to search a command item. */
export const getCommandMenuItemSearchText = (item: CommandMenuBehaviorItem): string =>
  [item.label, item.description, item.group, ...(item.keywords ?? [])].filter(Boolean).join(' ');

/** Filters command items by locale-aware, case-insensitive inclusion across their search text. */
export const filterCommandMenuItems = <TItem extends CommandMenuBehaviorItem>(
  items: readonly TItem[],
  query: string,
  locale?: string,
): TItem[] =>
  items.filter(
    (item) =>
      filterListboxOptions<SearchableCommandMenuItem>(
        [{ ...item, label: getCommandMenuItemSearchText(item) }],
        query,
        { locale },
      ).length > 0,
  );

/** Groups command items in first-seen group order and assigns render-stable positional group ids. */
export const groupCommandMenuItems = <TItem extends CommandMenuBehaviorItem>(
  items: readonly TItem[],
): CommandMenuGroup<TItem>[] => {
  const groups = new Map<string, CommandMenuGroup<TItem>>();

  for (const item of items) {
    const label = item.group;
    const group = groups.get(label ?? '') ?? { id: '', label, items: [] };
    group.items = [...group.items, item];
    groups.set(label ?? '', group);
  }

  return [...groups.values()].map((group, index) => ({ ...group, id: `group-${index}` }));
};

/** Builds the option id used by command-menu active-descendant relationships. */
export const getCommandMenuOptionId = (prefix: string, index: number): string =>
  `${prefix}-${index}`;

/** Returns the active option id only while an in-range option is highlighted in an open menu. */
export const getCommandMenuActiveDescendant = <TItem extends CommandMenuBehaviorItem>(
  items: readonly TItem[],
  highlightedIndex: number,
  optionIdPrefix: string,
  open: boolean,
): string | undefined =>
  open && highlightedIndex >= 0 && highlightedIndex < items.length
    ? getCommandMenuOptionId(optionIdPrefix, highlightedIndex)
    : undefined;

/** Resolves command-menu highlight movement while skipping disabled items without wrapping. */
export const getNextCommandMenuHighlight = <TItem extends CommandMenuBehaviorItem>(
  items: readonly TItem[],
  highlightedIndex: number,
  direction: 'first' | 'last' | 'next' | 'previous',
): number => {
  if (direction === 'first') return getFirstEnabledListboxIndex(items);
  if (direction === 'last') return getLastEnabledListboxIndex(items);
  if (highlightedIndex < 0) return getFirstEnabledListboxIndex(items);
  return direction === 'next'
    ? getNextEnabledListboxIndex(items, highlightedIndex)
    : getPreviousEnabledListboxIndex(items, highlightedIndex);
};
