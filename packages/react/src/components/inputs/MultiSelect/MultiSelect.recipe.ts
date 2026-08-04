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
      containerType: 'inline-size',
      containerName: 'multi-select',
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
      paddingInlineEnd: inputEndDecoratorPadding.md,
      minHeight: '{sizes.root.2}',
      '& > [data-multiselect-tags]': {
        display: 'contents',
      },
      '& [data-multiselect-tag]': {
        display: 'inline-flex',
        flex: '0 1 auto',
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
      '& [data-multiselect-custom-tag] > *': {
        minWidth: 0,
        minInlineSize: 0,
        maxWidth: '100%',
        maxInlineSize: '100%',
        overflowWrap: 'anywhere',
      },
      '& [data-multiselect-custom-tag]': {
        overflowWrap: 'anywhere',
      },
      '@container multi-select (max-width: 4rem)': {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
        // Size variants are emitted after base container rules, so this must win
        // over their reserved inline padding at the emergency narrow breakpoint.
        paddingInline: '0 !important',
        '& [data-multiselect-default-tag]': {
          boxSizing: 'border-box',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
          inlineSize: '100%',
          paddingInline: '0 !important',
        },
        '& [data-multiselect-default-tag] [data-multiselect-tag-label]': {
          boxSizing: 'border-box',
          width: '100%',
          inlineSize: '100%',
          paddingInline: '{spacing.2xs}',
          textAlign: 'center',
        },
        '& [data-multiselect-tag-remove]': {
          boxSizing: 'border-box',
          width: '100%',
          inlineSize: '100%',
          minWidth: 0,
          minInlineSize: 0,
          marginInlineStart: '0 !important',
          marginInlineEnd: '0 !important',
        },
      },
    },
    input: {
      flex: '1 1 60px',
      minWidth: 0,
      minInlineSize: 0,
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
      '@container multi-select (max-width: 4rem)': {
        flex: '0 1 auto',
        width: '100%',
        inlineSize: '100%',
        px: '{spacing.2xs}',
      },
    },
    trigger: {
      ...inputEndDecoratorStyles,
      boxSizing: 'border-box',
      width: '{sizes.root.2}',
      maxInlineSize: '100%',
      height: '100%',
      cursor: 'pointer',
      '@container multi-select (max-width: 4rem)': {
        position: 'relative',
        inset: 'auto',
        width: '100% !important',
        inlineSize: '100% !important',
        maxWidth: '100%',
        maxInlineSize: '100%',
        minHeight: '{sizes.control.minimumTarget}',
      },
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
          paddingInlineEnd: inputEndDecoratorPadding.sm,
          py: '{spacing.2xs}',
        },
      },
      md: {
        control: {
          minHeight: inputSizeVariants.md.height,
          fontSize: inputSizeVariants.md.fontSize,
          borderRadius: inputSizeVariants.md.borderRadius,
          px: inputSizeVariants.md.px,
          paddingInlineEnd: inputEndDecoratorPadding.md,
          py: '{spacing.2xs}',
        },
      },
      lg: {
        control: {
          minHeight: inputSizeVariants.lg.height,
          fontSize: inputSizeVariants.lg.fontSize,
          borderRadius: inputSizeVariants.lg.borderRadius,
          px: inputSizeVariants.lg.px,
          paddingInlineEnd: inputEndDecoratorPadding.lg,
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
