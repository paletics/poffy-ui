import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Grid component with Panda CSS recipe variants.
 */
export const gridRecipe = defineRecipe({
  className: 'grid',
  description: 'Grid layout styling for column templates, ratios, alignment, and gaps',
  base: {
    '--grid-columns': 'initial',
    display: 'grid',
    minInlineSize: 0,
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
        gridTemplateColumns: 'minmax(0, 1.414fr) minmax(0, 1fr)',
        '&:dir(rtl)': {
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.414fr)',
        },
      },
      'silver-right': {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.414fr)',
        '&:dir(rtl)': {
          gridTemplateColumns: 'minmax(0, 1.414fr) minmax(0, 1fr)',
        },
      },
      'silver-start': {
        gridTemplateColumns: 'minmax(0, 1.414fr) minmax(0, 1fr)',
      },
      'silver-end': {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.414fr)',
      },
      'golden-left': {
        gridTemplateColumns: 'minmax(0, 1.618fr) minmax(0, 1fr)',
        '&:dir(rtl)': {
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.618fr)',
        },
      },
      'golden-right': {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.618fr)',
        '&:dir(rtl)': {
          gridTemplateColumns: 'minmax(0, 1.618fr) minmax(0, 1fr)',
        },
      },
      'golden-start': {
        gridTemplateColumns: 'minmax(0, 1.618fr) minmax(0, 1fr)',
      },
      'golden-end': {
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.618fr)',
      },
      'equal-2': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
      'equal-3': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
    },
  },
});
