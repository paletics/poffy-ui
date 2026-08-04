import { Children, Fragment, isValidElement, type ReactNode } from 'react';

export const CHECKBOX_GROUP_ITEM_MARKER = Symbol.for('poffy-ui.checkbox-group.item');

interface MarkedCheckboxType {
  [CHECKBOX_GROUP_ITEM_MARKER]?: boolean;
}

export const getCheckboxGroupStaticTopology = (children: ReactNode) => {
  const topology = { hasOpaqueChildren: false, values: [] as string[] };
  const visit = (nodes: ReactNode) => {
    if (
      typeof nodes === 'object' &&
      nodes !== null &&
      !Array.isArray(nodes) &&
      !isValidElement(nodes) &&
      Symbol.iterator in nodes
    ) {
      topology.hasOpaqueChildren = true;
      return;
    }
    Children.forEach(nodes, (child) => {
      if (!isValidElement<{ children?: ReactNode; value?: unknown }>(child)) return;
      if ((child.type as MarkedCheckboxType)[CHECKBOX_GROUP_ITEM_MARKER]) {
        if (typeof child.props.value === 'string') topology.values.push(child.props.value);
        return;
      }
      if (child.type === Fragment || typeof child.type === 'string') visit(child.props.children);
      else topology.hasOpaqueChildren = true;
    });
  };
  visit(children);
  return topology;
};
