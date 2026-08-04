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
      maxWidth: '{sizes.full}',
      minH: '{sizes.control.minimumTarget}',
      px: '{spacing.base}',
      boxSizing: 'border-box',
      overflowX: 'auto',
      bg: 'layout.surface',
      borderBlockEnd: '1px solid',
      borderColor: 'layout.divider',
    },
    brand: {
      display: 'inline-flex',
      alignItems: 'center',
      minBlockSize: '{sizes.control.minimumTarget}',
      fontSize: 'lg',
      fontWeight: 'bold',
      color: 'text.primary',
      textDecoration: 'none',
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '-2px',
        borderRadius: '{radii.sm}',
      },
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.base}',
      flexShrink: 0,
    },
    item: {
      listStyle: 'none',
    },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      minBlockSize: '{sizes.control.minimumTarget}',
      px: '{spacing.xs}',
      fontSize: 'sm',
      color: 'text.secondary',
      textDecoration: 'none',
      transitionProperty: 'color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      cursor: 'pointer',
      _hover: {
        color: 'text.primary',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '-2px',
        borderRadius: '{radii.sm}',
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
          borderBlockStart: '1px solid',
          borderInlineStart: '1px solid',
          borderInlineEnd: '1px solid',
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
          insetBlockStart: 0,
          zIndex: 'appBar',
        },
      },
    },
    narrowLayout: {
      scroll: {},
      wrap: {
        root: {
          flexWrap: 'wrap',
          overflowX: 'visible',
          rowGap: '{spacing.sm}',
        },
        content: {
          minWidth: 0,
          maxWidth: '{sizes.full}',
          flexShrink: 1,
          flexWrap: 'wrap',
        },
        brand: {
          minInlineSize: 0,
          maxWidth: '{sizes.full}',
          overflowWrap: 'anywhere',
        },
        item: {
          minInlineSize: 0,
          maxWidth: '{sizes.full}',
        },
        link: {
          minInlineSize: 0,
          maxWidth: '{sizes.full}',
          overflowWrap: 'anywhere',
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
    narrowLayout: 'scroll',
    justify: 'start',
  },
});
