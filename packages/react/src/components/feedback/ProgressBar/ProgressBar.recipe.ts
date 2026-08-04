import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Progress Bar component slots with Panda CSS recipe variants.
 */
export const progressBarRecipe = defineSlotRecipe({
  className: 'progress-bar',
  description: 'Progress bar styling for root, track, bar, and label slots',
  slots: ['container', 'root', 'track', 'bar', 'label', 'measurement'],
  base: {
    container: {
      display: 'grid',
      position: 'relative',
      width: 'var(--progress-width)',
      maxWidth: '{sizes.full}',
      minWidth: 0,
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
      insetInlineStart: 0,
      bottom: 0,
      width: '{sizes.full}',
    },
    bar: {
      position: 'absolute',
      top: 0,
      insetInlineStart: 0,
      bottom: 0,
      height: '{sizes.full}',
      width: 'var(--progress-bar-width)',
      bg: 'currentColor',
      transition: 'none',
      zIndex: 1,
    },
    label: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 0,
      maxWidth: '{sizes.full}',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
      fontWeight: 'bold',
      pointerEvents: 'none',
      zIndex: 1,
      color: '{colors.text.secondary}',
      fontSize: 'var(--progress-font-size)',
    },
    measurement: {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      width: 'max-content',
      fontWeight: 'bold',
      fontSize: 'var(--progress-font-size)',
      lineHeight: 'normal',
      contain: 'layout style paint',
    },
  },
  variants: {
    intent: {
      primary: {
        container: {
          '--progress-label-on-bar': '{colors.variants.primary.contrast}',
        },
        root: {
          borderColor: '{colors.variants.primary.border}',
        },
        track: { bg: '{colors.variants.primary.surface}' },
        bar: { color: '{colors.variants.primary.main}' },
      },
      secondary: {
        container: {
          '--progress-label-on-bar': '{colors.variants.secondary.contrast}',
        },
        root: {
          borderColor: '{colors.variants.secondary.border}',
        },
        track: { bg: '{colors.variants.secondary.surface}' },
        bar: { color: '{colors.variants.secondary.main}' },
      },
      info: {
        container: {
          '--progress-label-on-bar': '{colors.variants.info.contrast}',
        },
        root: {
          borderColor: '{colors.variants.info.border}',
        },
        track: { bg: '{colors.variants.info.surface}' },
        bar: { color: '{colors.variants.info.main}' },
      },
      success: {
        container: {
          '--progress-label-on-bar': '{colors.variants.success.contrast}',
        },
        root: {
          borderColor: '{colors.variants.success.border}',
        },
        track: { bg: '{colors.variants.success.surface}' },
        bar: { color: '{colors.variants.success.main}' },
      },
      warning: {
        container: {
          '--progress-label-on-bar': '{colors.variants.warning.contrast}',
        },
        root: {
          borderColor: '{colors.variants.warning.border}',
        },
        track: { bg: '{colors.variants.warning.surface}' },
        bar: { color: '{colors.variants.warning.main}' },
      },
      danger: {
        container: {
          '--progress-label-on-bar': '{colors.variants.danger.contrast}',
        },
        root: {
          borderColor: '{colors.variants.danger.border}',
        },
        track: { bg: '{colors.variants.danger.surface}' },
        bar: { color: '{colors.variants.danger.main}' },
      },
      light: {
        container: {
          '--progress-label-on-bar': '{colors.variants.light.contrast}',
        },
        root: {
          borderColor: '{colors.variants.light.border}',
        },
        track: { bg: '{colors.variants.light.surface}' },
        bar: { color: '{colors.variants.light.main}' },
      },
      dark: {
        container: {
          '--progress-label-on-bar': '{colors.variants.dark.contrast}',
        },
        root: {
          borderColor: '{colors.variants.dark.border}',
        },
        track: { bg: '{colors.variants.dark.surface}' },
        bar: { color: '{colors.variants.dark.main}' },
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
      none: {
        bar: {
          animation: 'none',
          transition: 'none',
        },
      },
      progress: {
        bar: {
          transition: `width ${(1 / Math.SQRT2).toFixed(3)}s cubic-bezier(0.4, 0, 0.2, 1)`,
          _motionSubtle: {
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          _motionPop: {
            transition: 'width 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          },
        },
      },
      load: {
        bar: {
          w: `${((1 / Math.SQRT2) * 100).toFixed(1)}%`,
          animationName: 'progressLoad',
          animationDuration: `${(1 + Math.SQRT2).toFixed(3)}s`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out',
          _motionSubtle: {
            animationDuration: '3.621s',
          },
          _motionPop: {
            animationDuration: '1.932s',
          },
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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto',
          maxWidth: '{sizes.full}',
          minH: 'calc(var(--progress-font-size) * 1.45)',
          px: '{spacing.xs}',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          borderRadius: '{radii.full}',
          bg: 'color-mix(in srgb, {colors.layout.surface} 86%, transparent)',
          boxShadow: '0 0 0 1px color-mix(in srgb, {colors.layout.divider} 70%, transparent)',
        },
      },
      right: {
        container: {
          gridTemplateColumns: 'minmax(0, 1fr) fit-content(40%)',
          columnGap: '{spacing.sm}',
          alignItems: 'center',
        },
        root: {
          gridColumn: '1',
          width: '{sizes.full}',
          maxWidth: '{sizes.full}',
          minWidth: 0,
        },
        label: {
          gridColumn: '2',
          justifySelf: 'start',
          textAlign: 'start',
          width: 'auto',
          justifyContent: 'flex-start',
        },
      },
      top: {
        container: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          rowGap: '{spacing.2xs}',
        },
        root: {
          gridColumn: '1',
          gridRow: '2',
        },
        label: {
          gridColumn: '1',
          gridRow: '1',
          justifySelf: 'center',
          textAlign: 'center',
          width: 'auto',
        },
      },
      bottom: {
        container: {
          gridTemplateColumns: 'minmax(0, 1fr)',
          rowGap: '{spacing.2xs}',
        },
        root: {
          gridColumn: '1',
          gridRow: '1',
        },
        label: {
          gridColumn: '1',
          gridRow: '2',
          justifySelf: 'center',
          textAlign: 'center',
          width: 'auto',
        },
      },
      inside: {
        label: {
          position: 'absolute',
          top: '50%',
          insetInlineStart: 0,
          transform: 'translateY(-50%)',
          display: 'block',
          width: 'var(--progress-bar-width)',
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
    intent: 'primary',
    appearance: 'solid',
    shape: 'rounded',
    pattern: 'simple',
  },
});
