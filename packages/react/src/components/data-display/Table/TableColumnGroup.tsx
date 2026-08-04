'use client';

import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import type { TableColumnGroupProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';

/**
 * Renders a native `colgroup` for shared column dimensions.
 *
 * `asChild` accepts only `colgroup`; otherwise only `col` children are kept
 * when delegating falls back.
 */
export const TableColumnGroup = forwardRef<HTMLTableColElement, TableColumnGroupProps>(
  (props, ref) => {
    const { asChild, children, ...rest } = props;
    const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['colgroup']));
    const renderedChildren = canUseAsChild
      ? children
      : asChild
        ? getTableFallbackChildren(children, ['col'])
        : children;
    const Component = (canUseAsChild ? Slot : 'colgroup') as ElementType;

    return (
      <Component ref={ref} {...rest}>
        {renderedChildren}
      </Component>
    );
  },
);

TableColumnGroup.displayName = 'Table.ColumnGroup';
