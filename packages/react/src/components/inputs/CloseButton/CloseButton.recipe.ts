import { defineRecipe } from '@pandacss/dev';
import { iconButtonBaseStyles } from '../icon-button.shared';

/**
 * Styles the Close Button component with Panda CSS recipe variants.
 */
export const closeButtonRecipe = defineRecipe({
  className: 'close-button',
  description: 'Close button styling for compact dismiss actions',

  base: {
    ...iconButtonBaseStyles,
    '& svg': {
      width: '1em',
      height: '1em',
      strokeWidth: '{strokeWidths.default}',
    },
  },

  variants: {
    size: {
      sm: {
        width: '{spacing.lg}',
        height: '{spacing.lg}',
        fontSize: 'md',
        p: '{spacing.xs}',
      },
      md: {
        width: '{spacing.xl}',
        height: '{spacing.xl}',
        fontSize: 'lg',
        p: '{spacing.sm}',
      },
      lg: {
        width: '{spacing.2xl}',
        height: '{spacing.2xl}',
        fontSize: 'xl',
        p: '{spacing.md}',
      },
    },
    appearance: {
      ghost: {
        bg: 'transparent',
        color: 'text.secondary',
        border: '1px solid transparent',
        _hover: {
          bg: 'brand.surface',
          color: 'text.primary',
        },
      },
      soft: {
        bg: 'brand.surface',
        color: 'text.primary',
        border: '1px solid',
        borderColor: 'brand.surface',
        _hover: {
          bg: 'brand.tint',
          borderColor: 'brand.border',
        },
      },
      outline: {
        bg: 'transparent',
        color: 'text.secondary',
        border: '1px solid',
        borderColor: 'layout.divider',
        _hover: {
          bg: 'brand.surface',
          color: 'text.primary',
          borderColor: 'brand.border',
        },
      },
    },
    shape: {
      rounded: {
        borderRadius: '{radii.md}',
      },
      square: {
        borderRadius: '{radii.none}',
      },
    },
  },

  defaultVariants: {
    size: 'md',
    appearance: 'ghost',
    shape: 'rounded',
  },
});
