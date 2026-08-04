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
    '& > img': {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
    },
  },
  variants: {
    sizing: {
      intrinsic: {},
      fluid: {
        width: '100%',
        '& > img': {
          width: '100%',
          height: 'auto',
        },
      },
      fill: {
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        '& > img': {
          width: '100%',
          height: '100%',
          minWidth: 0,
          minHeight: 0,
        },
      },
    },
    fit: {
      cover: { '& > img': { objectFit: 'cover' } },
      contain: { '& > img': { objectFit: 'contain' } },
      fill: { '& > img': { objectFit: 'fill' } },
      none: { '& > img': { objectFit: 'none' } },
      'scale-down': { '& > img': { objectFit: 'scale-down' } },
    },
  },
  defaultVariants: {
    sizing: 'intrinsic',
    fit: 'cover',
  },
});
