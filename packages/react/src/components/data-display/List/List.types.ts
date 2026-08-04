import { ListVariantProps } from '@/styled-system/recipes';
import { NativeProps, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement, ReactNode, RefAttributes } from 'react';
import type {
  AsChildHostProps,
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Public type for `ListRecipeVariants`. */
export type ListRecipeVariants = ListVariantProps;

/**
 * List structure is static because it determines whether the root is `ul` or
 * `ol`. Render separate lists for responsive structural changes.
 */
export type ListVariant = 'plain' | 'marker' | 'ordered' | 'menu';

/**
 * Base properties for the semantic List root.
 *
 * @example
 * ```tsx
 * import { List } from '@poffy-ui/react/data-display';
 *
 * <List variant="marker">
 *   <List.Item>
 *     <List.Text primary="Deploy preview" secondary="Ready for review" />
 *   </List.Item>
 * </List>
 * ```
 *
 * ### Notes
 * Do: use List for semantic collections.
 * Render each entry with `List.Item`, a native `li`, or a component that
 * forwards to one of those hosts. Known-invalid native or text children are
 * wrapped for semantic safety, while opaque component output is preserved.
 * Don't: use List as a generic spacing primitive; use Stack from the layout package.
 */
export type ListBaseProps = Omit<ListRecipeVariants, 'variant'> & {
  children?: ReactNode;
};

type ListUnorderedBaseProps = ListBaseProps & {
  /** Uses a semantic unordered list. */
  variant?: Exclude<ListVariant, 'ordered'>;
};

type ListOrderedBaseProps = ListBaseProps & {
  /** Uses a semantic ordered list. */
  variant: 'ordered';
};

/**
 * Type checks ListRoot props against the native element selected by `variant`.
 * `asChild` may delegate only to the matching native list host at runtime.
 */
type ListUnorderedNativeProps = PrimitiveProps<'ul', ListUnorderedBaseProps>;
type ListOrderedNativeProps = PrimitiveProps<'ol', ListOrderedBaseProps>;
type ListUnorderedAsChildElement = ReactElement<Record<string, unknown>, 'ul'>;
type ListOrderedAsChildElement = ReactElement<Record<string, unknown>, 'ol'>;

/** Props for ListUnordered rendered with its default host. */
export type ListUnorderedDefaultProps = DefaultHostProps<ListUnorderedNativeProps>;
/** Props for ListOrdered rendered with its default host. */
export type ListOrderedDefaultProps = DefaultHostProps<ListOrderedNativeProps>;
/** Props for ListUnordered delegated to an asChild host. */
export type ListUnorderedAsChildProps = RetargetedAsChildHostProps<
  ListUnorderedNativeProps,
  HTMLUListElement,
  ListUnorderedAsChildElement
>;
/** Props for ListOrdered delegated to an asChild host. */
export type ListOrderedAsChildProps = RetargetedAsChildHostProps<
  ListOrderedNativeProps,
  HTMLOListElement,
  ListOrderedAsChildElement
>;
/** Public props for List. */
export type ListProps =
  | ListUnorderedDefaultProps
  | ListOrderedDefaultProps
  | ListUnorderedAsChildProps
  | ListOrderedAsChildProps;

/** Polymorphic component call signatures for ListRoot. */
export interface ListRootComponent {
  (props: ListUnorderedDefaultProps & RefAttributes<HTMLUListElement>): ReactElement | null;
  (props: ListOrderedDefaultProps & RefAttributes<HTMLOListElement>): ReactElement | null;
  (props: ListUnorderedAsChildProps & RefAttributes<HTMLUListElement>): ReactElement | null;
  (props: ListOrderedAsChildProps & RefAttributes<HTMLOListElement>): ReactElement | null;
  (
    props:
      | (ListUnorderedDefaultProps & RefAttributes<HTMLUListElement>)
      | (ListOrderedDefaultProps & RefAttributes<HTMLOListElement>)
      | (ListUnorderedAsChildProps & RefAttributes<HTMLUListElement>)
      | (ListOrderedAsChildProps & RefAttributes<HTMLOListElement>),
  ): ReactElement | null;
}

/**
 * Base properties for a single list entry.
 */
export interface ListItemBaseProps {
  children?: ReactNode;
}

/**
 * Type checks ListItem props with native `li` attributes.
 * ListItem is intentionally not polymorphic: a direct `li` preserves the
 * semantic list structure required by ListRoot.
 */
export type ListItemProps = NativeProps<'li', ListItemBaseProps>;

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
type ListItemIconNativeProps = PrimitiveProps<'div', ListItemIconBaseProps>;
/** Props for ListItemIcon rendered with its default host. */
export type ListItemIconDefaultProps = DefaultHostProps<ListItemIconNativeProps>;
/** Props for ListItemIcon delegated to an asChild host. */
export type ListItemIconAsChildProps = AsChildHostProps<ListItemIconNativeProps>;
/** Public props for ListItemIcon. */
export type ListItemIconProps = ListItemIconDefaultProps | ListItemIconAsChildProps;
/** Polymorphic component call signatures for ListItemIcon. */
export type ListItemIconComponent = PolymorphicAsChildComponent<
  ListItemIconDefaultProps,
  ListItemIconAsChildProps,
  HTMLDivElement
>;

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
type ListItemTextNativeProps = PrimitiveProps<'div', ListItemTextBaseProps>;
/** Props for ListItemText rendered with its default host. */
export type ListItemTextDefaultProps = DefaultHostProps<ListItemTextNativeProps>;
/** Props for ListItemText delegated to an asChild host. */
export type ListItemTextAsChildProps = AsChildHostProps<ListItemTextNativeProps>;
/** Public props for ListItemText. */
export type ListItemTextProps = ListItemTextDefaultProps | ListItemTextAsChildProps;
/** Polymorphic component call signatures for ListItemText. */
export type ListItemTextComponent = PolymorphicAsChildComponent<
  ListItemTextDefaultProps,
  ListItemTextAsChildProps,
  HTMLDivElement
>;
