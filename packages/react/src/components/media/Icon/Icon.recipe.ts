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
      xs: { w: 'var(--poffy-icon-size, {spacing.md})', h: 'var(--poffy-icon-size, {spacing.md})' },
      sm: { w: 'var(--poffy-icon-size, {sizes.silver.1})', h: 'var(--poffy-icon-size, {sizes.silver.1})' },
      md: { w: 'var(--poffy-icon-size, {sizes.root.1})', h: 'var(--poffy-icon-size, {sizes.root.1})' },
      lg: { w: 'var(--poffy-icon-size, {sizes.silver.2})', h: 'var(--poffy-icon-size, {sizes.silver.2})' },
      xl: { w: 'var(--poffy-icon-size, {sizes.root.2})', h: 'var(--poffy-icon-size, {sizes.root.2})' },
      '2xl': { w: 'var(--poffy-icon-size, {sizes.silver.3})', h: 'var(--poffy-icon-size, {sizes.silver.3})' },
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
