import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Alert component slots with Panda CSS recipe variants.
 */
export const alertRecipe = defineSlotRecipe({
  className: 'alert',
  description: 'Alert styling for status messages, icons, title, and description slots',
  slots: ['root', 'icon', 'title', 'description', 'closeButton'],
  base: {
    root: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.md}',
      px: '{spacing.base}',
      py: '{spacing.md}',
      borderRadius: '{radii.md}',
      position: 'relative',
      minInlineSize: 0,
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflowWrap: 'anywhere',
      '& > :not([data-alert-icon]):not([data-alert-close])': {
        minInlineSize: 0,
        maxInlineSize: '100%',
        overflowWrap: 'anywhere',
      },
    },
    icon: {
      flexShrink: 0,
      width: '{sizes.root.1}',
      height: '{sizes.root.1}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      minW: 0,
      fontWeight: 'semibold',
      lineHeight: '1.2',
      fontSize: 'sm',
      color: '{colors.text.primary}',
      overflowWrap: 'anywhere',
    },
    description: {
      minW: 0,
      lineHeight: '1.5',
      fontSize: 'sm',
      color: '{colors.text.secondary}',
      overflowWrap: 'anywhere',
    },
    closeButton: {
      position: 'absolute',
      top: '{spacing.sm}',
      insetInlineEnd: '{spacing.sm}',
      bg: '{colors.layout.surface}',
      color: '{colors.text.secondary}',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '{colors.layout.divider}',
      _hover: {
        bg: '{colors.brand.tint}',
        color: '{colors.text.primary}',
        borderColor: '{colors.brand.border}',
      },
      _active: { bg: '{colors.brand.surface}' },
      _focusVisible: {
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineColor: '{colors.brand.main}',
        outlineOffset: '2px',
      },
    },
  },
  defaultVariants: {
    status: 'info',
    variant: 'subtle',
  },
  variants: {
    status: {
      info: {
        root: {
          bg: '{colors.variants.info.surface}',
          color: '{colors.text.primary}',
        },
        icon: { color: '{colors.variants.info.main}' },
      },
      success: {
        root: {
          bg: '{colors.variants.success.surface}',
          color: '{colors.text.primary}',
        },
        icon: { color: '{colors.variants.success.main}' },
      },
      warning: {
        root: {
          bg: '{colors.variants.warning.surface}',
          color: '{colors.text.primary}',
        },
        icon: { color: '{colors.variants.warning.main}' },
      },
      error: {
        root: {
          bg: '{colors.variants.danger.surface}',
          color: '{colors.text.primary}',
        },
        icon: { color: '{colors.variants.danger.main}' },
      },
    },
    variant: {
      subtle: {},
      solid: {},
      'start-accent': {
        root: {
          borderInlineStartWidth: '4px',
          borderInlineStartStyle: 'solid',
        },
      },
      outline: {
        root: {
          bg: 'transparent',
          borderWidth: '1px',
          borderStyle: 'solid',
        },
      },
    },
    closable: {
      true: {
        root: {
          flexWrap: 'wrap',
          paddingInlineEnd: '{spacing.base}',
        },
        closeButton: {
          position: 'static',
          alignSelf: 'flex-start',
          flexShrink: 0,
          marginInlineStart: 'auto',
        },
      },
    },
  },
  compoundVariants: [
    {
      status: 'info',
      variant: 'solid',
      css: {
        root: { bg: '{colors.variants.info.main}', color: '{colors.variants.info.contrast}' },
        icon: { color: '{colors.variants.info.contrast}' },
        title: { color: '{colors.variants.info.contrast}' },
        description: { color: '{colors.variants.info.contrast}' },
      },
    },
    {
      status: 'success',
      variant: 'solid',
      css: {
        root: { bg: '{colors.variants.success.main}', color: '{colors.variants.success.contrast}' },
        icon: { color: '{colors.variants.success.contrast}' },
        title: { color: '{colors.variants.success.contrast}' },
        description: { color: '{colors.variants.success.contrast}' },
      },
    },
    {
      status: 'warning',
      variant: 'solid',
      css: {
        root: { bg: '{colors.variants.warning.main}', color: '{colors.variants.warning.contrast}' },
        icon: { color: '{colors.variants.warning.contrast}' },
        title: { color: '{colors.variants.warning.contrast}' },
        description: { color: '{colors.variants.warning.contrast}' },
      },
    },
    {
      status: 'error',
      variant: 'solid',
      css: {
        root: { bg: '{colors.variants.danger.main}', color: '{colors.variants.danger.contrast}' },
        icon: { color: '{colors.variants.danger.contrast}' },
        title: { color: '{colors.variants.danger.contrast}' },
        description: { color: '{colors.variants.danger.contrast}' },
      },
    },
    {
      status: 'info',
      variant: 'start-accent',
      css: { root: { borderInlineStartColor: '{colors.variants.info.main}' } },
    },
    {
      status: 'success',
      variant: 'start-accent',
      css: { root: { borderInlineStartColor: '{colors.variants.success.main}' } },
    },
    {
      status: 'warning',
      variant: 'start-accent',
      css: { root: { borderInlineStartColor: '{colors.variants.warning.main}' } },
    },
    {
      status: 'error',
      variant: 'start-accent',
      css: { root: { borderInlineStartColor: '{colors.variants.danger.main}' } },
    },
    {
      status: 'info',
      variant: 'outline',
      css: {
        root: { borderColor: '{colors.variants.info.main}' },
      },
    },
    {
      status: 'success',
      variant: 'outline',
      css: {
        root: { borderColor: '{colors.variants.success.main}' },
      },
    },
    {
      status: 'warning',
      variant: 'outline',
      css: {
        root: { borderColor: '{colors.variants.warning.main}' },
      },
    },
    {
      status: 'error',
      variant: 'outline',
      css: {
        root: { borderColor: '{colors.variants.danger.main}' },
      },
    },
  ],
});
