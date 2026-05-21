'use client';

import { createContext, useContext } from 'react';
import { TableProps } from './Table.types';

/**
 * Shared table variant state consumed by table compound parts.
 */
interface TableContextValue {
  variant?: TableProps['variant'];
  size?: TableProps['size'];
  layout?: TableProps['layout'];
}

/**
 * React context carrying Table variant state for nested parts.
 */
export const TableContext = createContext<TableContextValue | null>(null);

/**
 * Returns the nearest Table context and validates compound component usage.
 */
export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table sub-components must be used within a <Table />');
  }
  return context;
};
