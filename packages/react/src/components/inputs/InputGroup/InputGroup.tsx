import { InputGroupInput } from './InputGroupInput';
import { InputGroupRoot } from './InputGroupRoot';
import { InputStartAddon } from './InputStartAddon';
import { InputEndAddon } from './InputEndAddon';
import { InputStartElement } from './InputStartElement';
import { InputEndElement } from './InputEndElement';
import type { InputAddonComponent, InputElementComponent } from './InputGroup.types';

type InputGroupCompoundComponent = typeof InputGroupRoot & {
  Input: typeof InputGroupInput;
  StartAddon: InputAddonComponent;
  EndAddon: InputAddonComponent;
  StartElement: InputElementComponent;
  EndElement: InputElementComponent;
};

/**
 * Compound entry point for one field with fixed addon and inline-element slots.
 *
 * Render `Input`, `StartAddon`, `EndAddon`, `StartElement`, and `EndElement` as direct children;
 * the root reorders those slots around the remaining field children. Use addons for static
 * prefixes/suffixes and mark an element `interactive` only when it contains an independently
 * labelled control.
 */
export const InputGroup: InputGroupCompoundComponent = Object.assign(InputGroupRoot, {
  Input: InputGroupInput,
  StartAddon: InputStartAddon,
  EndAddon: InputEndAddon,
  StartElement: InputStartElement,
  EndElement: InputEndElement,
});
