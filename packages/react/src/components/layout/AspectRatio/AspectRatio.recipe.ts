import { defineRecipe } from '@pandacss/dev';

/**
 * AspectRatio Recipe
 * Provides minimal base styles for aspect ratio containers.
 * The actual aspect ratio is set via the CSS `aspect-ratio` property in the component.
 */
export const aspectRatioRecipe = defineRecipe({
  className: 'aspect-ratio',
  description: 'Aspect ratio styling for fixed-ratio media and layout wrappers',
  base: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    aspectRatio: 'var(--aspect-ratio)',
  },
});
