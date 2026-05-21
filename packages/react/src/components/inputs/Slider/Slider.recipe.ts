import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Slider component slots with Panda CSS recipe variants.
 */
export const sliderRecipe = defineSlotRecipe({
  className: 'slider',
  description: 'Slider styling for root, control, label, range, thumb, and track slots',
  slots: ['root', 'control', 'label', 'range', 'thumb', 'track'],
  base: {
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      position: 'relative',
    },
    control: {
      appearance: 'none',
      width: '100%',
      height: '{spacing.sm}',
      bg: 'brand.surface',
      color: 'var(--poffy-slider-main, {colors.brand.main})',
      borderRadius: '{radii.full}',
      outline: 'none',
      cursor: 'pointer',
      borderWidth: '1px',
      borderColor: 'brand.border',

      '&::-webkit-slider-thumb': {
        appearance: 'none',
        width: '{sizes.root.1}',
        height: '{sizes.root.1}',
        borderRadius: '{radii.full}',
        bg: 'currentColor',
        cursor: 'pointer',
        transition: 'background .15s ease-in-out',
        boxShadow: '{shadows.sm}',
      },

      '&::-moz-range-thumb': {
        width: '{sizes.root.1}',
        height: '{sizes.root.1}',
        border: 0,
        borderRadius: '{radii.full}',
        bg: 'currentColor',
        cursor: 'pointer',
        transition: 'background .15s ease-in-out',
        boxShadow: '{shadows.sm}',
      },

      _focusVisible: {
        boxShadow: '0 0 0 2px {colors.brand.main}',
      },

      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
        '&::-webkit-slider-thumb': {
          cursor: 'not-allowed',
          bg: 'slate.400',
        },
        '&::-moz-range-thumb': {
          cursor: 'not-allowed',
          bg: 'slate.400',
        },
      },
    },
    label: {
      fontSize: 'sm',
      color: 'text.primary',
    },
  },
  defaultVariants: {
    size: 'md',
    intent: 'primary',
  },
  variants: {
    size: {
      sm: {
        control: { height: '{spacing.xs}' },
      },
      md: {
        control: { height: '{spacing.sm}' },
      },
      lg: {
        control: { height: '{spacing.md}' },
      },
    },
    intent: {
      primary: {
        control: { '--poffy-slider-main': 'var(--poffy-colors-variants-primary-main)' },
      },
      secondary: {
        control: { '--poffy-slider-main': 'var(--poffy-colors-variants-secondary-main)' },
      },
      info: {
        control: { '--poffy-slider-main': 'var(--poffy-colors-variants-info-main)' },
      },
      success: {
        control: { '--poffy-slider-main': 'var(--poffy-colors-variants-success-main)' },
      },
      warning: {
        control: { '--poffy-slider-main': 'var(--poffy-colors-variants-warning-main)' },
      },
      danger: {
        control: { '--poffy-slider-main': 'var(--poffy-colors-variants-danger-main)' },
      },
    },
  },
});
