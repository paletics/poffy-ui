'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import { useTableContext } from './TableContext';
import { TableCaptionProps } from './Table.types';
import { getTableFallbackChildren, isTableAsChildHost } from './Table.utils';

/**
 * Renders the native `caption` for the owning Table; `asChild` accepts only `caption`.
 */
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { classes } = useTableContext();
  const canUseAsChild = Boolean(asChild && isTableAsChildHost(children, ['caption']));
  const renderedChildren = canUseAsChild
    ? children
    : asChild
      ? getTableFallbackChildren(children)
      : children;
  const Component = (canUseAsChild ? Slot : 'caption') as ElementType;

  return (
    <Component ref={ref} className={cx(classes.caption, className)} {...rest}>
      {renderedChildren}
    </Component>
  );
});

TableCaption.displayName = 'Table.Caption';
