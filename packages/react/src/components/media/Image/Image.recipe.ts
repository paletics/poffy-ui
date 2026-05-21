import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Image component with Panda CSS recipe variants.
 */
export const imageRecipe = defineRecipe({
  className: 'image',
  description: 'Responsive image styling for aspect ratio, radius, and fit variants',
  base: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
  },
  variants: {
    fit: {
      cover: { objectFit: 'cover' },
      contain: { objectFit: 'contain' },
      fill: { objectFit: 'fill' },
      none: { objectFit: 'none' },
      'scale-down': { objectFit: 'scale-down' },
    },
    aspectRatio: {
      square: { aspectRatio: '1 / 1' },
      video: { aspectRatio: '16 / 9' },
      wide: { aspectRatio: '2 / 1' },
      portrait: { aspectRatio: '3 / 4' },
      auto: { aspectRatio: 'auto' },
    },
    radius: {
      none: { borderRadius: '{radii.none}' },
      sm: { borderRadius: '{radii.sm}' },
      md: { borderRadius: '{radii.md}' },
      lg: { borderRadius: '{radii.lg}' },
      xl: { borderRadius: '{radii.xl}' },
      full: { borderRadius: '{radii.full}' },
    },
  },
  defaultVariants: {
    fit: 'cover',
    radius: 'none',
  },
});
