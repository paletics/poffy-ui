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
      minWidth: 0,
      maxWidth: '100%',
      overflow: 'auto',
      overscrollBehavior: 'contain',
      scrollPaddingInline: 'calc({focusRing.width} + {focusRing.offset})',
      containerType: 'inline-size',
      containerName: 'tree-view',
      outline: 'none',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      minInlineSize: '{sizes.control.minimumTarget}',
      outline: 'none',
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
        zIndex: 1,
      },
      "&[data-selected='true'] > [data-treeview-trigger]": {
        bg: 'brand.tint',
        color: 'brand.main',
        fontWeight: '{fontWeights.bold}',
      },
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.xs}',
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
      minBlockSize: '{sizes.control.minimumTarget}',
      boxSizing: 'border-box',
      px: '{spacing.2xs}',
      py: '{spacing.xs}',
      cursor: 'pointer',
      bg: 'transparent',
      color: 'text.primary',
      borderRadius: '{radii.md}',
      transition: 'background-color {durations.fast} {easings.soft}',
      _motionSubtle: { transition: 'background-color {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'background-color {durations.standard} {easings.bounce}' },
      _hover: { bg: 'brand.tint' },
      "&[data-selected='true']": {
        bg: 'brand.tint',
        color: 'brand.main',
        fontWeight: '{fontWeights.bold}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
        zIndex: 1,
      },
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
      transform: 'rotate(0deg)',
      '&:dir(rtl)': {
        transform: 'rotate(180deg)',
      },
      _motionSubtle: { transition: 'transform {durations.fast} {easings.soft}' },
      _motionPop: { transition: 'transform {durations.complex} {easings.bounce}' },
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
      minWidth: 0,
      textAlign: 'start',
      fontSize: '{fontSizes.sm}',
      fontWeight: '{fontWeights.medium}',
      overflowWrap: 'anywhere',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      paddingInlineStart: 'clamp({spacing.2xs}, 4cqi, {spacing.lg})',
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
