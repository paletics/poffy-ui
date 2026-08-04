/**
 * Renders an accessible image with lifecycle status and optional failure fallback.
 *
 * URL fallback keeps the forwarded image ref; custom React fallback content does not.
 */
export * from './Image';

/** Image accessibility, fallback/status, recipe, and native image-prop contracts. */
export type {
  ImageAccessibilityProps,
  ImageOwnProps,
  ImageProps,
  ImageRecipeVariants,
} from './Image.types';
