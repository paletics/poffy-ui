import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Copy Button component with Panda CSS recipe variants.
 */
export const copyButtonRecipe = defineRecipe({
  className: 'copy-button',
  description: 'Specialized button for clipboard copy actions',
  base: {
    display: 'inline-flex',
    position: 'relative',
  },
});
