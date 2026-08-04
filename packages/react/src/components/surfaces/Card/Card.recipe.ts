import { defineSlotRecipe, type SlotRecipeConfig } from '@pandacss/dev';
import { INTENTS } from '@poffy-ui/types';
import {
  createNeoBorderColor,
  createNeoOverlayTextColor,
  createNeoShadowColor,
  createNeoTokens,
} from '../../../theme/neoStyles';

const cardCompoundVariants = (): SlotRecipeConfig['compoundVariants'] =>
  INTENTS.map((intent) => {
    const colors = createNeoTokens(intent);

    return {
      intent,
      appearance: 'neo',
      css: {
        root: {
          '--card-neo-shadow': createNeoShadowColor(colors.mainToken),
          bg: colors.main,
          color: colors.contrast,
          borderWidth: '{borderWidths.strong}',
          borderColor: createNeoBorderColor(colors.mainToken),
          boxShadow: '{shadowOffsets.lg} {shadowOffsets.lg} 0px var(--card-neo-shadow)',
        },
        header: {
          borderBottomColor: createNeoBorderColor(colors.mainToken),
        },
        body: {
          color: colors.contrast,
        },
        footer: {
          bg: `[color-mix(in srgb, ${colors.mainToken} 82%, #000000 18%)]`,
          color: createNeoOverlayTextColor(colors.mainToken, intent),
          borderTopColor: createNeoBorderColor(colors.mainToken),
        },
      },
    };
  });

/**
 * Styles the Card component slots with Panda CSS recipe variants.
 */
export const cardRecipe = defineSlotRecipe({
  className: 'card',
  description: 'Card styling for root, header, body, and footer slots',
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      minInlineSize: 0,
      borderRadius: '{radii.lg}',
      overflow: 'hidden',
      borderWidth: '{borderWidths.thin}',
      borderStyle: 'solid',
      borderColor: 'transparent',
      bg: '{colors.layout.surface}',
      color: '{colors.text.primary}',
      boxShadow: '{shadows.sm}',
      position: 'relative',
      // Preserve rounded media clipping normally, but do not clip an edge-aligned child focus ring.
      _focusWithin: {
        overflow: 'visible',
      },
    },
    header: {
      minInlineSize: 0,
      p: '{spacing.base}',
      fontWeight: 'semibold',
      overflowWrap: 'anywhere',
      borderBottomWidth: '1px',
      borderColor: 'inherit',
    },
    body: {
      minInlineSize: 0,
      p: '{spacing.base}',
      flex: '1',
      overflowWrap: 'anywhere',
    },
    footer: {
      minInlineSize: 0,
      p: '{spacing.base}',
      overflowWrap: 'anywhere',
      borderTopWidth: '1px',
      borderColor: 'inherit',
    },
  },
  defaultVariants: {
    appearance: 'solid',
    intent: 'primary',
    shape: 'rounded',
  },
  variants: {
    appearance: {
      solid: {
        root: {
          bg: '{colors.layout.surface}',
          borderColor: '{colors.layout.divider}',
          boxShadow: '{shadows.md}',
        },
        footer: {
          bg: '{colors.layout.background}',
        },
      },
      soft: {
        root: {
          bg: '{colors.brand.surface}',
          borderColor: '{colors.brand.border}',
          boxShadow: 'none',
        },
        footer: {
          bg: '{colors.brand.tint}',
        },
      },
      outline: {
        root: {
          bg: 'transparent',
          borderColor: '{colors.layout.divider}',
          boxShadow: 'none',
        },
        footer: {
          bg: 'transparent',
        },
      },
      ghost: {
        root: {
          bg: 'transparent',
          borderWidth: '0',
          borderColor: 'transparent',
          boxShadow: 'none',
        },
        header: {
          borderBottomColor: 'transparent',
        },
        footer: {
          bg: 'transparent',
          borderTopColor: 'transparent',
        },
      },
      glass: {
        root: {
          bg: 'color-mix(in srgb, {colors.layout.surface} 72%, transparent)',
          borderColor: 'color-mix(in srgb, {colors.layout.divider} 64%, transparent)',
          backdropFilter: 'blur(16px)',
          boxShadow: '{shadows.lg}',
        },
        footer: {
          bg: 'color-mix(in srgb, {colors.layout.background} 56%, transparent)',
        },
      },
      neo: {},
    },
    intent: {
      primary: {
        root: {
          borderColor: '{colors.brand.border}',
        },
      },
      secondary: {
        root: {
          borderColor: '{colors.variants.secondary.border}',
        },
      },
      info: {
        root: {
          borderColor: '{colors.variants.info.border}',
        },
      },
      success: {
        root: {
          borderColor: '{colors.variants.success.border}',
        },
      },
      warning: {
        root: {
          borderColor: '{colors.variants.warning.border}',
        },
      },
      danger: {
        root: {
          borderColor: '{colors.variants.danger.border}',
        },
      },
      light: {
        root: {
          borderColor: '{colors.variants.light.border}',
        },
      },
      dark: {
        root: {
          borderColor: '{colors.variants.dark.border}',
        },
      },
    },
    shape: {
      rounded: {
        root: {
          borderRadius: '{radii.lg}',
        },
      },
      square: {
        root: {
          borderRadius: '0',
        },
      },
    },
  },
  compoundVariants: cardCompoundVariants(),
});
