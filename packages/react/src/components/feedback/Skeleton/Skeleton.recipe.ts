import { defineRecipe } from '@pandacss/dev';

/**
 * Styles Skeleton placeholders and owns their animation and sizing strategies.
 *
 * Animation strategy:
 * - `pulse`: CSS keyframe only (`pulse 1.5s ease-in-out infinite`).
 * - `shimmer`: CSS `_after` pseudo-element with `shimmer` keyframe.
 * - `none`: No animation applied.
 *
 * Sizing strategy:
 * - `width` / `height` are arbitrary consumer values, so the component injects CSS
 *   variables. The recipe owns how those values map to each shape.
 */
export const skeletonRecipe = defineRecipe({
  className: 'skeleton',
  description: 'Skeleton placeholder styling for loading surfaces',
  base: {
    display: 'inline-block',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    position: 'relative',
    overflow: 'hidden',
    minWidth: 0,
    maxWidth: '100%',
  },
  defaultVariants: {
    variant: 'secondary',
    shape: 'text',
    animation: 'pulse',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '{colors.variants.primary.tint}',
        color: '{colors.variants.primary.main}',
      },
      secondary: {
        backgroundColor: '{colors.variants.secondary.tint}',
        color: '{colors.variants.secondary.main}',
      },
      info: {
        backgroundColor: '{colors.variants.info.tint}',
        color: '{colors.variants.info.main}',
      },
      success: {
        backgroundColor: '{colors.variants.success.tint}',
        color: '{colors.variants.success.main}',
      },
      warning: {
        backgroundColor: '{colors.variants.warning.tint}',
        color: '{colors.variants.warning.main}',
      },
      danger: {
        backgroundColor: '{colors.variants.danger.tint}',
        color: '{colors.variants.danger.main}',
      },
      light: {
        backgroundColor: '{colors.variants.light.tint}',
        color: '{colors.variants.light.main}',
      },
      dark: {
        backgroundColor: '{colors.variants.dark.tint}',
        color: '{colors.variants.dark.main}',
      },
    },
    shape: {
      text: {
        height: 'var(--skeleton-height, 1.2em)',
        width: 'var(--skeleton-width, 100%)',
        borderRadius: '{radii.sm}',
        maxWidth: '100%',
      },
      circle: {
        width: 'var(--skeleton-width, {sizes.root.2})',
        height: 'var(--skeleton-height, auto)',
        borderRadius: '{radii.full}',
        flexShrink: 0,
        aspectRatio: '1',
        maxWidth: '100%',
      },
      rect: {
        width: 'var(--skeleton-width, 100%)',
        height: 'var(--skeleton-height, {sizes.silver.3})',
        borderRadius: '{radii.md}',
        maxWidth: '100%',
      },
    },
    animation: {
      pulse: {
        animation: 'pulse 1.5s ease-in-out infinite',
        _motionSubtle: {
          animationDuration: '2.25s',
        },
        _motionPop: {
          animationDuration: '1.2s',
        },
      },
      shimmer: {
        _after: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, currentColor, transparent)',
          opacity: 0.2,
          animation: 'shimmer 1.5s infinite linear',
          _motionSubtle: {
            animationDuration: '2.25s',
          },
          _motionPop: {
            animationDuration: '1.2s',
          },
        },
      },
      none: {},
    },
  },
});
