import { defineRecipe } from '@pandacss/dev';
import { overlayBackdropStyles } from '../overlay.shared';

/**
 * Styles the Backdrop component with Panda CSS recipe variants.
 */
export const backdropRecipe = defineRecipe({
  className: 'backdrop',
  description: 'Shared backdrop layer for overlay components',
  base: overlayBackdropStyles,
});
