import { InputVariantProps } from '@/styled-system/recipes';
import { type InputAppearance, PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Generated Panda recipe variant props for the Input component.
 */
export type InputVariants = InputVariantProps;

/**
 * Public Input variant props with shared input appearance names.
 */
export interface InputVariantSubset extends Omit<InputVariantProps, 'variant'> {
  /** Surface treatment. */
  appearance?: InputAppearance;
  /** Legacy recipe variant alias. */
  variant?: InputVariantProps['variant'];
}

/**
 * Props for the core text-like Input atom.
 *
 * ### Notes
 * Input follows the native input controlled/uncontrolled contract: use `value`
 * with `onChange`, or `defaultValue` for an initial value. Always provide a
 * visible label, `aria-label`, or `aria-labelledby`. `startElement` and
 * `endElement` are decorative or interactive adornments; ensure interactive
 * adornments have their own accessible names.
 *
 * Do: use native input attributes such as `type`, `name`, `autoComplete`, and
 * `required` directly.
 * Don't: use placeholder text as the only label.
 *
 * @example
 * ```tsx
 * import { Input } from '@poffy-ui/react/inputs';
 *
 * <Input aria-label="Email" type="email" value={email} onChange={handleEmail} />
 * ```
 *
 * Related: InputGroupProps for attached addons and positioned elements.
 *
 * ### Formula
 * - Silver Ratio (1:1.414) is applied to height and padding via Panda recipes.
 */
export interface InputProps extends PrimitiveProps<'input', InputVariantSubset> {
  /**
   * Whether the input is in an error state.
   * If true, applies error-specific styles and animations.
   * @defaultValue `false`
   */
  error?: boolean;
  /**
   * Element rendered inside the input on the left side (e.g. search icon, currency symbol).
   * Padding is automatically adjusted to prevent text overlap via the inputGroup recipe.
   * @example <Input startElement={<SearchIcon />} />
   */
  startElement?: ReactNode;
  /**
   * Element rendered inside the input on the right side (e.g. calendar icon, clear button).
   * Padding is automatically adjusted to prevent text overlap via the inputGroup recipe.
   * @example <Input endElement={<CalendarIcon />} />
   */
  endElement?: ReactNode;
}
