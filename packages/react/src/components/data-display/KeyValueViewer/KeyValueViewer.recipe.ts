import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles for compact metadata description lists.
 * Tier: Molecules, Engine: Panda CSS.
 */
export const keyValueViewerRecipe = defineSlotRecipe({
  className: 'key-value-viewer',
  description: 'Key-value metadata viewer with figure, caption, list, term, and value slots',
  slots: ['root', 'caption', 'list', 'item', 'term', 'value'],
  base: {
    root: {
      display: 'block',
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      containerType: 'inline-size',
      containerName: 'key-value-viewer',
      containIntrinsicInlineSize: '{sizes.ratio.md}',
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
    list: {
      display: 'grid',
      gridTemplateColumns: 'repeat(var(--key-value-columns), minmax(0, 1fr))',
      gap: 0,
      m: 0,
      '@container key-value-viewer (max-width: 40rem)': {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
    },
    item: {
      display: 'grid',
      gridTemplateColumns: 'minmax(7rem, 0.5fr) minmax(0, 1fr)',
      borderBlockStart: '1px solid',
      borderColor: 'color-mix(in srgb, {colors.layout.divider} 70%, transparent)',
      _first: {
        borderBlockStart: 0,
      },
      '@container key-value-viewer (max-width: 22rem)': {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
    },
    term: {
      px: '{spacing.base}',
      py: '{spacing.md}',
      bg: 'color-mix(in srgb, {colors.layout.surface} 92%, {colors.layout.divider})',
      color: '{colors.text.secondary}',
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'snug',
      overflowWrap: 'anywhere',
    },
    value: {
      minW: 0,
      px: '{spacing.base}',
      py: '{spacing.md}',
      color: '{colors.text.primary}',
      fontSize: 'sm',
      lineHeight: 'snug',
      overflowWrap: 'anywhere',
    },
  },
  variants: {
    size: {
      sm: {
        caption: { px: '{spacing.sm}', py: '{spacing.xs}', fontSize: 'xs' },
        term: { px: '{spacing.sm}', py: '{spacing.xs}', fontSize: 'xs' },
        value: { px: '{spacing.sm}', py: '{spacing.xs}', fontSize: 'xs' },
      },
      md: {},
    },
    columns: {
      1: {
        root: { '--key-value-columns': '1' },
      },
      2: {
        root: { '--key-value-columns': '2' },
        item: {
          '@container key-value-viewer (min-width: 40.001rem)': {
            '&:nth-child(-n + 2)': {
              borderBlockStart: 0,
            },
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    columns: 1,
  },
});
