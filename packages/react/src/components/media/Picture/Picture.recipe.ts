import { defineRecipe } from '@pandacss/dev';

/**
 * Styles the Picture component with Panda CSS recipe variants.
 */
export const pictureRecipe = defineRecipe({
  className: 'picture',
  description: 'Picture styling for responsive image containers',
  base: {
    display: 'block',
    maxWidth: '100%',
  },
  variants: {
    fit: {
      cover: { '& > img': { objectFit: 'cover' } },
      contain: { '& > img': { objectFit: 'contain' } },
      fill: { '& > img': { objectFit: 'fill' } },
      none: { '& > img': { objectFit: 'none' } },
      'scale-down': { '& > img': { objectFit: 'scale-down' } },
    },
  },
  defaultVariants: {
    fit: 'cover',
  },
});
