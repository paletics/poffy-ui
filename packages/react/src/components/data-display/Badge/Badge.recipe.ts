import { defineSlotRecipe } from '@pandacss/dev';

const BADGE_INTENTS = [
  'primary',
  'secondary',
  'danger',
  'success',
  'warning',
  'info',
  'light',
  'dark',
] as const;

const BADGE_APPEARANCES = ['solid', 'soft', 'outline'] as const;

/**
 * Styles the Badge component slots with Panda CSS recipe variants.
 */
export const badgeRecipe = defineSlotRecipe({
  className: 'badge',
  description: 'Badge styling for root and badge slots',
  slots: ['root', 'badge'],
  base: {
    root: {
      position: 'relative',
      width: 'fit-content',
      height: 'fit-content',
      display: 'inline-flex',
      lineHeight: 1,
    },
    badge: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      transition: 'all 0.2s',
      border: '1px solid transparent',
    },
  },
  variants: {
    size: {
      sm: {
        badge: {
          minW: '{sizes.silver.1}',
          h: '{sizes.silver.1}',
          fontSize: 'xs',
          px: '{spacing.xs}',
        },
      },
      md: {
        badge: { minW: '{sizes.root.1}', h: '{sizes.root.1}', fontSize: 'xs', px: '{spacing.sm}' },
      },
      lg: {
        badge: {
          minW: '{sizes.silver.2}',
          h: '{sizes.silver.2}',
          fontSize: 'sm',
          px: '{spacing.md}',
        },
      },
    },
    placement: {
      'top-right': { badge: { top: '0', right: '0', transform: 'translate(50%, -50%)' } },
      'top-left': { badge: { top: '0', left: '0', transform: 'translate(-50%, -50%)' } },
      'bottom-right': { badge: { bottom: '0', right: '0', transform: 'translate(50%, 50%)' } },
      'bottom-left': { badge: { bottom: '0', left: '0', transform: 'translate(-50%, 50%)' } },
      center: { badge: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } },
    },
    intent: {
      primary: {},
      secondary: {},
      danger: {},
      success: {},
      warning: {},
      info: {},
      light: {},
      dark: {},
    },
    appearance: {
      solid: {},
      soft: {},
      outline: {},
    },
    shape: {
      rounded: { badge: { borderRadius: '{radii.md}' } },
      pill: { badge: { borderRadius: '{radii.full}' } },
    },
  },
  compoundVariants: BADGE_INTENTS.flatMap((intent) =>
    BADGE_APPEARANCES.map((appearance) => {
      if (appearance === 'solid') {
        return {
          intent,
          appearance,
          css: {
            badge: {
              bg: `variants.${intent}.main`,
              color: `variants.${intent}.contrast`,
              borderColor: 'transparent',
            },
          },
        };
      }

      if (appearance === 'soft') {
        return {
          intent,
          appearance,
          css: {
            badge: {
              bg: `variants.${intent}.surface`,
              color: `variants.${intent}.main`,
              borderColor: `variants.${intent}.border`,
            },
          },
        };
      }

      return {
        intent,
        appearance,
        css: {
          badge: {
            bg: 'transparent',
            color: `variants.${intent}.main`,
            borderColor: `variants.${intent}.main`,
          },
        },
      };
    }),
  ),
  defaultVariants: {
    size: 'md',
    placement: 'top-right',
    intent: 'primary',
    appearance: 'solid',
    shape: 'pill',
  },
});
