import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Input Group component slots with Panda CSS recipe variants.
 */
export const inputGroupRecipe = defineSlotRecipe({
  className: 'inputGroup',
  description: 'Input group styling for field, addon, element, and input slots',
  slots: ['root', 'field', 'addon', 'element', 'input'],
  base: {
    root: {
      display: 'flex',
      width: '100%',
      minWidth: 0,
      position: 'relative',
      alignItems: 'stretch',
      gap: '0',
      containerType: 'inline-size',
      containerName: 'input-group',
      containIntrinsicInlineSize: '{sizes.ratio.md}',
      '& input': {
        flex: '1 1 0%',
        minWidth: '0',
      },
      '&[data-has-start-addon] input': {
        borderStartStartRadius: '{radii.none}',
        borderEndStartRadius: '{radii.none}',
      },
      '&[data-has-end-addon] input': {
        borderStartEndRadius: '{radii.none}',
        borderEndEndRadius: '{radii.none}',
      },
      '&[data-has-start-element] input': {
        paddingInlineStart: '{spacing.xl}',
      },
      '&[data-has-end-element] input': {
        paddingInlineEnd: '{spacing.xl}',
      },
    },
    field: {
      display: 'flex',
      position: 'relative',
      flex: '1 1 0%',
      minW: '0px',
    },
    input: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: '0%',
      minW: '0px',
      '&[data-has-start-addon]': {
        borderStartStartRadius: '{radii.none}',
        borderEndStartRadius: '{radii.none}',
      },
      '&[data-has-end-addon]': {
        borderStartEndRadius: '{radii.none}',
        borderEndEndRadius: '{radii.none}',
      },
      '&[data-has-start-element]': {
        paddingInlineStart: '{spacing.xl}',
      },
      '&[data-has-end-element]': {
        paddingInlineEnd: '{spacing.xl}',
      },
    },
    addon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      flexShrink: 1,
      minWidth: 0,
      maxWidth: '50%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      boxSizing: 'border-box',
      alignSelf: 'stretch',
      borderWidth: '2px',
      borderColor: '{colors.brand.border}',
      bg: '{colors.brand.surface}',
      color: '{colors.text.secondary}',
      fontSize: 'inherit',
      // Keep static prefixes/suffixes compact, but do not clip the external
      // focus ring when a consumer supplies a keyboard-reachable addon action.
      '&:has(:focus-visible)': {
        overflow: 'visible',
        zIndex: 1,
      },
      '&[data-placement="start"]': {
        borderInlineEndWidth: '0',
        borderStartStartRadius: 'inherit',
        borderEndStartRadius: 'inherit',
        borderStartEndRadius: '{radii.none}',
        borderEndEndRadius: '{radii.none}',
      },
      '&[data-placement="end"]': {
        borderInlineStartWidth: '0',
        borderStartEndRadius: 'inherit',
        borderEndEndRadius: 'inherit',
        borderStartStartRadius: '{radii.none}',
        borderEndStartRadius: '{radii.none}',
      },
    },
    element: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      insetBlock: 0,
      zIndex: 2,
      pointerEvents: 'none',
      color: '{colors.text.secondary}',
      maxWidth: '100%',
      maxInlineSize: '100%',
      '& > *': {
        minWidth: 0,
        minInlineSize: 0,
        maxWidth: '100%',
        maxInlineSize: '100%',
      },
      '&:not([data-interactive])': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      '&[data-placement="start"]': { insetInlineStart: 0 },
      '&[data-placement="end"]': { insetInlineEnd: 0 },
      '&[data-interactive] :is(button, a, [role="button"])': {
        minWidth: '100%',
        minHeight: '{sizes.control.minimumTarget}',
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          fontSize: 'sm',
          borderRadius: '{radii.xl}',
          '&[data-has-start-element] input': { paddingInlineStart: '{spacing.xl}' },
          '&[data-has-end-element] input': { paddingInlineEnd: '{spacing.xl}' },
          '@container input-group (max-width: 4rem)': {
            '&[data-has-start-element][data-has-end-element] [data-input-group-element][data-placement="start"]:not([data-interactive])':
              {
                display: 'none',
              },
            '&[data-has-start-element][data-has-end-element] input': {
              paddingInlineStart: '{spacing.md}',
            },
          },
          '@container input-group (max-width: 2rem)': {
            '&[data-search-input] [data-input-group-element]:not([data-interactive])': {
              display: 'none',
            },
            '&[data-search-input] input': {
              paddingInlineStart: '{spacing.md}',
              paddingInlineEnd: '{spacing.md}',
            },
          },
        },
        input: {
          '&[data-has-start-element]': { paddingInlineStart: '{spacing.xl}' },
          '&[data-has-end-element]': { paddingInlineEnd: '{spacing.xl}' },
        },
        addon: {
          height: '{sizes.silver.2}',
          px: '{spacing.md}',
          '&[data-placement="start"]': {
            borderStartStartRadius: '{radii.xl}',
            borderEndStartRadius: '{radii.xl}',
          },
          '&[data-placement="end"]': {
            borderStartEndRadius: '{radii.xl}',
            borderEndEndRadius: '{radii.xl}',
          },
        },
        element: { width: '{sizes.silver.2}' },
      },
      md: {
        root: {
          fontSize: 'md',
          borderRadius: '{radii.2xl}',
          '&[data-has-start-element] input': { paddingInlineStart: '{spacing.2xl}' },
          '&[data-has-end-element] input': { paddingInlineEnd: '{spacing.2xl}' },
          '@container input-group (max-width: 5.656rem)': {
            '&[data-has-start-element][data-has-end-element] [data-input-group-element][data-placement="start"]:not([data-interactive])':
              {
                display: 'none',
              },
            '&[data-has-start-element][data-has-end-element] input': {
              paddingInlineStart: '{spacing.base}',
            },
          },
          '@container input-group (max-width: 2.828rem)': {
            '&[data-search-input] [data-input-group-element]': {
              display: 'none',
            },
            '&[data-search-input] input': {
              paddingInlineStart: '{spacing.base}',
              paddingInlineEnd: '{spacing.base}',
            },
          },
        },
        input: {
          '&[data-has-start-element]': { paddingInlineStart: '{spacing.2xl}' },
          '&[data-has-end-element]': { paddingInlineEnd: '{spacing.2xl}' },
        },
        addon: {
          height: '{sizes.root.2}',
          px: '{spacing.base}',
          '&[data-placement="start"]': {
            borderStartStartRadius: '{radii.2xl}',
            borderEndStartRadius: '{radii.2xl}',
          },
          '&[data-placement="end"]': {
            borderStartEndRadius: '{radii.2xl}',
            borderEndEndRadius: '{radii.2xl}',
          },
        },
        element: { width: '{sizes.root.2}' },
      },
      lg: {
        root: {
          fontSize: 'lg',
          borderRadius: '{radii.3xl}',
          '&[data-has-start-element] input': { paddingInlineStart: '{spacing.3xl}' },
          '&[data-has-end-element] input': { paddingInlineEnd: '{spacing.3xl}' },
          '@container input-group (max-width: 8rem)': {
            '&[data-has-start-element][data-has-end-element] [data-input-group-element][data-placement="start"]:not([data-interactive])':
              {
                display: 'none',
              },
            '&[data-has-start-element][data-has-end-element] input': {
              paddingInlineStart: '{spacing.lg}',
            },
          },
          '@container input-group (max-width: 4rem)': {
            '&[data-search-input] [data-input-group-element]:not([data-interactive])': {
              display: 'none',
            },
            '&[data-search-input] input': {
              paddingInlineStart: '{spacing.lg}',
              paddingInlineEnd: '{spacing.lg}',
            },
          },
        },
        input: {
          '&[data-has-start-element]': { paddingInlineStart: '{spacing.3xl}' },
          '&[data-has-end-element]': { paddingInlineEnd: '{spacing.3xl}' },
        },
        addon: {
          height: '{sizes.silver.3}',
          px: '{spacing.lg}',
          '&[data-placement="start"]': {
            borderStartStartRadius: '{radii.3xl}',
            borderEndStartRadius: '{radii.3xl}',
          },
          '&[data-placement="end"]': {
            borderStartEndRadius: '{radii.3xl}',
            borderEndEndRadius: '{radii.3xl}',
          },
        },
        element: { width: '{sizes.silver.3}' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
