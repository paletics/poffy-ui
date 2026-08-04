import { cloneElement, Fragment, isValidElement, type ReactNode } from 'react';

const tableCompoundDisplayNames = new Set([
  'Table.Body',
  'Table.Caption',
  'Table.Cell',
  'Table.Column',
  'Table.ColumnGroup',
  'Table.Footer',
  'Table.Head',
  'Table.HeaderCell',
  'Table.Row',
]);

const isTableCompoundChild = (child: ReactNode) => {
  if (!isValidElement(child) || typeof child.type === 'string' || typeof child.type === 'symbol') {
    return false;
  }

  const displayName = (child.type as unknown as { displayName?: unknown }).displayName;
  return typeof displayName === 'string' && tableCompoundDisplayNames.has(displayName);
};

export const isTableAsChildHost = (children: ReactNode, tags: readonly string[]) =>
  isValidElement(children) && typeof children.type === 'string' && tags.includes(children.type);

/**
 * Removes incompatible native wrappers until a slot's direct table children
 * are reached. Custom compound parts are retained so they can render their
 * own native table hosts.
 */
export const getTableFallbackChildren = (
  children: ReactNode,
  allowedTags?: readonly string[],
): ReactNode => {
  if (!isValidElement<{ children?: ReactNode }>(children)) return children;
  if (!allowedTags) {
    return typeof children.type === 'string' ? children.props.children : children;
  }
  if (children.type === Fragment) {
    return getTableFallbackChildren(children.props.children, allowedTags);
  }
  if (typeof children.type !== 'string') {
    return isTableCompoundChild(children)
      ? children
      : getTableFallbackChildren(children.props.children, allowedTags);
  }
  if (!allowedTags.includes(children.type)) {
    return getTableFallbackChildren(children.props.children, allowedTags);
  }

  return cloneElement(children, undefined, children.props.children);
};
