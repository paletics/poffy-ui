import { defineSlotRecipe } from '@pandacss/dev';
import { inputVisualVariants } from '../shared/input.shared';

/**
 * Styles the OTP Input component slots with Panda CSS recipe variants.
 */
export const otpInputRecipe = defineSlotRecipe({
  className: 'otp-input',
  description: 'OTP input styling for root and segmented input slots',
  slots: ['root', 'input'],
  base: {
    root: {
      display: 'flex',
      gap: '{spacing.xs}',
      alignItems: 'center',
      justifyContent: 'safe center',
      maxWidth: '100%',
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
      scrollbarWidth: 'thin',
      scrollPaddingInline: '{spacing.xs}',
      px: '{spacing.2xs}',
      // `overflow-x: auto` also establishes a block-axis clipping boundary.
      // Reserve the shared focus-ring width so segment rings remain fully visible.
      py: '{focusRing.width}',
      scrollPaddingBlock: '{focusRing.width}',
    },
    input: {
      width: '{sizes.root.2}',
      height: '{sizes.root.2}',
      flexShrink: 0,
      textAlign: 'center',
      fontSize: 'lg',
      fontWeight: 'bold',
      borderRadius: '{radii.md}',
      borderWidth: '1px',
      borderColor: 'brand.border',
      bg: 'brand.surface',
      color: 'text.primary',
      outline: 'none',
      transition: 'all 0.2s',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
      _focus: {
        borderColor: 'brand.main',
        boxShadow: '0 0 0 1px {colors.brand.main}',
        zIndex: 1,
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  },
  defaultVariants: {
    appearance: 'outline',
    size: 'md',
  },
  variants: {
    appearance: {
      outline: {
        input: inputVisualVariants.outline,
      },
      soft: {
        input: inputVisualVariants.filled,
      },
    },
    size: {
      sm: {
        root: { gap: '{spacing.sm}' },
        input: { width: '{sizes.silver.2}', height: '{sizes.silver.2}', fontSize: 'md' },
      },
      md: {
        root: { gap: '{spacing.md}' },
        input: { width: '{sizes.root.2}', height: '{sizes.root.2}', fontSize: 'lg' },
      },
      lg: {
        root: { gap: '{spacing.base}' },
        input: { width: '{sizes.silver.3}', height: '{sizes.silver.3}', fontSize: 'xl' },
      },
    },
  },
});
