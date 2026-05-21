import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Simple Grid component with Panda CSS recipe variants.
 */
export const simpleGridRecipe = defineRecipe({
  className: 'simple-grid',
  description: 'Simple grid styling for responsive equal-width column layouts',
  base: {
    display: 'grid',
    gridTemplateColumns: 'var(--grid-columns)',
  },
  variants: {
    columns: {
      1: { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' },
      2: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
      3: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
      4: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
      5: { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
      6: { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
      7: { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
      8: { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
      9: { gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' },
      10: { gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' },
      11: { gridTemplateColumns: 'repeat(11, minmax(0, 1fr))' },
      12: { gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' },
      auto: { gridTemplateColumns: 'repeat(auto-fit, minmax(var(--min-child-width, 20px), 1fr))' },
    },
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
  },
  defaultVariants: {
    gap: 'md',
  },
});
