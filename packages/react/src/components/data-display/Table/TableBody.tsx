'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableBodyProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';

/**
 * Renders the native `tbody` styled by the owning Table.
 *
 * `asChild` accepts only `tbody`; unsupported delegated content retains only
 * row children before falling back to the default element.
 */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { classes } = useTableContext();
  const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['tbody']));
  const renderedChildren = canUseAsChild
    ? children
    : asChild
      ? getTableFallbackChildren(children, ['tr'])
      : children;
  const Component = (canUseAsChild ? Slot : 'tbody') as ElementType;

  return (
    <Component ref={ref} className={cx(classes.body, className)} {...rest}>
      {renderedChildren}
    </Component>
  );
});

TableBody.displayName = 'Table.Body';
