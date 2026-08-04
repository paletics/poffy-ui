/** Preloads an image in the appropriate document realm and reports its lifecycle state. */
export { useImage } from './useImage';

/**
 * Subscribes to a browser media query with one shared native listener per Window and query.
 *
 * SSR and unavailable `matchMedia` use the caller's `defaultMatches` snapshot.
 */
export { useMediaQuery } from './useMediaQuery';

/** Image preload configuration, lifecycle status, and return contracts. */
export type { ImageStatus, UseImageProps, UseImageReturn } from './useImage.types';

/** Media-query SSR fallback and target-window configuration. */
export type { UseMediaQueryOptions } from './useMediaQuery.types';
