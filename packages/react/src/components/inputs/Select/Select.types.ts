import { SelectVariantProps } from '@/styled-system/recipes';
import { type InputAppearance } from '@poffy-ui/types';
import { ComponentProps } from 'react';

/**
 * Variants for the Select component based on Panda CSS recipe.
 */
export type SelectVariants = SelectVariantProps;

/**
 * Public surface treatment for Select.
 */
export type SelectAppearance = InputAppearance | 'neo';

/**
 * Public Select variant props with shared input appearance names.
 */
export interface SelectVariantSubset extends Omit<SelectVariantProps, 'variant'> {
  /** Surface treatment. */
  appearance?: SelectAppearance;
  /** Legacy recipe variant alias. */
  variant?: SelectVariantProps['variant'];
}

/**
 * Props for the styled native `<select>` input.
 *
 * ### Notes
 * Select keeps the browser select behavior and accepts normal HTML select
 * children. Use `value` with `onChange` for controlled state, or `defaultValue`
 * for uncontrolled initial state. Provide a visible label, `aria-label`, or
 * `aria-labelledby`.
 *
 * Do: use this for standard forms and maximum native behavior.
 * Don't: use this when you need a searchable popup; use `ComboBox` instead.
 *
 * @example
 * ```tsx
 * import { Select } from '@poffy-ui/react/inputs';
 *
 * <Select aria-label="Status" value={status} onChange={event => setStatus(event.target.value)}>
 *   <option value="open">Open</option>
 * </Select>
 * ```
 *
 * Related: ListboxSelectProps for a custom listbox surface with select-like props.
 */
export interface SelectProps extends Omit<ComponentProps<'select'>, 'size'>, SelectVariantSubset {
  /**
   * Whether the select is in an error state.
   * If true, applies error-specific styles to the field.
   * @defaultValue `false`
   */
  error?: boolean;
}
