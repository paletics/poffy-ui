import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Date Time Picker component slots with Panda CSS recipe variants.
 */
export const dateTimePickerRecipe = defineSlotRecipe({
  className: 'date-time-picker',
  description: 'Date-time picker layout styling for date and time input composition',
  slots: ['root', 'date', 'time'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.md}',
      flexWrap: 'wrap',
    },
    date: {
      minWidth: '15rem',
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: '16rem',
    },
    time: {
      flexShrink: 0,
    },
  },
});
