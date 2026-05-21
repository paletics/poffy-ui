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
      position: 'relative',
      alignItems: 'stretch',
      gap: '0',
      '& input': {
        flex: '1 1 0%',
        minWidth: '0',
      },
      '&[data-has-left-addon] input': {
        borderTopLeftRadius: '{radii.none}',
        borderBottomLeftRadius: '{radii.none}',
      },
      '&[data-has-right-addon] input': {
        borderTopRightRadius: '{radii.none}',
        borderBottomRightRadius: '{radii.none}',
      },
      '&[data-has-left-element] input': {
        paddingLeft: '{spacing.xl}',
      },
      '&[data-has-right-element] input': {
        paddingRight: '{spacing.xl}',
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
      '&[data-has-left-addon]': {
        borderTopLeftRadius: '{radii.none}',
        borderBottomLeftRadius: '{radii.none}',
      },
      '&[data-has-right-addon]': {
        borderTopRightRadius: '{radii.none}',
        borderBottomRightRadius: '{radii.none}',
      },
      '&[data-has-left-element]': {
        paddingLeft: '{spacing.xl}',
      },
      '&[data-has-right-element]': {
        paddingRight: '{spacing.xl}',
      },
    },
    addon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      boxSizing: 'border-box',
      alignSelf: 'stretch',
      borderWidth: '2px',
      borderColor: '{colors.brand.border}',
      bg: '{colors.brand.surface}',
      color: '{colors.text.secondary}',
      fontSize: 'inherit',
      '&[data-placement="left"]': {
        borderRightWidth: '0',
        borderTopLeftRadius: 'inherit',
        borderBottomLeftRadius: 'inherit',
        borderTopRightRadius: '{radii.none}',
        borderBottomRightRadius: '{radii.none}',
      },
      '&[data-placement="right"]': {
        borderLeftWidth: '0',
        borderTopRightRadius: 'inherit',
        borderBottomRightRadius: 'inherit',
        borderTopLeftRadius: '{radii.none}',
        borderBottomLeftRadius: '{radii.none}',
      },
    },
    element: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      zIndex: 2,
      pointerEvents: 'none',
      color: '{colors.text.secondary}',
      '&[data-placement="left"]': { left: 0 },
      '&[data-placement="right"]': { right: 0 },
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          fontSize: 'sm',
          borderRadius: '{radii.xl}',
          '&[data-has-left-element] input': { paddingLeft: '{spacing.xl}' },
          '&[data-has-right-element] input': { paddingRight: '{spacing.xl}' },
        },
        input: {
          '&[data-has-left-element]': { paddingLeft: '{spacing.xl}' },
          '&[data-has-right-element]': { paddingRight: '{spacing.xl}' },
        },
        addon: {
          height: '{sizes.silver.2}',
          px: '{spacing.md}',
          '&[data-placement="left"]': {
            borderTopLeftRadius: '{radii.xl}',
            borderBottomLeftRadius: '{radii.xl}',
          },
          '&[data-placement="right"]': {
            borderTopRightRadius: '{radii.xl}',
            borderBottomRightRadius: '{radii.xl}',
          },
        },
        element: { width: '{sizes.silver.2}' },
      },
      md: {
        root: {
          fontSize: 'md',
          borderRadius: '{radii.2xl}',
          '&[data-has-left-element] input': { paddingLeft: '{spacing.2xl}' },
          '&[data-has-right-element] input': { paddingRight: '{spacing.2xl}' },
        },
        input: {
          '&[data-has-left-element]': { paddingLeft: '{spacing.2xl}' },
          '&[data-has-right-element]': { paddingRight: '{spacing.2xl}' },
        },
        addon: {
          height: '{sizes.root.2}',
          px: '{spacing.base}',
          '&[data-placement="left"]': {
            borderTopLeftRadius: '{radii.2xl}',
            borderBottomLeftRadius: '{radii.2xl}',
          },
          '&[data-placement="right"]': {
            borderTopRightRadius: '{radii.2xl}',
            borderBottomRightRadius: '{radii.2xl}',
          },
        },
        element: { width: '{sizes.root.2}' },
      },
      lg: {
        root: {
          fontSize: 'lg',
          borderRadius: '{radii.3xl}',
          '&[data-has-left-element] input': { paddingLeft: '{spacing.3xl}' },
          '&[data-has-right-element] input': { paddingRight: '{spacing.3xl}' },
        },
        input: {
          '&[data-has-left-element]': { paddingLeft: '{spacing.3xl}' },
          '&[data-has-right-element]': { paddingRight: '{spacing.3xl}' },
        },
        addon: {
          height: '{sizes.silver.3}',
          px: '{spacing.lg}',
          '&[data-placement="left"]': {
            borderTopLeftRadius: '{radii.3xl}',
            borderBottomLeftRadius: '{radii.3xl}',
          },
          '&[data-placement="right"]': {
            borderTopRightRadius: '{radii.3xl}',
            borderBottomRightRadius: '{radii.3xl}',
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
