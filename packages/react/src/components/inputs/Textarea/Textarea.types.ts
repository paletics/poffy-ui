import type { TextareaVariantProps } from '@/styled-system/recipes';
import type { ComponentProps } from 'react';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';

/** Visual props for `Textarea`. */
export type TextareaVariants = TextareaVariantSubset;

/** Textarea recipe options exposed with shared appearance names. */
export interface TextareaVariantSubset extends Omit<TextareaVariantProps, 'variant'> {
  /**
   * Surface treatment.
   * @defaultValue `'outline'`
   */
  appearance?: InputAppearanceProp;
}

/**
 * Props for a native multi-line field. Provide a label through a FormControl or native ARIA.
 *
 * Direct `disabled`, `readOnly`, `required`, `id`, and `error` values override the nearest
 * FormControl. Registered help text is always used for `aria-describedby`; registered error text
 * is associated only while the resolved field state is invalid.
 */
export interface TextareaProps
  extends Omit<ComponentProps<'textarea'>, 'size'>, TextareaVariantSubset {
  /**
   * Whether the textarea is in an error state.
   * If true, applies error-specific styles.
   * @defaultValue `false`
   */
  error?: boolean;
}
