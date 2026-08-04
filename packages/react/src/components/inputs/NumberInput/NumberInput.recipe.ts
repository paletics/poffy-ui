import { defineSlotRecipe } from '@pandacss/dev';
import { inputBaseStyles, inputErrorState, inputVisualVariants } from '../shared/input.shared';

/**
 * Styles the Number Input component slots with Panda CSS recipe variants.
 */
export const numberInputRecipe = defineSlotRecipe({
  className: 'numberInput',
  description: 'Number input styling for field and stepper controls',
  slots: ['root', 'field', 'stepperGroup', 'stepperButton'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      containerType: 'inline-size',
      containerName: 'number-input',
      // Preserve the native field + stepper shrink-to-fit width while inline-size
      // containment provides a stable query boundary.
      containIntrinsicInlineSize: 'calc({sizes.ratio.md} + {spacing.lg})',
      minHeight: 'calc(2 * {sizes.control.minimumTarget} + 4px)',
    },
    field: {
      ...inputBaseStyles,
      flex: '1',
      minWidth: 0,
      px: 'var(--number-input-field-padding-inline)',
      borderStartEndRadius: 'none',
      borderEndEndRadius: 'none',
      minHeight: 'calc(2 * {sizes.control.minimumTarget} + 4px)',
      '@container number-input (max-width: 6.25rem)': {
        '--number-input-field-padding-inline': '0',
        // The stepper owns the shared seam at emergency widths. Removing the
        // duplicate field border leaves enough content width for a digit at 40px.
        borderInlineEndWidth: '0 !important',
      },
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        appearance: 'none',
        margin: '0',
      },
      MozAppearance: 'textfield',
    },
    stepperGroup: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      alignSelf: 'stretch',
      minHeight: 0,
      borderWidth: '2px',
      borderColor: '{colors.brand.border}',
      overflow: 'hidden',
    },
    stepperButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '1',
      flexBasis: 0,
      width: '100%',
      height: '100%',
      minInlineSize: '{sizes.control.minimumTarget}',
      minHeight: '{sizes.control.minimumTarget}',
      py: '0',
      px: 'var(--number-input-stepper-padding-inline)',
      '@container number-input (max-width: 6.25rem)': {
        '--number-input-stepper-padding-inline': '0',
        '--poffy-icon-size': '1em',
      },
      borderWidth: '0',
      outline: '0',
      appearance: 'none',
      cursor: 'pointer',
      bg: '{colors.brand.surface}',
      color: '{colors.text.secondary}',
      borderRadius: '{radii.none}',
      lineHeight: '1',
      '& svg': {
        width: '1em',
        height: '1em',
        flexShrink: 0,
      },
      '&[data-direction="up"] svg': {
        transform: 'rotate(270deg)',
      },
      '&[data-direction="down"] svg': {
        transform: 'rotate(90deg)',
      },
      '& + &': {
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: '{colors.brand.border}',
      },
      _hover: {
        bg: '{colors.brand.tint}',
        color: '{colors.text.primary}',
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      _focusVisible: {
        zIndex: 1,
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineColor: '{colors.brand.main}',
        outlineOffset: '-2px',
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          height: '{sizes.silver.2}',
          '--number-input-field-padding-inline': '{spacing.md}',
          '--number-input-stepper-padding-inline': '{spacing.xs}',
        },
        field: {
          height: '{sizes.silver.2}',
          fontSize: 'sm',
          borderStartStartRadius: 'xl',
          borderEndStartRadius: 'xl',
          borderStartEndRadius: 'none',
          borderEndEndRadius: 'none',
        },
        stepperGroup: {
          borderStartEndRadius: 'xl',
          borderEndEndRadius: 'xl',
        },
        stepperButton: {
          fontSize: '2xs',
        },
      },
      md: {
        root: {
          height: '{sizes.root.2}',
          '--number-input-field-padding-inline': '{spacing.base}',
          '--number-input-stepper-padding-inline': '{spacing.sm}',
        },
        field: {
          height: '{sizes.root.2}',
          fontSize: 'md',
          borderStartStartRadius: '2xl',
          borderEndStartRadius: '2xl',
          borderStartEndRadius: 'none',
          borderEndEndRadius: 'none',
        },
        stepperGroup: {
          borderStartEndRadius: '2xl',
          borderEndEndRadius: '2xl',
        },
        stepperButton: {
          fontSize: 'xs',
        },
      },
      lg: {
        root: {
          height: '{sizes.silver.3}',
          '--number-input-field-padding-inline': '{spacing.lg}',
          '--number-input-stepper-padding-inline': '{spacing.md}',
        },
        field: {
          height: '{sizes.silver.3}',
          fontSize: 'lg',
          borderStartStartRadius: '3xl',
          borderEndStartRadius: '3xl',
          borderStartEndRadius: 'none',
          borderEndEndRadius: 'none',
        },
        stepperGroup: {
          borderStartEndRadius: '3xl',
          borderEndEndRadius: '3xl',
        },
        stepperButton: {
          fontSize: 'sm',
        },
      },
    },
    variant: {
      outline: {
        field: inputVisualVariants.outline,
        stepperGroup: { borderColor: '{colors.brand.border}', bg: '{colors.brand.surface}' },
      },
      filled: {
        field: inputVisualVariants.filled,
        stepperGroup: { borderColor: 'transparent', bg: '{colors.brand.surface}' },
      },
      flushed: {
        field: {
          borderBottomWidth: '2px',
          borderBottomColor: '{colors.brand.border}',
          borderTopWidth: '0',
          borderLeftWidth: '0',
          borderRightWidth: '0',
          borderRadius: '{radii.none}',
          px: '0',
          bg: 'transparent',
          _focusVisible: {
            borderColor: '{colors.brand.main}',
            boxShadow: '0 2px 0 0 {colors.brand.main}',
          },
        },
        stepperGroup: {
          borderTopWidth: '0',
          borderRightWidth: '0',
          borderBottomWidth: '2px',
          borderLeftWidth: '0',
          borderBottomColor: '{colors.brand.border}',
          borderRadius: '{radii.none}',
          bg: 'transparent',
        },
      },
    },
    error: {
      true: {
        field: inputErrorState.true,
        stepperGroup: { borderColor: '{colors.variants.danger.main}' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
});
