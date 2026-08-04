import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles for limited safe Markdown rendering.
 * Tier: Organisms, Engine: Panda CSS.
 */
export const markdownViewerRecipe = defineSlotRecipe({
  className: 'markdown-viewer',
  description: 'Markdown viewer prose, block, list, quote, and rule styling',
  slots: ['root', 'paragraph', 'list', 'listItem', 'blockquote', 'rule', 'codeBlock', 'image'],
  base: {
    root: {
      display: 'grid',
      gap: '{spacing.md}',
      minW: 0,
      maxW: '100%',
      color: '{colors.text.primary}',
      lineHeight: 'relaxed',
      '& > :first-child': {
        mt: 0,
      },
      '& > :last-child': {
        mb: 0,
      },
    },
    paragraph: {
      minInlineSize: 0,
      m: 0,
      color: '{colors.text.primary}',
      fontSize: 'md',
      lineHeight: 'relaxed',
      overflowWrap: 'anywhere',
    },
    list: {
      minInlineSize: 0,
      m: 0,
      ps: '{spacing.xl}',
      color: '{colors.text.primary}',
      fontSize: 'md',
      lineHeight: 'relaxed',
      overflowWrap: 'anywhere',
    },
    listItem: {
      minInlineSize: 0,
      ps: '{spacing.xs}',
      overflowWrap: 'anywhere',
      _marker: {
        color: '{colors.text.secondary}',
      },
    },
    blockquote: {
      minInlineSize: 0,
      m: 0,
      py: '{spacing.sm}',
      paddingInlineStart: '{spacing.lg}',
      borderInlineStartWidth: '{borderWidths.strong}',
      borderInlineStartStyle: 'solid',
      borderInlineStartColor: '{colors.brand.border}',
      color: '{colors.text.secondary}',
      fontSize: 'md',
      lineHeight: 'relaxed',
      overflowWrap: 'anywhere',
    },
    rule: {
      width: '100%',
      my: '{spacing.xs}',
      border: 0,
      borderBlockStart: '1px solid',
      borderColor: '{colors.layout.divider}',
    },
    codeBlock: {
      minW: 0,
    },
    image: {
      display: 'block',
      maxW: '100%',
      h: 'auto',
      borderRadius: '{radii.md}',
    },
  },
  variants: {
    size: {
      sm: {
        root: { gap: '{spacing.sm}' },
        paragraph: { fontSize: 'sm' },
        list: { fontSize: 'sm' },
        blockquote: { fontSize: 'sm' },
      },
      md: {},
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
