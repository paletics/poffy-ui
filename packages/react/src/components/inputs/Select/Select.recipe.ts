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
    root: {
      ...inputShellRootStyles,
      boxSizing: 'border-box',
      minWidth: 0,
      minInlineSize: 0,
      maxWidth: '100%',
      maxInlineSize: '100%',
      containerType: 'inline-size',
      containerName: 'select-control',
      containIntrinsicInlineSize: '{sizes.ratio.md}',
    },
    field: {
      ...inputBaseStyles,
      display: 'block',
      cursor: 'pointer',
      paddingInlineEnd: inputEndDecoratorPadding.md,
      '&:not([multiple])': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    icon: {
      ...inputEndDecoratorStyles,
      insetInlineEnd: inputEndDecoratorOffsets.md,
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
      transition: 'transform 160ms ease',
      _motionSubtle: { transition: 'transform {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'transform {durations.standard} {easings.bounce}' },
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
          paddingInlineEnd: inputEndDecoratorPadding.md,
        },
      },
    },
    size: {
      sm: {
        field: {
          ...inputSizeVariants.sm,
          paddingInlineEnd: inputEndDecoratorPadding.sm,
          '&[multiple]': {
            height: 'auto',
            minBlockSize: inputSizeVariants.sm.height,
            paddingInlineEnd: '{spacing.md}',
          },
          '@container select-control (max-width: 7rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
            '&[multiple]': {
              paddingInlineEnd: '{spacing.2xs}',
            },
          },
          '@container select-control (max-width: 4rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        icon: {
          fontSize: inputEndDecoratorIconSizes.sm,
          insetInlineEnd: inputEndDecoratorOffsets.sm,
          '@container select-control (max-width: 4rem)': {
            display: 'none',
          },
        },
      },
      md: {
        field: {
          ...inputSizeVariants.md,
          paddingInlineEnd: inputEndDecoratorPadding.md,
          '&[multiple]': {
            height: 'auto',
            minBlockSize: inputSizeVariants.md.height,
            paddingInlineEnd: '{spacing.base}',
          },
          '@container select-control (max-width: 7rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
            '&[multiple]': {
              paddingInlineEnd: '{spacing.2xs}',
            },
          },
          '@container select-control (max-width: 4rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        icon: {
          fontSize: inputEndDecoratorIconSizes.md,
          insetInlineEnd: inputEndDecoratorOffsets.md,
          '@container select-control (max-width: 4rem)': {
            display: 'none',
          },
        },
      },
      lg: {
        field: {
          ...inputSizeVariants.lg,
          paddingInlineEnd: inputEndDecoratorPadding.lg,
          '&[multiple]': {
            height: 'auto',
            minBlockSize: inputSizeVariants.lg.height,
            paddingInlineEnd: '{spacing.lg}',
          },
          '@container select-control (max-width: 7rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
            '&[multiple]': {
              paddingInlineEnd: '{spacing.2xs}',
            },
          },
          '@container select-control (max-width: 4rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        icon: {
          fontSize: inputEndDecoratorIconSizes.lg,
          insetInlineEnd: inputEndDecoratorOffsets.lg,
          '@container select-control (max-width: 4rem)': {
            display: 'none',
          },
        },
      },
    },
    error: {
      true: {
        field: inputErrorState.true,
      },
    },
  },
});
