import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the SearchInput component shell.
 */
export const searchInputRecipe = defineRecipe({
  className: 'search-input',
  description: 'Search input composition around the standard input atom',
  base: {
    display: 'inline-flex',
    width: '100%',
  },
});
