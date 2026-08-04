import type { KeyValueViewerVariantProps } from '@/styled-system/recipes';
import type { NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';

/** One source-ordered term/value entry rendered by KeyValueViewer as `dt` and `dd`. */
export interface KeyValueItem {
  /** Stable, unique item id within this viewer, used as the React key. Duplicates warn in development. */
  id: string;
  /** Term shown in the `dt` cell. */
  label: ReactNode;
  /** Value shown in the `dd` cell; nullish and empty-string values use `emptyValue`. */
  value?: ReactNode;
}

/** Shared base props for KeyValueViewer. */
export interface KeyValueViewerBaseProps extends KeyValueViewerVariantProps {
  /** Optional visible caption for the metadata group. */
  caption?: ReactNode;
  /** Items rendered in source order. */
  items: readonly KeyValueItem[];
  /** Fallback shown when an item value is nullish or an empty string. */
  emptyValue?: ReactNode;
}

/** Public props for KeyValueViewer. */
export type KeyValueViewerProps = NativeProps<'figure', KeyValueViewerBaseProps>;
