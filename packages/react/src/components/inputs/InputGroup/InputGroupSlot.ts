import type { ComponentType } from 'react';

/**
 * Slot identifiers used by InputGroup compound children.
 */
type InputGroupSlot = 'startAddon' | 'endAddon' | 'startElement' | 'endElement';

/**
 * Symbol marker used to identify InputGroup slot components.
 */
export const INPUT_GROUP_SLOT = Symbol.for('poffy-ui.input-group.slot');

/**
 * Component type carrying an optional InputGroup slot marker.
 */
export type InputGroupSlotComponent = ComponentType<unknown> & {
  [INPUT_GROUP_SLOT]?: InputGroupSlot;
};
