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
  slots: ['container', 'root', 'simple', 'title', 'content', 'spacer'],
  base: {
    container: {
      display: 'flex',
      pointerEvents: 'none',
      position: 'fixed',
      zIndex: 'puff',
      gap: '{spacing.sm}',
      maxWidth: '[calc(100vw - 2rem)]',
    },
    root: {
      pointerEvents: 'auto',
      width: 'fit-content',
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
      marginLeft: 'auto',
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
          minWidth: '{sizes.ratio.sm}',
          p: '{spacing.md}',
          gap: '{spacing.sm}',
          minHeight: '{sizes.root.2}',
        },
        simple: {
          maxWidth: '{sizes.ratio.md}',
          minWidth: '{sizes.ratio.sm}',
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
          minWidth: '{sizes.ratio.md}',
          p: '{spacing.base}',
          gap: '{spacing.sm}',
          minHeight: '{sizes.root.2}',
        },
        simple: {
          maxWidth: '{sizes.ratio.lg}',
          minWidth: '{sizes.ratio.md}',
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
          flexDirection: 'column',
          alignItems: 'flex-start',
          top: '{spacing.base}',
          left: '{spacing.base}',
          right: 'auto',
          bottom: 'auto',
          transform: 'none',
        },
      },
      'top-center': {
        container: {
          flexDirection: 'column',
          alignItems: 'center',
          top: '{spacing.base}',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translateX(-50%)',
        },
      },
      'top-right': {
        container: {
          flexDirection: 'column',
          alignItems: 'flex-end',
          top: '{spacing.base}',
          right: '{spacing.base}',
          left: 'auto',
          bottom: 'auto',
          transform: 'none',
        },
      },
      'bottom-left': {
        container: {
          flexDirection: 'column-reverse',
          alignItems: 'flex-start',
          bottom: '{spacing.base}',
          left: '{spacing.base}',
          right: 'auto',
          top: 'auto',
          transform: 'none',
        },
      },
      'bottom-center': {
        container: {
          flexDirection: 'column-reverse',
          alignItems: 'center',
          bottom: '{spacing.base}',
          left: '50%',
          right: 'auto',
          top: 'auto',
          transform: 'translateX(-50%)',
        },
      },
      'bottom-right': {
        container: {
          flexDirection: 'column-reverse',
          alignItems: 'flex-end',
          bottom: '{spacing.base}',
          right: '{spacing.base}',
          left: 'auto',
          top: 'auto',
          transform: 'none',
        },
      },
      center: {
        container: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          flexDirection: 'column',
          alignItems: 'center',
        },
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
