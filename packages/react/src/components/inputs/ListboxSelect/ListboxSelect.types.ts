import type { ListboxSelectVariantProps } from '@/styled-system/recipes';
import type { SelectAppearance, SelectProps } from '@/components/inputs/Select/Select.types';

/** Variants for the ListboxSelect component based on Panda CSS recipe. */
export type ListboxSelectVariants = ListboxSelectVariantProps;

/** Public surface treatment for ListboxSelect. */
export type ListboxSelectAppearance = SelectAppearance;

/** Public ListboxSelect variant props with shared select appearance names. */
export interface ListboxSelectVariantSubset extends Omit<ListboxSelectVariantProps, 'variant'> {
  /** Surface treatment. */
  appearance?: ListboxSelectAppearance;
  /** Legacy recipe variant alias. */
  variant?: ListboxSelectVariantProps['variant'];
}

/**
 * Props for a custom single-select listbox with native-select form parity.
 *
 * ### Notes
 * Use ListboxSelect when you need custom option rendering and keyboard listbox
 * behavior while keeping the same `value`, `defaultValue`, `onChange`, `name`,
 * and `required` contract as Select. Provide visible text or `aria-label`/
 * `aria-labelledby`; do not rely on placeholder-only labeling.
 *
 * Do: render `option` children with string values.
 * Don't: use this for searchable filtering; use `ComboBox` instead.
 *
 * @example
 * ```tsx
 * import { ListboxSelect } from '@poffy-ui/react/inputs';
 *
 * <ListboxSelect aria-label="Plan" value={plan} onChange={handlePlanChange}>
 *   <option value="pro">Pro</option>
 * </ListboxSelect>
 * ```
 *
 * Related: SelectProps for the native select API.
 * Related: ComboBoxProps for searchable selection.
 */
export type ListboxSelectProps = Omit<SelectProps, keyof ListboxSelectVariantSubset> &
  ListboxSelectVariantSubset;
