import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Time Clock component slots with Panda CSS recipe variants.
 */
export const timeClockRecipe = defineSlotRecipe({
  className: 'time-clock',
  description: 'Interactive clock-face styling for time input controls',
  slots: [
    'root',
    'header',
    'fieldButton',
    'separator',
    'meridiemGroup',
    'meridiemButton',
    'dial',
    'hand',
    'option',
    'center',
  ],
  base: {
    root: {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: '{spacing.md}',
      color: '{colors.text.primary}',
      '&[data-disabled]': {
        opacity: 0.6,
        pointerEvents: 'none',
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '{spacing.xs}',
    },
    fieldButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minW: '{sizes.silver.2}',
      h: '{sizes.silver.2}',
      px: '{spacing.sm}',
      borderRadius: '{radii.md}',
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      bg: '{colors.brand.surface}',
      color: '{colors.text.primary}',
      fontWeight: 'semibold',
      cursor: 'pointer',
      transition: 'all {durations.fast}',
      _hover: {
        bg: '{colors.brand.tint}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '2px',
      },
      '&[data-active]': {
        bg: '{colors.brand.main}',
        borderColor: '{colors.brand.main}',
        color: '{colors.brand.contrast}',
      },
      _disabled: {
        cursor: 'not-allowed',
      },
    },
    separator: {
      color: '{colors.text.secondary}',
      fontWeight: 'bold',
    },
    meridiemGroup: {
      display: 'inline-flex',
      alignItems: 'center',
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      borderRadius: '{radii.md}',
      overflow: 'hidden',
      bg: '{colors.brand.surface}',
    },
    meridiemButton: {
      px: '{spacing.sm}',
      h: '{sizes.silver.2}',
      color: '{colors.text.secondary}',
      fontWeight: 'semibold',
      cursor: 'pointer',
      transition: 'all {durations.fast}',
      _hover: {
        bg: '{colors.brand.tint}',
        color: '{colors.text.primary}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
      },
      '&[data-selected]': {
        bg: '{colors.brand.main}',
        color: '{colors.brand.contrast}',
      },
      _disabled: {
        cursor: 'not-allowed',
      },
    },
    dial: {
      '--time-clock-radius':
        'calc(var(--time-clock-size) / 2 - var(--time-clock-option-size) / 2 - {spacing.sm})',
      position: 'relative',
      w: 'var(--time-clock-size)',
      h: 'var(--time-clock-size)',
      borderRadius: '{radii.full}',
      bg: '{colors.brand.surface}',
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      boxShadow: '{shadows.sm}',
    },
    hand: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      w: '2px',
      h: 'var(--time-clock-radius)',
      bg: '{colors.brand.main}',
      transformOrigin: '50% 0',
      transform:
        'rotate(var(--time-clock-selected-angle)) translateY(calc(var(--time-clock-radius) * -1))',
      pointerEvents: 'none',
      opacity: 0.45,
    },
    option: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      w: 'var(--time-clock-option-size)',
      h: 'var(--time-clock-option-size)',
      borderRadius: '{radii.full}',
      color: '{colors.text.primary}',
      fontWeight: 'semibold',
      cursor: 'pointer',
      transform:
        'translate(-50%, -50%) rotate(var(--time-clock-angle)) translateY(calc(var(--time-clock-radius) * -1)) rotate(calc(-1 * var(--time-clock-angle)))',
      transition:
        'background-color {durations.fast}, color {durations.fast}, box-shadow {durations.fast}',
      _hover: {
        bg: '{colors.brand.tint}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '2px',
      },
      '&[data-selected]': {
        bg: '{colors.brand.main}',
        color: '{colors.brand.contrast}',
      },
      _disabled: {
        cursor: 'not-allowed',
      },
    },
    center: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      w: '{spacing.sm}',
      h: '{spacing.sm}',
      borderRadius: '{radii.full}',
      bg: '{colors.brand.main}',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          '--time-clock-size': '13rem',
          '--time-clock-option-size': '{sizes.root.1}',
          fontSize: 'sm',
        },
      },
      md: {
        root: {
          '--time-clock-size': '16rem',
          '--time-clock-option-size': '{sizes.silver.2}',
          fontSize: 'md',
        },
      },
      lg: {
        root: {
          '--time-clock-size': '19rem',
          '--time-clock-option-size': '{sizes.root.2}',
          fontSize: 'lg',
        },
      },
    },
    variant: {
      outline: {},
      filled: {
        fieldButton: {
          bg: '{colors.brand.tint}',
        },
        dial: {
          bg: '{colors.brand.tint}',
        },
      },
      flushed: {
        fieldButton: {
          borderTopWidth: '0',
          borderLeftWidth: '0',
          borderRightWidth: '0',
          borderRadius: '{radii.none}',
          bg: 'transparent',
        },
        dial: {
          borderLeftWidth: '0',
          borderRightWidth: '0',
          borderRadius: '{radii.md}',
          boxShadow: 'none',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
});
