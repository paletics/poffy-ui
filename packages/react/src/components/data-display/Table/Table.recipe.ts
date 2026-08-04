import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Table component slots with Panda CSS recipe variants.
 */
export const tableRecipe = defineSlotRecipe({
  className: 'table',
  description: 'Table styling for root, head, body, row, cell, and caption slots',
  slots: ['root', 'caption', 'head', 'body', 'row', 'cell', 'footer', 'emptyState'],
  base: {
    root: {
      '--table-sticky-background': 'var(--poffy-colors-layout-surface)',
      width: '100%',
      captionSide: 'bottom',
      borderCollapse: 'collapse',
      fontSize: 'md',
      textAlign: 'start',
    },
    caption: {
      minInlineSize: 0,
      pt: '{spacing.base}',
      color: 'text.secondary',
      fontSize: 'sm',
      overflowWrap: 'anywhere',
    },
    head: {
      '& tr': {
        borderBlockEndWidth: '1px',
        borderColor: 'brand.border',
      },
    },
    body: {
      '& tr:last-child': {
        borderBlockEndWidth: '0',
      },
    },
    footer: {
      borderBlockStartWidth: '1px',
      borderColor: 'brand.border',
      bg: 'brand.tint',
      fontWeight: 'medium',
    },
    row: {
      borderBlockEndWidth: '1px',
      borderColor: 'brand.border',
      transition: 'colors',
      _motionSubtle: { transition: 'colors {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'colors {durations.standard} {easings.bounce}' },
      _selected: {
        bg: 'brand.tint',
      },
    },
    cell: {
      p: '{spacing.base}',
      verticalAlign: 'middle',
      overflowWrap: 'anywhere',
      '&:has([role=checkbox])': {
        paddingInlineEnd: '0',
      },
    },
    emptyState: {
      py: '{spacing.xl}',
      color: 'text.secondary',
      textAlign: 'center',
    },
  },
  defaultVariants: {
    variant: 'simple',
    layout: 'auto',
  },
  variants: {
    variant: {
      simple: {},
      striped: {
        body: {
          '& tr:nth-of-type(odd)': {
            '--table-sticky-background': 'var(--poffy-colors-brand-tint)',
            bg: 'brand.tint',
          },
        },
      },
      stripedVertical: {
        root: {
          '& td:nth-of-type(odd), & th:nth-of-type(odd)': {
            '--table-sticky-background': 'var(--poffy-colors-brand-tint)',
            bg: 'brand.tint',
          },
        },
      },
      outline: {
        root: {
          borderWidth: '1px',
          borderColor: 'brand.border',
          borderRadius: '{radii.md}',
        },
      },
      borderless: {
        root: {
          border: 'none',
        },
        head: {
          '& tr': {
            borderBlockEnd: 'none',
          },
        },
        row: {
          borderBlockEnd: 'none',
        },
      },
    },
    layout: {
      auto: {
        root: {
          tableLayout: 'auto',
        },
      },
      fixed: {
        root: {
          tableLayout: 'fixed',
        },
      },
    },
    stickyHeader: {
      true: {
        head: {
          position: 'sticky',
          top: '0',
          zIndex: 1,
          '& th': {
            '--table-sticky-background': 'var(--poffy-colors-layout-surface)',
            bg: 'layout.surface',
          },
        },
      },
    },
    headerTone: {
      subtle: {
        head: {
          '& th': {
            '--table-sticky-background': 'var(--poffy-colors-layout-surface)',
            bg: 'layout.surface',
            color: 'text.secondary',
          },
        },
      },
      strong: {
        head: {
          '& th': {
            '--table-sticky-background': 'var(--poffy-colors-brand-tint)',
            bg: 'brand.tint',
            color: 'brand.main',
            fontWeight: 'bold',
          },
        },
      },
    },
    size: {
      sm: {
        cell: { p: '{spacing.sm}' },
        caption: { fontSize: 'sm' },
      },
      md: {
        cell: { p: '{spacing.base}' },
        caption: { fontSize: 'md' },
      },
      lg: {
        cell: { p: '{spacing.lg}' },
        caption: { fontSize: 'lg' },
      },
    },
  },
});
