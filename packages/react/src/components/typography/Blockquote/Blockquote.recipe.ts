import { defineRecipe } from '@pandacss/dev';

export const blockquoteRecipe = defineRecipe({
  className: 'blockquote',
  description: 'Blockquote styling for quoted prose and documentation callouts',
  base: {
    margin: '0',
    minWidth: '0',
    paddingY: '{spacing.sm}',
    paddingInlineStart: '{spacing.lg}',
    borderInlineStartWidth: '4px',
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: '{colors.brand.main}',
    color: '{colors.text.secondary}',
    fontSize: '{fontSizes.md}',
    lineHeight: 'relaxed',
    overflowWrap: 'anywhere',
  },
  variants: {
    tone: {
      neutral: {
        borderInlineStartColor: '{colors.layout.divider}',
      },
      brand: {
        borderInlineStartColor: '{colors.brand.main}',
      },
      subtle: {
        borderInlineStartColor: '{colors.layout.divider}',
        color: '{colors.text.secondary}',
      },
    },
  },
  defaultVariants: {
    tone: 'brand',
  },
});
