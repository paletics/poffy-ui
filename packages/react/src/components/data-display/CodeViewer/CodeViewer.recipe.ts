import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles for framed source-code viewing with optional captions and gutters.
 * Tier: Molecules, Engine: Panda CSS.
 */
export const codeViewerRecipe = defineSlotRecipe({
  className: 'code-viewer',
  description: 'Code viewer frame, caption, body, gutter, and source slots',
  slots: ['root', 'caption', 'body', 'gutter', 'numbers', 'source'],
  base: {
    root: {
      display: 'block',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: '{colors.layout.divider}',
      borderRadius: '{radii.lg}',
      bg: '{colors.layout.surface}',
      color: '{colors.text.primary}',
      boxShadow: '{shadows.xs}',
    },
    caption: {
      px: '{spacing.base}',
      py: '{spacing.md}',
      borderBlockEnd: '1px solid',
      borderColor: '{colors.layout.divider}',
      bg: 'color-mix(in srgb, {colors.layout.surface} 88%, {colors.layout.divider})',
      color: '{colors.text.primary}',
      fontSize: 'sm',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      textAlign: 'start',
      overflowWrap: 'anywhere',
    },
    body: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      maxWidth: '100%',
      overflow: 'auto',
      fontFamily: 'mono',
      bg: '{colors.layout.surface}',
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
      },
      '&[data-line-numbers=true]': {
        gridTemplateColumns: 'max-content minmax(0, 1fr)',
      },
    },
    gutter: {
      display: 'block',
      minW: '{sizes.root.2}',
      px: '{spacing.sm}',
      py: '{spacing.lg}',
      borderInlineEnd: '1px solid',
      borderColor: '{colors.layout.divider}',
      bg: 'color-mix(in srgb, {colors.layout.surface} 92%, {colors.layout.divider})',
      color: '{colors.text.secondary}',
      fontSize: 'sm',
      lineHeight: 'relaxed',
      textAlign: 'end',
      userSelect: 'none',
      whiteSpace: 'pre',
    },
    numbers: {
      display: 'block',
    },
    source: {
      minW: 0,
      '& pre': {
        borderRadius: 0,
      },
      '& code': {
        minH: '100%',
      },
    },
  },
  variants: {
    size: {
      sm: {
        caption: { px: '{spacing.sm}', py: '{spacing.xs}', fontSize: 'xs' },
        gutter: { px: '{spacing.xs}', py: '{spacing.md}', fontSize: 'xs' },
      },
      md: {},
    },
    wrap: {
      false: {
        source: {
          '& code': {
            whiteSpace: 'pre',
          },
          '& pre': {
            width: 'max-content',
            maxWidth: 'none',
            overflow: 'visible',
          },
        },
      },
      true: {
        source: {
          '& code': {
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    wrap: false,
  },
});
