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
      justifyContent: 'safe center',
      inlineSize: '{sizes.full}',
      minInlineSize: 'min({sizes.md}, 100%)',
      maxInlineSize: '{sizes.full}',
      boxSizing: 'border-box',
      containerType: 'inline-size',
      containerName: 'pagination',
      containIntrinsicInlineSize: 'min({sizes.md}, 100vw)',
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
      scrollPaddingInline: '{spacing.2xs}',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      width: 'max-content',
      minInlineSize: 'max-content',
      gap: '{spacing.2xs}',
      listStyle: 'none',
      p: '0',
      m: '0',
      '@container pagination (max-width: 15rem)': {
        '&[data-pagination-compact] > li': { display: 'none' },
        '&[data-pagination-compact] > li:has([data-current]), &[data-pagination-compact] > li:has([data-pagination-direction])':
          {
            display: 'flex',
          },
      },
      '@container pagination (max-width: 8rem)': {
        '&[data-pagination-compact] > li:has([data-pagination-direction="next"])': {
          display: 'none',
        },
        '&[data-pagination-compact]:has([data-pagination-direction="previous"][data-disabled]) > li:has([data-pagination-direction="previous"])':
          {
            display: 'none',
          },
        '&[data-pagination-compact]:has([data-pagination-direction="previous"][data-disabled]) > li:has([data-pagination-direction="next"])':
          {
            display: 'flex',
          },
      },
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
      maxInlineSize: '[100cqi]',
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
      _motionSubtle: { transition: 'colors {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'colors {durations.standard} {easings.bounce}' },
      _hover: {
        bg: 'brand.tint',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.accent',
        outlineOffset: '-2px',
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
      '@container pagination (max-width: 15rem)': {
        '&[data-pagination-direction]': {
          paddingInline: '{spacing.sm}',
        },
        '&[data-pagination-direction] > [data-pagination-label]': {
          fontSize: 0,
        },
        '&[data-pagination-direction="previous"] > [data-pagination-label]::before': {
          content: '"‹"',
          fontSize: '{fontSizes.lg}',
        },
        '&[data-pagination-direction="next"] > [data-pagination-label]::before': {
          content: '"›"',
          fontSize: '{fontSizes.lg}',
        },
        '&[data-pagination-direction="previous"]:dir(rtl) > [data-pagination-label]::before': {
          content: '"›"',
        },
        '&[data-pagination-direction="next"]:dir(rtl) > [data-pagination-label]::before': {
          content: '"‹"',
        },
      },
    },
    linkLabel: {
      position: 'relative',
      zIndex: 1,
      minInlineSize: 0,
      maxInlineSize: '{sizes.full}',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
        link: {
          minWidth: '{sizes.control.minimumTarget}',
          minHeight: '{sizes.control.minimumTarget}',
          height: '{sizes.root.1}',
          fontSize: 'sm',
        },
        ellipsis: {
          minWidth: '{sizes.control.minimumTarget}',
          minHeight: '{sizes.control.minimumTarget}',
          width: '{sizes.root.1}',
          height: '{sizes.root.1}',
        },
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
