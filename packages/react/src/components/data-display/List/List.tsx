'use client';

import { ListRoot } from './ListRoot';
import { ListItem } from './ListItem';
import { ListItemIcon } from './ListItemIcon';
import { ListItemText } from './ListItemText';

/**
 * Shorthand compound component for the List, bundling Root, Item, Icon, and Text.
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: list)
 * ### Design Tokens
 * - gap/padding: silver-ratio tokens
 * ### Variant Logic
 * - plain: Unstyled list. ordered: Numbered. unordered: Bulleted.
 * ### Accessibility
 * - Automatically renders as `ul` or `ol` based on the variant.
 * @example
 * ```tsx
 * import { List } from '@poffy-ui/react/data-display';
 * import { StarIcon } from '@poffy-ui/react/media';
 *
 * <List variant="unordered">
 *   <List.Item>
 *     <List.Icon aria-hidden><StarIcon /></List.Icon>
 *     <List.Text primary="Favourites" secondary="Your starred items" />
 *   </List.Item>
 * </List>
 * ```
 */
export const List = Object.assign(ListRoot, {
  Root: ListRoot,
  Item: ListItem,
  Icon: ListItemIcon,
  Text: ListItemText,
});
