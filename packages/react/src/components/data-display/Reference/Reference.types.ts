import type { NativeProps } from '@poffy-ui/types';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode, RefAttributes } from 'react';
import type { ReferenceMessages } from './Reference.locales';
import type {
  DefaultHostProps,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Public surface treatment for Reference.
 */
export type ReferenceAppearance = 'plain' | 'soft';

/**
 * Public size for Reference.
 */
export type ReferenceSize = 'sm' | 'md';

/** Controls how long labels and descriptions fit constrained containers. */
export type ReferenceOverflow = 'truncate' | 'wrap';

/**
 * Serializable item shape for ReferenceList.
 */
export interface ReferenceItem {
  /** Stable item key when the data source provides one. */
  id?: string;
  /** Citation marker shown before the label, such as `1` or `A`. */
  index?: string | number;
  /** Primary visible text for the reference. */
  label: ReactNode;
  /** Supporting text shown below or beside the label. */
  description?: ReactNode;
  /** Destination URL. Unsafe URLs are rendered as non-link text. */
  href?: string;
  /**
   * Marks the link as external and applies external-link attributes.
   *
   * @defaultValue `false`
   */
  external?: boolean;
  /** Browsing context for the destination. `_blank` automatically adds safe rel tokens. */
  target?: string;
  /** Relationship tokens for the destination. */
  rel?: string;
}

/**
 * Base properties for a compact source/reference display.
 */
export interface ReferenceBaseProps {
  /** Citation marker shown before the label, such as `1` or `A`. */
  index?: string | number;
  /** Primary visible text for the reference. */
  label?: ReactNode;
  /** Supporting text shown below or beside the label. */
  description?: ReactNode;
  /** Destination URL. When omitted or unsafe, Reference renders as non-link text. */
  href?: string;
  /**
   * Marks the link as external and applies external-link attributes.
   *
   * @defaultValue `false`
   */
  external?: boolean;
  /**
   * Surface treatment for a reference chip or row.
   *
   * @defaultValue `'plain'`
   */
  appearance?: ReferenceAppearance;
  /**
   * Density of the reference text and spacing.
   *
   * @defaultValue `'md'`
   */
  size?: ReferenceSize;
  /**
   * Long-text behavior. Truncation does not add a browser tooltip automatically.
   *
   * @defaultValue `'truncate'`
   */
  overflow?: ReferenceOverflow;
  /** Locale used by built-in accessible fallback labels. */
  locale?: string;
  /** Overrides for built-in accessible fallback labels. */
  messages?: Partial<ReferenceMessages>;
}

/**
 * Props for a single reference. Renders an anchor when `href` is provided.
 * `asChild` accepts a native `a` for links and a native `span` for non-link references.
 */
type ReferenceSharedProps = Omit<ReferenceBaseProps, 'external' | 'href'>;
type ReferenceLinkOwnProps = ReferenceSharedProps & {
  href: string;
  external?: boolean;
};
type ReferenceTextOwnProps = ReferenceSharedProps & {
  href?: never;
  external?: never;
};
type ReferenceLinkNativeProps = NativeProps<'a', ReferenceLinkOwnProps>;
type ReferenceTextNativeProps = NativeProps<'span', ReferenceTextOwnProps>;
type ReferenceAnchorElement = ReactElement<ComponentPropsWithoutRef<'a'>, 'a'>;
type ReferenceSpanElement = ReactElement<ComponentPropsWithoutRef<'span'>, 'span'>;

/** Props for ReferenceLink rendered with its default host. */
export type ReferenceLinkDefaultProps = DefaultHostProps<ReferenceLinkNativeProps>;
/** Props for ReferenceLink delegated to an asChild host. */
export type ReferenceLinkAsChildProps = RetargetedAsChildHostProps<
  ReferenceLinkNativeProps,
  HTMLAnchorElement,
  ReferenceAnchorElement
>;
/** Props for ReferenceText rendered with its default host. */
export type ReferenceTextDefaultProps = DefaultHostProps<ReferenceTextNativeProps>;
/** Props for ReferenceText delegated to an asChild host. */
export type ReferenceTextAsChildProps = RetargetedAsChildHostProps<
  ReferenceTextNativeProps,
  HTMLSpanElement,
  ReferenceSpanElement
>;
/** Public props for Reference. */
export type ReferenceProps =
  | ReferenceLinkDefaultProps
  | ReferenceLinkAsChildProps
  | ReferenceTextDefaultProps
  | ReferenceTextAsChildProps;

/** Branch-aware Reference component contract for link and passive text hosts. */
export interface ReferenceComponent {
  (props: ReferenceLinkDefaultProps & RefAttributes<HTMLAnchorElement>): ReactElement | null;
  (props: ReferenceLinkAsChildProps & RefAttributes<HTMLAnchorElement>): ReactElement | null;
  (props: ReferenceTextDefaultProps & RefAttributes<HTMLSpanElement>): ReactElement | null;
  (props: ReferenceTextAsChildProps & RefAttributes<HTMLSpanElement>): ReactElement | null;
  (
    props:
      | (ReferenceLinkDefaultProps & RefAttributes<HTMLAnchorElement>)
      | (ReferenceLinkAsChildProps & RefAttributes<HTMLAnchorElement>)
      | (ReferenceTextDefaultProps & RefAttributes<HTMLSpanElement>)
      | (ReferenceTextAsChildProps & RefAttributes<HTMLSpanElement>),
  ): ReactElement | null;
}

/**
 * Base properties for a collection of references.
 */
export interface ReferenceListBaseProps {
  /**
   * Serializable items rendered as Reference children.
   *
   * ### Notes
   * Use either `references` for data-driven lists or `children` for custom composition.
   */
  references?: ReferenceItem[];
  /** Custom composed Reference children. */
  children?: ReactNode;
  /** Locale used by built-in accessible fallback labels. */
  locale?: string;
  /** Overrides for built-in accessible fallback labels. */
  messages?: Partial<ReferenceMessages>;
}

/**
 * Props for the ReferenceList navigation container. `asChild` accepts a native `nav`.
 */
type ReferenceListNativeProps = NativeProps<'nav', ReferenceListBaseProps>;
type ReferenceNavElement = ReactElement<ComponentPropsWithoutRef<'nav'>, 'nav'>;
/** Props for ReferenceList rendered with its default host. */
export type ReferenceListDefaultProps = DefaultHostProps<ReferenceListNativeProps>;
/** Props for ReferenceList delegated to an asChild host. */
export type ReferenceListAsChildProps = RetargetedAsChildHostProps<
  ReferenceListNativeProps,
  HTMLElement,
  ReferenceNavElement
>;
/** Public props for ReferenceList. */
export type ReferenceListProps = ReferenceListDefaultProps | ReferenceListAsChildProps;

/** Polymorphic component call signatures for ReferenceList. */
export interface ReferenceListComponent {
  (props: ReferenceListDefaultProps & RefAttributes<HTMLElement>): ReactElement | null;
  (props: ReferenceListAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (
    props:
      | (ReferenceListDefaultProps & RefAttributes<HTMLElement>)
      | (ReferenceListAsChildProps & RefAttributes<HTMLElement>),
  ): ReactElement | null;
}
