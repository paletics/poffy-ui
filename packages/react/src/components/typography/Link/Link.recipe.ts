import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Link component with Panda CSS recipe variants.
 */
export const linkRecipe = defineRecipe({
  className: 'link',
  description: 'Styled anchor component with color and decoration variants',
  base: {
    cursor: 'pointer',
    textDecoration: 'none',
    transitionProperty: 'color, opacity',
    transitionDuration: '{durations.fast}',
    transitionTimingFunction: '{easings.default}',
    _focusVisible: {
      outline: '2px solid',
      outlineColor: '{colors.brand.main}',
      outlineOffset: '2px',
      borderRadius: '{radii.sm}',
    },
  },
  variants: {
    variant: {
      underline: {
        textDecoration: 'underline',
        textDecorationThickness: '1px',
        textUnderlineOffset: '3px',
        _hover: { opacity: 0.75 },
      },
      hover: {
        _hover: { textDecoration: 'underline', textUnderlineOffset: '3px' },
      },
      plain: {
        _hover: { opacity: 0.7 },
      },
    },
    colorScheme: {
      brand: { color: '{colors.brand.main}' },
      neutral: { color: 'inherit' },
      danger: { color: '{colors.variants.danger.main}' },
      success: { color: '{colors.variants.success.main}' },
    },
  },
  defaultVariants: {
    variant: 'hover',
    colorScheme: 'brand',
  },
});
