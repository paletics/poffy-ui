import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Wheel Picker component slots with Panda CSS recipe variants.
 */
export const wheelPickerRecipe = defineSlotRecipe({
  className: 'wheel-picker',
  description:
    'Wheel picker styling for columns, labels, viewport, options, and selection indicator slots',
  slots: [
    'root',
    'column',
    'columnLabel',
    'viewportShell',
    'viewport',
    'option',
    'selectionIndicator',
  ],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'stretch',
      gap: '{spacing.sm}',
      color: '{colors.text.primary}',
      '&[data-disabled]': {
        opacity: 0.6,
        pointerEvents: 'none',
      },
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.xs}',
      minW: 'var(--wheel-picker-column-width)',
    },
    columnLabel: {
      color: '{colors.text.secondary}',
      fontWeight: 'medium',
      textAlign: 'center',
    },
    viewportShell: {
      position: 'relative',
      h: 'var(--wheel-picker-height)',
    },
    viewport: {
      position: 'relative',
      h: 'var(--wheel-picker-height)',
      py: 'calc((var(--wheel-picker-height) - var(--wheel-picker-option-height)) / 2)',
      overflowY: 'auto',
      overscrollBehaviorY: 'contain',
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      borderRadius: '{radii.md}',
      bg: '{colors.brand.surface}',
      boxShadow: '{shadows.sm}',
      scrollbarWidth: 'none',
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '2px',
      },
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    option: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      h: 'var(--wheel-picker-option-height)',
      px: '{spacing.md}',
      color: '{colors.text.secondary}',
      fontWeight: 'medium',
      cursor: 'pointer',
      transition:
        'background-color {durations.fast}, color {durations.fast}, opacity {durations.fast}',
      _hover: {
        bg: '{colors.brand.tint}',
        color: '{colors.text.primary}',
      },
      '&[data-selected]': {
        color: '{colors.text.primary}',
        fontWeight: 'semibold',
      },
      '&[data-disabled]': {
        color: '{colors.text.secondary}',
        cursor: 'not-allowed',
      },
    },
    selectionIndicator: {
      position: 'absolute',
      left: '{spacing.xs}',
      right: '{spacing.xs}',
      top: '50%',
      zIndex: 1,
      h: 'var(--wheel-picker-option-height)',
      borderWidth: '1px',
      borderColor: '{colors.brand.main}',
      borderRadius: '{radii.md}',
      bg: '{colors.brand.tint}',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      opacity: 0.72,
      transition:
        'background-color {durations.fast}, border-color {durations.fast}, opacity {durations.fast}',
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          '--wheel-picker-column-width': '5rem',
          '--wheel-picker-height': '7.5rem',
          '--wheel-picker-option-height': '2.5rem',
          fontSize: 'sm',
        },
        columnLabel: { fontSize: 'xs' },
      },
      md: {
        root: {
          '--wheel-picker-column-width': '6rem',
          '--wheel-picker-height': '9rem',
          '--wheel-picker-option-height': '3rem',
          fontSize: 'md',
        },
        columnLabel: { fontSize: 'sm' },
      },
      lg: {
        root: {
          '--wheel-picker-column-width': '7rem',
          '--wheel-picker-height': '10.5rem',
          '--wheel-picker-option-height': '3.5rem',
          fontSize: 'lg',
        },
        columnLabel: { fontSize: 'md' },
      },
    },
    variant: {
      outline: {},
      filled: {
        viewport: {
          bg: '{colors.brand.tint}',
        },
      },
      flushed: {
        viewport: {
          borderLeftWidth: '0',
          borderRightWidth: '0',
          borderRadius: '{radii.none}',
          boxShadow: 'none',
        },
      },
    },
    error: {
      true: {
        viewport: {
          borderColor: '{colors.variants.danger.main}',
        },
        selectionIndicator: {
          borderColor: '{colors.variants.danger.main}',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
});
