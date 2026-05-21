import { defineSlotRecipe } from '@pandacss/dev';

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
      gap: '{spacing.sm}',
      fontWeight: 'medium',
      borderRadius: '{radii.md}',
      border: '1px solid',
      borderColor: 'layout.divider',
      bg: 'layout.surface',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color, color, box-shadow',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
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
      bg: 'layout.surface',
      borderRadius: '{radii.md}',
      border: '1px solid',
      borderColor: 'layout.divider',
      boxShadow: '{shadows.lg}',
      py: '{spacing.2xs}',
      outline: 'none',
      maxHeight: '300px',
      overflowY: 'auto',
      zIndex: 'popover',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      width: '{sizes.full}',
      cursor: 'pointer',
      bg: 'transparent',
      border: 'none',
      textAlign: 'left',
      transitionProperty: 'background-color, color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _hover: {
        bg: 'brand.surface',
      },
      _focusVisible: {
        bg: 'brand.surface',
        outline: 'none',
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
            outline: 'none',
          },
        },
      },
    },
    size: {
      sm: {
        trigger: {
          px: '{spacing.md}',
          py: '{spacing.xs}',
          fontSize: 'xs',
        },
        menu: {
          minWidth: '160px',
        },
        item: {
          px: '{spacing.sm}',
          py: '{spacing.xs}',
          fontSize: 'xs',
        },
      },
      md: {
        trigger: {
          px: '{spacing.base}',
          py: '{spacing.sm}',
          fontSize: 'md',
        },
        menu: {
          minWidth: '200px',
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
          minWidth: '15rem',
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
