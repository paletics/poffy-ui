import { TextareaVariantProps } from '@/styled-system/recipes';
import { type InputAppearance } from '@poffy-ui/types';
import { ComponentProps } from 'react';

/**
 * Variants for the Textarea component based on Panda CSS recipe.
 */
export type TextareaVariants = TextareaVariantProps;

/**
 * Public Textarea variant props with shared input appearance names.
 */
export interface TextareaVariantSubset extends Omit<TextareaVariantProps, 'variant'> {
  /** Surface treatment. */
  appearance?: InputAppearance;
  /** Legacy recipe variant alias. */
  variant?: TextareaVariantProps['variant'];
}

/**
 * Properties for the Textarea component.
 * Supports standard HTML textarea attributes and recipe variants.
 */
export interface TextareaProps
  extends Omit<ComponentProps<'textarea'>, 'size'>, TextareaVariantSubset {
  /**
   * Whether the textarea is in an error state.
   * If true, applies error-specific styles.
   * @defaultValue false
   */
  error?: boolean;
}
