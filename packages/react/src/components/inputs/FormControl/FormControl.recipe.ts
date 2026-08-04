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
      minInlineSize: 0,
      maxInlineSize: '100%',
      boxSizing: 'border-box',
      position: 'relative',
    },
    label: {
      display: 'block',
      minInlineSize: 0,
      overflowWrap: 'anywhere',
      fontSize: 'md',
      marginInlineEnd: '{spacing.md}',
      marginBlockEnd: '{spacing.2xs}',
      fontWeight: 'medium',
      transition: 'all 0.2s',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
      opacity: 1,
      _disabled: {
        opacity: 0.4,
      },
    },
    helperText: {
      minInlineSize: 0,
      overflowWrap: 'anywhere',
      marginBlockStart: '{spacing.sm}',
      color: '{colors.text.secondary}',
      fontSize: 'sm',
      lineHeight: 'normal',
    },
    errorMessage: {
      minInlineSize: 0,
      overflowWrap: 'anywhere',
      marginBlockStart: '{spacing.sm}',
      color: '{colors.variants.danger.main}',
      fontSize: 'sm',
      display: 'flex',
      alignItems: 'center',
      '& > *': {
        minInlineSize: 0,
        maxInlineSize: '100%',
        overflowWrap: 'anywhere',
      },
    },
    requiredIndicator: {
      marginInlineStart: '{spacing.2xs}',
      color: '{colors.variants.danger.main}',
    },
  },
});
