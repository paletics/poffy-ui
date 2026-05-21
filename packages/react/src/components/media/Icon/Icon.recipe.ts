import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Icon component with Panda CSS recipe variants.
 */
export const iconRecipe = defineRecipe({
  className: 'icon',
  description: 'Icon styling for size, color, and decorative SVG behavior',
  base: {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
    aspectRatio: '1 / 1',
    '--poffy-icon-stroke-width': '2px',
    // fill/stroke are managed per variant to prevent CSS cascade conflicts
    // with fill-based child path elements.
  },
  variants: {
    size: {
      xs: { w: 'var(--poffy-icon-size, 11.3px)', h: 'var(--poffy-icon-size, 11.3px)' },
      sm: { w: 'var(--poffy-icon-size, 16px)', h: 'var(--poffy-icon-size, 16px)' },
      md: { w: 'var(--poffy-icon-size, 22.6px)', h: 'var(--poffy-icon-size, 22.6px)' },
      lg: { w: 'var(--poffy-icon-size, 32px)', h: 'var(--poffy-icon-size, 32px)' },
      xl: { w: 'var(--poffy-icon-size, 45.2px)', h: 'var(--poffy-icon-size, 45.2px)' },
      '2xl': { w: 'var(--poffy-icon-size, 64px)', h: 'var(--poffy-icon-size, 64px)' },
    },
    variant: {
      // Stroke-based icon (default). Renders paths using currentColor stroke and no fill.
      // Customise line weight via --poffy-icon-stroke-width.
      stroke: {
        '&': {
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 'var(--poffy-icon-stroke-width)',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
      },
      // Fill-based icon. Use for solid/monochrome icons such as CheckIcon or CopyIcon.
      filled: {
        '&': {
          fill: 'currentColor',
          stroke: 'none',
        },
      },
    },
    disabled: {
      true: { opacity: 0.4, filter: 'grayscale(1)' },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'stroke',
  },
});
