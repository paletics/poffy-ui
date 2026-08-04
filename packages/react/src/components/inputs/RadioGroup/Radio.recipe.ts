import { defineSlotRecipe } from '@pandacss/dev';
import {
  hiddenInputStyles,
  labelStyles,
  peerFocusWithRing,
  selectionBaseStyles,
} from '../selection.shared';

/**
 * Styles the Radio component slots with Panda CSS recipe variants.
 */
export const radioRecipe = defineSlotRecipe({
  className: 'radio',
  description: 'Radio option styling for root, control, label, and hidden input slots',
  slots: ['root', 'control', 'label', 'input'],
  base: {
    root: {
      ...selectionBaseStyles,
      gap: 'md',
      minWidth: 0,
      maxWidth: '100%',
      minBlockSize: '{sizes.control.minimumTarget}',
    },
    input: hiddenInputStyles,
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderWidth: '1px',
      borderColor: '{colors.brand.border}',
      bg: '{colors.brand.surface}',
      color: 'var(--poffy-radio-main, {colors.brand.main})',
      borderRadius: '{radii.full}',
      transitionDuration: '{durations.fast}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      ...peerFocusWithRing,
      _peerChecked: {
        borderColor: 'var(--poffy-radio-main, {colors.brand.main})',
        color: 'var(--poffy-radio-main, {colors.brand.main})',
      },
      _peerDisabled: {
        borderColor: '{colors.slate.300}',
        bg: '{colors.slate.100}',
        color: '{colors.slate.400}',
      },
      position: 'relative',
      _before: {
        content: '""',
        display: 'block',
        width: '50%',
        height: '50%',
        borderRadius: '{radii.full}',
        bg: 'currentColor',
        transform: 'scale(0)',
        transition: 'transform 0.2s',
        _motionSubtle: { transition: 'transform {durations.ultraFast} {easings.soft}' },
        _motionPop: { transition: 'transform {durations.standard} {easings.bounce}' },
      },
      '.peer:checked ~ &::before': {
        transform: 'scale(1)',
      },
      '&[data-animated="true"]::before': {
        display: 'none',
      },
    },
    label: {
      ...labelStyles,
      minWidth: 0,
      overflowWrap: 'anywhere',
    },
  },
  defaultVariants: {
    size: 'md',
    intent: 'primary',
  },
  variants: {
    size: {
      sm: {
        root: { minBlockSize: '{sizes.control.minimumTarget}' },
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
        control: { '--poffy-radio-main': 'var(--poffy-colors-variants-primary-main)' },
      },
      secondary: {
        control: { '--poffy-radio-main': 'var(--poffy-colors-variants-secondary-main)' },
      },
      success: {
        control: { '--poffy-radio-main': 'var(--poffy-colors-variants-success-main)' },
      },
      danger: {
        control: { '--poffy-radio-main': 'var(--poffy-colors-variants-danger-main)' },
      },
    },
    error: {
      true: {
        control: { borderColor: '{colors.variants.danger.main}' },
        label: { color: '{colors.variants.danger.main}' },
      },
    },
  },
});
