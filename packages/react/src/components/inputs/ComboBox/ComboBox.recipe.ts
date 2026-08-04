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
      minInlineSize: '{sizes.root.3}',
    },
    label: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'text.primary',
    },
    control: {
      ...inputShellRootStyles,
      minWidth: 0,
      containerType: 'inline-size',
      containerName: 'combo-box-control',
    },
    input: {
      ...inputBaseStyles,
      paddingInlineEnd: inputEndDecoratorPadding.md,
      _placeholder: {
        color: 'text.secondary',
      },
    },
    trigger: {
      ...inputEndDecoratorStyles,
      width: '{sizes.root.2}',
      cursor: 'pointer',
      maxWidth: '100%',
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
          paddingInlineEnd: inputEndDecoratorPadding.sm,
          '@container combo-box-control (max-width: 4rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
            color: 'transparent',
            caretColor: 'transparent',
            _placeholder: { color: 'transparent' },
          },
          '@container combo-box-control (max-width: 1.5rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        trigger: {
          width: '{sizes.silver.2}',
          height: '{sizes.silver.2}',
          '@container combo-box-control (max-width: 4rem)': {
            width: '{sizes.control.minimumTarget} !important',
            inlineSize: '{sizes.control.minimumTarget} !important',
          },
          '@container combo-box-control (max-width: 1.5rem)': {
            display: 'none',
          },
        },
        item: { py: '{spacing.sm}' },
      },
      md: {
        input: {
          ...inputSizeVariants.md,
          px: inputSizeVariants.md.px,
          paddingInlineEnd: inputEndDecoratorPadding.md,
          '@container combo-box-control (max-width: 5.656rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
            color: 'transparent',
            caretColor: 'transparent',
            _placeholder: { color: 'transparent' },
          },
          '@container combo-box-control (max-width: 1.5rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        trigger: {
          width: '{sizes.root.2}',
          height: '{sizes.root.2}',
          '@container combo-box-control (max-width: 5.656rem)': {
            width: '{sizes.control.minimumTarget} !important',
            inlineSize: '{sizes.control.minimumTarget} !important',
          },
          '@container combo-box-control (max-width: 1.5rem)': {
            display: 'none',
          },
        },
        item: { py: '{spacing.base}' },
      },
      lg: {
        input: {
          ...inputSizeVariants.lg,
          px: inputSizeVariants.lg.px,
          paddingInlineEnd: inputEndDecoratorPadding.lg,
          '@container combo-box-control (max-width: 8rem)': {
            paddingInlineStart: '{spacing.2xs}',
            paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.2xs})',
            color: 'transparent',
            caretColor: 'transparent',
            _placeholder: { color: 'transparent' },
          },
          '@container combo-box-control (max-width: 1.5rem)': {
            paddingInlineEnd: '{spacing.2xs}',
          },
        },
        trigger: {
          width: '{sizes.silver.3}',
          height: '{sizes.silver.3}',
          '@container combo-box-control (max-width: 8rem)': {
            width: '{sizes.control.minimumTarget} !important',
            inlineSize: '{sizes.control.minimumTarget} !important',
          },
          '@container combo-box-control (max-width: 1.5rem)': {
            display: 'none',
          },
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
