import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the TextRevealTransition component slots with Panda CSS recipe variants.
 */
export const textRevealTransitionRecipe = defineSlotRecipe({
  className: 'text-transition',
  description: 'Text reveal transition styling for root and character slots',
  slots: ['root', 'char'],
  base: {
    root: {
      display: 'inline-block',
      position: 'relative',
    },
    char: {
      display: 'inline-block',
      whiteSpace: 'pre',
      willChange: 'transform, opacity',
      lineHeight: '1.414',
    },
  },
});
