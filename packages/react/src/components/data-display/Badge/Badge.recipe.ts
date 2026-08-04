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
      '&[data-standalone]': {
        boxSizing: 'border-box',
        minInlineSize: 0,
        maxInlineSize: '100%',
      },
      // A delegated interactive root owns the focus outline. Keep an anchored
      // indicator below that outline while it is visible.
      '&:focus-visible > [data-badge-indicator]': {
        zIndex: 'auto',
      },
    },
    badge: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      pointerEvents: 'none',
      transition: 'all 0.2s',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
      border: '1px solid transparent',
      '&[data-standalone]': {
        position: 'static',
        transform: 'none !important',
        boxSizing: 'border-box',
        minInlineSize: 0,
        maxInlineSize: '100%',
      },
      '& [data-badge-standalone-content]': {
        display: 'block',
        minInlineSize: 0,
        maxInlineSize: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
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
      'top-start': {
        badge: {
          insetBlockStart: '0',
          insetInlineStart: '0',
          transform: 'translate(-50%, -50%)',
          '&:dir(rtl)': { transform: 'translate(50%, -50%)' },
        },
      },
      'top-end': {
        badge: {
          insetBlockStart: '0',
          insetInlineEnd: '0',
          transform: 'translate(50%, -50%)',
          '&:dir(rtl)': { transform: 'translate(-50%, -50%)' },
        },
      },
      'bottom-start': {
        badge: {
          insetBlockEnd: '0',
          insetInlineStart: '0',
          transform: 'translate(-50%, 50%)',
          '&:dir(rtl)': { transform: 'translate(50%, 50%)' },
        },
      },
      'bottom-end': {
        badge: {
          insetBlockEnd: '0',
          insetInlineEnd: '0',
          transform: 'translate(50%, 50%)',
          '&:dir(rtl)': { transform: 'translate(-50%, 50%)' },
        },
      },
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
