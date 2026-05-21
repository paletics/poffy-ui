import { defineSlotRecipe } from '@pandacss/dev';
import { INTENTS } from '@poffy-ui/types';

const S2 = Math.SQRT2;
const D_FULL = `${(2 * (1 + S2)).toFixed(3)}s`;
const D_SMALL = `${(1 + S2).toFixed(3)}s`;
const SPIN_ARC = `calc(var(--circumference) * ${(1 / S2).toFixed(5)}) calc(var(--circumference) * ${(1 - 1 / S2).toFixed(5)})`;

const generateColorVariants = () => {
  const variants: Record<string, Record<string, Record<string, string>>> = {
    light: {
      track: { stroke: '{colors.variants.light.surface}' },
      indicator: { stroke: '{colors.variants.light.border}' },
    },
    outline: {
      track: { stroke: '{colors.layout.divider}' },
      indicator: { stroke: '{colors.variants.outline.border}' },
    },
    ghost: {
      track: { stroke: '{colors.layout.divider}' },
      indicator: { stroke: '{colors.text.secondary}' },
    },
  };

  INTENTS.forEach((intent) => {
    variants[intent] = {
      track: { stroke: `{colors.variants.${intent}.surface}` },
      indicator: { stroke: `{colors.variants.${intent}.main}` },
    };
  });

  return variants;
};

/**
 * Styles the Spinner component slots with Panda CSS recipe variants.
 */
export const spinnerRecipe = defineSlotRecipe({
  className: 'spinner',
  description: 'Spinner styling for root, track, and indicator slots',
  slots: ['root', 'svg', 'track', 'indicator'],
  base: {
    root: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    svg: { transform: 'rotate(-90deg)', transformOrigin: 'center' },
    track: { fill: 'transparent', stroke: '{colors.layout.divider}' },
    indicator: {
      fill: 'transparent',
      strokeLinecap: 'round',
      transformOrigin: 'center',
      transformBox: 'fill-box',
    },
  },
  variants: {
    variant: generateColorVariants(),
    animation: {
      spin: {
        indicator: {
          animation: `spin ${D_SMALL} linear infinite`,
          strokeDasharray: SPIN_ARC,
          willChange: 'transform',
        },
      },
      dash: {
        indicator: {
          animation: `circle-dash ${D_FULL} cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite`,
          strokeDasharray: 'var(--circumference) var(--circumference)',
          willChange: 'transform, stroke-dashoffset',
          transition: 'none',
        },
      },
      breathe: {
        indicator: {
          animation: `breathe ${D_FULL} cubic-bezier(0.4, 0, 0.2, 1) infinite`,
          strokeDasharray: 'var(--circumference) var(--circumference)',
          willChange: 'opacity, stroke-dashoffset',
          transition: 'none',
        },
      },
      'pop-spin': {
        indicator: {
          animation: `pop-spin ${D_FULL} ease-in-out infinite`,
          strokeDasharray: 'var(--circumference) var(--circumference)',
          willChange: 'transform, stroke-dashoffset',
          transition: 'none',
        },
      },
      'refined-dash': {
        indicator: {
          animation: `refined-dash ${D_FULL} ease-in-out infinite`,
          strokeDasharray: 'var(--circumference) var(--circumference)',
          willChange: 'transform, stroke-dashoffset',
          transition: 'none',
        },
      },
      'orbit-glow': {
        indicator: { animation: 'none', transition: 'none' },
      },
      trail: {
        indicator: { animation: 'none', transition: 'none' },
      },
      elastic: {
        indicator: { animation: 'none', transition: 'none' },
      },
      silver: {
        indicator: { animation: 'none', transition: 'none' },
      },
      none: {
        indicator: { animation: 'none', transition: 'none' },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    animation: 'spin',
  },
});
