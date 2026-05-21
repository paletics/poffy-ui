import { PrimitiveProps } from '@poffy-ui/types';

/**
 * ### AI Context & Architecture
 * - Tier: Molecules
 */
export type InputGroupSize = 'sm' | 'md' | 'lg';

/**
 * Own props for InputGroup.
 *
 * ### Notes
 * InputGroup is structural: render `InputGroup` as the root, exactly one input
 * control inside, and optional left/right addons or elements. Addons are part of
 * the layout; interactive elements inside them must still be keyboard reachable
 * and labeled.
 *
 * Do: use addons for static prefixes/suffixes such as currency or units.
 * Don't: put multiple primary inputs in one InputGroup.
 *
 * @example
 * ```tsx
 * import { Input, InputGroup, InputLeftAddon } from '@poffy-ui/react/inputs';
 *
 * <InputGroup>
 *   <InputLeftAddon>https://</InputLeftAddon>
 *   <Input aria-label="Domain" />
 * </InputGroup>
 * ```
 *
 * Related: InputProps for the contained field API.
 */
export interface InputGroupOwnProps {
  /** Shared size for grouped input parts. */
  size?: InputGroupSize;
}

/** Props for InputGroup root. */
export type InputGroupProps = PrimitiveProps<'div', InputGroupOwnProps>;

/** Props for InputGroup addon slots. */
export type InputAddonProps = PrimitiveProps<'div'>;

/** Props for InputGroup element slots. */
export type InputElementProps = PrimitiveProps<'div'>;
