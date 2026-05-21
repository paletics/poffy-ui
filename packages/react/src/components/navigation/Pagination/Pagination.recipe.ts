import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Slot recipe for the Pagination component suite.
 * Defines styles for the root container, item list, links, and ellipsis indicators.
 */
export const paginationRecipe = defineSlotRecipe({
  className: 'pagination',
  description: 'Pagination styling for navigation items, links, controls, and ellipsis slots',
  slots: ['root', 'list', 'item', 'link', 'linkLabel', 'activeIndicator', 'ellipsis'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.2xs}',
      listStyle: 'none',
      p: '0',
      m: '0',
    },
    item: {
      display: 'flex',
    },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      minWidth: '{sizes.silver.2}',
      height: '{sizes.silver.2}',
      px: '{spacing.sm}',
      borderRadius: '{radii.md}',
      overflow: 'hidden',
      fontSize: 'md',
      fontWeight: 'medium',
      color: 'text.primary',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'colors',
      _hover: {
        bg: 'brand.tint',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.accent',
        outlineOffset: '2px',
      },
      _current: {
        color: 'brand.contrast',
        pointerEvents: 'none',
        _hover: {
          bg: 'transparent',
        },
      },
      _disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
        _hover: {
          bg: 'transparent',
        },
      },
    },
    linkLabel: {
      position: 'relative',
      zIndex: 1,
    },
    activeIndicator: {
      position: 'absolute',
      inset: '0',
      borderRadius: 'inherit',
      bg: 'brand.main',
      pointerEvents: 'none',
    },
    ellipsis: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '{sizes.silver.2}',
      height: '{sizes.silver.2}',
      color: 'brand.tint',
    },
  },
  variants: {
    appearance: {
      soft: {
        link: {
          _hover: {
            bg: 'brand.tint',
          },
          _current: {
            color: 'brand.contrast',
            pointerEvents: 'none',
            _hover: {
              bg: 'transparent',
            },
          },
        },
        activeIndicator: {
          bg: 'brand.main',
        },
      },
      outline: {
        link: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'layout.divider',
          _hover: {
            bg: 'transparent',
            borderColor: 'brand.border',
          },
          _current: {
            bg: 'transparent',
            color: 'brand.main',
            borderColor: 'brand.main',
            pointerEvents: 'none',
          },
        },
        activeIndicator: {
          bg: 'transparent',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'brand.main',
        },
      },
      ghost: {
        link: {
          bg: 'transparent',
          _hover: {
            bg: 'transparent',
            color: 'brand.main',
          },
          _current: {
            bg: 'transparent',
            color: 'brand.main',
            pointerEvents: 'none',
          },
        },
        activeIndicator: {
          bg: 'brand.surface',
        },
      },
    },
    size: {
      sm: {
        link: { minWidth: '{sizes.root.1}', height: '{sizes.root.1}', fontSize: 'sm' },
        ellipsis: { width: '{sizes.root.1}', height: '{sizes.root.1}' },
      },
      md: {
        link: { minWidth: '{sizes.silver.2}', height: '{sizes.silver.2}', fontSize: 'md' },
        ellipsis: { width: '{sizes.silver.2}', height: '{sizes.silver.2}' },
      },
      lg: {
        link: { minWidth: '{sizes.root.2}', height: '{sizes.root.2}', fontSize: 'lg' },
        ellipsis: { width: '{sizes.root.2}', height: '{sizes.root.2}' },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    size: 'md',
  },
});
