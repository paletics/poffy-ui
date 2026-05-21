import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Progress Bar component slots with Panda CSS recipe variants.
 */
export const progressBarRecipe = defineSlotRecipe({
  className: 'progress-bar',
  description: 'Progress bar styling for root, track, bar, and label slots',
  slots: ['container', 'root', 'track', 'bar', 'label'],
  base: {
    container: {
      display: 'block',
      position: 'relative',
      width: 'var(--progress-width)',
    },
    root: {
      position: 'relative',
      overflow: 'hidden',
      display: 'block',
      width: '{sizes.full}',
      borderRadius: '{radii.full}',
      height: 'var(--progress-height)',
    },
    track: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '{sizes.full}',
    },
    bar: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      height: '{sizes.full}',
      width: 'var(--progress-bar-width)',
      bg: 'currentColor',
      transition: 'width 0.3s ease-in-out',
      zIndex: 1,
    },
    label: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      fontWeight: 'bold',
      pointerEvents: 'none',
      zIndex: 1,
      color: '{colors.text.secondary}',
      fontSize: 'var(--progress-font-size)',
    },
  },
  variants: {
    variant: {
      primary: {
        root: {
          borderColor: '{colors.variants.primary.border}',
          '--progress-label-on-bar': '{colors.variants.primary.contrast}',
        },
        track: { bg: '{colors.variants.primary.surface}' },
        bar: { color: '{colors.variants.primary.main}' },
      },
      secondary: {
        root: {
          borderColor: '{colors.variants.secondary.border}',
          '--progress-label-on-bar': '{colors.variants.secondary.contrast}',
        },
        track: { bg: '{colors.variants.secondary.surface}' },
        bar: { color: '{colors.variants.secondary.main}' },
      },
      info: {
        root: {
          borderColor: '{colors.variants.info.border}',
          '--progress-label-on-bar': '{colors.variants.info.contrast}',
        },
        track: { bg: '{colors.variants.info.surface}' },
        bar: { color: '{colors.variants.info.main}' },
      },
      success: {
        root: {
          borderColor: '{colors.variants.success.border}',
          '--progress-label-on-bar': '{colors.variants.success.contrast}',
        },
        track: { bg: '{colors.variants.success.surface}' },
        bar: { color: '{colors.variants.success.main}' },
      },
      warning: {
        root: {
          borderColor: '{colors.variants.warning.border}',
          '--progress-label-on-bar': '{colors.variants.warning.contrast}',
        },
        track: { bg: '{colors.variants.warning.surface}' },
        bar: { color: '{colors.variants.warning.main}' },
      },
      danger: {
        root: {
          borderColor: '{colors.variants.danger.border}',
          '--progress-label-on-bar': '{colors.variants.danger.contrast}',
        },
        track: { bg: '{colors.variants.danger.surface}' },
        bar: { color: '{colors.variants.danger.main}' },
      },
      light: {
        root: {
          borderColor: '{colors.variants.light.border}',
          '--progress-label-on-bar': '{colors.variants.light.contrast}',
        },
        track: { bg: '{colors.variants.light.surface}' },
        bar: { color: '{colors.variants.light.main}' },
      },
      dark: {
        root: {
          borderColor: '{colors.variants.dark.border}',
          '--progress-label-on-bar': '{colors.variants.dark.contrast}',
        },
        track: { bg: '{colors.variants.dark.surface}' },
        bar: { color: '{colors.variants.dark.main}' },
      },
      outline: {
        root: {
          borderColor: '{colors.variants.outline.border}',
          '--progress-label-on-bar': '{colors.variants.outline.contrast}',
        },
        track: { bg: '{colors.variants.outline.surface}' },
        bar: { color: '{colors.variants.outline.border}' },
      },
      ghost: {
        root: {
          borderColor: '{colors.variants.ghost.border}',
          '--progress-label-on-bar': '{colors.variants.ghost.contrast}',
        },
        track: { bg: '{colors.variants.ghost.surface}' },
        bar: { color: '{colors.variants.ghost.active}' },
      },
    },
    appearance: {
      solid: {},
      soft: {
        track: {
          opacity: 0.78,
        },
      },
      outline: {
        root: {
          borderWidth: '1px',
          borderStyle: 'solid',
        },
      },
    },
    shape: {
      rounded: {
        root: {
          borderRadius: '{radii.full}',
        },
      },
      square: {
        root: {
          borderRadius: '{radii.sm}',
        },
      },
    },
    pattern: {
      simple: {},
      dashed: {
        bar: {
          bg: 'transparent',
          backgroundImage:
            'repeating-linear-gradient(45deg, currentColor, currentColor 4px, transparent 4px, transparent 8px)',
          backgroundColor: 'color-mix(in srgb, currentColor 16%, transparent)',
        },
      },
    },

    animationType: {
      progress: {
        bar: {
          transition: `width ${(1 / Math.SQRT2).toFixed(3)}s cubic-bezier(0.4, 0, 0.2, 1)`,
        },
      },
      load: {
        bar: {
          w: `${((1 / Math.SQRT2) * 100).toFixed(1)}%`,
          animationName: 'progressLoad',
          animationDuration: `${(1 + Math.SQRT2).toFixed(3)}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out',
          zIndex: 2,
          transition: 'none',
        },
      },
    },
    borderType: {
      solid: { root: { borderStyle: 'solid', borderWidth: '2px' } },
      dashed: { root: { borderStyle: 'dashed', borderWidth: '2px' } },
      dotted: { root: { borderStyle: 'dotted', borderWidth: '2px' } },
      none: { root: { borderStyle: 'none' } },
    },
    // Label position variants. The component conditionally renders the label element
    // in different DOM locations (inside bar, inside root, or as sibling), so these
    // styles must match the rendering context for each position.
    labelPosition: {
      center: {
        label: {
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          minW: '{spacing.2xl}',
          minH: 'calc(var(--progress-font-size) * 1.45)',
          px: '{spacing.xs}',
          borderRadius: '{radii.full}',
          bg: 'color-mix(in srgb, {colors.layout.surface} 86%, transparent)',
          boxShadow: '0 0 0 1px color-mix(in srgb, {colors.layout.divider} 70%, transparent)',
        },
      },
      right: {
        label: {
          top: '50%',
          left: '100%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translateY(-50%)',
          paddingLeft: '{spacing.sm}',
          width: 'auto',
          justifyContent: 'flex-start',
        },
      },
      top: {
        label: {
          bottom: '100%',
          top: 'auto',
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
          paddingBottom: '{spacing.2xs}',
          width: 'auto',
        },
      },
      bottom: {
        label: {
          top: '100%',
          bottom: 'auto',
          left: '50%',
          right: 'auto',
          transform: 'translateX(-50%)',
          paddingTop: '{spacing.2xs}',
          width: 'auto',
        },
      },
      inside: {
        label: {
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          display: 'block',
          width: '{sizes.full}',
          maxWidth: '{sizes.full}',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          px: '{spacing.xs}',
          color: 'var(--progress-label-on-bar)',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    appearance: 'solid',
    shape: 'rounded',
    pattern: 'simple',
  },
});
