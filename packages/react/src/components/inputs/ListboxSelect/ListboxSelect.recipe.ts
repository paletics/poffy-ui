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
import { dropdownContentStyles, dropdownItemStyles } from '../dropdown.shared';
import { createNeoBorderColor, createNeoShadowColor } from '../../../theme/neoStyles';

/**
 * Styles the Listbox Select component slots with Panda CSS recipe variants.
 */
export const listboxSelectRecipe = defineSlotRecipe({
  className: 'listbox-select',
  description: 'Listbox select styling for trigger, listbox, option, and indicator slots',
  slots: ['root', 'field', 'icon', 'content', 'item', 'itemText'],
  base: {
    root: {
      ...inputShellRootStyles,
      boxSizing: 'border-box',
      width: 'var(--poffy-listbox-select-width, {sizes.ratio.md})',
      inlineSize: 'var(--poffy-listbox-select-width, {sizes.ratio.md})',
      minWidth: 0,
      minInlineSize: 0,
      maxWidth: '100%',
      maxInlineSize: '100%',
      containerType: 'inline-size',
      containerName: 'listbox-select-control',
    },
    field: {
      ...inputBaseStyles,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      paddingInlineEnd: inputEndDecoratorPadding.md,
      '& [data-listbox-select-value]': {
        flex: '1 1 0',
        minWidth: 0,
        minInlineSize: 0,
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
      '&[data-state="open"]': {
        transform: 'translateY(-50%) rotate(180deg)',
      },
      '& svg': {
        width: '1em',
        height: '1em',
        flexShrink: 0,
      },
    },
    content: dropdownContentStyles,
    item: dropdownItemStyles,
    itemText: {
      flex: 1,
      truncate: true,
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
          '@container listbox-select-control (max-width: 7rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
          },
          '@container listbox-select-control (max-width: 4rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        icon: {
          fontSize: inputEndDecoratorIconSizes.sm,
          insetInlineEnd: inputEndDecoratorOffsets.sm,
          '@container listbox-select-control (max-width: 4rem)': {
            display: 'none',
          },
        },
      },
      md: {
        field: {
          ...inputSizeVariants.md,
          paddingInlineEnd: inputEndDecoratorPadding.md,
          '@container listbox-select-control (max-width: 7rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
          },
          '@container listbox-select-control (max-width: 4rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        icon: {
          fontSize: inputEndDecoratorIconSizes.md,
          insetInlineEnd: inputEndDecoratorOffsets.md,
          '@container listbox-select-control (max-width: 4rem)': {
            display: 'none',
          },
        },
      },
      lg: {
        field: {
          ...inputSizeVariants.lg,
          paddingInlineEnd: inputEndDecoratorPadding.lg,
          '@container listbox-select-control (max-width: 7rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
          },
          '@container listbox-select-control (max-width: 4rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        icon: {
          fontSize: inputEndDecoratorIconSizes.lg,
          insetInlineEnd: inputEndDecoratorOffsets.lg,
          '@container listbox-select-control (max-width: 4rem)': {
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
