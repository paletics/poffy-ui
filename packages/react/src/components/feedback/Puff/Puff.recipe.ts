import { defineSlotRecipe, type SlotRecipeConfig } from '@pandacss/dev';
import { INTENTS } from '@poffy-ui/types';
import { createNeoBorderColor, createNeoShadowColor } from '../../../theme/neoStyles';

const generateCompoundVariants = (): SlotRecipeConfig['compoundVariants'] => {
  const variants: SlotRecipeConfig['compoundVariants'] = [];

  INTENTS.forEach((intent) => {
    const isLight = intent === 'light';
    const isDark = intent === 'dark';
    const tokenBase = `variants.${intent}`;

    const colors = {
      main: `${tokenBase}.main`,
      contrast: `${tokenBase}.contrast`,
      border: `${tokenBase}.border`,
      surface: `${tokenBase}.surface`,
      hover: `${tokenBase}.hover`,
      mainToken: `token(colors.${tokenBase}.main)`,
      borderToken: `token(colors.${tokenBase}.border)`,
    };
    const cssVars = {
      '--puff-accent-color': colors.mainToken,
      '--puff-shadow-color': colors.borderToken,
    };
    const neoShadow = createNeoShadowColor(colors.mainToken);
    variants.push({
      intent,
      appearance: 'solid',
      css: {
        root: {
          ...cssVars,
          bg: colors.main,
          color: colors.contrast,
          borderWidth: '{borderWidths.default}',
          borderStyle: 'solid',
          borderColor: colors.border,
        },
        title: {
          color: colors.contrast,
        },
        content: {
          color: colors.contrast,
        },
        simple: {
          ...cssVars,
          bg: colors.main,
          color: colors.contrast,
          borderWidth: '{borderWidths.default}',
          borderStyle: 'solid',
          borderColor: colors.border,
        },
      },
    });
    variants.push({
      intent,
      appearance: 'soft',
      css: {
        root: {
          ...cssVars,
          bg: colors.surface,
          color: colors.main,
          borderWidth: '{borderWidths.thin}',
          borderStyle: 'solid',
          borderColor: colors.main,
        },
        title: {
          color: colors.main,
        },
        content: {
          color: colors.main,
        },
        simple: {
          ...cssVars,
          bg: colors.surface,
          color: colors.main,
          borderWidth: '{borderWidths.thin}',
          borderStyle: 'solid',
          borderColor: colors.main,
        },
      },
    });
    variants.push({
      intent,
      appearance: 'neo',
      css: {
        root: {
          ...cssVars,
          '--neo-shadow-color': neoShadow,
          bg: colors.main,
          color: colors.contrast,
          borderWidth: '{borderWidths.strong}',
          borderStyle: 'solid',
          borderColor: createNeoBorderColor(colors.mainToken),
          boxShadow: '{shadowOffsets.md} {shadowOffsets.md} 0px var(--neo-shadow-color)',
        },
        title: {
          color: colors.contrast,
        },
        content: {
          color: colors.contrast,
        },
        simple: {
          ...cssVars,
          '--neo-shadow-color': neoShadow,
          bg: colors.main,
          color: colors.contrast,
          borderWidth: '{borderWidths.strong}',
          borderStyle: 'solid',
          borderColor: createNeoBorderColor(colors.mainToken),
          boxShadow: '{shadowOffsets.md} {shadowOffsets.md} 0px var(--neo-shadow-color)',
        },
      },
    });
    let glassColor = `[color-mix(in srgb, ${colors.mainToken}, #000000 25%)]`;
    if (isLight) glassColor = 'text.primary';
    if (isDark) glassColor = `[color-mix(in srgb, ${colors.mainToken}, #FFFFFF 25%)]`;

    variants.push({
      intent,
      appearance: 'glass',
      css: {
        root: {
          ...cssVars,
          bg: `[color-mix(in srgb, ${colors.mainToken} 25%, transparent)]`,
          color: glassColor,
          borderWidth: '{borderWidths.thin}',
          borderStyle: 'solid',
          borderColor: `[color-mix(in srgb, ${colors.mainToken} 40%, transparent)]`,
          backdropFilter: 'blur(12px)',
          boxShadow: '{shadows.sm}',
        },
        title: {
          color: glassColor,
        },
        content: {
          color: glassColor,
        },
        simple: {
          ...cssVars,
          bg: `[color-mix(in srgb, ${colors.mainToken} 25%, transparent)]`,
          color: glassColor,
          borderWidth: '{borderWidths.thin}',
          borderStyle: 'solid',
          borderColor: `[color-mix(in srgb, ${colors.mainToken} 40%, transparent)]`,
          backdropFilter: 'blur(12px)',
          boxShadow: '{shadows.sm}',
        },
      },
    });
    variants.push({
      intent,
      appearance: 'outline',
      css: {
        root: {
          ...cssVars,
          bg: 'transparent',
          color: colors.main,
          borderWidth: '{borderWidths.default}',
          borderStyle: 'solid',
          borderColor: colors.main,
        },
        title: {
          color: colors.main,
        },
        content: {
          color: colors.main,
        },
        simple: {
          ...cssVars,
          bg: 'transparent',
          color: colors.main,
          borderWidth: '{borderWidths.default}',
          borderStyle: 'solid',
          borderColor: colors.main,
        },
      },
    });
    variants.push({
      intent,
      appearance: 'minimal',
      css: {
        root: {
          ...cssVars,
          bg: colors.main,
          color: colors.contrast,
          border: 'none',
          boxShadow: '{shadows.md}',
        },
        simple: {
          ...cssVars,
          bg: colors.main,
          color: colors.contrast,
          border: 'none',
          boxShadow: '{shadows.md}',
        },
      },
    });
    variants.push({
      intent,
      appearance: 'ghost',
      css: {
        root: {
          bg: 'transparent',
          boxShadow: 'none',
          border: 'none',
        },
        simple: {
          bg: 'transparent',
          boxShadow: 'none',
          border: 'none',
        },
      },
    });
  });

  return variants;
};

/**
 * Styles the Puff component slots with Panda CSS recipe variants.
 */
export const puffRecipe = defineSlotRecipe({
  className: 'puff',
  description: 'Toast notification styling for container, root, title, content, and spacer slots',
  slots: ['container', 'viewport', 'root', 'simple', 'title', 'content', 'spacer'],
  base: {
    container: {
      display: 'flex',
      pointerEvents: 'none',
      position: 'fixed',
      zIndex: 'puff',
      '--puff-viewport-max-block-size':
        '[calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 2rem)]',
      maxWidth:
        '[calc(100vw - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px) - 2rem)]',
      maxHeight: 'var(--puff-viewport-max-block-size)',
      '@supports (width: 100dvw)': {
        maxWidth:
          '[calc(100dvw - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px) - 2rem)]',
      },
      '@supports (height: 100dvh)': {
        '--puff-viewport-max-block-size':
          '[calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 2rem)]',
      },
    },
    viewport: {
      display: 'flex',
      gap: '{spacing.sm}',
      maxWidth: '{sizes.full}',
      // Percentages cannot provide a reliable cap while the fixed container
      // sizes itself from its content. Use the same definite viewport cap.
      maxHeight: 'var(--puff-viewport-max-block-size)',
      // The viewport clips stacked notifications on both axes when either
      // overflow axis scrolls. Keep a complete external focus ring visible.
      boxSizing: 'border-box',
      paddingBlock: 'calc({focusRing.width} + {focusRing.offset})',
      paddingInline: 'calc({focusRing.width} + {focusRing.offset})',
      scrollPaddingBlock: 'calc({focusRing.width} + {focusRing.offset})',
      scrollPaddingInline: 'calc({focusRing.width} + {focusRing.offset})',
      // Actions are arbitrary consumer nodes. Give the actual focused node a
      // matching scroll margin, because native focus scrolling targets it
      // rather than the enclosing Puff surface.
      '& :focus-visible': {
        scrollMarginBlock: 'calc({focusRing.width} + {focusRing.offset})',
        scrollMarginInline: 'calc({focusRing.width} + {focusRing.offset})',
      },
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      pointerEvents: 'auto',
    },
    root: {
      pointerEvents: 'auto',
      width: 'fit-content',
      // The viewport owns overflow. A notification must retain its intrinsic
      // block size so a focusable action cannot be compressed out of its card.
      flexShrink: 0,
      borderRadius: '{radii.3xl}',
      boxShadow: '{shadows.xl}',
      display: 'flex',
      flexDirection: 'column',
      wordBreak: 'break-word',
    },
    simple: {
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '{radii.3xl}',
      boxShadow: '{shadows.xl}',
      width: 'fit-content',
      flexShrink: 0,
      wordBreak: 'break-word',
    },
    title: {
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      fontWeight: 'bold',
    },
    content: {
      pointerEvents: 'auto',
      lineHeight: '1.5',
      opacity: '0.85',
    },
    spacer: {
      marginInlineStart: 'auto',
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

    size: {
      sm: {
        root: {
          maxWidth: '{sizes.ratio.sm}',
          p: '{spacing.sm}',
          gap: '{spacing.xs}',
          minHeight: '{sizes.root.1}',
        },
        simple: {
          maxWidth: '{sizes.ratio.sm}',
          px: '{spacing.sm}',
          py: '{spacing.xs}',
          gap: '{spacing.xs}',
          minHeight: '{sizes.root.1}',
          fontSize: 'sm',
        },
        title: {
          gap: '{spacing.xs}',
          fontSize: 'sm',
        },
        content: {
          fontSize: 'sm',
        },
      },
      md: {
        root: {
          maxWidth: '{sizes.ratio.md}',
          minWidth: 'min({sizes.ratio.sm}, 100%)',
          p: '{spacing.md}',
          gap: '{spacing.sm}',
          minHeight: '{sizes.root.2}',
        },
        simple: {
          maxWidth: '{sizes.ratio.md}',
          minWidth: 'min({sizes.ratio.sm}, 100%)',
          px: '{spacing.md}',
          py: '{spacing.sm}',
          gap: '{spacing.sm}',
          minHeight: '{sizes.root.2}',
          fontSize: '{fontSizes.sm}',
        },
        title: {
          gap: '{spacing.xs}',
          fontSize: '{fontSizes.sm}',
        },
        content: {
          fontSize: '{fontSizes.sm}',
        },
      },
      lg: {
        root: {
          maxWidth: '{sizes.ratio.lg}',
          minWidth: 'min({sizes.ratio.md}, 100%)',
          p: '{spacing.base}',
          gap: '{spacing.sm}',
          minHeight: '{sizes.root.2}',
        },
        simple: {
          maxWidth: '{sizes.ratio.lg}',
          minWidth: 'min({sizes.ratio.md}, 100%)',
          px: '{spacing.base}',
          py: '{spacing.md}',
          gap: '{spacing.sm}',
          minHeight: '{sizes.root.2}',
          fontSize: 'md',
        },
        title: {
          gap: '{spacing.sm}',
          fontSize: 'md',
        },
        content: {
          fontSize: 'md',
        },
      },
    },
    appearance: {
      solid: {},
      soft: {},
      neo: {},
      glass: {},
      outline: {},
      minimal: {},
      ghost: {},
    },
    point: {
      'top-left': {
        container: {
          insetBlockStart: '[max({spacing.base}, env(safe-area-inset-top, 0px))]',
          left: '[max({spacing.base}, env(safe-area-inset-left, 0px))]',
        },
        viewport: { flexDirection: 'column', alignItems: 'flex-start' },
      },
      'top-center': {
        container: {
          insetBlockStart: '[max({spacing.base}, env(safe-area-inset-top, 0px))]',
          left: '50%',
          transform: 'translateX(-50%)',
        },
        viewport: { flexDirection: 'column', alignItems: 'center' },
      },
      'top-right': {
        container: {
          insetBlockStart: '[max({spacing.base}, env(safe-area-inset-top, 0px))]',
          right: '[max({spacing.base}, env(safe-area-inset-right, 0px))]',
        },
        viewport: { flexDirection: 'column', alignItems: 'flex-end' },
      },
      'bottom-left': {
        container: {
          insetBlockEnd: '[max({spacing.base}, env(safe-area-inset-bottom, 0px))]',
          left: '[max({spacing.base}, env(safe-area-inset-left, 0px))]',
        },
        viewport: { flexDirection: 'column-reverse', alignItems: 'flex-start' },
      },
      'bottom-center': {
        container: {
          insetBlockEnd: '[max({spacing.base}, env(safe-area-inset-bottom, 0px))]',
          left: '50%',
          transform: 'translateX(-50%)',
        },
        viewport: { flexDirection: 'column-reverse', alignItems: 'center' },
      },
      'bottom-right': {
        container: {
          insetBlockEnd: '[max({spacing.base}, env(safe-area-inset-bottom, 0px))]',
          right: '[max({spacing.base}, env(safe-area-inset-right, 0px))]',
        },
        viewport: { flexDirection: 'column-reverse', alignItems: 'flex-end' },
      },
      center: {
        container: {
          insetBlockStart: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        viewport: { flexDirection: 'column', alignItems: 'center' },
      },
    },
  },
  compoundVariants: generateCompoundVariants(),
  defaultVariants: {
    intent: 'primary',
    appearance: 'solid',
    point: 'top-right',
    size: 'md',
  },
});
