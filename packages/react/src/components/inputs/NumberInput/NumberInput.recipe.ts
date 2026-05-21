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
      position: 'relative',
    },
    field: {
      ...inputBaseStyles,
      flex: '1',
      minWidth: 0,
      borderTopRightRadius: 'none',
      borderBottomRightRadius: 'none',
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
      minWidth: '0',
      minHeight: '0',
      p: '0',
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
        },
        field: {
          height: '{sizes.silver.2}',
          fontSize: 'sm',
          px: '{spacing.md}',
          borderTopLeftRadius: 'xl',
          borderBottomLeftRadius: 'xl',
          borderTopRightRadius: 'none',
          borderBottomRightRadius: 'none',
        },
        stepperGroup: {
          borderTopRightRadius: 'xl',
          borderBottomRightRadius: 'xl',
        },
        stepperButton: {
          px: '{spacing.xs}',
          fontSize: '2xs',
        },
      },
      md: {
        root: {
          height: '{sizes.root.2}',
        },
        field: {
          height: '{sizes.root.2}',
          fontSize: 'md',
          px: '{spacing.base}',
          borderTopLeftRadius: '2xl',
          borderBottomLeftRadius: '2xl',
          borderTopRightRadius: 'none',
          borderBottomRightRadius: 'none',
        },
        stepperGroup: {
          borderTopRightRadius: '2xl',
          borderBottomRightRadius: '2xl',
        },
        stepperButton: {
          px: '{spacing.sm}',
          fontSize: 'xs',
        },
      },
      lg: {
        root: {
          height: '{sizes.silver.3}',
        },
        field: {
          height: '{sizes.silver.3}',
          fontSize: 'lg',
          px: '{spacing.lg}',
          borderTopLeftRadius: '3xl',
          borderBottomLeftRadius: '3xl',
          borderTopRightRadius: 'none',
          borderBottomRightRadius: 'none',
        },
        stepperGroup: {
          borderTopRightRadius: '3xl',
          borderBottomRightRadius: '3xl',
        },
        stepperButton: {
          px: '{spacing.md}',
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
