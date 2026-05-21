import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Empty State component slots with Panda CSS recipe variants.
 */
export const emptyStateRecipe = defineSlotRecipe({
  className: 'empty-state',
  description: 'Empty state styling for icon, title, description, and action slots',
  slots: ['root', 'icon', 'title', 'description', 'actions'],
  base: {
    root: {
      '--empty-state-main': 'var(--poffy-colors-variants-primary-main)',
      '--empty-state-surface': 'var(--poffy-colors-brand-tint)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '{spacing.xl}',
      borderRadius: '{radii.md}',
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: 'layout.divider',
      backgroundColor: 'var(--empty-state-surface)',
      width: '100%',
    },
    icon: {
      color: 'var(--empty-state-main)',
      width: '{sizes.root.2}',
      height: '{sizes.root.2}',
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
      fontSize: 'lg',
      marginBottom: '{spacing.2xs}',
      lineHeight: 'tight',
    },
    description: {
      color: 'text.secondary',
      fontSize: 'sm',
      maxWidth: '{sizes.sm}',
      marginBottom: '{spacing.lg}',
    },
    actions: {
      display: 'flex',
      gap: '{spacing.md}',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  variants: {
    size: {
      sm: {
        root: { padding: '{spacing.lg}' },
        icon: {
          width: '{sizes.silver.2}',
          height: '{sizes.silver.2}',
          marginBottom: '{spacing.sm}',
        },
        title: { fontSize: 'md' },
        description: { fontSize: 'xs' },
      },
      md: {
        root: { padding: '{spacing.xl}' },
        icon: { width: '{sizes.root.2}', height: '{sizes.root.2}', marginBottom: '{spacing.lg}' },
        title: { fontSize: 'lg' },
        description: { fontSize: 'sm' },
      },
      lg: {
        root: { padding: '{spacing.2xl}' },
        icon: {
          width: '{sizes.silver.3}',
          height: '{sizes.silver.3}',
          marginBottom: '{spacing.xl}',
        },
        title: { fontSize: 'xl' },
        description: { fontSize: 'md' },
      },
    },
    variant: {
      dashed: {
        root: { borderStyle: 'dashed', backgroundColor: 'transparent' },
      },
      solid: {
        root: { borderStyle: 'solid', backgroundColor: 'var(--empty-state-surface)' },
      },
      elevated: {
        root: { borderStyle: 'none', boxShadow: '{shadows.md}', bg: 'layout.surface' },
      },
      flat: {
        root: { borderStyle: 'none', bg: 'var(--empty-state-surface)' },
      },
    },
    intent: {
      primary: {
        root: {
          '--empty-state-main': 'var(--poffy-colors-variants-primary-main)',
          '--empty-state-surface': 'var(--poffy-colors-variants-primary-surface)',
        },
      },
      secondary: {
        root: {
          '--empty-state-main': 'var(--poffy-colors-variants-secondary-main)',
          '--empty-state-surface': 'var(--poffy-colors-variants-secondary-surface)',
        },
      },
      info: {
        root: {
          '--empty-state-main': 'var(--poffy-colors-variants-info-main)',
          '--empty-state-surface': 'var(--poffy-colors-variants-info-surface)',
        },
      },
      success: {
        root: {
          '--empty-state-main': 'var(--poffy-colors-variants-success-main)',
          '--empty-state-surface': 'var(--poffy-colors-variants-success-surface)',
        },
      },
      warning: {
        root: {
          '--empty-state-main': 'var(--poffy-colors-variants-warning-main)',
          '--empty-state-surface': 'var(--poffy-colors-variants-warning-surface)',
        },
      },
      danger: {
        root: {
          '--empty-state-main': 'var(--poffy-colors-variants-danger-main)',
          '--empty-state-surface': 'var(--poffy-colors-variants-danger-surface)',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'flat',
    intent: 'primary',
  },
});
