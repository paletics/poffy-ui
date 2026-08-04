import { defineRecipe } from '@pandacss/dev';
import {
  inputBaseStyles,
  inputErrorState,
  inputVisualVariants,
} from '../shared/input.shared';

const textareaSizeVariants = {
  sm: {
    minHeight: '{sizes.silver.2}',
    fontSize: 'sm',
    px: '{spacing.md}',
    borderRadius: 'xl',
  },
  md: {
    minHeight: '{sizes.root.2}',
    fontSize: 'md',
    px: '{spacing.base}',
    borderRadius: '2xl',
  },
  lg: {
    minHeight: '{sizes.silver.3}',
    fontSize: 'lg',
    px: '{spacing.lg}',
    borderRadius: '3xl',
  },
};

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
    size: textareaSizeVariants,
    error: inputErrorState,
  },
});
