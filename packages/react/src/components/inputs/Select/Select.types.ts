import { SelectVariantProps } from '@/styled-system/recipes';
import { ComponentProps } from 'react';
import type {
  NeoInputAppearanceProp,
  NeoInputAppearanceValue,
} from '@/components/inputs/inputVariant';

/** Visual props for `Select`. */
export type SelectVariants = SelectVariantSubset;

/** Surface treatment for `Select`. */
export type SelectAppearance = NeoInputAppearanceValue;

/** Select recipe options using shared input appearance names. */
export interface SelectVariantSubset extends Omit<SelectVariantProps, 'variant'> {
  /** Surface treatment. @defaultValue `'outline'` */
  appearance?: NeoInputAppearanceProp;
}

/**
 * Props for an owned native `<select>`. Provide a visible label or an ARIA name.
 *
 * Direct `disabled`, `readOnly`, `required`, `id`, and `error` values override the nearest
 * FormControl. Single select shows a decorative chevron; native `multiple` select does not.
 */
export interface SelectProps extends Omit<ComponentProps<'select'>, 'size'>, SelectVariantSubset {
  /**
   * Prevents user-driven selection changes while preserving focus and form submission.
   *
   * Pointer and non-Tab keyboard changes are restored to the prior option set.
   * Read-only keeps `aria-required` but omits native `required` validation
   * because the user cannot satisfy it by changing the field.
   */
  readOnly?: boolean;
  /**
   * Whether the select is in an error state.
   * If true, applies error-specific styles to the field.
   * @defaultValue `false`
   */
  error?: boolean;
}
