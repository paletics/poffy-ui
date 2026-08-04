import { defineSlotRecipe } from '@pandacss/dev';
import {
  floatingAvailableHeight,
  floatingAvailableWidth,
  floatingViewportFallbackStyles,
} from '@/components/shared/floatingViewportFallback';

/**
 * Slot recipe for the Dropdown component suite.
 * Defines styles for the trigger, menu container, items, separators, and labels.
 *
 * ### Variant Logic
 * - md: Standard menu sizing. lg: High visibility menus.
 */
export const dropdownRecipe = defineSlotRecipe({
  className: 'dropdown',
  description: 'Dropdown menu styling for trigger, content, item, icon, and separator slots',
  slots: ['trigger', 'menu', 'item', 'separator', 'label'],
  base: {
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Below 24px, preserve the interaction target and intentionally let the
      // trigger exceed its containing block.
      minInlineSize: '{sizes.control.minimumTarget}',
      maxInlineSize: '{sizes.full}',
      minBlockSize: '{sizes.control.minimumTarget}',
      boxSizing: 'border-box',
      gap: '{spacing.sm}',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
      fontWeight: 'medium',
      borderRadius: '{radii.md}',
      border: '1px solid',
      borderColor: 'layout.divider',
      bg: 'layout.surface',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color, color, box-shadow',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      _hover: {
        bg: 'brand.surface',
        borderColor: 'layout.divider',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '2px',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&[aria-expanded=true]': {
        bg: 'brand.surface',
        borderColor: 'layout.divider',
      },
    },
    menu: {
      ...floatingViewportFallbackStyles,
      bg: 'layout.surface',
      borderRadius: '{radii.md}',
      border: '1px solid',
      borderColor: 'layout.divider',
      boxShadow: '{shadows.lg}',
      margin: 0,
      paddingInline: 0,
      py: '{spacing.2xs}',
      listStyle: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      minWidth: 0,
      maxWidth: floatingAvailableWidth,
      maxHeight: `min(300px, ${floatingAvailableHeight})`,
      overflowX: 'hidden',
      overflowY: 'auto',
      zIndex: 'popover',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      width: '{sizes.full}',
      minWidth: 0,
      boxSizing: 'border-box',
      overflowWrap: 'anywhere',
      cursor: 'pointer',
      bg: 'transparent',
      border: 'none',
      textAlign: 'start',
      transitionProperty: 'background-color, color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: { transitionDuration: '{durations.standard}' },
      _hover: {
        bg: 'brand.surface',
      },
      _focusVisible: {
        bg: 'brand.surface',
        // Menu items live in a clipped scrollport. An inset ring remains fully
        // visible while being distinct from the matching hover background.
        boxShadow: 'inset 0 0 0 {focusRing.width} {colors.brand.main}',
      },
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
        _hover: {
          bg: 'transparent',
        },
      },
    },
    separator: {
      h: '1px',
      bg: 'layout.divider',
      my: '{spacing.2xs}',
    },
    label: {
      px: '{spacing.md}',
      py: '{spacing.sm}',
      fontSize: 'xs',
      fontWeight: 'semibold',
      color: 'text.secondary',
      textTransform: 'uppercase',
      letterSpacing: 'wider',
    },
  },
  variants: {
    appearance: {
      soft: {},
      outline: {
        menu: {
          bg: 'transparent',
        },
        item: {
          _hover: {
            bg: 'transparent',
            color: 'brand.main',
          },
          _focusVisible: {
            bg: 'transparent',
            color: 'brand.main',
            boxShadow: 'inset 0 0 0 {focusRing.width} {colors.brand.main}',
          },
        },
      },
    },
    size: {
      sm: {
        trigger: {
          px: '{spacing.md}',
          py: '{spacing.xs}',
          fontSize: 'sm',
        },
        menu: {
          minWidth: `min(160px, ${floatingAvailableWidth})`,
        },
        item: {
          px: '{spacing.sm}',
          py: '{spacing.xs}',
          fontSize: 'sm',
        },
      },
      md: {
        trigger: {
          px: '{spacing.base}',
          py: '{spacing.sm}',
          fontSize: 'md',
        },
        menu: {
          minWidth: `min(200px, ${floatingAvailableWidth})`,
        },
        item: {
          px: '{spacing.md}',
          py: '{spacing.sm}',
          fontSize: 'md',
        },
      },
      lg: {
        trigger: {
          px: '{spacing.xl}',
          py: '{spacing.md}',
          fontSize: 'lg',
        },
        menu: {
          minWidth: `min(15rem, ${floatingAvailableWidth})`,
        },
        item: {
          px: '{spacing.lg}',
          py: '{spacing.md}',
          fontSize: 'lg',
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    size: 'md',
  },
});
