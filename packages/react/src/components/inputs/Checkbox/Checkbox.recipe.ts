import { defineSlotRecipe } from '@pandacss/dev';
import {
  hiddenInputStyles,
  labelStyles,
  peerFocusWithRing,
  selectionBaseStyles,
} from '../selection.shared';

/**
 * Styles the Checkbox component slots with Panda CSS recipe variants.
 */
export const checkboxRecipe = defineSlotRecipe({
  className: 'checkbox',
  description: 'Accessible checkbox styling for root, control, label, input, and icon slots',
  slots: ['root', 'control', 'label', 'input', 'icon'],

  base: {
    root: {
      ...selectionBaseStyles,
      gap: 'md',
      minHeight: '{sizes.root.2}',
      py: '{spacing.2xs}',
    },
    input: hiddenInputStyles,
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderWidth: '2px',
      borderColor: 'var(--poffy-chk-border, {colors.slate.300})',
      bg: 'brand.surface',
      borderRadius: '{radii.sm}',
      transitionDuration: '{durations.fast}',
      transitionProperty: 'background-color, border-color, box-shadow, transform, color',

      _hover: {
        borderColor: 'brand.border',
        bg: 'brand.hover',
        color: 'brand.main',
      },
      '.group:hover &': {
        borderColor: 'brand.main',
        bg: 'brand.hover',
      },

      _peerFocusVisible: {
        ...peerFocusWithRing._peerFocusVisible,
        boxShadow: '0 0 0 4px {colors.cyan.200}',
      },
      _peerChecked: {
        bg: 'var(--poffy-chk-main, {colors.brand.main})',
        borderColor: 'var(--poffy-chk-main, {colors.brand.main})',
        color: 'white',

        _hover: {
          bg: 'brand.hover',
          color: 'white',
        },
      },
      _peerIndeterminate: {
        bg: 'var(--poffy-chk-main, {colors.brand.main})',
        borderColor: 'var(--poffy-chk-main, {colors.brand.main})',
        color: 'white',
      },
      _peerDisabled: {
        borderColor: 'slate.200',
        bg: 'slate.100',
        color: 'slate.400',
      },
    },
    icon: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '& > span': {
        width: '75%',
        height: '75%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      '& svg': {
        width: '100%',
        height: '100%',
      },
    },
    label: labelStyles,
  },

  defaultVariants: {
    size: 'md',
    intent: 'primary',
  },

  variants: {
    size: {
      sm: {
        control: { w: '{sizes.silver.1}', h: '{sizes.silver.1}' },
        label: { fontSize: 'sm' },
      },
      md: {
        control: { w: '{sizes.root.1}', h: '{sizes.root.1}' },
        label: { fontSize: 'md' },
      },
      lg: {
        control: { w: '{sizes.silver.2}', h: '{sizes.silver.2}' },
        label: { fontSize: 'lg' },
      },
    },
    intent: {
      primary: {
        control: { '--poffy-chk-main': 'var(--poffy-colors-variants-primary-main)' },
      },
      secondary: {
        control: { '--poffy-chk-main': 'var(--poffy-colors-variants-secondary-main)' },
      },
      success: {
        control: { '--poffy-chk-main': 'var(--poffy-colors-variants-success-main)' },
      },
      danger: {
        control: { '--poffy-chk-main': 'var(--poffy-colors-variants-danger-main)' },
      },
    },
    error: {
      true: {
        control: {
          borderColor: '{colors.variants.danger.main}',
          '--poffy-chk-main': 'var(--poffy-colors-variants-danger-main)',
          _hover: {
            borderColor: '{colors.variants.danger.main}',
            bg: '{colors.variants.danger.hover}',
            color: '{colors.variants.danger.contrast}',
          },
          '.group:hover &': {
            borderColor: '{colors.variants.danger.main}',
            bg: '{colors.variants.danger.hover}',
          },
          _peerChecked: {
            _hover: {
              borderColor: '{colors.variants.danger.main}',
              bg: '{colors.variants.danger.hover}',
              color: '{colors.variants.danger.contrast}',
            },
          },
          _peerIndeterminate: {
            _hover: {
              borderColor: '{colors.variants.danger.main}',
              bg: '{colors.variants.danger.hover}',
              color: '{colors.variants.danger.contrast}',
            },
          },
        },
        label: { color: '{colors.variants.danger.main}' },
      },
    },
  },
});
