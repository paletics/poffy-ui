/** Calculates bounded scrollbar thumb metrics and exposes the shared minimum thumb size. */
export { calcScrollAreaThumb, MIN_SCROLL_AREA_THUMB_SIZE } from './scroll-area';

/** Derived scrollbar-thumb geometry. */
export type { ScrollAreaThumbMetrics } from './scroll-area.types';

/**
 * Coordinates viewport/track/thumb refs and drag behavior for a custom scroll area.
 *
 * Attach every returned ref to its matching element so scroll, resize, and mutation updates can
 * keep both scrollbar thumbs synchronized.
 */
export { useScrollArea } from './useScrollArea';

/** Scroll-area refs, id, and thumb-drag handler contract. */
export type { UseScrollAreaReturn } from './useScrollArea.types';
