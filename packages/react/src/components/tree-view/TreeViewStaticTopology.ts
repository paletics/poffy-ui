import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { TreeViewContent } from './TreeViewContent';
import { TreeViewItem } from './TreeViewItem';

/** Reads the server-visible tree topology without executing opaque components. */
export const getKnownAmbiguousTreeItemIds = (children: ReactNode): ReadonlySet<string> => {
  const idCounts = new Map<string, number>();

  const visit = (node: ReactNode): void => {
    Children.forEach(node, (child) => {
      if (!isValidElement<{ children?: ReactNode; id?: unknown }>(child)) return;
      if (child.type === TreeViewItem && typeof child.props.id === 'string') {
        idCounts.set(child.props.id, (idCounts.get(child.props.id) ?? 0) + 1);
        visit(child.props.children);
        return;
      }
      if (
        child.type === Fragment ||
        child.type === TreeViewContent ||
        typeof child.type === 'string'
      ) {
        visit(child.props.children);
      }
    });
  };

  visit(children);
  return new Set([...idCounts].flatMap(([id, count]) => (count > 1 ? [id] : [])));
};
