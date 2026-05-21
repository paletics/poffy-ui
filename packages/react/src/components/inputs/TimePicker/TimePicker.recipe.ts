import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Time Picker component slots with Panda CSS recipe variants.
 */
export const timePickerRecipe = defineSlotRecipe({
  className: 'time-picker',
  description: 'Time picker layout styling for segmented time inputs and separators',
  slots: ['root', 'segment', 'separator', 'meridiem'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '{spacing.xs}',
      flexWrap: 'nowrap',
    },
    segment: {},
    separator: {
      fontWeight: 'medium',
      color: '{colors.text.secondary}',
    },
    meridiem: {},
  },
  variants: {
    size: {
      sm: {
        segment: { width: '6.25rem' },
        separator: { fontSize: 'sm' },
        meridiem: { width: '4.75rem' },
      },
      md: {
        segment: { width: '7rem' },
        separator: { fontSize: 'md' },
        meridiem: { width: '5.25rem' },
      },
      lg: {
        segment: { width: '8rem' },
        separator: { fontSize: 'lg' },
        meridiem: { width: '6rem' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
