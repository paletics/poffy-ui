import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Text component with Panda CSS recipe variants.
 */
export const textRecipe = defineRecipe({
  className: 'text',
  description: 'Text styling for body copy, captions, and muted typography variants',
  base: {
    margin: 0,
  },
  variants: {
    variant: {
      body1: {
        fontSize: 'md',
        fontWeight: 'normal',
        lineHeight: 'normal',
      },
      body2: {
        fontSize: 'sm',
        fontWeight: 'normal',
        lineHeight: 'normal',
      },
      caption: {
        fontSize: 'xs',
        fontWeight: 'normal',
        lineHeight: 'normal',
      },
    },
    weight: {
      normal: { fontWeight: 'normal' },
      medium: { fontWeight: 'medium' },
      semibold: { fontWeight: 'semibold' },
      bold: { fontWeight: 'bold' },
    },
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
      justify: { textAlign: 'justify' },
    },
    transform: {
      none: { textTransform: 'none' },
      uppercase: { textTransform: 'uppercase' },
      lowercase: { textTransform: 'lowercase' },
      capitalize: { textTransform: 'capitalize' },
    },
  },
  defaultVariants: {
    variant: 'body1',
    weight: 'normal',
    align: 'left',
    transform: 'none',
  },
});
