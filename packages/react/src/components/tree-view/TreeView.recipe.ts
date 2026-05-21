import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Tree View component slots with Panda CSS recipe variants.
 */
export const treeViewRecipe = defineSlotRecipe({
  className: 'treeview',
  description:
    'Tree view styling for hierarchical items, triggers, content, and selection controls',
  slots: ['root', 'item', 'trigger', 'indicator', 'icon', 'content', 'label'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      outline: 'none',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      outline: 'none',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.xs}',
      width: '100%',
      px: '{spacing.2xs}',
      py: '{spacing.xs}',
      cursor: 'pointer',
      bg: 'transparent',
      color: 'text.primary',
      borderRadius: '{radii.md}',
      transition: 'background-color {durations.fast} {easings.soft}',
      _hover: { bg: 'brand.tint' },
      "&[data-selected='true']": {
        bg: 'brand.tint',
        color: 'brand.main',
        fontWeight: '{fontWeights.bold}',
      },
      _focusVisible: { outline: '2px solid {colors.brand.main}', zIndex: 1 },
      _disabled: { cursor: 'not-allowed', opacity: 0.5 },
      outline: 'none',
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '{sizes.silver.1}',
      height: '{sizes.silver.1}',
      color: 'text.secondary',
      transition: 'transform {durations.standard} {easings.snappy}',
      '&[data-state="expanded"]': {
        transform: 'rotate(90deg)',
      },
      '&[data-hidden]': {
        visibility: 'hidden',
      },
      flexShrink: 0,
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'text.secondary',
      flexShrink: 0,
    },
    label: {
      flex: 1,
      textAlign: 'left',
      fontSize: '{fontSizes.sm}',
      fontWeight: '{fontWeights.medium}',
      truncate: true,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      pl: '{spacing.lg}',
      overflow: 'hidden',
    },
  },
  variants: {
    appearance: {
      soft: {},
      outline: {
        trigger: {
          _hover: { bg: 'transparent', color: 'brand.main' },
          "&[data-selected='true']": {
            bg: 'transparent',
            color: 'brand.main',
          },
        },
      },
    },
  },
  defaultVariants: { appearance: 'soft' },
});
