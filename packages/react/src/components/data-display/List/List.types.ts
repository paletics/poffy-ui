import { ListVariantProps } from '@/styled-system/recipes';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Extracted variant types from the Panda CSS list recipe.
 *
 * ### Notes
 * Prefer `ListProps` for public component usage. Use this type when
 * authoring a wrapper that forwards the recipe's list variants.
 *
 * ### AI Usage
 * - Use when extending list styles.
 */
export type ListRecipeVariants = ListVariantProps;

/**
 * Base properties for the List root element.
 * ### Formula
 * - Silver Ratio (1:1.414) applied to gap/padding spacing tokens.
 *
 * @example
 * ```tsx
 * import { List } from '@poffy-ui/react/data-display';
 *
 * <List variant="unordered">
 *   <List.Item>
 *     <List.Text primary="Deploy preview" secondary="Ready for review" />
 *   </List.Item>
 * </List>
 * ```
 *
 * ### Notes
 * Do: use List for semantic collections.
 * Don't: use List as a generic spacing primitive; use Stack from the layout package.
 */
export type ListBaseProps = ListRecipeVariants & {
  children?: ReactNode;
};

/**
 * Type checks ListRoot props merging variant and native HTML attributes.
 */
export type ListProps = PrimitiveProps<'ul', ListBaseProps>;

/**
 * Base properties for a single list entry.
 */
export interface ListItemBaseProps {
  children?: ReactNode;
}

/**
 * Type checks ListItem props with native `li` attributes.
 */
export type ListItemProps = PrimitiveProps<'li', ListItemBaseProps>;

/**
 * Base properties for the icon container in a ListItem.
 *
 * ### Notes
 * Icons are usually decorative in this slot. Mark custom SVG children
 * `aria-hidden` unless they add information not present in the text.
 */
export interface ListItemIconBaseProps {
  children?: ReactNode;
}

/**
 * Type checks ListItemIcon props wrapping a native `div`.
 */
export type ListItemIconProps = PrimitiveProps<'div', ListItemIconBaseProps>;

/**
 * Base properties for the text content section of a ListItem.
 */
export interface ListItemTextBaseProps {
  children?: ReactNode;
  /** The primary (main) label of the list item. */
  primary?: ReactNode;
  /** The secondary (subtext/detail) label of the list item. */
  secondary?: ReactNode;
}

/**
 * Type checks ListItemText props wrapping a native `div`.
 */
export type ListItemTextProps = PrimitiveProps<'div', ListItemTextBaseProps>;
