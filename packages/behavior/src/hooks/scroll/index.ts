/** Tracks viewport scroll coordinates for the global or explicitly supplied window. */
export { useScrollPosition } from './useScrollPosition';

/** Viewport scroll-coordinate contract. */
export type { ScrollPosition } from './useScrollPosition.types';

/**
 * Observes document or element scroll progress and batches event-driven updates per animation frame.
 *
 * Disabled or unobservable targets return static zero metrics.
 */
export { useScrollProgress } from './useScrollProgress';

/** Scroll progress axis, metrics, and target/disabled configuration contracts. */
export type {
  ScrollProgress,
  ScrollProgressAxis,
  UseScrollProgressOptions,
} from './useScrollProgress.types';

/**
 * Computes a conservative pause condition from explicit disablement, document visibility, and
 * optional intersection observation.
 *
 * An unavailable requested observer is treated as paused.
 */
export { useAnimationPause } from './useAnimationPause';

/** Animation-pause visibility, observer, and target-document configuration. */
export type { UseAnimationPauseOptions } from './useAnimationPause.types';
