/**
 * Media primitives for responsive images and SVG icons.
 *
 * `Image` and `Picture` validate their fallback/source structure, while `Icon` is decorative by
 * default and must be named when it conveys information. Named icon components share `Icon`'s SVG
 * props and accessibility behavior.
 */
export * from './Image';
export * from './Picture';
export * from './Icon';
