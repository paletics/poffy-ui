import { defineSlotRecipe } from '@pandacss/dev';
import { INTENTS } from '@poffy-ui/types';

const D_PROG = `${(1 / Math.SQRT2).toFixed(3)}s`;

const generateColorVariants = () => {
  const variants: Record<string, Record<string, Record<string, string>>> = {
    light: {
      track: { stroke: '{colors.variants.light.surface}' },
      indicator: { stroke: '{colors.variants.light.border}' },
      label: { color: '{colors.variants.light.border}' },
    },
    outline: {
      track: { stroke: '{colors.layout.divider}' },
      indicator: { stroke: '{colors.variants.outline.border}' },
      label: { color: '{colors.variants.outline.contrast}' },
    },
    ghost: {
      track: { stroke: '{colors.layout.divider}' },
      indicator: { stroke: '{colors.text.secondary}' },
      label: { color: '{colors.text.secondary}' },
    },
  };

  INTENTS.forEach((intent) => {
    variants[intent] = {
      track: { stroke: `{colors.variants.${intent}.surface}` },
      indicator: { stroke: `{colors.variants.${intent}.main}` },
      label: { color: `{colors.variants.${intent}.main}` },
    };
  });

  return variants;
};

/**
 * Styles the CircleProgress component slots with Panda CSS recipe variants.
 */
export const circleProgressRecipe = defineSlotRecipe({
  className: 'circle-progress',
  description: 'Circular progress styling for track, indicator, and label slots',
  slots: ['root', 'svg', 'track', 'indicator', 'label'],
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
      strokeDasharray: 'var(--circle-circumference) var(--circle-circumference)',
      strokeDashoffset: 'var(--circle-offset)',
    },
    label: {
      position: 'absolute',
      fontWeight: 'bold',
      fontFamily: 'sans-serif',
      color: '{colors.text.secondary}',
      fontSize: 'var(--label-size)',
    },
  },
  variants: {
    variant: generateColorVariants(),
    appearance: {
      solid: {},
      soft: {
        track: {
          opacity: 0.75,
        },
      },
    },
    animation: {
      progress: {
        indicator: {
          transition: `stroke-dashoffset ${D_PROG} cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
        },
      },
      none: {
        indicator: { animation: 'none', transition: 'none' },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    appearance: 'solid',
    animation: 'progress',
  },
});
