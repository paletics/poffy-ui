import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Stack component with Panda CSS recipe variants.
 */
export const stackRecipe = defineRecipe({
  className: 'stack',
  description: 'Stack layout styling for axis, alignment, wrapping, and gap variants',
  base: {
    display: 'flex',
    minInlineSize: 0,
  },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
      'row-reverse': { flexDirection: 'row-reverse' },
      'column-reverse': { flexDirection: 'column-reverse' },
    },
    align: {
      'flex-start': { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      'flex-end': { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      'flex-start': { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      'flex-end': { justifyContent: 'flex-end' },
      'space-between': { justifyContent: 'space-between' },
      'space-around': { justifyContent: 'space-around' },
      'space-evenly': { justifyContent: 'space-evenly' },
    },
    wrap: {
      wrap: { flexWrap: 'wrap' },
      nowrap: { flexWrap: 'nowrap' },
      'wrap-reverse': { flexWrap: 'wrap-reverse' },
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
    motion: {
      none: { transition: 'none' },
      pop: {
        transitionProperty: 'all',
        transitionDuration: '{durations.fast}',
        transitionTimingFunction: '{easings.bounce}',
        _motionSubtle: {
          transitionDuration: '{durations.ultraFast}',
          transitionTimingFunction: '{easings.soft}',
        },
        _motionPop: {
          transitionDuration: '{durations.standard}',
          transitionTimingFunction: '{easings.bounce}',
        },
        _motionReduce: {
          transition: 'none',
        },
      },
    },
  },
  defaultVariants: {
    direction: 'column',
    align: 'stretch',
    justify: 'flex-start',
    gap: 'md',
    wrap: 'nowrap',
    motion: 'none',
  },
});
