import { defineSlotRecipe } from '@pandacss/dev';
import {
  inputBaseStyles,
  inputContainerErrorState,
  inputContainerVisualVariants,
  inputEndDecoratorPadding,
  inputEndDecoratorStyles,
  inputShellRootStyles,
  inputSizeVariants,
} from '../shared/input.shared';
import { dropdownContentStyles, dropdownItemStyles } from '../dropdown.shared';
import { createNeoBorderColor, createNeoShadowColor } from '../../../theme/neoStyles';

/**
 * Styles the Multi Select component slots with Panda CSS recipe variants.
 */
export const multiSelectRecipe = defineSlotRecipe({
  className: 'multi-select',
  description: 'Multi-select styling for trigger, listbox, options, tags, and actions',
  slots: ['root', 'control', 'input', 'trigger', 'content', 'item', 'itemText', 'itemIndicator'],
  base: {
    root: {
      ...inputShellRootStyles,
      boxSizing: 'border-box',
      width: 'var(--poffy-multi-select-width, {sizes.ratio.md})',
      inlineSize: 'var(--poffy-multi-select-width, {sizes.ratio.md})',
      minWidth: 0,
      minInlineSize: 0,
      maxWidth: '100%',
      maxInlineSize: '100%',
    },
    control: {
      ...inputBaseStyles,
      ...inputShellRootStyles,
      boxSizing: 'border-box',
      inlineSize: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '{spacing.xs}',
      minInlineSize: 0,
      maxWidth: '100%',
      maxInlineSize: '100%',
      pr: inputEndDecoratorPadding.md,
      minHeight: '{sizes.root.2}',
      '& > [data-multiselect-tags]': {
        display: 'contents',
      },
      '& [data-multiselect-tag]': {
        display: 'inline-flex',
        flex: '0 1 auto',
        overflow: 'hidden',
        maxWidth: '100%',
        maxInlineSize: '100%',
        minWidth: 0,
        minInlineSize: 0,
      },
      '& [data-multiselect-tag] [data-multiselect-tag-label]': {
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    input: {
      flex: '1 1 60px',
      minWidth: '60px',
      minInlineSize: '60px',
      maxWidth: '100%',
      maxInlineSize: '100%',
      width: 'auto',
      inlineSize: 'auto',
      outline: 'none',
      background: 'transparent',
      color: 'text.primary',
      fontSize: 'inherit',
      py: '{spacing.2xs}',
      _placeholder: {
        color: 'text.secondary',
      },
    },
    trigger: {
      ...inputEndDecoratorStyles,
      width: '{sizes.root.2}',
      height: '100%',
      cursor: 'pointer',
    },
    content: dropdownContentStyles,
    item: {
      ...dropdownItemStyles,
      _selected: {
        opacity: 0.5,
      },
    },
    itemText: {
      flex: 1,
    },
    itemIndicator: {
      color: 'brand.main',
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
  },
  variants: {
    variant: {
      outline: {
        control: inputContainerVisualVariants.outline,
      },
      filled: {
        control: inputContainerVisualVariants.filled,
      },
      neo: {
        control: {
          borderWidth: '{borderWidths.strong}',
          borderColor: createNeoBorderColor('var(--poffy-colors-brand-main)'),
          bg: 'layout.surface',
          boxShadow: `{spacing.sm} {spacing.sm} 0px ${createNeoShadowColor(
            'var(--poffy-colors-brand-main)',
          )}`,
          _focusWithin: {
            outline: '2px solid',
            outlineColor: '{colors.brand.main}',
            outlineOffset: '2px',
          },
        },
      },
      flushed: {
        control: inputContainerVisualVariants.flushed,
      },
    },
    size: {
      sm: {
        control: {
          minHeight: inputSizeVariants.sm.height,
          fontSize: inputSizeVariants.sm.fontSize,
          borderRadius: inputSizeVariants.sm.borderRadius,
          px: inputSizeVariants.sm.px,
          pr: inputEndDecoratorPadding.sm,
          py: '{spacing.2xs}',
        },
      },
      md: {
        control: {
          minHeight: inputSizeVariants.md.height,
          fontSize: inputSizeVariants.md.fontSize,
          borderRadius: inputSizeVariants.md.borderRadius,
          px: inputSizeVariants.md.px,
          pr: inputEndDecoratorPadding.md,
          py: '{spacing.2xs}',
        },
      },
      lg: {
        control: {
          minHeight: inputSizeVariants.lg.height,
          fontSize: inputSizeVariants.lg.fontSize,
          borderRadius: inputSizeVariants.lg.borderRadius,
          px: inputSizeVariants.lg.px,
          pr: inputEndDecoratorPadding.lg,
          py: '{spacing.xs}',
        },
      },
    },
    error: {
      true: {
        control: inputContainerErrorState.true,
      },
    },
  },
});
