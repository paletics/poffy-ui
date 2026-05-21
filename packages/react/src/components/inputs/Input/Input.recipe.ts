import { defineRecipe } from '@pandacss/dev';
import {
  inputBaseStyles,
  inputErrorState,
  inputSizeVariants,
  inputVisualVariants,
} from '../shared/input.shared';

/**
 * Styles the Input component with Panda CSS recipe variants.
 */
export const inputRecipe = defineRecipe({
  className: 'input',
  description: 'Input styling for standard single-line input states',
  base: inputBaseStyles,
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
