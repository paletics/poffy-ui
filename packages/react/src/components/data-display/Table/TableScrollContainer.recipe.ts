import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the optional native horizontal scroll owner for wide tables.
 */
export const tableScrollContainerRecipe = defineRecipe({
  className: 'table-scroll-container',
  description: 'Local horizontal overflow container for semantic tables',
  base: {
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    overflowX: 'auto',
    overscrollBehaviorX: 'contain',
    _focusVisible: {
      outlineWidth: '{focusRing.width}',
      outlineStyle: 'solid',
      outlineColor: 'brand.main',
      outlineOffset: '{focusRing.offset}',
    },
  },
});
