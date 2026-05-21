import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Tag component slots with Panda CSS recipe variants.
 */
export const tagRecipe = defineSlotRecipe({
  className: 'tag',
  description: 'Tag styling for root, label, and close button slots',
  slots: ['root', 'label', 'closeButton'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '{spacing.2xs}',
      borderRadius: '{radii.md}',
      fontWeight: 'medium',
      lineHeight: '1.2',
      outline: 0,
      verticalAlign: 'top',
      maxWidth: '100%',
    },
    label: {
      lineHeight: '1.2',
      overflow: 'visible',
    },
    closeButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '0',
      opacity: 0.5,
      width: 'fit-content',
      height: 'fit-content',
      borderRadius: '{radii.sm}',
      marginLeft: '{spacing.xs}',
      cursor: 'pointer',
      transition: 'opacity {durations.fast} ease',
      _hover: {
        opacity: 0.8,
        bg: '{colors.layout.divider}',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: '{colors.brand.main}',
        outlineOffset: '2px',
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          px: '{spacing.sm}',
          minH: '{sizes.root.1}',
          fontSize: 'xs',
          borderRadius: '{radii.sm}',
        },
        closeButton: { marginRight: '{spacing.-2xs}', marginStart: '{spacing.2xs}' },
      },
      md: {
        root: {
          px: '{spacing.md}',
          minH: '{sizes.silver.2}',
          fontSize: 'sm',
          borderRadius: '{radii.md}',
        },
        closeButton: { marginRight: '{spacing.-2xs}', marginStart: '{spacing.xs}' },
      },
      lg: {
        root: {
          px: '{spacing.base}',
          minH: '{sizes.root.2}',
          fontSize: 'md',
          borderRadius: '{radii.md}',
        },
        closeButton: { marginRight: '{spacing.-2xs}', marginStart: '{spacing.sm}' },
      },
    },
    appearance: {
      soft: {
        root: { bg: 'var(--tag-surface)', color: 'var(--tag-main)' },
      },
      outline: {
        root: {
          border: '1px solid',
          borderColor: 'var(--tag-main)',
          color: 'var(--tag-main)',
        },
      },
      ghost: {
        root: {
          color: 'var(--tag-main)',
        },
      },
    },
    intent: {
      primary: {
        root: {
          '--tag-main': 'var(--poffy-colors-variants-primary-main)',
          '--tag-surface': 'var(--poffy-colors-variants-primary-surface)',
        },
      },
      secondary: {
        root: {
          '--tag-main': 'var(--poffy-colors-variants-secondary-main)',
          '--tag-surface': 'var(--poffy-colors-variants-secondary-surface)',
        },
      },
      info: {
        root: {
          '--tag-main': 'var(--poffy-colors-variants-info-main)',
          '--tag-surface': 'var(--poffy-colors-variants-info-surface)',
        },
      },
      success: {
        root: {
          '--tag-main': 'var(--poffy-colors-variants-success-main)',
          '--tag-surface': 'var(--poffy-colors-variants-success-surface)',
        },
      },
      warning: {
        root: {
          '--tag-main': 'var(--poffy-colors-variants-warning-main)',
          '--tag-surface': 'var(--poffy-colors-variants-warning-surface)',
        },
      },
      danger: {
        root: {
          '--tag-main': 'var(--poffy-colors-variants-danger-main)',
          '--tag-surface': 'var(--poffy-colors-variants-danger-surface)',
        },
      },
    },
    shape: {
      rounded: {
        root: { borderRadius: '{radii.md}' },
      },
      pill: {
        root: { borderRadius: '{radii.full}' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    appearance: 'soft',
    intent: 'primary',
    shape: 'rounded',
  },
});
