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
            border: '1px solid',
            borderColor: colors.border,
            borderInlineStartColor: 'color-mix(in srgb, currentColor 28%, transparent)',
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
            border: '1px solid',
            borderColor: colors.surface,
            borderInlineStartColor: colors.main,
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
            border: '1px solid',
            borderColor: colors.main,
            borderInlineStartColor: colors.border,
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
            border: '1px solid',
            borderColor: colors.border,
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
            borderWidth: 0,
            borderInlineStartWidth: '1px',
            borderInlineStartStyle: 'solid',
            borderInlineStartColor: 'color-mix(in srgb, currentColor 28%, transparent)',
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
      maxWidth: '{sizes.full}',
      minWidth: 0,
    },

    mainButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '1 1 auto',
      gap: '{spacing.sm}',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: 'body',
      textAlign: 'center',
      // Preserve the intrinsic content-fit width used by the standard size
      // galleries. Emergency narrow layouts need an explicit compact contract;
      // wrapping here makes even short labels collapse one character per line.
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '{sizes.full}',
      minWidth: 0,
      userSelect: 'none',
      outline: 'none',
      border: 'none',
      borderStartEndRadius: 0,
      borderEndEndRadius: 0,
      borderInlineEndWidth: '0',
      transitionProperty: 'background-color, color, border-color, box-shadow',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      _focusVisible: {
        position: 'relative',
        zIndex: 1,
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
      flexShrink: 1,
      minInlineSize: '{sizes.control.minimumTarget}',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontFamily: 'body',
      userSelect: 'none',
      outline: 'none',
      border: 'none',
      boxShadow: 'none !important',
      borderStartStartRadius: '0 !important',
      borderEndStartRadius: '0 !important',
      borderInlineStart: '1px solid',
      transitionProperty: 'background-color, color, border-color, box-shadow',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      _focusVisible: {
        position: 'relative',
        zIndex: 1,
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
      boxSizing: 'border-box',
      width:
        '[min(max(11rem, var(--floating-reference-width, 11rem)), var(--floating-available-width, 100vw))]',
      maxWidth: 'var(--floating-available-width, 100vw)',
      maxHeight: 'min(8rem, var(--floating-available-height, 8rem))',
      overflowX: 'hidden',
      overflowY: 'auto',
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
      minWidth: 0,
      minInlineSize: 0,
      overflowWrap: 'anywhere',
      px: '{spacing.md}',
      py: '{spacing.sm}',
      cursor: 'pointer',
      fontSize: 'sm',
      color: '{colors.text.primary}',
      bg: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'start',
      _hover: {
        bg: '{colors.brand.surface}',
      },
      _focusVisible: {
        position: 'relative',
        zIndex: 1,
        outlineWidth: '{focusRing.width}',
        outlineStyle: 'solid',
        outlineColor: '{colors.brand.main}',
        outlineOffset: '{focusRing.insetOffset}',
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
      flexShrink: 0,
    },
  },

  variants: {
    size: {
      sm: {
        mainButton: {
          px: '{sizes.root.1}',
          minH: '{sizes.silver.2}',
          py: '{spacing.2xs}',
          textStyle: 'button',
          fontSize: 'sm',
        },
        dropdownButton: {
          flexBasis: 'calc({sizes.silver.2} + {spacing.xs})',
          width: 'calc({sizes.silver.2} + {spacing.xs})',
          minH: '{sizes.silver.2}',
          '--poffy-icon-size': '{sizes.silver.1}',
        },
      },
      md: {
        mainButton: {
          px: '{sizes.silver.2}',
          minH: '{sizes.root.2}',
          py: '{spacing.xs}',
          textStyle: 'button',
          fontSize: 'md',
        },
        dropdownButton: {
          flexBasis: 'calc({sizes.root.2} + {spacing.xs})',
          width: 'calc({sizes.root.2} + {spacing.xs})',
          minH: '{sizes.root.2}',
          '--poffy-icon-size': '{sizes.root.1}',
        },
      },
      lg: {
        mainButton: {
          px: '{sizes.root.2}',
          minH: '{sizes.silver.3}',
          py: '{spacing.sm}',
          textStyle: 'h6',
          fontSize: 'lg',
        },
        dropdownButton: {
          flexBasis: 'calc({sizes.silver.3} + {spacing.xs})',
          width: 'calc({sizes.silver.3} + {spacing.xs})',
          minH: '{sizes.silver.3}',
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
          borderStartStartRadius: '{radii.xl}',
          borderEndStartRadius: '{radii.xl}',
        },
        dropdownButton: {
          borderStartEndRadius: '{radii.xl} !important',
          borderEndEndRadius: '{radii.xl} !important',
        },
      },
      pill: {
        mainButton: {
          borderStartStartRadius: '{radii.full}',
          borderEndStartRadius: '{radii.full}',
        },
        dropdownButton: {
          borderStartEndRadius: '{radii.full} !important',
          borderEndEndRadius: '{radii.full} !important',
        },
      },
      square: {
        mainButton: {
          borderStartStartRadius: '{radii.none}',
          borderEndStartRadius: '{radii.none}',
        },
        dropdownButton: {
          borderStartEndRadius: '{radii.none} !important',
          borderEndEndRadius: '{radii.none} !important',
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
