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
      width: '100%',
      maxWidth: '100%',
      minWidth: 0,
      boxSizing: 'border-box',
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
      scrollbarWidth: 'thin',
      scrollPaddingInline: '{spacing.2xs}',
      px: '{spacing.2xs}',
      // Do not add focus-ring clearance to the control height: this compound
      // field needs to align with DatePicker at each public size.
      py: '0',
      scrollPaddingBlock: 'calc({focusRing.width} + {focusRing.offset})',
    },
    segment: {
      flexShrink: 1,
      minWidth: '{sizes.silver.3}',
    },
    separator: {
      fontWeight: 'medium',
      color: '{colors.text.secondary}',
    },
    meridiem: {
      flexShrink: 1,
      minWidth: '{sizes.silver.3}',
    },
  },
  variants: {
    size: {
      sm: {
        segment: { width: '6.25rem', minWidth: '{sizes.root.2}' },
        separator: { fontSize: 'sm' },
        meridiem: { width: '4.75rem', minWidth: '{sizes.root.2}' },
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
