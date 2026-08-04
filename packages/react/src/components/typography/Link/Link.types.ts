import { LinkVariantProps } from '@/styled-system/recipes';
import { NativeProps, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement, RefAttributes } from 'react';
import type { RetargetedAsChildHostProps } from '@/components/shared/polymorphicAsChild.types';
import type { DestinationAwareAsChildProps } from '@/components/shared/linkDelegation';

/**
 * Link-specific props for navigation and external references. New-tab links receive missing
 * security `rel` tokens automatically; use a button for actions that do not navigate.
 */
export interface LinkOwnProps extends LinkVariantProps {
  /**
   * Shorthand to open the link in a new tab.
   * Automatically sets `target="_blank"` and appends `noopener noreferrer` to `rel`.
   *
   * @defaultValue `false`
   * Related: Link component JSDoc for full security behavior.
   */
  external?: boolean;
}

/**
 * Public props for Link.
 *
 * ### Notes
 * Supports `asChild` for router integration while preserving Poffy link styles.
 * Native `asChild` hosts must be anchors; invalid native hosts fall back to an anchor when a
 * destination is available. Router components remain supported during the staged migration and
 * must forward `href`, `target`, `rel`, and the ref to a native anchor.
 */
type LinkNativeProps = PrimitiveProps<'a', LinkOwnProps>;

/** Navigational default branch. */
export type LinkAnchorProps = Omit<LinkNativeProps, 'asChild' | 'href'> & {
  asChild?: false;
  href: string;
};

/** Non-navigational text branch rendered as a span. */
export type LinkSpanProps = NativeProps<'span', Omit<LinkOwnProps, 'external'>> & {
  asChild?: false;
  href?: never;
  external?: never;
  download?: never;
  hrefLang?: never;
  media?: never;
  ping?: never;
  referrerPolicy?: never;
  rel?: never;
  target?: never;
  type?: never;
};

/** Router/native-anchor delegation branch. */
export type LinkAsChildProps = DestinationAwareAsChildProps<
  RetargetedAsChildHostProps<LinkNativeProps, HTMLElement, ReactElement>
>;

/** Public props for Link. */
export type LinkProps = LinkAnchorProps | LinkSpanProps | LinkAsChildProps;

/** Polymorphic component call signatures for Link. */
export interface LinkComponent {
  (props: LinkAnchorProps & RefAttributes<HTMLAnchorElement>): ReactElement | null;
  (props: LinkSpanProps & RefAttributes<HTMLSpanElement>): ReactElement | null;
  (props: LinkAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (
    props:
      | (LinkAnchorProps & RefAttributes<HTMLAnchorElement>)
      | (LinkSpanProps & RefAttributes<HTMLSpanElement>)
      | (LinkAsChildProps & RefAttributes<HTMLElement>),
  ): ReactElement | null;
}
