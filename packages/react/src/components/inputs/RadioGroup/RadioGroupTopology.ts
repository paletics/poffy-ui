import { Children, Fragment, isValidElement, type ReactNode } from 'react';

export const RADIO_COMPONENT_MARKER = Symbol.for('poffy-ui.radio-group.radio');

interface MarkedRadioType {
  [RADIO_COMPONENT_MARKER]?: boolean;
}

export interface RadioGroupStaticTopology {
  hasOpaqueChildren: boolean;
  values: string[];
}

/** Reads the declarative radio topology without executing opaque custom components. */
export const getRadioGroupStaticTopology = (children: ReactNode): RadioGroupStaticTopology => {
  const topology: RadioGroupStaticTopology = { hasOpaqueChildren: false, values: [] };

  const visit = (nodes: ReactNode) => {
    if (
      typeof nodes === 'object' &&
      nodes !== null &&
      !Array.isArray(nodes) &&
      !isValidElement(nodes) &&
      Symbol.iterator in nodes
    ) {
      // Iterables may be single-use. Inspecting them would consume the nodes before React renders
      // them, so leave their topology to the client registry and fail closed during SSR.
      topology.hasOpaqueChildren = true;
      return;
    }
    Children.forEach(nodes, (child) => {
      if (!isValidElement<{ children?: ReactNode; value?: unknown }>(child)) return;
      if ((child.type as MarkedRadioType)[RADIO_COMPONENT_MARKER]) {
        if (typeof child.props.value === 'string') topology.values.push(child.props.value);
        return;
      }
      if (child.type === Fragment || typeof child.type === 'string') {
        visit(child.props.children);
        return;
      }
      topology.hasOpaqueChildren = true;
    });
  };

  visit(children);
  return topology;
};
