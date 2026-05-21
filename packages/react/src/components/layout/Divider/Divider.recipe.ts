import { defineRecipe } from '@pandacss/dev';

/**
 * Divider Recipe
 * Provides visual separation with orientation and style variants.
 */
export const dividerRecipe = defineRecipe({
  className: 'divider',
  description: 'Divider styling for horizontal and vertical content separators',
  base: {
    borderColor: 'layout.divider',
    borderStyle: 'solid',
  },
  variants: {
    orientation: {
      horizontal: {
        width: '{sizes.full}',
        borderBottomWidth: '1px',
      },
      vertical: {
        height: '{sizes.full}',
        minHeight: '1em', // Ensure visibility if height not set
        borderLeftWidth: '1px',
      },
    },
    variant: {
      solid: { borderStyle: 'solid' },
      dashed: { borderStyle: 'dashed' },
      dotted: { borderStyle: 'dotted' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
  },
});
