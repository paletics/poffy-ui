import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Toggle Button component with Panda CSS recipe variants.
 */
export const toggleButtonRecipe = defineRecipe({
  className: 'toggle-button',
  description: 'Toggle button styling for pressed and unpressed states',

  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '{spacing.sm}',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'body',
    textAlign: 'center',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    outline: 'none',
    position: 'relative',
    border: 'none',

    transitionProperty: 'background-color, color, border-color, box-shadow, transform',
    transitionDuration: '{durations.fast}',
    transitionTimingFunction: '{easings.soft}',

    _focusVisible: {
      outline: '2px solid',
      outlineColor: '{colors.brand.main}',
      outlineOffset: '2px',
    },

    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.5,
      filter: 'grayscale(0.8)',
    },

    '& svg': {
      width: '1.4em',
      height: '1.4em',
    },
    '& [data-slot="icon"]': {
      display: 'inline-flex',
      alignItems: 'center',
    },
  },

  variants: {
    size: {
      xs: { px: '{spacing.sm}', h: '{sizes.silver.1}', textStyle: 'caption', fontSize: 'xs' },
      sm: { px: '{spacing.md}', h: '{sizes.root.1}', textStyle: 'caption' },
      md: { px: '{spacing.lg}', h: '{sizes.silver.2}', textStyle: 'button' },
      lg: { px: '{spacing.xl}', h: '{sizes.root.2}', textStyle: 'h6' },
    },

    variant: {
      soft: {
        bg: '{colors.layout.divider}',
        color: '{colors.text.secondary}',
        border: '1px solid',
        borderColor: '{colors.layout.divider}',
        _hover: {
          bg: '{colors.brand.surface}',
        },
      },
      ghost: {
        bg: 'transparent',
        color: '{colors.text.secondary}',
        _hover: {
          bg: '{colors.brand.surface}',
        },
      },
      outline: {
        bg: 'transparent',
        color: '{colors.text.secondary}',
        border: '1px solid',
        borderColor: '{colors.layout.divider}',
        _hover: {
          bg: '{colors.brand.surface}',
          borderColor: '{colors.brand.main}',
        },
      },
      minimal: {
        bg: '{colors.layout.divider}',
        color: '{colors.text.secondary}',
        border: 'none',
        _hover: {
          bg: '{colors.brand.surface}',
        },
      },
    },
    intent: {
      primary: {},
      secondary: {},
      success: {},
      danger: {},
      light: {},
      dark: {},
    },

    shape: {
      rounded: { borderRadius: '{radii.md}' },
      pill: { borderRadius: '{radii.full}' },
      square: { borderRadius: '{radii.none}' },
    },

    pressed: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      variant: 'soft',
      pressed: true,
      intent: 'primary',
      css: {
        bg: '{colors.brand.main}',
        color: '{colors.white}',
        _hover: {
          bg: '{colors.brand.hover}',
        },
      },
    },
    {
      variant: 'soft',
      pressed: true,
      intent: 'secondary',
      css: {
        bg: '{colors.variants.secondary.main}',
        color: '{colors.variants.secondary.contrast}',
        borderColor: '{colors.variants.secondary.main}',
        _hover: {
          bg: '{colors.variants.secondary.hover}',
        },
      },
    },
    {
      variant: 'soft',
      pressed: true,
      intent: 'success',
      css: {
        bg: '{colors.variants.success.main}',
        color: '{colors.variants.success.contrast}',
        borderColor: '{colors.variants.success.main}',
        _hover: {
          bg: '{colors.variants.success.hover}',
        },
      },
    },
    {
      variant: 'soft',
      pressed: true,
      intent: 'danger',
      css: {
        bg: '{colors.variants.danger.main}',
        color: '{colors.variants.danger.contrast}',
        borderColor: '{colors.variants.danger.main}',
        _hover: {
          bg: '{colors.variants.danger.hover}',
        },
      },
    },
    {
      variant: 'soft',
      pressed: true,
      intent: 'light',
      css: {
        bg: '{colors.variants.light.main}',
        color: '{colors.variants.light.contrast}',
        borderColor: '{colors.variants.light.main}',
        _hover: {
          bg: '{colors.variants.light.hover}',
        },
      },
    },
    {
      variant: 'soft',
      pressed: true,
      intent: 'dark',
      css: {
        bg: '{colors.variants.dark.main}',
        color: '{colors.variants.dark.contrast}',
        borderColor: '{colors.variants.dark.main}',
        _hover: {
          bg: '{colors.variants.dark.hover}',
        },
      },
    },
    {
      variant: 'ghost',
      pressed: true,
      intent: 'primary',
      css: {
        bg: '{colors.brand.surface}',
        color: '{colors.brand.main}',
        _hover: {
          bg: '{colors.brand.hover}',
          color: '{colors.white}',
        },
      },
    },
    {
      variant: 'ghost',
      pressed: true,
      intent: 'secondary',
      css: {
        bg: '{colors.variants.secondary.surface}',
        color: '{colors.variants.secondary.main}',
        _hover: {
          bg: '{colors.variants.secondary.hover}',
          color: '{colors.variants.secondary.contrast}',
        },
      },
    },
    {
      variant: 'ghost',
      pressed: true,
      intent: 'success',
      css: {
        bg: '{colors.variants.success.surface}',
        color: '{colors.variants.success.main}',
        _hover: {
          bg: '{colors.variants.success.hover}',
          color: '{colors.variants.success.contrast}',
        },
      },
    },
    {
      variant: 'ghost',
      pressed: true,
      intent: 'danger',
      css: {
        bg: '{colors.variants.danger.surface}',
        color: '{colors.variants.danger.main}',
        _hover: {
          bg: '{colors.variants.danger.hover}',
          color: '{colors.variants.danger.contrast}',
        },
      },
    },
    {
      variant: 'ghost',
      pressed: true,
      intent: 'light',
      css: {
        bg: '{colors.variants.light.surface}',
        color: '{colors.variants.light.main}',
        _hover: {
          bg: '{colors.variants.light.hover}',
          color: '{colors.variants.light.contrast}',
        },
      },
    },
    {
      variant: 'ghost',
      pressed: true,
      intent: 'dark',
      css: {
        bg: '{colors.variants.dark.surface}',
        color: '{colors.variants.dark.main}',
        _hover: {
          bg: '{colors.variants.dark.hover}',
          color: '{colors.variants.dark.contrast}',
        },
      },
    },
    {
      variant: 'outline',
      pressed: true,
      intent: 'primary',
      css: {
        bg: '{colors.brand.surface}',
        color: '{colors.brand.main}',
        borderColor: '{colors.brand.main}',
        _hover: {
          bg: '{colors.brand.main}',
          color: '{colors.white}',
        },
      },
    },
    {
      variant: 'outline',
      pressed: true,
      intent: 'secondary',
      css: {
        bg: '{colors.variants.secondary.surface}',
        color: '{colors.variants.secondary.main}',
        borderColor: '{colors.variants.secondary.main}',
        _hover: {
          bg: '{colors.variants.secondary.main}',
          color: '{colors.variants.secondary.contrast}',
        },
      },
    },
    {
      variant: 'outline',
      pressed: true,
      intent: 'success',
      css: {
        bg: '{colors.variants.success.surface}',
        color: '{colors.variants.success.main}',
        borderColor: '{colors.variants.success.main}',
        _hover: {
          bg: '{colors.variants.success.main}',
          color: '{colors.variants.success.contrast}',
        },
      },
    },
    {
      variant: 'outline',
      pressed: true,
      intent: 'danger',
      css: {
        bg: '{colors.variants.danger.surface}',
        color: '{colors.variants.danger.main}',
        borderColor: '{colors.variants.danger.main}',
        _hover: {
          bg: '{colors.variants.danger.main}',
          color: '{colors.variants.danger.contrast}',
        },
      },
    },
    {
      variant: 'outline',
      pressed: true,
      intent: 'light',
      css: {
        bg: '{colors.variants.light.surface}',
        color: '{colors.variants.light.main}',
        borderColor: '{colors.variants.light.main}',
        _hover: {
          bg: '{colors.variants.light.main}',
          color: '{colors.variants.light.contrast}',
        },
      },
    },
    {
      variant: 'outline',
      pressed: true,
      intent: 'dark',
      css: {
        bg: '{colors.variants.dark.surface}',
        color: '{colors.variants.dark.main}',
        borderColor: '{colors.variants.dark.main}',
        _hover: {
          bg: '{colors.variants.dark.main}',
          color: '{colors.variants.dark.contrast}',
        },
      },
    },
    {
      variant: 'minimal',
      pressed: true,
      intent: 'primary',
      css: {
        bg: '{colors.brand.main}',
        color: '{colors.white}',
      },
    },
    {
      variant: 'minimal',
      pressed: true,
      intent: 'secondary',
      css: {
        bg: '{colors.variants.secondary.main}',
        color: '{colors.variants.secondary.contrast}',
      },
    },
    {
      variant: 'minimal',
      pressed: true,
      intent: 'success',
      css: {
        bg: '{colors.variants.success.main}',
        color: '{colors.variants.success.contrast}',
      },
    },
    {
      variant: 'minimal',
      pressed: true,
      intent: 'danger',
      css: {
        bg: '{colors.variants.danger.main}',
        color: '{colors.variants.danger.contrast}',
      },
    },
    {
      variant: 'minimal',
      pressed: true,
      intent: 'light',
      css: {
        bg: '{colors.variants.light.main}',
        color: '{colors.variants.light.contrast}',
      },
    },
    {
      variant: 'minimal',
      pressed: true,
      intent: 'dark',
      css: {
        bg: '{colors.variants.dark.main}',
        color: '{colors.variants.dark.contrast}',
      },
    },
  ],

  defaultVariants: {
    size: 'md',
    variant: 'ghost',
    intent: 'primary',
    shape: 'rounded',
    pressed: false,
  },
});
