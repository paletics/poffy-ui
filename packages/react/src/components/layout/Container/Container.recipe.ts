import { defineRecipe } from '@pandacss/dev';

/**
 * Container Recipe
 * Provides a centered, max-width constrained container with responsive padding.
 */
export const containerRecipe = defineRecipe({
  className: 'container',
  description: 'Container styling for centered, responsive max-width layouts',
  base: {
    mx: 'auto',
    width: '100%',
    px: { base: '{spacing.md}', md: '{spacing.xl}' },
    maxWidth: {
      base: '100%',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1536px',
    },
  },
});
