'use client';

import { ListRoot } from './ListRoot';
import { ListItem } from './ListItem';
import { ListItemIcon } from './ListItemIcon';
import { ListItemText } from './ListItemText';

/**
 * Builds a semantic list with item, icon, and text compound parts.
 *
 * The root is a `ul` except for `variant="ordered"`, which is an `ol`.
 * Use `List.Item` (or another component that renders an `li`) for every
 * entry; known-invalid content is wrapped in an `li` and warns in development.
 */
export const List = Object.assign(ListRoot, {
  Root: ListRoot,
  Item: ListItem,
  Icon: ListItemIcon,
  Text: ListItemText,
});
