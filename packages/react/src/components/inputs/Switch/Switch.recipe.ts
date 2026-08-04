import { defineSlotRecipe } from '@pandacss/dev';
import {
  hiddenInputStyles,
  labelStyles,
  peerFocusWithRing,
  selectionBaseStyles,
} from '../selection.shared';

/**
 * Styles the Switch component slots with Panda CSS recipe variants.
 */
export const switchRecipe = defineSlotRecipe({
  className: 'switch',
  description: 'Switch styling for root, track, thumb, label, and input slots',
  slots: ['root', 'control', 'thumb', 'label', 'input'],
  base: {
    root: {
      ...selectionBaseStyles,
      gap: 'md',
      '--switch-border-width': '2px',
      '--switch-travel-distance': 'var(--switch-thumb-size)',
      '--switch-checked-translate': 'var(--switch-travel-distance)',
      '--switch-active-translate':
        'calc(var(--switch-travel-distance) - (var(--switch-thumb-size) * 0.3))',
      '&:dir(rtl)': {
        '--switch-checked-translate': 'calc(0px - var(--switch-travel-distance))',
        '--switch-active-translate':
          'calc(0px - var(--switch-travel-distance) + (var(--switch-thumb-size) * 0.3))',
      },
    },
    input: hiddenInputStyles,
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      boxSizing: 'content-box',
      width: 'calc(var(--switch-thumb-size) + var(--switch-travel-distance))',
      height: 'var(--switch-thumb-size)',

      p: 'var(--switch-padding)',
      borderWidth: 'var(--switch-border-width)',
      borderColor: 'brand.border',
      borderRadius: '{radii.full}',
      position: 'relative',
      bg: 'brand.surface',

      transition: 'background-color 0.3s, border-color 0.3s',
      _motionSubtle: {
        transition: 'background-color {durations.fast}, border-color {durations.fast}',
      },
      _motionPop: {
        transition: 'background-color {durations.complex}, border-color {durations.complex}',
      },
      cursor: 'inherit',
      ...peerFocusWithRing,
      '--thumb-w': 'var(--switch-thumb-size)',
      '--thumb-x': '0px',
      _peerChecked: {
        bg: 'var(--switch-main, {colors.brand.main})',
        borderColor: 'var(--switch-main, {colors.brand.main})',
        '& > span': {
          transform: 'translateX(var(--switch-checked-translate)) !important',
        },
      },
      _peerActive: {
        '& > span': {
          width: 'calc(var(--switch-thumb-size) * 1.3) !important',
        },
      },
      '.peer:checked:active ~ & > span, .peer:is([data-state="checked"]):active ~ & > span': {
        width: 'calc(var(--switch-thumb-size) * 1.3) !important',
        transform: 'translateX(var(--switch-active-translate)) !important',
      },
      _dark: {
        bg: 'slate.800',
        _peerChecked: { bg: 'var(--switch-main, {colors.brand.main})' },
      },
    },
    thumb: {
      display: 'block',
      bg: 'white',
      borderRadius: '{radii.full}',
      borderWidth: 'var(--switch-border-width)',
      borderColor: 'brand.border',
      boxShadow: '{shadows.sm}',

      width: 'var(--thumb-w)',
      height: 'var(--switch-thumb-size)',
      transform: 'translateX(var(--thumb-x))',

      transitionProperty: 'transform, width, background-color',
      transitionDuration: '{durations.standard}',
      transitionTimingFunction: '{easings.bounce}',
      _motionSubtle: {
        transitionDuration: '{durations.fast}',
        transitionTimingFunction: '{easings.soft}',
      },
      _motionPop: {
        transitionDuration: '{durations.complex}',
        transitionTimingFunction: '{easings.bounce}',
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
        root: {
          '--switch-thumb-size': '{sizes.silver.1}',
          '--switch-padding': '{spacing.2xs}',
        },
        label: { fontSize: 'sm' },
      },
      md: {
        root: {
          '--switch-thumb-size': '{sizes.root.1}',
          '--switch-padding': 'calc(var(--switch-thumb-size) * 0.125)',
        },
        label: { fontSize: 'md' },
      },
      lg: {
        root: {
          '--switch-thumb-size': '{sizes.silver.2}',
          '--switch-padding': '{spacing.2xs}',
        },
        label: { fontSize: 'lg' },
      },
    },
    intent: {
      primary: {
        control: { '--switch-main': 'var(--poffy-colors-variants-primary-main)' },
      },
      secondary: {
        control: { '--switch-main': 'var(--poffy-colors-variants-secondary-main)' },
      },
      success: {
        control: { '--switch-main': 'var(--poffy-colors-variants-success-main)' },
      },
      danger: {
        control: { '--switch-main': 'var(--poffy-colors-variants-danger-main)' },
      },
    },
  },
});
