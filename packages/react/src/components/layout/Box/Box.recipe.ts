import { defineRecipe } from '@pandacss/dev';

/**
 * Box Recipe
 * Provides foundational reset styles for the most primitive layout container.
 * Box serves as the base for all other UI components.
 */
export const boxRecipe = defineRecipe({
  className: 'box',
  description: 'Box layout styling for reset-safe primitive containers',
  base: {
    boxSizing: 'border-box',
  },
});
