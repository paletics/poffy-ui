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
      width: 'min({sizes.silver.5}, 100%)',
      maxWidth: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      height: 'auto',
      bg: 'layout.surface',
      borderRadius: '{radii.lg}',
      border: '1px solid',
      borderInlineEnd: '1px solid',
      borderColor: 'layout.divider',
      borderStyle: 'solid',
      boxShadow: '{shadows.sm}',
      transitionProperty: 'width',
      transitionDuration: '{durations.standard}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.fast}' },
      _motionPop: {
        transitionDuration: '{durations.complex}',
        transitionTimingFunction: '{easings.bounce}',
      },
    },
    header: {
      display: 'flex',
      minWidth: 0,
      alignItems: 'center',
      px: '{spacing.base}',
      py: '{spacing.base}',
      borderBlockEnd: '1px solid',
      borderColor: 'layout.divider',
    },
    content: {
      flex: '1',
      minWidth: 0,
      overflowY: 'auto',
      py: '{spacing.base}',
      px: '{spacing.md}',
      // Sidebar items use an external focus ring. Tell native focus scrolling
      // to retain that ring when an item reaches either vertical edge.
      scrollPaddingBlock: 'calc({focusRing.width} + {focusRing.offset})',
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.base}',
    },
    footer: {
      display: 'flex',
      minWidth: 0,
      alignItems: 'center',
      px: '{spacing.base}',
      py: '{spacing.base}',
      borderBlockStart: '1px solid',
      borderColor: 'layout.divider',
    },
    group: {
      display: 'flex',
      minWidth: 0,
      flexDirection: 'column',
      gap: '{spacing.2xs}',
    },
    label: {
      minWidth: 0,
      maxWidth: '{sizes.full}',
      px: '{spacing.md}',
      boxSizing: 'border-box',
      fontSize: 'xs',
      fontWeight: 'semibold',
      color: 'text.secondary',
      textTransform: 'uppercase',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
      mb: '{spacing.sm}',
    },
    item: {
      display: 'flex',
      minWidth: 0,
      minBlockSize: '{sizes.control.minimumTarget}',
      alignItems: 'center',
      gap: '{spacing.md}',
      px: '{spacing.md}',
      py: '{spacing.sm}',
      borderRadius: '{radii.md}',
      cursor: 'pointer',
      color: 'text.secondary',
      fontSize: 'sm',
      textDecoration: 'none',
      transitionProperty: 'background-color, color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: { transitionDuration: '{durations.standard}' },
      _hover: {
        bg: 'brand.surface',
        color: 'text.primary',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '2px',
      },
      scrollMarginBlock: 'calc({focusRing.width} + {focusRing.offset})',
      '&[aria-current="page"], &[data-active]': {
        bg: 'brand.surface',
        color: 'brand.main',
        fontWeight: 'medium',
        _hover: {
          bg: 'brand.surface',
        },
      },
    },
    itemLabel: {
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
        root: { width: 'min({sizes.silver.3}, 100%)' },
        header: { justifyContent: 'center', px: '{spacing.sm}' },
        footer: { justifyContent: 'center', px: '{spacing.sm}' },
        label: { display: 'none' },
        item: { justifyContent: 'center', px: '{spacing.sm}' },
        itemLabel: { srOnly: true },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    collapsed: false,
  },
});
