import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Result component slots with Panda CSS recipe variants.
 */
export const resultRecipe = defineSlotRecipe({
  className: 'result',
  description: 'Result state styling for icon, title, description, and action slots',
  slots: ['root', 'icon', 'title', 'description', 'actions'],
  base: {
    root: {
      '--result-main': 'var(--poffy-colors-variants-info-main)',
      '--result-surface': 'var(--poffy-colors-variants-info-surface)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      paddingBlock: '{spacing.2xl}',
      paddingInline: 'clamp({spacing.md}, 10%, {spacing.2xl})',
      borderRadius: '{radii.lg}',
      width: '100%',
      minWidth: 0,
      maxWidth: '100%',
    },
    icon: {
      width: '{sizes.silver.3}',
      height: '{sizes.silver.3}',
      marginBottom: '{spacing.lg}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& svg': {
        width: '100%',
        height: '100%',
      },
    },
    title: {
      fontWeight: 'bold',
      fontSize: '2xl',
      marginBottom: '{spacing.sm}',
      lineHeight: 'tight',
      minWidth: 0,
      maxWidth: '100%',
      overflowWrap: 'anywhere',
    },
    description: {
      color: '{colors.text.secondary}',
      fontSize: 'md',
      maxWidth: '{sizes.md}',
      marginBottom: '{spacing.xl}',
      lineHeight: 'relaxed',
      minWidth: 0,
      overflowWrap: 'anywhere',
    },
    actions: {
      display: 'flex',
      gap: '{spacing.md}',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: '100%',
    },
  },
  variants: {
    status: {
      success: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-success-main)',
          '--result-surface': 'var(--poffy-colors-variants-success-surface)',
        },
        icon: { color: '{colors.variants.success.main}' },
        title: { color: '{colors.text.primary}' },
      },
      error: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-danger-main)',
          '--result-surface': 'var(--poffy-colors-variants-danger-surface)',
        },
        icon: { color: '{colors.variants.danger.main}' },
        title: { color: '{colors.text.primary}' },
      },
      warning: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-warning-main)',
          '--result-surface': 'var(--poffy-colors-variants-warning-surface)',
        },
        icon: { color: '{colors.variants.warning.main}' },
        title: { color: '{colors.text.primary}' },
      },
      info: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-info-main)',
          '--result-surface': 'var(--poffy-colors-variants-info-surface)',
        },
        icon: { color: '{colors.variants.info.main}' },
        title: { color: '{colors.text.primary}' },
      },
    },
    appearance: {
      soft: {
        root: {
          backgroundColor: 'var(--result-surface)',
        },
      },
      outline: {
        root: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--result-main)',
          backgroundColor: 'transparent',
        },
      },
    },
  },
  defaultVariants: {
    status: 'info',
    appearance: 'soft',
  },
});
