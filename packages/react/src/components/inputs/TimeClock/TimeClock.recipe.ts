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
      width: '100%',
      maxWidth: 'max-content',
      minWidth: 0,
      '&[data-disabled]': {
        opacity: 0.6,
        pointerEvents: 'none',
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
      gap: '{spacing.xs}',
      containerType: 'inline-size',
      containerName: 'time-clock-header',
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
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
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
      boxSizing: 'border-box',
      minWidth: 0,
      maxWidth: '100%',
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      borderRadius: '{radii.md}',
      overflow: 'hidden',
      bg: '{colors.brand.surface}',
      '@container time-clock-header (max-width: 8rem)': {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        width: '100%',
      },
      '@container time-clock-header (max-width: 3rem)': {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
    },
    meridiemButton: {
      boxSizing: 'border-box',
      minWidth: 0,
      maxWidth: '100%',
      minHeight: '{sizes.control.minimumTarget}',
      height: '{sizes.silver.2}',
      maxHeight: '{sizes.silver.2}',
      px: '{spacing.sm}',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'center',
      color: '{colors.text.secondary}',
      fontWeight: 'semibold',
      cursor: 'pointer',
      transition: 'all {durations.fast}',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
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
      '@container time-clock-header (max-width: 8rem)': {
        width: '100%',
        px: '{spacing.xs}',
      },
    },
    dial: {
      '--time-clock-radius':
        'calc(var(--time-clock-size) / 2 - var(--time-clock-option-size) / 2 - {spacing.sm})',
      '--time-clock-inner-radius': 'calc(var(--time-clock-radius) * 0.62)',
      '--time-clock-hand-radius': 'var(--time-clock-radius)',
      position: 'relative',
      w: 'var(--time-clock-size)',
      h: 'var(--time-clock-size)',
      flexShrink: 0,
      borderRadius: '{radii.full}',
      bg: '{colors.brand.surface}',
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      boxShadow: '{shadows.sm}',
      '&[data-selected-ring="inner"]': {
        '--time-clock-hand-radius': 'var(--time-clock-inner-radius)',
      },
    },
    hand: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      w: '2px',
      h: 'var(--time-clock-hand-radius)',
      bg: '{colors.brand.main}',
      transformOrigin: '50% 0',
      transform:
        'rotate(var(--time-clock-selected-angle)) translateY(calc(var(--time-clock-hand-radius) * -1))',
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
      '--time-clock-option-radius': 'var(--time-clock-radius)',
      transform:
        'translate(-50%, -50%) rotate(var(--time-clock-angle)) translateY(calc(var(--time-clock-option-radius) * -1)) rotate(calc(-1 * var(--time-clock-angle)))',
      transition:
        'background-color {durations.fast}, color {durations.fast}, box-shadow {durations.fast}',
      _motionSubtle: {
        transition:
          'background-color {durations.ultraFast}, color {durations.ultraFast}, box-shadow {durations.ultraFast}',
      },
      _motionPop: {
        transition:
          'background-color {durations.standard}, color {durations.standard}, box-shadow {durations.standard}',
      },
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
      '&[data-preview]': {
        bg: '{colors.brand.tint}',
        boxShadow: 'inset 0 0 0 2px {colors.brand.main}',
      },
      '&[data-ring="inner"]': {
        '--time-clock-option-radius': 'var(--time-clock-inner-radius)',
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
          '--time-clock-option-size': '{sizes.control.minimumTarget}',
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
