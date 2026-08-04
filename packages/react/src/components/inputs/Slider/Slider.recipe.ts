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
      minWidth: 0,
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '{spacing.sm}',
      position: 'relative',
    },
    control: {
      '--slider-track-size': '{spacing.sm}',
      appearance: 'none',
      flex: '1 1 {sizes.sm}',
      width: 'auto',
      minWidth: 0,
      minHeight: '{sizes.control.minimumTarget}',
      height: '{sizes.control.minimumTarget}',
      bg: 'transparent',
      color: 'var(--poffy-slider-main, {colors.brand.main})',
      outline: 'none',
      cursor: 'pointer',
      borderWidth: '0',
      p: '0',

      '&::-webkit-slider-runnable-track': {
        height: 'var(--slider-track-size)',
        bg: 'brand.surface',
        borderRadius: '{radii.full}',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'brand.border',
      },

      '&::-moz-range-track': {
        height: 'var(--slider-track-size)',
        bg: 'brand.surface',
        borderRadius: '{radii.full}',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'brand.border',
      },

      '&::-webkit-slider-thumb': {
        appearance: 'none',
        width: '{sizes.control.minimumTarget}',
        height: '{sizes.control.minimumTarget}',
        marginBlockStart: 'calc((var(--slider-track-size) - {sizes.control.minimumTarget}) / 2)',
        borderRadius: '{radii.full}',
        bg: 'currentColor',
        cursor: 'pointer',
        transition: 'background .15s ease-in-out',
        _motionSubtle: { transition: 'background {durations.ultraFast} {easings.soft}' },
        _motionPop: { transition: 'background {durations.standard} {easings.bounce}' },
        boxShadow: '{shadows.sm}',
      },

      '&::-moz-range-thumb': {
        width: '{sizes.control.minimumTarget}',
        height: '{sizes.control.minimumTarget}',
        border: 0,
        borderRadius: '{radii.full}',
        bg: 'currentColor',
        cursor: 'pointer',
        transition: 'background .15s ease-in-out',
        _motionSubtle: { transition: 'background {durations.ultraFast} {easings.soft}' },
        _motionPop: { transition: 'background {durations.standard} {easings.bounce}' },
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
      minWidth: 0,
      maxWidth: '100%',
      overflowWrap: 'anywhere',
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
        control: { '--slider-track-size': '{spacing.xs}' },
      },
      md: {
        control: { '--slider-track-size': '{spacing.sm}' },
      },
      lg: {
        control: { '--slider-track-size': '{spacing.md}' },
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
