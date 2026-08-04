'use client';

import { createContext, useContext } from 'react';
import { TreeViewContextValue } from './TreeView.types';

const TreeViewContext = createContext<TreeViewContextValue | null>(null);

/**
 * Provider for shared TreeView selection, expansion, and keyboard state.
 */
export const TreeViewProvider = TreeViewContext.Provider;

/**
 * Returns the nearest TreeView context and validates compound component usage.
 */
export const useTreeViewContext = () => {
  const context = useContext(TreeViewContext);
  if (!context) {
    throw new Error('TreeView components must be used within a TreeView.Root');
  }
  return context;
};

// Internal per-item context shared by item parts such as Trigger, Content, and Checkbox.
const TreeViewItemContext = createContext<{
  id: string;
  instanceId: string;
  isAmbiguous: boolean;
  childrenIds?: string[];
  hasChildren?: boolean;
  setFocusable: (isFocusable: boolean) => void;
  setSelectable: (childrenIds: string[] | null, isSelectionDisabled?: boolean) => void;
} | null>(null);

/**
 * Provider for per-item TreeView state such as item id and child relationships.
 */
export const TreeViewItemProvider = TreeViewItemContext.Provider;

/**
 * Returns the nearest TreeView item context and validates item part usage.
 */
export const useTreeViewItemContext = () => {
  const context = useContext(TreeViewItemContext);
  if (!context) {
    throw new Error(
      'TreeView.Trigger, TreeView.Content, or TreeView.Checkbox must be used within a TreeView.Item',
    );
  }
  return context;
};
