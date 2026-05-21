import { cva } from '@/styled-system/css';

/**
 * Styles the Checkbox Group layout with Panda CSS cva variants.
 */
export const checkboxGroupRecipe = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'md',
  },
  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      vertical: {
        flexDirection: 'column',
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});
