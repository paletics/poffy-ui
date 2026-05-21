'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { table } from '@/styled-system/recipes';
import { ElementType, forwardRef, useMemo } from 'react';
import { TableContext } from './TableContext';
import { TableProps } from './Table.types';

/**
 * The root `<table>` container for the Table compound component.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: table), React Context, Radix Slot
 * ### Design Tokens
 * - spacing/typography: silver-ratio tokens
 * ### Variant Logic
 * - variant: striped=alternating rows, bordered=cell borders, compact=reduced padding.
 * ### Notes
 * Establishes variant context consumed by all Table sub-components.
 * ### Accessibility
 * - Always pair with `<Table.Caption>` for screen reader context.
 * @example
 * ```tsx
 * import { Table } from '@poffy-ui/react/data-display';
 *
 * <Table.Root variant="striped" size="md">
 *   <Table.Caption>Q1 Sales Data</Table.Caption>
 *   <Table.Head>
 *     <Table.Row><th scope="col">Region</th><th scope="col">Sales</th></Table.Row>
 *   </Table.Head>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>Tokyo</Table.Cell>
 *       <Table.Cell>$2,100,000</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Root>
 * ```
 */
export const TableRoot = forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const { asChild, children, className, variant, size, layout, ...rest } = props;
  const Component = asChild ? Slot : ('table' as ElementType);
  const classes = table({ variant, size, layout });

  const contextValue = useMemo(() => ({ variant, size, layout }), [variant, size, layout]);

  return (
    <TableContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </Component>
    </TableContext.Provider>
  );
});

TableRoot.displayName = 'Table.Root';
