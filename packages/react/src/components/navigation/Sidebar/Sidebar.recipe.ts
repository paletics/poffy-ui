import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Slot recipe for the Sidebar component suite.
 * Defines styles for the root container, header, content area, footer, groups, and items.
 *
 * ### Variant Logic
 * - collapsed: Minimalist view for small screens or focused work.
 */
export const sidebarRecipe = defineSlotRecipe({
  className: 'sidebar',
  description: 'A vertical navigation sidebar for primary application structure',
  slots: ['root', 'header', 'content', 'footer', 'group', 'item', 'label', 'itemLabel'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '{sizes.silver.5}',
      height: '{sizes.full}',
      bg: 'layout.surface',
      borderRight: '1px solid',
      borderColor: 'layout.divider',
      borderStyle: 'solid',
      transitionProperty: 'width',
      transitionDuration: '{durations.standard}',
      transitionTimingFunction: '{easings.soft}',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      px: '{spacing.base}',
      py: '{spacing.base}',
      borderBottom: '1px solid',
      borderColor: 'layout.divider',
    },
    content: {
      flex: '1',
      overflowY: 'auto',
      py: '{spacing.base}',
      px: '{spacing.md}',
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.base}',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      px: '{spacing.base}',
      py: '{spacing.base}',
      borderTop: '1px solid',
      borderColor: 'layout.divider',
    },
    group: {
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.2xs}',
    },
    label: {
      px: '{spacing.md}',
      fontSize: '2xs',
      fontWeight: 'semibold',
      color: 'text.secondary',
      textTransform: 'uppercase',
      mb: '{spacing.sm}',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.md}',
      px: '{spacing.md}',
      py: '{spacing.sm}',
      borderRadius: '{radii.md}',
      cursor: 'pointer',
      color: 'text.secondary',
      fontSize: '2xs',
      textDecoration: 'none',
      transitionProperty: 'background-color, color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _hover: {
        bg: 'brand.surface',
        color: 'text.primary',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '2px',
      },
      '&[aria-current="page"], &[data-active]': {
        bg: 'brand.surface',
        color: 'brand.main',
        fontWeight: 'medium',
        _hover: {
          bg: 'brand.surface',
        },
      },
    },
  },
  variants: {
    appearance: {
      soft: {
        root: {
          bg: 'layout.surface',
          borderColor: 'layout.divider',
        },
      },
      outline: {
        root: {
          bg: 'transparent',
          borderColor: 'layout.divider',
        },
        item: {
          _hover: {
            bg: 'transparent',
            color: 'brand.main',
          },
          '&[aria-current="page"], &[data-active]': {
            bg: 'transparent',
            color: 'brand.main',
            fontWeight: 'medium',
            _hover: {
              bg: 'transparent',
            },
          },
        },
      },
    },
    collapsed: {
      true: {
        root: { width: '{sizes.silver.3}' },
        header: { justifyContent: 'center', px: '{spacing.sm}' },
        footer: { justifyContent: 'center', px: '{spacing.sm}' },
        label: { display: 'none' },
        item: { justifyContent: 'center', px: '{spacing.sm}' },
        itemLabel: { display: 'none' },
      },
    },
    variant: {
      floating: {
        root: {
          height: 'auto',
          borderRadius: '{radii.lg}',
          border: '1px solid',
          borderColor: 'layout.divider',
          boxShadow: '{shadows.sm}',
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    collapsed: false,
    variant: 'floating',
  },
});
