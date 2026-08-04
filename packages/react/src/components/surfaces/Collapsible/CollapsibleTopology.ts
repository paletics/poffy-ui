import { Children, Fragment, isValidElement, type ReactNode } from 'react';

export const COLLAPSIBLE_TRIGGER_MARKER = Symbol.for('poffy-ui.collapsible.trigger');
export const COLLAPSIBLE_CONTENT_MARKER = Symbol.for('poffy-ui.collapsible.content');

interface MarkedType {
  [key: symbol]: boolean | undefined;
}

export const getCollapsiblePartCounts = (children: ReactNode) => {
  let triggers = 0;
  let contents = 0;
  let hasOpaqueChildren = false;
  const visit = (nodes: ReactNode) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement<{ children?: ReactNode }>(child)) return;
      const type = child.type as unknown as MarkedType;
      if (type[COLLAPSIBLE_TRIGGER_MARKER]) triggers += 1;
      else if (type[COLLAPSIBLE_CONTENT_MARKER]) contents += 1;
      else if (child.type === Fragment || typeof child.type === 'string')
        visit(child.props.children);
      else hasOpaqueChildren = true;
    });
  };
  visit(children);
  return { contents, hasOpaqueChildren, triggers };
};
