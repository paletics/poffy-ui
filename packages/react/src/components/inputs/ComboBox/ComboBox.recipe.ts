import { defineSlotRecipe } from '@pandacss/dev';
import {
  inputBaseStyles,
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
 * Styles the Combo Box component slots with Panda CSS recipe variants.
 */
export const comboBoxRecipe = defineSlotRecipe({
  className: 'combo-box',
  description: 'Combo box styling for input, trigger, listbox, option, and tag slots',
  slots: [
    'root',
    'label',
    'control',
    'input',
    'trigger',
    'content',
    'item',
    'itemText',
    'itemIndicator',
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.2xs}',
      ...inputShellRootStyles,
    },
    label: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'text.primary',
    },
    control: inputShellRootStyles,
    input: {
      ...inputBaseStyles,
      pr: inputEndDecoratorPadding.md,
      _placeholder: {
        color: 'text.secondary',
      },
    },
    trigger: {
      ...inputEndDecoratorStyles,
      width: '{sizes.root.2}',
      cursor: 'pointer',
    },
    content: dropdownContentStyles,
    item: {
      ...dropdownItemStyles,
    },
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
        input: inputVisualVariants.outline,
      },
      filled: {
        input: inputVisualVariants.filled,
      },
      neo: {
        input: {
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
        input: inputVisualVariants.flushed,
      },
    },
    size: {
      sm: {
        input: {
          ...inputSizeVariants.sm,
          px: inputSizeVariants.sm.px,
          pr: inputEndDecoratorPadding.sm,
        },
        item: { py: '{spacing.sm}' },
      },
      md: {
        input: {
          ...inputSizeVariants.md,
          px: inputSizeVariants.md.px,
          pr: inputEndDecoratorPadding.md,
        },
        item: { py: '{spacing.base}' },
      },
      lg: {
        input: {
          ...inputSizeVariants.lg,
          px: inputSizeVariants.lg.px,
          pr: inputEndDecoratorPadding.lg,
        },
        item: { py: '{spacing.lg}' },
      },
    },
    error: {
      true: {
        input: inputErrorState.true,
      },
    },
  },
});
