/** One command available to the renderer-neutral command-menu helpers. */
export interface CommandMenuBehaviorItem {
  /** Excludes the command from keyboard highlight and selection. */
  disabled?: boolean;
  /** Optional display-group label. Commands without it form their own unlabelled group. */
  group?: string;
  /** Consumer-owned identifier; filtering deliberately does not de-duplicate this value. */
  id: string;
  /** Additional terms searched alongside the label, description, and group. */
  keywords?: readonly string[];
  /** Primary command label and required searchable text. */
  label: string;
  /** Optional secondary text included in searching. */
  description?: string;
}

/** A first-seen-order group produced by {@link groupCommandMenuItems}. */
export interface CommandMenuGroup<TItem extends CommandMenuBehaviorItem> {
  /** Positional render-stable id assigned for this grouping result. */
  id: string;
  /** Source group label; omitted for ungrouped commands. */
  label?: string;
  /** Commands in their original relative order. */
  items: TItem[];
}
