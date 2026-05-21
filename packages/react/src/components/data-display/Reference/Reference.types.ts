import type { PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';

/**
 * Public surface treatment for Reference.
 */
export type ReferenceAppearance = 'plain' | 'soft';

/**
 * Public size for Reference.
 */
export type ReferenceSize = 'sm' | 'md';

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
  /** Destination URL. When omitted, the item renders as non-link reference text. */
  href?: string;
  /**
   * Marks the link as external and applies external-link attributes.
   *
   * @defaultValue `false`
   */
  external?: boolean;
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
  /** Destination URL. When omitted, Reference renders as non-link reference text. */
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
}

/**
 * Props for a single reference. Renders an anchor when `href` is provided.
 */
export type ReferenceProps = PrimitiveProps<'a', ReferenceBaseProps>;

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
}

/**
 * Props for the ReferenceList navigation container.
 */
export type ReferenceListProps = PrimitiveProps<'nav', ReferenceListBaseProps>;
