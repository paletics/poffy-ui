import { defineSlotRecipe, type SlotRecipeConfig } from '@pandacss/dev';
import { INTENTS } from '@poffy-ui/types';

const generateCompoundVariants = (): SlotRecipeConfig['compoundVariants'] => {
  const variants: NonNullable<SlotRecipeConfig['compoundVariants']> = [];

  INTENTS.forEach((intent) => {
    const colors = {
      main: `{colors.variants.${intent}.main}`,
      contrast: `{colors.variants.${intent}.contrast}`,
      border: `{colors.variants.${intent}.border}`,
      surface: `{colors.variants.${intent}.surface}`,
      hover: `{colors.variants.${intent}.hover}`,
    };

    variants.push(
      {
        intent,
        variant: 'solid',
        css: {
          mainButton: {
            bg: colors.main,
            color: colors.contrast,
            border: '1px solid',
            borderColor: colors.border,
            _hover: { bg: colors.hover },
          },
          dropdownButton: {
            bg: colors.main,
            color: colors.contrast,
            borderTopWidth: '1px',
            borderRightWidth: '1px',
            borderBottomWidth: '1px',
            borderLeftWidth: '1px',
            borderTopStyle: 'solid',
            borderRightStyle: 'solid',
            borderBottomStyle: 'solid',
            borderLeftStyle: 'solid',
            borderTopColor: colors.border,
            borderRightColor: colors.border,
            borderBottomColor: colors.border,
            borderLeftColor: 'color-mix(in srgb, currentColor 28%, transparent)',
            _hover: { bg: colors.hover },
          },
        },
      },
      {
        intent,
        variant: 'soft',
        css: {
          mainButton: {
            bg: colors.surface,
            color: colors.main,
            border: '1px solid',
            borderColor: colors.surface,
            _hover: {
              bg: colors.main,
              color: colors.contrast,
              borderColor: colors.main,
            },
          },
          dropdownButton: {
            bg: colors.surface,
            color: colors.main,
            borderTopWidth: '1px',
            borderRightWidth: '1px',
            borderBottomWidth: '1px',
            borderLeftWidth: '1px',
            borderTopStyle: 'solid',
            borderRightStyle: 'solid',
            borderBottomStyle: 'solid',
            borderLeftStyle: 'solid',
            borderTopColor: colors.surface,
            borderRightColor: colors.surface,
            borderBottomColor: colors.surface,
            borderLeftColor: colors.main,
            _hover: {
              bg: colors.main,
              color: colors.contrast,
              borderColor: colors.main,
            },
          },
        },
      },
      {
        intent,
        variant: 'outline',
        css: {
          mainButton: {
            bg: 'transparent',
            color: colors.main,
            border: '1px solid',
            borderColor: colors.main,
            _hover: { bg: colors.surface },
          },
          dropdownButton: {
            bg: 'transparent',
            color: colors.main,
            borderTopWidth: '1px',
            borderRightWidth: '1px',
            borderBottomWidth: '1px',
            borderLeftWidth: '1px',
            borderTopStyle: 'solid',
            borderRightStyle: 'solid',
            borderBottomStyle: 'solid',
            borderLeftStyle: 'solid',
            borderTopColor: colors.main,
            borderRightColor: colors.main,
            borderBottomColor: colors.main,
            borderLeftColor: colors.border,
            _hover: { bg: colors.surface },
          },
        },
      },
      {
        intent,
        variant: 'ghost',
        css: {
          mainButton: {
            bg: 'transparent',
            color: colors.main,
            _hover: { bg: colors.surface },
          },
          dropdownButton: {
            bg: 'transparent',
            color: colors.main,
            borderTopWidth: '1px',
            borderRightWidth: '1px',
            borderBottomWidth: '1px',
            borderLeftWidth: '1px',
            borderTopStyle: 'solid',
            borderRightStyle: 'solid',
            borderBottomStyle: 'solid',
            borderLeftStyle: 'solid',
            borderTopColor: colors.border,
            borderRightColor: colors.border,
            borderBottomColor: colors.border,
            borderLeftColor: colors.border,
            _hover: { bg: colors.surface },
          },
        },
      },
      {
        intent,
        variant: 'minimal',
        css: {
          mainButton: {
            bg: colors.main,
            color: colors.contrast,
            border: 'none',
            _hover: {
              bg: colors.surface,
              color: colors.main,
            },
          },
          dropdownButton: {
            bg: colors.main,
            color: colors.contrast,
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 0,
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'color-mix(in srgb, currentColor 28%, transparent)',
            _hover: {
              bg: colors.surface,
              color: colors.main,
            },
          },
        },
      },
    );
  });

  return variants;
};

/**
 * Styles the Split Button component slots with Panda CSS recipe variants.
 */
export const splitButtonRecipe = defineSlotRecipe({
  className: 'split-button',
  description: 'Split button styling for primary action, menu trigger, and item slots',
  slots: ['root', 'mainButton', 'dropdownButton', 'menu', 'menuItem', 'icon'],

  base: {
    root: {
      display: 'inline-flex',
      position: 'relative',
      alignItems: 'stretch',
    },

    mainButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '{spacing.sm}',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: 'body',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      userSelect: 'none',
      outline: 'none',
      border: 'none',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRightWidth: '0',
      transitionProperty: 'background-color, color, border-color, box-shadow',
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
      },
    },

    dropdownButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: 'body',
      userSelect: 'none',
      outline: 'none',
      border: 'none',
      boxShadow: 'none !important',
      borderTopLeftRadius: '0 !important',
      borderBottomLeftRadius: '0 !important',
      borderLeft: '1px solid',
      transitionProperty: 'background-color, color, border-color, box-shadow',
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
      },
      '& svg': {
        width: '1em',
        height: '1em',
      },
    },

    menu: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      minWidth: '11rem',
      bg: '{colors.layout.surface}',
      border: '1px solid',
      borderColor: '{colors.layout.divider}',
      borderRadius: '{radii.md}',
      boxShadow: '{shadows.lg}',
      py: 1,
      zIndex: 1000,
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },

    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      px: '{spacing.md}',
      py: '{spacing.sm}',
      cursor: 'pointer',
      fontSize: 'sm',
      color: '{colors.text.primary}',
      bg: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left',
      _hover: {
        bg: '{colors.brand.surface}',
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.5,
        bg: 'transparent',
      },
    },

    icon: {
      display: 'inline-flex',
      alignItems: 'center',
    },
  },

  variants: {
    size: {
      sm: {
        mainButton: {
          px: '{sizes.root.1}',
          h: '{sizes.silver.2}',
          textStyle: 'button',
          fontSize: 'sm',
        },
        dropdownButton: {
          minWidth: 'calc({sizes.silver.2} + {spacing.xs})',
          h: '{sizes.silver.2}',
          '--poffy-icon-size': '{sizes.silver.1}',
        },
      },
      md: {
        mainButton: {
          px: '{sizes.silver.2}',
          h: '{sizes.root.2}',
          textStyle: 'button',
          fontSize: 'md',
        },
        dropdownButton: {
          minWidth: 'calc({sizes.root.2} + {spacing.xs})',
          h: '{sizes.root.2}',
          '--poffy-icon-size': '{sizes.root.1}',
        },
      },
      lg: {
        mainButton: {
          px: '{sizes.root.2}',
          h: '{sizes.silver.3}',
          textStyle: 'h6',
          fontSize: 'lg',
        },
        dropdownButton: {
          minWidth: 'calc({sizes.silver.3} + {spacing.xs})',
          h: '{sizes.silver.3}',
          '--poffy-icon-size': '{sizes.silver.2}',
        },
      },
    },
    variant: {
      solid: {},
      soft: {},
      outline: {},
      ghost: {},
      minimal: {},
    },
    intent: {
      primary: {},
      secondary: {},
      info: {},
      success: {},
      warning: {},
      danger: {},
      light: {},
      dark: {},
    },
    shape: {
      rounded: {
        mainButton: {
          borderTopLeftRadius: '{radii.xl}',
          borderBottomLeftRadius: '{radii.xl}',
        },
        dropdownButton: {
          borderTopRightRadius: '{radii.xl} !important',
          borderBottomRightRadius: '{radii.xl} !important',
        },
      },
      pill: {
        mainButton: {
          borderTopLeftRadius: '{radii.full}',
          borderBottomLeftRadius: '{radii.full}',
        },
        dropdownButton: {
          borderTopRightRadius: '{radii.full} !important',
          borderBottomRightRadius: '{radii.full} !important',
        },
      },
      square: {
        mainButton: {
          borderTopLeftRadius: '{radii.none}',
          borderBottomLeftRadius: '{radii.none}',
        },
        dropdownButton: {
          borderTopRightRadius: '{radii.none} !important',
          borderBottomRightRadius: '{radii.none} !important',
        },
      },
    },
    isOpen: {
      true: {
        dropdownButton: {
          filter: 'brightness(0.95)',
        },
      },
      false: {},
    },
  },

  compoundVariants: generateCompoundVariants(),

  defaultVariants: {
    size: 'md',
    variant: 'solid',
    intent: 'primary',
    shape: 'rounded',
    isOpen: false,
  },
});
