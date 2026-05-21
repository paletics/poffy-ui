import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Heading component with Panda CSS recipe variants.
 */
export const headingRecipe = defineRecipe({
  className: 'heading',
  description: 'Semantic heading component with level-based typography',
  base: {
    margin: 0,
    fontFamily: '{fonts.heading}',
  },
  variants: {
    level: {
      '1': {
        fontSize: '3xl',
        fontWeight: 'bold',
        lineHeight: 'tight',
      },
      '2': {
        fontSize: '2xl',
        fontWeight: 'bold',
        lineHeight: 'snug',
      },
      '3': {
        fontSize: 'xl',
        fontWeight: 'semibold',
        lineHeight: 'snug',
      },
      '4': {
        fontSize: 'lg',
        fontWeight: 'semibold',
        lineHeight: 'normal',
      },
      '5': {
        fontSize: 'md',
        fontWeight: 'semibold',
        lineHeight: 'relaxed',
      },
      '6': {
        fontSize: 'xs',
        fontWeight: 'semibold',
        lineHeight: 'relaxed',
      },
    },
    weight: {
      normal: { fontWeight: 'normal' },
      medium: { fontWeight: 'medium' },
      semibold: { fontWeight: 'semibold' },
      bold: { fontWeight: 'bold' },
    },
  },
  defaultVariants: {
    level: '1',
  },
});
