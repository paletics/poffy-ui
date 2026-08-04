'use client';

import { cx } from '@/styled-system/css';
import { keyValueViewer } from '@/styled-system/recipes';
import { forwardRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { KeyValueItem, KeyValueViewerProps } from './KeyValueViewer.types';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

function renderValue(item: KeyValueItem, emptyValue: ReactNode): ReactNode {
  if (item.value === null || item.value === undefined || item.value === '') {
    return emptyValue;
  }

  if (typeof item.value === 'boolean') return String(item.value);

  return item.value;
}

/**
 * Renders metadata as a semantic description list inside a `figure`.
 *
 * Items remain in source order. `null`, `undefined`, and an empty string use
 * `emptyValue` (or a localized “not set” message), while boolean values render
 * as `true` or `false`. Duplicate item IDs are rendered but warn during
 * development because row identity becomes ambiguous.
 */
export const KeyValueViewer = forwardRef<HTMLElement, KeyValueViewerProps>(
  ({ caption, items, emptyValue, size, columns, className, ...rest }, ref) => {
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const resolvedEmptyValue = emptyValue ?? messages.notSet;
    const classes = keyValueViewer({ size, columns });

    useEffect(() => {
      if (globalThis.process?.env?.['NODE_ENV'] === 'production') return;
      const ids = items.map((item) => item.id);
      if (new Set(ids).size === ids.length) return;
      console.warn(
        '[KeyValueViewer] KeyValueItem ids must be unique within a KeyValueViewer. Duplicate ids produce ambiguous row identity.',
      );
    }, [items]);

    return (
      <figure ref={ref} className={cx(classes.root, className)} {...rest}>
        {caption != null ? <figcaption className={classes.caption}>{caption}</figcaption> : null}
        <dl className={classes.list}>
          {items.map((item) => (
            <div className={classes.item} key={item.id}>
              <dt className={classes.term}>{item.label}</dt>
              <dd className={classes.value}>{renderValue(item, resolvedEmptyValue)}</dd>
            </div>
          ))}
        </dl>
      </figure>
    );
  },
);

KeyValueViewer.displayName = 'KeyValueViewer';
