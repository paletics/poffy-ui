import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Stat component slots with Panda CSS recipe variants.
 */
export const statRecipe = defineSlotRecipe({
  className: 'stat',
  description: 'Stat styling for label, value, helper, trend, and icon slots',
  slots: ['root', 'label', 'number', 'helpText', 'arrow'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    label: {
      fontWeight: 'medium',
      fontSize: 'sm',
      color: 'text.secondary',
    },
    number: {
      fontWeight: 'bold',
      fontSize: '2xl',
      lineHeight: 1,
      marginTop: '{spacing.2xs}',
    },
    helpText: {
      fontSize: 'sm',
      color: 'text.secondary',
      display: 'flex',
      alignItems: 'center',
      marginTop: '{spacing.2xs}',
    },
    arrow: {
      marginRight: '{spacing.2xs}',
      width: '{spacing.md}',
      height: '{spacing.md}',
      display: 'inline-block',
      lineHeight: 1,
      verticalAlign: 'middle',
    },
  },
  variants: {
    size: {
      sm: {
        label: { fontSize: 'sm' },
        number: { fontSize: 'xl' },
        helpText: { fontSize: 'sm' },
      },
      md: {
        label: { fontSize: 'sm' },
        number: { fontSize: '2xl' },
        helpText: { fontSize: 'sm' },
      },
      lg: {
        label: { fontSize: 'md' },
        number: { fontSize: '3xl' },
        helpText: { fontSize: 'sm' },
      },
    },
    type: {
      increase: {
        arrow: { color: 'emerald.500' },
      },
      decrease: {
        arrow: { color: 'rose.500' },
      },
    },
    intent: {
      success: {
        number: { color: '{colors.variants.success.main}' },
        helpText: { color: '{colors.variants.success.main}' },
      },
      warning: {
        number: { color: '{colors.variants.warning.main}' },
        helpText: { color: '{colors.variants.warning.main}' },
      },
      danger: {
        number: { color: '{colors.variants.danger.main}' },
        helpText: { color: '{colors.variants.danger.main}' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
