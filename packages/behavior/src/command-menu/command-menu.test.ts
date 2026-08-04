import { describe, expect, it } from 'vitest';
import {
  filterCommandMenuItems,
  getCommandMenuActiveDescendant,
  getCommandMenuOptionId,
  getNextCommandMenuHighlight,
  groupCommandMenuItems,
} from './command-menu';
import type { CommandMenuBehaviorItem } from './command-menu.types';

const items: CommandMenuBehaviorItem[] = [
  { id: 'open project', label: 'Open project', group: 'Projects', keywords: ['workspace'] },
  { id: 'archive', label: 'Archive project', group: 'Projects', disabled: true },
  { id: 'settings', label: 'Settings', description: 'Workspace preferences', group: 'System' },
];

describe('command-menu behavior', () => {
  it('filters commands by label, description, group, and keywords', () => {
    expect(filterCommandMenuItems(items, 'workspace')).toHaveLength(2);
    expect(filterCommandMenuItems(items, 'preferences')).toEqual([items[2]]);
    expect(filterCommandMenuItems(items, 'missing')).toEqual([]);
  });

  it('does not collapse duplicate ids while filtering', () => {
    const duplicated = [
      { id: 'same', label: 'Open project' },
      { id: 'same', label: 'Close project' },
    ];

    expect(filterCommandMenuItems(duplicated, 'open')).toEqual([duplicated[0]]);
  });

  it('uses the supplied locale for case-insensitive matching', () => {
    const turkishItem = { id: 'isparta', label: 'ISPARTA' };

    expect(filterCommandMenuItems([turkishItem], 'ısparta', 'tr')).toEqual([turkishItem]);
    expect(filterCommandMenuItems([turkishItem], 'ısparta')).toEqual([]);
  });

  it('groups commands without losing insertion order', () => {
    expect(groupCommandMenuItems(items)).toEqual([
      { id: 'group-0', label: 'Projects', items: [items[0], items[1]] },
      { id: 'group-1', label: 'System', items: [items[2]] },
    ]);
  });

  it('keeps ungrouped commands separate from a literal default-like group label', () => {
    const grouped = groupCommandMenuItems([
      { id: 'ungrouped', label: 'Ungrouped' },
      { id: 'default', label: 'Default group', group: '__default' },
    ]);

    expect(grouped).toEqual([
      { id: 'group-0', label: undefined, items: [{ id: 'ungrouped', label: 'Ungrouped' }] },
      {
        id: 'group-1',
        label: '__default',
        items: [{ id: 'default', label: 'Default group', group: '__default' }],
      },
    ]);
  });

  it('uses index-based option ids', () => {
    expect(getCommandMenuOptionId('cmd', 0)).toBe('cmd-0');
    expect(getCommandMenuActiveDescendant(items, 0, 'cmd', true)).toBe('cmd-0');
    expect(getCommandMenuActiveDescendant(items, 0, 'cmd', false)).toBeUndefined();
  });

  it('skips disabled commands during highlight movement', () => {
    expect(getNextCommandMenuHighlight(items, 0, 'next')).toBe(2);
    expect(getNextCommandMenuHighlight(items, 2, 'previous')).toBe(0);
  });
});
