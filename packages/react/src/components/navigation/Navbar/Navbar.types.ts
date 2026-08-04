import { navbar } from '@/styled-system/recipes';
import { type NavigationAppearance, NativeProps, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement, ReactNode, RefAttributes } from 'react';
import type { RetargetedAsChildHostProps } from '@/components/shared/polymorphicAsChild.types';
import type { DestinationAwareAsChildProps } from '@/components/shared/linkDelegation';

type NavbarRecipeVariants = NonNullable<Parameters<typeof navbar>[0]>;

/** Overflow strategy used when Navbar content does not fit on one row. */
export type NavbarNarrowLayout = 'scroll' | 'wrap';

/**
 * Public Navbar variant props with shared navigation appearance names.
 *
 * ### Notes
 * Use `appearance` for the public API; recipe-specific internals should
 * stay encapsulated.
 */
export interface NavbarVariantSubset extends Omit<
  NavbarRecipeVariants,
  'appearance' | 'justify' | 'narrowLayout'
> {
  /**
   * Surface treatment.
   *
   * @defaultValue recipe default
   */
  appearance?: NavigationAppearance;
  /**
   * Overflow strategy used when content does not fit on one row.
   * @defaultValue `'scroll'`
   */
  narrowLayout?: NavbarNarrowLayout;
}

/** Canonical public variants accepted by the Navbar root. */
export type NavbarVariants = NavbarVariantSubset;

/**
 * Props for fixed-host primary navigation. Compose NavbarBrand with one or more NavbarContent regions
 * and wrap individual links in NavbarItem for consistent layout.
 */
export type NavbarRootProps = NativeProps<'nav', NavbarVariantSubset & { children?: ReactNode }>;


type NavbarBrandNativeProps = PrimitiveProps<'a'>;
/** Public props for NavbarBrandAnchor. */
export type NavbarBrandAnchorProps = Omit<NavbarBrandNativeProps, 'asChild' | 'href'> & {
  asChild?: false;
  href: string;
};
/** Public props for NavbarBrandSpan. */
export type NavbarBrandSpanProps = NativeProps<'span'> & {
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
/** Props for NavbarBrand delegated to an asChild host. */
export type NavbarBrandAsChildProps = DestinationAwareAsChildProps<
  RetargetedAsChildHostProps<NavbarBrandNativeProps, HTMLElement, ReactElement>
>;
/** Public props for NavbarBrand. */
export type NavbarBrandProps =
  | NavbarBrandAnchorProps
  | NavbarBrandSpanProps
  | NavbarBrandAsChildProps;
/** Polymorphic component call signatures for NavbarBrand. */
export interface NavbarBrandComponent {
  (props: NavbarBrandAnchorProps & RefAttributes<HTMLAnchorElement>): ReactElement | null;
  (props: NavbarBrandSpanProps & RefAttributes<HTMLSpanElement>): ReactElement | null;
  (props: NavbarBrandAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (
    props:
      | (NavbarBrandAnchorProps & RefAttributes<HTMLAnchorElement>)
      | (NavbarBrandSpanProps & RefAttributes<HTMLSpanElement>)
      | (NavbarBrandAsChildProps & RefAttributes<HTMLElement>),
  ): ReactElement | null;
}

/**
 * Props for the NavbarContent component.
 */
export type NavbarContentProps = NativeProps<
  'div',
  {
    /**
     * Horizontal alignment of items within the content area.
     * Mapped to CSS `justify-content` via Panda `css()`; not an inline style.
     * @defaultValue 'start'
     */
    justify?: 'start' | 'end' | 'center' | 'between';
  }
>;

/**
 * Props for the NavbarItem component.
 *
 * ### Notes
 * Use as a non-interactive wrapper around `NavbarLink` or action controls.
 */
export type NavbarItemProps = NativeProps<'div'>;


interface NavbarLinkOwnProps {
  /**
   * Whether the link represents the current page.
   * If true, it sets aria-current="page" and applies active styles.
   * @defaultValue false
   */
  isActive?: boolean;
}
type NavbarLinkNativeProps = PrimitiveProps<'a', NavbarLinkOwnProps>;
/** Public props for NavbarLinkAnchor. */
export type NavbarLinkAnchorProps = Omit<NavbarLinkNativeProps, 'asChild' | 'href'> & {
  asChild?: false;
  href: string;
};
/** Public props for NavbarLinkSpan. */
export type NavbarLinkSpanProps = NativeProps<'span', NavbarLinkOwnProps> & {
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
/** Props for NavbarLink delegated to an asChild host. */
export type NavbarLinkAsChildProps = DestinationAwareAsChildProps<
  RetargetedAsChildHostProps<NavbarLinkNativeProps, HTMLElement, ReactElement>
>;
/** Public props for NavbarLink. */
export type NavbarLinkProps = NavbarLinkAnchorProps | NavbarLinkSpanProps | NavbarLinkAsChildProps;
/** Polymorphic component call signatures for NavbarLink. */
export interface NavbarLinkComponent {
  (props: NavbarLinkAnchorProps & RefAttributes<HTMLAnchorElement>): ReactElement | null;
  (props: NavbarLinkSpanProps & RefAttributes<HTMLSpanElement>): ReactElement | null;
  (props: NavbarLinkAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (
    props:
      | (NavbarLinkAnchorProps & RefAttributes<HTMLAnchorElement>)
      | (NavbarLinkSpanProps & RefAttributes<HTMLSpanElement>)
      | (NavbarLinkAsChildProps & RefAttributes<HTMLElement>),
  ): ReactElement | null;
}
