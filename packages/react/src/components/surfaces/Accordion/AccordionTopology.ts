import { Children, Fragment, isValidElement, type ReactNode } from 'react';

export const ACCORDION_ITEM_MARKER = Symbol.for('poffy-ui.accordion.item');
export const ACCORDION_TRIGGER_MARKER = Symbol.for('poffy-ui.accordion.trigger');
export const ACCORDION_CONTENT_MARKER = Symbol.for('poffy-ui.accordion.content');

interface MarkedType {
  [key: symbol]: boolean | undefined;
}

const scan = (children: ReactNode, onElement: (type: MarkedType, value: unknown) => void) => {
  let opaque = false;
  const visit = (nodes: ReactNode) => {
    if (
      typeof nodes === 'object' &&
      nodes !== null &&
      !Array.isArray(nodes) &&
      !isValidElement(nodes) &&
      Symbol.iterator in nodes
    ) {
      opaque = true;
      return;
    }
    Children.forEach(nodes, (child) => {
      if (!isValidElement<{ children?: ReactNode; value?: unknown }>(child)) return;
      const type = child.type as unknown as MarkedType;
      onElement(type, child.props.value);
      if (child.type === Fragment || typeof child.type === 'string') visit(child.props.children);
      else if (
        !type[ACCORDION_ITEM_MARKER] &&
        !type[ACCORDION_TRIGGER_MARKER] &&
        !type[ACCORDION_CONTENT_MARKER]
      )
        opaque = true;
    });
  };
  visit(children);
  return opaque;
};

export const getAccordionItemValues = (children: ReactNode) => {
  const values: string[] = [];
  const hasOpaqueChildren = scan(children, (type, value) => {
    if (type[ACCORDION_ITEM_MARKER] && typeof value === 'string') values.push(value);
  });
  return { hasOpaqueChildren, values };
};

export const getAccordionPartCounts = (children: ReactNode) => {
  let triggers = 0;
  let contents = 0;
  const hasOpaqueChildren = scan(children, (type) => {
    if (type[ACCORDION_TRIGGER_MARKER]) triggers += 1;
    if (type[ACCORDION_CONTENT_MARKER]) contents += 1;
  });
  return { contents, hasOpaqueChildren, triggers };
};
