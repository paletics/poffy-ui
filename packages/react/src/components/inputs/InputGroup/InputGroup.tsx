import { InputGroupInput } from './InputGroupInput';
import { InputGroupRoot } from './InputGroupRoot';
import { InputLeftAddon } from './InputLeftAddon';
import { InputRightAddon } from './InputRightAddon';
import { InputLeftElement } from './InputLeftElement';
import { InputRightElement } from './InputRightElement';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { InputAddonProps, InputElementProps } from './InputGroup.types';

type InputGroupSlotExport<P> = ForwardRefExoticComponent<P & RefAttributes<HTMLDivElement>>;

type InputGroupComponent = typeof InputGroupRoot & {
  Input: typeof InputGroupInput;
  LeftAddon: InputGroupSlotExport<InputAddonProps>;
  RightAddon: InputGroupSlotExport<InputAddonProps>;
  LeftElement: InputGroupSlotExport<InputElementProps>;
  RightElement: InputGroupSlotExport<InputElementProps>;
};

/**
 * Compound input group with addon and element slots.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: `InputGroupRoot`, `InputGroupInput`, addon slots, element slots
 * - **Props**: compound component export around `InputGroupProps`
 *
 * ### Design Tokens
 * - **spacing**: size-aware addon padding and element offsets come from `inputGroupRecipe`
 * - **color**: addon surfaces and embedded elements use semantic input tokens
 *
 * ### Variant Logic
 * - **LeftAddon / RightAddon**: Use for textual prefixes or suffixes that affect field meaning.
 * - **LeftElement / RightElement**: Use for decorative icons or inline controls inside the input shell.
 *
 * ### Accessibility
 * - **Role**: delegates input semantics to `InputGroup.Input`.
 * - **Required**: Keep labels on the input itself or wrap the group in `FormControl`.
 *
 * ### AI Usage
 * - **DO**: Compose `InputGroup.Input` with at most one slot per side.
 * - **DON'T**: Put focusable buttons in element slots unless they have explicit labels and tab behavior.
 *
 * @example Text addon
 * ```tsx
 * import { InputGroup } from '@poffy-ui/react/inputs';
 *
 * <InputGroup>
 *   <InputGroup.LeftAddon>https://</InputGroup.LeftAddon>
 *   <InputGroup.Input aria-label="Website" />
 * </InputGroup>
 * ```
 */
export const InputGroup: InputGroupComponent = Object.assign(InputGroupRoot, {
  Input: InputGroupInput,
  LeftAddon: InputLeftAddon,
  RightAddon: InputRightAddon,
  LeftElement: InputLeftElement,
  RightElement: InputRightElement,
});
