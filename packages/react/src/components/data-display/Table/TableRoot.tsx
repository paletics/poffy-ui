'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef, useMemo } from 'react';
import { TableContext } from './TableContext';
import { TableProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';

const tableRootChildTags = ['caption', 'colgroup', 'thead', 'tbody', 'tfoot'] as const;

/**
 * Renders the root native `table` and shares layout variants with its parts.
 *
 * `asChild` delegates only to a `table`; otherwise unsupported delegated
 * content is reduced to valid table child groups before rendering the default
 * host. Use `Table.ScrollContainer` rather than styling this root as a scroller.
 */
export const TableRoot = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const { asChild, children, className, variant, size, layout, stickyHeader, headerTone, ...rest } =
    props;
  const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['table']));
  const renderedChildren = canUseAsChild
    ? children
    : asChild
      ? getTableFallbackChildren(children, tableRootChildTags)
      : children;
  const Component = (canUseAsChild ? Slot : 'table') as ElementType;
  const classes = useMemo(
    () => table({ variant, size, layout, stickyHeader, headerTone }),
    [variant, size, layout, stickyHeader, headerTone],
  );

  const contextValue = useMemo(
    () => ({ variant, size, layout, stickyHeader, headerTone, classes }),
    [variant, size, layout, stickyHeader, headerTone, classes],
  );

  return (
    <TableContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {renderedChildren}
      </Component>
    </TableContext.Provider>
  );
});

TableRoot.displayName = 'Table.Root';
