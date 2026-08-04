/**
 * Renders responsive `<source>` elements followed by one final fallback `<img>`.
 *
 * Inspectable invalid child order still renders but warns once in development.
 */
export * from './Picture';

/** Picture native/recipe prop contracts. */
export type { PictureOwnProps, PictureProps, PictureRecipeVariants } from './Picture.types';
