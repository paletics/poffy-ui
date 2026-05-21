import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Radio Group component slots with Panda CSS recipe variants.
 */
export const radioGroupRecipe = defineSlotRecipe({
  className: 'radio-group',
  description: 'Radio group container styling for orientation, spacing, and disabled state',
  slots: ['root'],
  base: {
    root: {
      display: 'flex',
      gap: '{spacing.sm}',
    },
  },
  variants: {
    orientation: {
      vertical: {
        root: {
          flexDirection: 'column',
          gap: '{spacing.sm}',
        },
      },
      horizontal: {
        root: {
          flexDirection: 'row',
          gap: '{spacing.base}',
        },
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});
