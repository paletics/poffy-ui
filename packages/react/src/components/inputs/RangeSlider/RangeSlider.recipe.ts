import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the RangeSlider component slots.
 */
export const rangeSliderRecipe = defineSlotRecipe({
  className: 'range-slider',
  description: 'Two-thumb range slider with track, selected range, and custom thumbs',
  slots: ['root', 'label', 'track', 'range', 'thumb', 'hiddenInput'],
  base: {
    root: {
      '--range-slider-focus-ring-width': '{borderWidths.strong}',
      '--range-slider-thumb-size': 'max({sizes.root.1}, {sizes.control.minimumTarget})',
      width: '100%',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.sm}',
      color: 'var(--poffy-range-slider-main, {colors.brand.main})',
    },
    label: {
      minWidth: 0,
      fontSize: 'sm',
      color: 'text.primary',
      overflowWrap: 'anywhere',
    },
    track: {
      position: 'relative',
      width: 'auto',
      marginInline:
        'calc(var(--range-slider-thumb-size) / 2 + var(--range-slider-focus-ring-width))',
      height: '{spacing.xl}',
      touchAction: 'none',
      '&::before': {
        content: '""',
        position: 'absolute',
        insetInline: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        height: '{spacing.sm}',
        borderRadius: '{radii.full}',
        borderWidth: '1px',
        borderColor: 'brand.border',
        bg: 'brand.surface',
      },
    },
    range: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '{spacing.sm}',
      borderRadius: '{radii.full}',
      bg: 'currentColor',
      pointerEvents: 'none',
    },
    thumb: {
      position: 'absolute',
      top: '50%',
      width: 'var(--range-slider-thumb-size)',
      height: 'var(--range-slider-thumb-size)',
      transform: 'translate(-50%, -50%)',
      '&[data-direction="rtl"]': {
        transform: 'translate(50%, -50%)',
      },
      borderRadius: '{radii.full}',
      borderWidth: '0',
      bg: 'currentColor',
      boxShadow: '{shadows.sm}',
      cursor: 'grab',
      touchAction: 'none',
      _focusVisible: {
        outline: 'none',
        boxShadow: '0 0 0 var(--range-slider-focus-ring-width) {colors.brand.main}',
      },
      _active: {
        cursor: 'grabbing',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    hiddenInput: {
      display: 'none',
    },
  },
  defaultVariants: {
    size: 'md',
    intent: 'primary',
  },
  variants: {
    size: {
      sm: {
        root: {
          '--range-slider-thumb-size': 'max({sizes.silver.2}, {sizes.control.minimumTarget})',
        },
        track: { height: '{spacing.lg}' },
        range: { height: '{spacing.xs}' },
      },
      md: {},
      lg: {
        root: {
          '--range-slider-thumb-size': 'max({sizes.root.2}, {sizes.control.minimumTarget})',
        },
        track: { height: '{spacing.2xl}' },
        range: { height: '{spacing.md}' },
      },
    },
    intent: {
      primary: {
        root: { '--poffy-range-slider-main': 'var(--poffy-colors-variants-primary-main)' },
      },
      secondary: {
        root: { '--poffy-range-slider-main': 'var(--poffy-colors-variants-secondary-main)' },
      },
      info: {
        root: { '--poffy-range-slider-main': 'var(--poffy-colors-variants-info-main)' },
      },
      success: {
        root: { '--poffy-range-slider-main': 'var(--poffy-colors-variants-success-main)' },
      },
      warning: {
        root: { '--poffy-range-slider-main': 'var(--poffy-colors-variants-warning-main)' },
      },
      danger: {
        root: { '--poffy-range-slider-main': 'var(--poffy-colors-variants-danger-main)' },
      },
    },
    error: {
      true: {
        root: { '--poffy-range-slider-main': 'var(--poffy-colors-variants-danger-main)' },
      },
    },
  },
});
