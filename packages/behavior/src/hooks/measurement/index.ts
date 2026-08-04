/** Default outer margin used by {@link useChartDimensions}. */
export { DEFAULT_CHART_MARGIN } from './useChartDimensions';

/**
 * Measures a chart container and derives non-negative inner dimensions after margins.
 *
 * It reattaches after `ref.current` changes and falls back to owner-window resize without
 * ResizeObserver.
 */
export { useChartDimensions } from './useChartDimensions';

/** Chart margin and measured outer/inner dimension contracts. */
export type { ChartDimensions, ChartMargin } from './useChartDimensions.types';
