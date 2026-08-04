'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableFooterProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';

/**
 * Renders the native `tfoot` styled by the owning Table.
 *
 * `asChild` accepts only `tfoot`; unsupported delegated content retains only
 * row children before falling back to the default element.
 */
export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { classes } = useTableContext();
  const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['tfoot']));
  const renderedChildren = canUseAsChild
    ? children
    : asChild
      ? getTableFallbackChildren(children, ['tr'])
      : children;
  const Component = (canUseAsChild ? Slot : 'tfoot') as ElementType;

  return (
    <Component ref={ref} className={cx(classes.footer, className)} {...rest}>
      {renderedChildren}
    </Component>
  );
});

TableFooter.displayName = 'Table.Footer';
