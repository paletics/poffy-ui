import { defineRecipe } from '@pandacss/dev';
import {
  inputBaseStyles,
  inputErrorState,
  inputSizeVariants,
  inputVisualVariants,
} from '../shared/input.shared';

/**
 * Styles the Textarea component with Panda CSS recipe variants.
 */
export const textareaRecipe = defineRecipe({
  className: 'textarea',
  description: 'Textarea styling for standard multiline input states',
  base: {
    ...inputBaseStyles,
    paddingY: '{spacing.sm}',
    minHeight: '{sizes.root.3}',
    lineHeight: 'snug',
    verticalAlign: 'top',
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
  variants: {
    variant: inputVisualVariants,
    size: inputSizeVariants,
    error: inputErrorState,
  },
});
