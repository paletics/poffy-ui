import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles for structured unified and split diff displays.
 * Tier: Organisms, Engine: Panda CSS.
 */
export const diffViewerRecipe = defineSlotRecipe({
  className: 'diff-viewer',
  description: 'Diff viewer styling for line, gutter, code, marker, and caption slots',
  slots: ['root', 'caption', 'body', 'hunk', 'hunkHeader', 'row', 'gutter', 'marker', 'content'],
  base: {
    root: {
      display: 'block',
      maxWidth: '100%',
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
      borderBottom: '1px solid',
      borderColor: '{colors.layout.divider}',
      bg: 'color-mix(in srgb, {colors.layout.surface} 88%, {colors.layout.divider})',
      color: '{colors.text.primary}',
      fontSize: 'sm',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      textAlign: 'left',
    },
    body: {
      overflow: 'auto',
      fontFamily: 'mono',
      fontSize: 'sm',
      lineHeight: 'normal',
    },
    hunk: {
      minW: '100%',
    },
    hunkHeader: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      px: '{spacing.base}',
      py: '{spacing.xs}',
      borderBottom: '1px solid',
      borderColor: '{colors.layout.divider}',
      bg: 'color-mix(in srgb, {colors.brand.surface} 72%, {colors.layout.surface})',
      color: '{colors.brand.main}',
      fontSize: 'xs',
      fontWeight: 'semibold',
      whiteSpace: 'pre',
    },
    row: {
      '--diff-row-bg': 'transparent',
      '--diff-accent': 'transparent',
      '--diff-gutter-bg':
        'color-mix(in srgb, {colors.layout.surface} 92%, {colors.layout.divider})',
      '--diff-gutter-color': '{colors.text.secondary}',
      '--diff-marker-bg': 'transparent',
      '--diff-marker-color': '{colors.text.secondary}',
      '--diff-marker-border': 'color-mix(in srgb, {colors.layout.divider} 70%, transparent)',
      '--diff-content-color': '{colors.text.primary}',
      display: 'grid',
      gridTemplateColumns: 'var(--diff-grid-template)',
      alignItems: 'stretch',
      minW: 'max-content',
      borderLeft: '{borderWidths.strong} solid var(--diff-accent)',
      borderTop: '1px solid',
      borderTopColor: 'color-mix(in srgb, {colors.layout.divider} 58%, transparent)',
      bg: 'var(--diff-row-bg)',
      '&[data-change=added]': {
        '--diff-row-bg': '{colors.variants.success.surface}',
        '--diff-accent': '{colors.variants.success.main}',
        '--diff-gutter-bg':
          'color-mix(in srgb, {colors.variants.success.surface} 74%, {colors.layout.surface})',
        '--diff-gutter-color': '{colors.variants.success.main}',
        '--diff-marker-bg': '{colors.variants.success.main}',
        '--diff-marker-color': '{colors.variants.success.contrast}',
        '--diff-marker-border': '{colors.variants.success.main}',
        '--diff-content-color':
          'color-mix(in srgb, {colors.variants.success.main} 34%, {colors.text.primary})',
      },
      '&[data-change=removed]': {
        '--diff-row-bg': '{colors.variants.danger.surface}',
        '--diff-accent': '{colors.variants.danger.main}',
        '--diff-gutter-bg':
          'color-mix(in srgb, {colors.variants.danger.surface} 74%, {colors.layout.surface})',
        '--diff-gutter-color': '{colors.variants.danger.main}',
        '--diff-marker-bg': '{colors.variants.danger.main}',
        '--diff-marker-color': '{colors.variants.danger.contrast}',
        '--diff-marker-border': '{colors.variants.danger.main}',
        '--diff-content-color':
          'color-mix(in srgb, {colors.variants.danger.main} 34%, {colors.text.primary})',
      },
      '&[data-change=modified]': {
        '--diff-row-bg': '{colors.variants.warning.surface}',
        '--diff-accent': '{colors.variants.warning.main}',
        '--diff-gutter-bg':
          'color-mix(in srgb, {colors.variants.warning.surface} 74%, {colors.layout.surface})',
        '--diff-gutter-color': '{colors.variants.warning.main}',
        '--diff-marker-bg': '{colors.variants.warning.main}',
        '--diff-marker-color': '{colors.variants.warning.contrast}',
        '--diff-marker-border': '{colors.variants.warning.main}',
        '--diff-content-color':
          'color-mix(in srgb, {colors.variants.warning.main} 34%, {colors.text.primary})',
      },
    },
    gutter: {
      px: '{spacing.sm}',
      py: '{spacing.xs}',
      minW: '{sizes.root.2}',
      color: 'var(--diff-gutter-color)',
      bg: 'var(--diff-gutter-bg)',
      fontVariantNumeric: 'tabular-nums',
      textAlign: 'right',
      userSelect: 'none',
      whiteSpace: 'pre',
      borderRight: '1px solid',
      borderColor: '{colors.layout.divider}',
    },
    marker: {
      px: '{spacing.xs}',
      py: '{spacing.xs}',
      minW: '{sizes.silver.2}',
      borderRight: '1px solid',
      borderColor: 'var(--diff-marker-border)',
      bg: 'var(--diff-marker-bg)',
      color: 'var(--diff-marker-color)',
      fontWeight: 'semibold',
      textAlign: 'center',
      userSelect: 'none',
      whiteSpace: 'pre',
    },
    content: {
      display: 'block',
      minW: 0,
      px: '{spacing.md}',
      py: '{spacing.xs}',
      fontFamily: 'inherit',
      color: 'var(--diff-content-color)',
      whiteSpace: 'pre',
      overflow: 'visible',
    },
  },
  variants: {
    mode: {
      unified: {
        root: {
          '--diff-grid-template': 'max-content max-content max-content minmax(20rem, 1fr)',
        },
      },
      split: {
        root: {
          '--diff-grid-template':
            'max-content max-content minmax(16rem, 1fr) max-content minmax(16rem, 1fr)',
        },
      },
    },
    size: {
      sm: {
        body: { fontSize: 'xs' },
        caption: { px: '{spacing.sm}', py: '{spacing.xs}' },
        gutter: { px: '{spacing.xs}' },
        content: { px: '{spacing.xs}' },
      },
      md: {},
    },
  },
  defaultVariants: {
    mode: 'unified',
    size: 'md',
  },
});
