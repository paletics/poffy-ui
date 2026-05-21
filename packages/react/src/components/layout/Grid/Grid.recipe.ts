import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Grid component with Panda CSS recipe variants.
 */
export const gridRecipe = defineRecipe({
  className: 'grid',
  description: 'Grid layout styling for column templates, ratios, alignment, and gaps',
  base: {
    display: 'grid',
    gridTemplateColumns: 'var(--grid-columns)',
  },
  variants: {
    gap: {
      none: { gap: '0' },
      '2xs': { gap: '{spacing.2xs}' },
      xs: { gap: '{spacing.xs}' },
      sm: { gap: '{spacing.sm}' },
      base: { gap: '{spacing.base}' },
      md: { gap: '{spacing.md}' },
      lg: { gap: '{spacing.lg}' },
      xl: { gap: '{spacing.xl}' },
      '2xl': { gap: '{spacing.2xl}' },
      '3xl': { gap: '{spacing.3xl}' },
    },
    ratio: {
      'silver-left': {
        gridTemplateColumns: '1.414fr 1fr',
      },
      'silver-right': {
        gridTemplateColumns: '1fr 1.414fr',
      },
      'golden-left': {
        gridTemplateColumns: '1.618fr 1fr',
      },
      'golden-right': {
        gridTemplateColumns: '1fr 1.618fr',
      },
      'equal-2': { gridTemplateColumns: 'repeat(2, 1fr)' },
      'equal-3': { gridTemplateColumns: 'repeat(3, 1fr)' },
    },
  },
});
