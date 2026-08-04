import { defineRecipe } from '@pandacss/dev';

/**
 * Center Recipe
 * Provides flex-based centering layout for both vertical and horizontal alignment.
 */
export const centerRecipe = defineRecipe({
  className: 'center',
  description: 'Center layout styling for horizontal and vertical child alignment',
  base: {
    display: 'flex',
    minInlineSize: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
