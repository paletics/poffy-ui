import { defineSlotRecipe, type SlotRecipeConfig } from '@pandacss/dev';
import { createNeoBorderColor, createNeoShadowColor } from '../../../theme/neoStyles';

const DIRECTIONAL_INTENTS = ['primary', 'secondary', 'info', 'light', 'dark'] as const;
const DIRECTIONAL_APPEARANCES = ['solid', 'soft', 'outline', 'ghost', 'neo'] as const;

const generateCompoundVariants = (): SlotRecipeConfig['compoundVariants'] => {
  const variants: NonNullable<SlotRecipeConfig['compoundVariants']> = [];

  DIRECTIONAL_INTENTS.forEach((intent) => {
    const colors = {
      main: `{colors.variants.${intent}.main}`,
      contrast: `{colors.variants.${intent}.contrast}`,
      border: `{colors.variants.${intent}.border}`,
      surface: `{colors.variants.${intent}.surface}`,
      hover: `{colors.variants.${intent}.hover}`,
    };

    DIRECTIONAL_APPEARANCES.forEach((appearance) => {
      if (appearance === 'solid') {
        variants.push({
          intent,
          appearance,
          css: {
            button: {
              bg: colors.main,
              color: colors.contrast,
              borderWidth: '{borderWidths.thin}',
              borderStyle: 'solid',
              borderColor: colors.border,
              _hover: {
                bg: colors.hover,
              },
            },
          },
        });
        return;
      }

      if (appearance === 'soft') {
        variants.push({
          intent,
          appearance,
          css: {
            button: {
              bg: colors.surface,
              color: colors.main,
              borderWidth: '{borderWidths.thin}',
              borderStyle: 'solid',
              borderColor: colors.surface,
              _hover: {
                bg: colors.main,
                color: colors.contrast,
                borderColor: colors.main,
              },
            },
          },
        });
        return;
      }

      if (appearance === 'outline') {
        variants.push({
          intent,
          appearance,
          css: {
            button: {
              bg: 'transparent',
              color: colors.main,
              borderWidth: '{borderWidths.thin}',
              borderStyle: 'solid',
              borderColor: colors.main,
              _hover: {
                bg: colors.surface,
              },
            },
          },
        });
        return;
      }

      if (appearance === 'ghost') {
        variants.push({
          intent,
          appearance,
          css: {
            button: {
              bg: 'transparent',
              color: colors.main,
              _hover: {
                bg: colors.surface,
              },
            },
          },
        });
        return;
      }

      variants.push({
        intent,
        appearance,
        css: {
          button: {
            '--directional-neo-shadow': createNeoShadowColor(
              `var(--poffy-colors-variants-${intent}-main)`,
            ),
            bg: colors.main,
            color: colors.contrast,
            borderWidth: '{borderWidths.default}',
            borderStyle: 'solid',
            borderColor: createNeoBorderColor(`var(--poffy-colors-variants-${intent}-main)`),
            boxShadow: '{shadowOffsets.lg} {shadowOffsets.lg} 0px var(--directional-neo-shadow)',
          },
        },
      });
    });
  });

  variants.push(
    {
      connected: true,
      orientation: 'horizontal',
      css: {
        group: {
          '& [data-directional-button] + [data-directional-button]': {
            borderLeftWidth: '{borderWidths.thin}',
            borderLeftColor: 'brand.border',
            borderLeftStyle: 'solid',
          },
        },
      },
    },
    {
      connected: true,
      orientation: 'vertical',
      css: {
        group: {
          '& [data-directional-button] + [data-directional-button]': {
            borderTopWidth: '{borderWidths.thin}',
            borderTopColor: 'brand.border',
            borderTopStyle: 'solid',
          },
        },
      },
    },
  );

  return variants;
};

/**
 * Styles the Directional Button component slots with Panda CSS recipe variants.
 */
export const directionalButtonRecipe = defineSlotRecipe({
  className: 'directionalButton',
  description: 'Directional button styling for button, group, and icon slots',
  slots: ['button', 'group', 'icon'],
  base: {
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderWidth: '0',
      outline: '0',
      appearance: 'none',
      userSelect: 'none',
      cursor: 'pointer',
      lineHeight: '1',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      transitionProperty: 'background-color, color, box-shadow, border-color, transform',
      '& svg': {
        width: '1em',
        height: '1em',
        flexShrink: 0,
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
        opacity: 0.4,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
    group: {
      display: 'inline-flex',
      alignItems: 'stretch',
      position: 'relative',
    },
    icon: {
      display: 'inline-flex',
      flexShrink: 0,
    },
  },
  variants: {
    size: {
      sm: {
        button: {
          minWidth: '{sizes.silver.2}',
          minHeight: '{sizes.silver.2}',
          fontSize: 'xs',
          px: '{spacing.xs}',
        },
        group: {
          borderRadius: '{radii.xl}',
        },
      },
      md: {
        button: {
          minWidth: '{sizes.root.2}',
          minHeight: '{sizes.root.2}',
          fontSize: 'sm',
          px: '{spacing.sm}',
        },
        group: {
          borderRadius: '{radii.2xl}',
        },
      },
      lg: {
        button: {
          minWidth: '{sizes.silver.3}',
          minHeight: '{sizes.silver.3}',
          fontSize: 'md',
          px: '{spacing.md}',
        },
        group: {
          borderRadius: '{radii.3xl}',
        },
      },
    },
    appearance: {
      solid: {},
      soft: {},
      outline: {},
      ghost: {},
      neo: {},
    },
    intent: {
      primary: {},
      secondary: {},
      info: {},
      light: {},
      dark: {},
    },
    shape: {
      rounded: {
        button: { borderRadius: '{radii.md}' },
      },
      pill: {
        button: { borderRadius: '{radii.full}' },
      },
      square: {
        button: { borderRadius: '{radii.none}' },
      },
    },
    orientation: {
      horizontal: {
        group: {
          flexDirection: 'row',
        },
      },
      vertical: {
        group: {
          flexDirection: 'column',
        },
      },
    },
    connected: {
      true: {
        group: {
          overflow: 'hidden',
          borderWidth: '{borderWidths.default}',
          borderColor: 'brand.border',
        },
        button: {
          borderRadius: '{radii.none}',
          boxShadow: 'none',
        },
      },
      false: {},
    },
    direction: {
      right: {
        icon: {
          transform: 'rotate(0deg)',
        },
      },
      down: {
        icon: {
          transform: 'rotate(90deg)',
        },
      },
      left: {
        icon: {
          transform: 'rotate(180deg)',
        },
      },
      up: {
        icon: {
          transform: 'rotate(270deg)',
        },
      },
    },
  },
  compoundVariants: generateCompoundVariants(),
  defaultVariants: {
    size: 'md',
    appearance: 'soft',
    intent: 'primary',
    shape: 'rounded',
    orientation: 'horizontal',
    connected: false,
    direction: 'right',
  },
});
