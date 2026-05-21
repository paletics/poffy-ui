import { defineRecipe, type RecipeConfig } from '@pandacss/dev';
import { INTENTS } from '@poffy-ui/types';
import {
  createNeoBorderColor,
  createNeoOverlayTextColor,
  createNeoShadowColor,
  createNeoTokens,
} from '../../../theme/neoStyles';

const generateCompoundVariants = (): RecipeConfig['compoundVariants'] => {
  const variants: RecipeConfig['compoundVariants'] = [];

  INTENTS.forEach((intent) => {
    const colors = createNeoTokens(intent);
    const cssVars = {
      '--btn-glow-color': colors.mainToken,
      '--btn-shadow-color': colors.borderToken,
      '--btn-focus-color': colors.mainToken,
    };
    // Shared by glass and outline appearances so their contrast rules cannot drift.
    const overlayTextColor = createNeoOverlayTextColor(colors.mainToken, intent);
    variants.push({
      intent,
      appearance: 'minimal',
      css: {
        ...cssVars,
        bg: colors.main,
        color: colors.contrast,
        border: 'none',
        borderColor: 'transparent',
        boxShadow: `none`,

        _hover: {
          bg: colors.surface,
          color: colors.main,
        },
        _active: {
          filter: 'brightness(0.9)',
        },
      },
    });
    variants.push({
      intent,
      appearance: 'solid',
      css: {
        ...cssVars,
        bg: colors.main,
        color: colors.contrast,
        borderWidth: '{borderWidths.default}',
        borderStyle: 'solid',
        borderColor: colors.border,
        boxShadow: `{shadowOffsets.sm} {shadowOffsets.sm} 0px var(--btn-shadow-color)`,

        _hover: {
          bg: colors.hover,
          color: colors.contrast,
        },
        _active: {},
      },
    });
    variants.push({
      intent,
      appearance: 'soft',
      css: {
        ...cssVars,
        bg: colors.surface,
        color: colors.main,
        borderWidth: '{borderWidths.default}',
        borderStyle: 'solid',
        borderColor: colors.surface,
        boxShadow: `{shadowOffsets.sm} {shadowOffsets.sm} 0px ${colors.mainToken}`,

        _hover: {
          bg: colors.main,
          color: colors.contrast,
          borderColor: colors.main,
        },
      },
    });
    variants.push({
      intent,
      appearance: 'neo',
      css: {
        ...cssVars,
        '--neo-shadow-color': createNeoShadowColor(colors.mainToken),

        bg: colors.main,
        color: colors.contrast,
        borderWidth: '{borderWidths.default}',
        borderStyle: 'solid',
        borderColor: createNeoBorderColor(colors.mainToken),
        boxShadow: '{shadowOffsets.lg} {shadowOffsets.lg} 0px var(--neo-shadow-color)',
      },
    });
    variants.push({
      intent,
      appearance: 'glass',
      css: {
        ...cssVars,
        bg: `[color-mix(in srgb, ${colors.mainToken} 25%, transparent)]`,
        color: overlayTextColor,
        borderWidth: '{borderWidths.default}',
        borderStyle: 'solid',
        borderColor: `[color-mix(in srgb, ${colors.mainToken} 60%, transparent)]`,
        boxShadow: 'none',
        backdropFilter: 'blur({blurs.lg})',

        _hover: {
          bg: `[color-mix(in srgb, ${colors.mainToken} 40%, transparent)]`,
        },
      },
    });
    variants.push({
      intent,
      appearance: 'outline',
      css: {
        ...cssVars,
        bg: `transparent`,
        color: overlayTextColor,
        borderWidth: '{borderWidths.default}',
        borderStyle: 'solid',
        borderColor: `[color-mix(in srgb, ${colors.mainToken} 60%, transparent)]`,
        backdropFilter: 'blur({blurs.lg})',

        _hover: {
          bg: colors.surface,
          color: colors.main,
          borderColor: colors.main,
        },
      },
    });
  });

  // NOTE: The default `ghost` appearance (no compound variant match) remains intent-agnostic,
  // using `text.primary` to blend with context. When `intent` is explicitly specified,
  // the compound variant below applies intent-specific coloring.
  INTENTS.forEach((intent) => {
    const tokenBase = `variants.${intent}`;
    const mainToken = `var(--poffy-colors-variants-${intent}-main)`;
    const colors = {
      main: `${tokenBase}.main`,
      surface: `${tokenBase}.surface`,
    };

    const isLight = intent === 'light';
    const isDark = intent === 'dark';
    let overlayTextColor = `[color-mix(in srgb, ${mainToken}, #000000 25%)]`;
    if (isLight) overlayTextColor = 'text.primary';
    if (isDark) overlayTextColor = `[color-mix(in srgb, ${mainToken}, #FFFFFF 25%)]`;

    variants.push({
      intent,
      appearance: 'ghost',
      css: {
        '--btn-focus-color': mainToken,
        color: overlayTextColor,
        _hover: {
          bg: colors.surface,
          color: colors.main,
        },
      },
    });
  });

  return variants;
};

/**
 * Styles for the Button component. All spacing and height values follow the Silver Ratio (1:1.414)
 * via tokens defined in `src/theme/tokens.ts`. Compound variants are generated programmatically
 * by `generateCompoundVariants()` to cover all `intent` × `appearance` combinations.
 *
 * ### Variant Logic
 * - **intent="primary"**: Highest visual weight CTA. Limit to one per view.
 * - **intent="secondary"**: Supporting action. Place alongside `primary` on the same surface.
 * - **intent="info" | "success" | "warning"**: Contextual feedback intents — status banners, toasts.
 * - **intent="danger"**: Destructive operations only (delete, revoke, unsubscribe).
 * - **intent="light" | "dark"**: Neutral surface intents for low-emphasis or monochrome layouts.
 * - **appearance="solid"**: Filled surface. Maximum prominence. Amplifies intent weight.
 * - **appearance="soft"**: Surface-tinted background. One step below `solid` — avoids visual competition.
 * - **appearance="neo"**: Neo-Brutalism style with thick border and hard shadow. Decorative / statement contexts.
 * - **appearance="glass"**: Frosted translucent surface. Use only on image or gradient backdrops.
 * - **appearance="outline"**: Border only. Secondary action hierarchy alongside `solid`.
 * - **appearance="ghost"**: No background. Use inside toolbars and list rows to blend into context.
 * - **appearance="minimal"**: Flat fill, no border. Highest information density — dense UIs only.
 * - **size="sm|md|lg"**: Choose based on surrounding content density. Default `md` in body contexts.
 * - **shape="rounded|pill|square"**: Controls corner radius — `pill` for the signature Poffy feel.
 * - **glow="true"**: Pulsing radial glow animation. Reserve for hero or primary-action emphasis.
 * - **isGrow="true"**: `width: full` — use inside flex containers that dictate width.
 *
 * ### AI Usage Constraints
 * - **DON'T**: Do not use `appearance="glass"` on solid-color backgrounds — it requires a translucent backdrop.
 * - **DON'T**: Do not define disabled styles as a variant — disabled state is handled via `[data-disabled]` / `[data-loading]` selectors in `base`.
 * - **DON'T**: Do not write animations in `base` — all motion is delegated to `ActionMotion`.
 */
export const buttonRecipe = defineRecipe({
  className: 'button',
  description:
    'Button styling for appearances, intents, sizes, icons, loading, and disabled states',
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

    _focusVisible: {
      outlineWidth: '{focusRing.width}',
      outlineStyle: 'solid',
      outlineColor: 'var(--btn-focus-color)',
      outlineOffset: '{focusRing.offset}',
    },
    // Transform is reserved for Motion; CSS transitions only handle color and shadow.
    transitionProperty: 'background-color, color, border-color, box-shadow, opacity, filter',
    transitionDuration: '{durations.fast}',
    transitionTimingFunction: '{easings.soft}',
    // When data-loading is present the button keeps its intent color (see &[data-loading] below).
    '&:is(:disabled, [disabled], [data-disabled]):not([data-loading])': {
      cursor: 'not-allowed',
      opacity: 0.5,
      filter: 'grayscale(0.8)',
      boxShadow: 'none !important',
      animation: 'none',
      bg: 'text.disabled',
      color: 'white',
      borderColor: 'transparent',
    },

    // Loading state: keeps the button's intent color but signals processing.
    // Opacity and pointer-events are controlled here so no JS-side dynamicStyles are needed.
    '&[data-loading]': {
      cursor: 'wait',
      opacity: 0.7,
      pointerEvents: 'none',
      animation: 'none',
    },

    '& svg': {
      width: '1.4em',
      height: '1.4em',
    },
    '& [data-part="icon"]': {
      display: 'inline-flex',
      alignItems: 'center',
    },
  },
  variants: {
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
    appearance: {
      solid: {},
      soft: {},
      neo: {},
      glass: {},
      minimal: {},
      outline: {},
      ghost: {
        bg: 'transparent',
        color: 'text.primary',
        borderWidth: '{borderWidths.default}',
        borderStyle: 'solid',
        borderColor: 'transparent',
        boxShadow: 'none',
        _hover: { bg: 'brand.surface' },
      },
    },
    size: {
      sm: {
        px: '{sizes.root.1}',
        h: '{sizes.silver.2}',
        gap: '{spacing.sm}',
        textStyle: 'button',
        fontSize: 'sm',
      },
      md: { px: '{sizes.silver.2}', h: '{sizes.root.2}', gap: '{spacing.md}', textStyle: 'button' },
      lg: { px: '{sizes.root.2}', h: '{sizes.silver.3}', gap: '{spacing.base}', textStyle: 'h6' },
    },
    shape: {
      rounded: { borderRadius: '{radii.md}' },
      pill: { borderRadius: '{radii.full}' },
      square: { borderRadius: '{radii.none}' },
    },
    glow: {
      true: {
        animation: 'glow 2s infinite ease-in-out',
      },
      false: {},
    },
    isGrow: {
      true: { width: '{sizes.full}' },
      false: {},
    },
  },
  compoundVariants: generateCompoundVariants(),
  defaultVariants: {
    intent: 'primary',
    appearance: 'solid',
    size: 'md',
    shape: 'rounded',
    glow: false,
    isGrow: false,
  },
});
