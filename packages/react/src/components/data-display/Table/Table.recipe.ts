import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Table component slots with Panda CSS recipe variants.
 */
export const tableRecipe = defineSlotRecipe({
  className: 'table',
  description: 'Table styling for root, head, body, row, cell, and caption slots',
  slots: ['root', 'caption', 'head', 'body', 'row', 'cell', 'footer'],
  base: {
    root: {
      width: '100%',
      captionSide: 'bottom',
      borderCollapse: 'collapse',
      fontSize: 'md',
      textAlign: 'left',
    },
    caption: {
      pt: '{spacing.base}',
      color: 'text.secondary',
      fontSize: 'sm',
    },
    head: {
      '& tr': {
        borderBottomWidth: '1px',
        borderColor: 'brand.border',
      },
    },
    body: {
      '& tr:last-child': {
        borderBottomWidth: '0',
      },
    },
    footer: {
      borderTopWidth: '1px',
      borderColor: 'brand.border',
      bg: 'brand.tint',
      fontWeight: 'medium',
    },
    row: {
      borderBottomWidth: '1px',
      borderColor: 'brand.border',
      transition: 'colors',
      _hover: {
        bg: 'brand.tint',
      },
      _selected: {
        bg: 'brand.tint',
      },
    },
    cell: {
      p: '{spacing.base}',
      verticalAlign: 'middle',
      '&:has([role=checkbox])': {
        pr: '0',
      },
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
            bg: 'brand.tint',
          },
        },
      },
      stripedVertical: {
        root: {
          '& td:nth-of-type(odd), & th:nth-of-type(odd)': {
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
            borderBottom: 'none',
          },
        },
        row: {
          borderBottom: 'none',
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
