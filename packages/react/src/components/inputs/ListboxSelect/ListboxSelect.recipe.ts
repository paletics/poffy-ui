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
    },
    field: {
      ...inputBaseStyles,
      display: 'flex',
      alignItems: 'center',
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
