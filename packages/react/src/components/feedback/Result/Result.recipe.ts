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
      padding: '{spacing.2xl}',
      borderRadius: '{radii.lg}',
      width: '100%',
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
    },
    description: {
      color: 'text.secondary',
      fontSize: 'md',
      maxWidth: '{sizes.md}',
      marginBottom: '{spacing.xl}',
      lineHeight: 'relaxed',
    },
    actions: {
      display: 'flex',
      gap: '{spacing.md}',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
  variants: {
    status: {
      success: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-success-main)',
          '--result-surface': 'var(--poffy-colors-variants-success-surface)',
        },
        icon: { color: 'emerald.700' },
        title: { color: 'emerald.700' },
      },
      error: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-danger-main)',
          '--result-surface': 'var(--poffy-colors-variants-danger-surface)',
        },
        icon: { color: 'rose.700' },
        title: { color: 'rose.700' },
      },
      warning: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-warning-main)',
          '--result-surface': 'var(--poffy-colors-variants-warning-surface)',
        },
        icon: { color: 'yellow.800' },
        title: { color: 'yellow.800' },
      },
      info: {
        root: {
          '--result-main': 'var(--poffy-colors-variants-info-main)',
          '--result-surface': 'var(--poffy-colors-variants-info-surface)',
        },
        icon: { color: 'cyan.700' },
        title: { color: 'cyan.700' },
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
