import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Slot recipe for the Navbar component suite.
 * Defines styles for the root container, brand/logo, content areas, items, and links.
 *
 * ### Variant Logic
 * - sticky: Fixes the navbar to the top with an appBar z-index.
 */
export const navbarRecipe = defineSlotRecipe({
  className: 'navbar',
  description: 'Navbar styling for application header navigation and grouped actions',
  slots: ['root', 'brand', 'content', 'item', 'link', 'toggle'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '{sizes.full}',
      h: '{spacing.3xl}',
      px: '{spacing.base}',
      bg: 'layout.surface',
      borderBottom: '1px solid',
      borderColor: 'layout.divider',
    },
    brand: {
      fontSize: 'lg',
      fontWeight: 'bold',
      color: 'text.primary',
      textDecoration: 'none',
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.base}',
    },
    item: {
      listStyle: 'none',
    },
    link: {
      fontSize: 'xs',
      color: 'text.secondary',
      textDecoration: 'none',
      transitionProperty: 'color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      cursor: 'pointer',
      _hover: {
        color: 'text.primary',
      },
      '&[aria-current="page"], &[data-active]': {
        color: 'text.primary',
        fontWeight: 'medium',
      },
    },
    toggle: {
      display: 'none',
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
          borderTop: '1px solid',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderColor: 'layout.divider',
        },
      },
      ghost: {
        root: {
          bg: 'transparent',
          borderColor: 'transparent',
        },
      },
    },
    sticky: {
      true: {
        root: {
          position: 'sticky',
          top: 0,
          zIndex: 'appBar',
        },
      },
    },
    justify: {
      start: { content: { justifyContent: 'flex-start' } },
      end: { content: { justifyContent: 'flex-end' } },
      center: { content: { justifyContent: 'center' } },
      between: { content: { justifyContent: 'space-between' } },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    sticky: false,
    justify: 'start',
  },
});
