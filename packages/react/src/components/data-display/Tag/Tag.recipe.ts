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
      boxSizing: 'border-box',
      minInlineSize: 0,
      maxWidth: '100%',
    },
    label: {
      minWidth: 0,
      lineHeight: '1.2',
      overflowWrap: 'break-word',
      wordBreak: 'normal',
      whiteSpace: 'normal',
    },
    closeButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: '0',
      opacity: 0.5,
      flexShrink: 0,
      minInlineSize: '{sizes.control.minimumTarget}',
      minBlockSize: '{sizes.control.minimumTarget}',
      borderRadius: '{radii.sm}',
      marginInlineStart: '{spacing.xs}',
      cursor: 'pointer',
      transition: 'opacity {durations.fast} ease',
      _motionSubtle: { transition: 'opacity {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'opacity {durations.standard} {easings.bounce}' },
      _hover: {
        opacity: 0.8,
        bg: '{colors.layout.divider}',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: '{colors.brand.main}',
        outlineOffset: '-2px',
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
        closeButton: { marginInlineEnd: '{spacing.-2xs}', marginInlineStart: '{spacing.2xs}' },
      },
      md: {
        root: {
          px: '{spacing.md}',
          minH: '{sizes.silver.2}',
          fontSize: 'sm',
          borderRadius: '{radii.md}',
        },
        closeButton: { marginInlineEnd: '{spacing.-2xs}', marginInlineStart: '{spacing.xs}' },
      },
      lg: {
        root: {
          px: '{spacing.base}',
          minH: '{sizes.root.2}',
          fontSize: 'md',
          borderRadius: '{radii.md}',
        },
        closeButton: { marginInlineEnd: '{spacing.-2xs}', marginInlineStart: '{spacing.sm}' },
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
