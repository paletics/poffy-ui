import { defineSlotRecipe } from '@pandacss/dev';
import {
  inputBaseStyles,
  inputEndDecoratorIconSizes,
  inputEndDecoratorOffsets,
  inputEndDecoratorPadding,
  inputEndDecoratorStyles,
  inputErrorState,
  inputShellRootStyles,
  inputSizeVariants,
  inputVisualVariants,
} from '../shared/input.shared';
import { createNeoBorderColor, createNeoShadowColor } from '../../../theme/neoStyles';

/**
 * Styles the Select component slots with Panda CSS recipe variants.
 */
export const selectRecipe = defineSlotRecipe({
  className: 'select',
  description: 'Native select styling for field, trigger, and indicator affordances',
  slots: ['root', 'field', 'icon'],
  base: {
    root: inputShellRootStyles,
    field: {
      ...inputBaseStyles,
      display: 'block',
      cursor: 'pointer',
      paddingRight: inputEndDecoratorPadding.md,
    },
    icon: {
      ...inputEndDecoratorStyles,
      right: inputEndDecoratorOffsets.md,
      top: '50%',
      transform: 'translateY(-50%)',
      transition: 'transform 160ms ease',
      pointerEvents: 'none',
      fontSize: inputEndDecoratorIconSizes.md,
      '& svg': {
        width: '1em',
        height: '1em',
        flexShrink: 0,
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
  variants: {
    variant: {
      outline: {
        field: inputVisualVariants.outline,
      },
      filled: {
        field: inputVisualVariants.filled,
      },
      neo: {
        field: {
          borderWidth: '{borderWidths.strong}',
          borderColor: createNeoBorderColor('var(--poffy-colors-brand-main)'),
          bg: 'layout.surface',
          boxShadow: `{spacing.sm} {spacing.sm} 0px ${createNeoShadowColor(
            'var(--poffy-colors-brand-main)',
          )}`,
          _focusVisible: {
            outline: '2px solid',
            outlineColor: '{colors.brand.main}',
            outlineOffset: '2px',
          },
        },
      },
      flushed: {
        field: {
          ...inputVisualVariants.flushed,
          paddingRight: inputEndDecoratorPadding.md,
        },
      },
    },
    size: {
      sm: {
        field: {
          ...inputSizeVariants.sm,
          paddingRight: inputEndDecoratorPadding.sm,
        },
        icon: { fontSize: inputEndDecoratorIconSizes.sm, right: inputEndDecoratorOffsets.sm },
      },
      md: {
        field: {
          ...inputSizeVariants.md,
          paddingRight: inputEndDecoratorPadding.md,
        },
        icon: { fontSize: inputEndDecoratorIconSizes.md, right: inputEndDecoratorOffsets.md },
      },
      lg: {
        field: {
          ...inputSizeVariants.lg,
          paddingRight: inputEndDecoratorPadding.lg,
        },
        icon: { fontSize: inputEndDecoratorIconSizes.lg, right: inputEndDecoratorOffsets.lg },
      },
    },
    error: {
      true: {
        field: inputErrorState.true,
      },
    },
  },
});
