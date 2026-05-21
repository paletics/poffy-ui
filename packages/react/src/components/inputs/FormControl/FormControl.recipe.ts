import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Form Control component slots with Panda CSS recipe variants.
 */
export const formControlRecipe = defineSlotRecipe({
  className: 'form-control',
  description:
    'Form control styling for root, label, helper text, error message, and required indicator slots',
  slots: ['root', 'label', 'helperText', 'errorMessage', 'requiredIndicator'],
  base: {
    root: {
      width: '100%',
      position: 'relative',
    },
    label: {
      display: 'block',
      fontSize: 'md',
      marginRight: '{spacing.md}',
      marginBottom: '{spacing.2xs}',
      fontWeight: 'medium',
      transition: 'all 0.2s',
      opacity: 1,
      _disabled: {
        opacity: 0.4,
      },
    },
    helperText: {
      marginTop: '{spacing.sm}',
      color: '{colors.text.secondary}',
      fontSize: 'sm',
      lineHeight: 'normal',
    },
    errorMessage: {
      marginTop: '{spacing.sm}',
      color: '{colors.variants.danger.main}',
      fontSize: 'sm',
      display: 'flex',
      alignItems: 'center',
    },
    requiredIndicator: {
      marginLeft: '{spacing.2xs}',
      color: '{colors.variants.danger.main}',
    },
  },
});
