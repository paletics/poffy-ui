import { sidebar } from '@/styled-system/recipes';
import type { NativeProps, NavigationAppearance, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement, ReactNode, RefAttributes } from 'react';
import type { RetargetedAsChildHostProps } from '@/components/shared/polymorphicAsChild.types';
import type { DestinationAwareAsChildProps } from '@/components/shared/linkDelegation';

type SidebarRecipeVariants = NonNullable<Parameters<typeof sidebar>[0]>;

/**
 * Public Sidebar variant props with supported navigation appearance names.
 */
export interface SidebarVariantSubset extends Omit<
  SidebarRecipeVariants,
  'appearance' | 'collapsed' | 'variant'
> {
  /**
   * Surface treatment.
   *
   * @defaultValue `'soft'`
   */
  appearance?: Extract<NavigationAppearance, 'soft' | 'outline'>;
  /**
   * Whether the sidebar is rendered in its collapsed presentation state.
   * Responsive values are intentionally unsupported because this value also
   * controls accessibility relationships in descendant components.
   */
  collapsed?: boolean;
}

/** Canonical public variants accepted by Sidebar. */
export type SidebarVariants = SidebarVariantSubset;

/**
 * Props for persistent application navigation. Compose branding in SidebarHeader, groups in
 * SidebarContent, and persistent actions in SidebarFooter; use Dropdown for transient menus.
 */
export interface SidebarRootProps extends NativeProps<'aside', SidebarVariantSubset> {
  /** BCP 47 locale overriding the nearest LocaleProvider for the default landmark label. */
  locale?: string;
  /**
   * Sidebar sub-components (Header, Content, Footer).
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarHeader component.
 *
 * ### Notes
 * Use for product identity, workspace switchers, or compact controls
 * that should remain visually tied to the sidebar.
 */
export interface SidebarHeaderProps extends NativeProps<'header'> {
  /**
   * Header content.
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarContent component.
 *
 * ### Notes
 * Primary scrollable/navigation area for `SidebarGroup` and
 * `SidebarItem` children.
 */
export interface SidebarContentProps extends NativeProps<'div'> {
  /**
   * Content items.
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarFooter component.
 *
 * ### Notes
 * Use for account controls, secondary actions, or status details that
 * should stay visually after the main navigation.
 */
export interface SidebarFooterProps extends NativeProps<'footer'> {
  /**
   * Footer content.
   */
  children?: ReactNode;
}

/**
 * Props for the SidebarGroup component.
 *
 * ### Notes
 * Pass `label` when a group needs a screen-reader-visible heading in
 * expanded mode. In collapsed sidebars, the implementation avoids referencing
 * hidden labels from `aria-labelledby`.
 */
export interface SidebarGroupProps extends NativeProps<'div'> {
  /**
   * Optional label for the group.
   */
  label?: ReactNode;
  /**
   * Group items.
   */
  children?: ReactNode;
}


interface SidebarItemOwnProps {
  /**
   * Whether the item represents the current active page.
   * @defaultValue false
   */
  isActive?: boolean;
  /**
   * Optional icon to display before the text.
   */
  icon?: ReactNode;
  /**
   * Item text.
   */
  children?: ReactNode;
}

type SidebarItemNativeProps = PrimitiveProps<'a', SidebarItemOwnProps>;

/** Props for a SidebarItem rendered as a native destination link. */
export type SidebarItemAnchorProps = Omit<SidebarItemNativeProps, 'asChild' | 'href'> & {
  asChild?: false;
  href: string;
};

/** Props for a passive SidebarItem rendered without a destination. */
export type SidebarItemSpanProps = NativeProps<'span', SidebarItemOwnProps> & {
  asChild?: false;
  href?: never;
  download?: never;
  hrefLang?: never;
  media?: never;
  ping?: never;
  referrerPolicy?: never;
  rel?: never;
  target?: never;
  type?: never;
};

/** Props for a SidebarItem delegated to a router-compatible link host. */
export type SidebarItemAsChildProps = DestinationAwareAsChildProps<
  RetargetedAsChildHostProps<SidebarItemNativeProps, HTMLElement, ReactElement>
>;

/** Public props for SidebarItem. */
export type SidebarItemProps =
  | SidebarItemAnchorProps
  | SidebarItemSpanProps
  | SidebarItemAsChildProps;

/** Polymorphic component call signatures for SidebarItem. */
export interface SidebarItemComponent {
  (props: SidebarItemAnchorProps & RefAttributes<HTMLAnchorElement>): ReactElement | null;
  (props: SidebarItemSpanProps & RefAttributes<HTMLSpanElement>): ReactElement | null;
  (props: SidebarItemAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (
    props:
      | (SidebarItemAnchorProps & RefAttributes<HTMLAnchorElement>)
      | (SidebarItemSpanProps & RefAttributes<HTMLSpanElement>)
      | (SidebarItemAsChildProps & RefAttributes<HTMLElement>),
  ): ReactElement | null;
}
