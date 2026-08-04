import { defineRecipe } from '@pandacss/dev';
import { INTENTS } from '@poffy-ui/types';
import { iconButtonBaseStyles } from '../icon-button.shared';
import {
  createNeoBorderColor,
  createNeoOverlayTextColor,
  createNeoShadowColor,
  createNeoTokens,
} from '../../../theme/neoStyles';

const ICON_BUTTON_APPEARANCES = [
  'minimal',
  'solid',
  'soft',
  'neo',
  'glass',
  'outline',
  'ghost',
] as const;

const generateCompoundVariants = () => {
  return INTENTS.flatMap((intent) =>
    ICON_BUTTON_APPEARANCES.map((appearance) => {
      const colors = createNeoTokens(intent);

      const cssVars = {
        '--icon-btn-focus-color': colors.mainToken,
        '--icon-btn-shadow-color': colors.borderToken,
      };

      const overlayTextColor = createNeoOverlayTextColor(colors.mainToken, intent);

      if (appearance === 'minimal') {
        return {
          intent,
          appearance,
          css: {
            ...cssVars,
            bg: colors.main,
            color: colors.contrast,
            border: 'none',
            boxShadow: 'none',
            _hover: {
              bg: colors.surface,
              color: colors.main,
            },
          },
        };
      }

      if (appearance === 'solid') {
        return {
          intent,
          appearance,
          css: {
            ...cssVars,
            bg: colors.main,
            color: colors.contrast,
            borderWidth: '{borderWidths.default}',
            borderStyle: 'solid',
            borderColor: colors.border,
            boxShadow: '{shadowOffsets.sm} {shadowOffsets.sm} 0px var(--icon-btn-shadow-color)',
            _hover: {
              bg: colors.hover,
            },
          },
        };
      }

      if (appearance === 'soft') {
        return {
          intent,
          appearance,
          css: {
            ...cssVars,
            bg: colors.surface,
            color: colors.main,
            borderWidth: '{borderWidths.default}',
            borderStyle: 'solid',
            borderColor: colors.surface,
            boxShadow: '{shadowOffsets.sm} {shadowOffsets.sm} 0px var(--icon-btn-shadow-color)',
            _hover: {
              bg: colors.main,
              color: colors.contrast,
              borderColor: colors.main,
            },
          },
        };
      }

      if (appearance === 'neo') {
        return {
          intent,
          appearance,
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
        };
      }

      if (appearance === 'glass') {
        return {
          intent,
          appearance,
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
        };
      }

      if (appearance === 'outline') {
        return {
          intent,
          appearance,
          css: {
            ...cssVars,
            bg: 'transparent',
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
        };
      }

      return {
        intent,
        appearance,
        css: {
          ...cssVars,
          bg: 'transparent',
          color: overlayTextColor,
          borderWidth: '{borderWidths.default}',
          borderStyle: 'solid',
          borderColor: 'transparent',
          boxShadow: 'none',
          _hover: {
            bg: colors.surface,
            color: colors.main,
          },
        },
      };
    }),
  );
};

/**
 * Styles the Icon Button component with Panda CSS recipe variants.
 */
export const iconButtonRecipe = defineRecipe({
  className: 'icon-button',
  description: 'Icon-only button for compact UIs and toolbars',

  base: {
    ...iconButtonBaseStyles,

    '& svg': {
      width: '1em',
      height: '1em',
      flexShrink: 0,
    },
    '& [data-disclosure-icon]': {
      display: 'inline-flex',
      transition: 'transform 160ms ease',
      _motionSubtle: { transition: 'transform {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'transform {durations.standard} {easings.bounce}' },
    },
    '&[data-state="open"] [data-disclosure-icon]': {
      transform: 'rotate(180deg)',
    },
  },

  variants: {
    size: {
      xs: {
        width: '{sizes.control.minimumTarget}',
        height: '{sizes.control.minimumTarget}',
        fontSize: 'sm',
      },
      sm: {
        width: '{sizes.silver.2}',
        height: '{sizes.silver.2}',
        fontSize: 'md',
      },
      md: {
        width: '{sizes.root.2}',
        height: '{sizes.root.2}',
        fontSize: 'lg',
      },
      lg: {
        width: '{sizes.silver.3}',
        height: '{sizes.silver.3}',
        fontSize: 'xl',
      },
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
    appearance: {
      solid: {},
      soft: {},
      outline: {},
      ghost: {},
      minimal: {},
      neo: {},
      glass: {},
    },
    shape: {
      square: {
        borderRadius: '{radii.none}',
      },
      rounded: {
        borderRadius: '{radii.md}',
      },
      pill: {
        borderRadius: '{radii.full}',
      },
    },
  },
  compoundVariants: generateCompoundVariants(),

  defaultVariants: {
    size: 'md',
    intent: 'primary',
    appearance: 'ghost',
    shape: 'pill',
  },
});
