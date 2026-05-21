/**
 * Shared framework-agnostic logic for interaction state, focus rules, and
 * behavior helpers that can be consumed by React and premium packages.
 */
export { buildCalendarGrid, formatDateISO, isSameDay } from '../calendar';
/** Re-exported calendar grid type for compatibility imports. */
export type { CalendarGrid } from '../calendar';
export { buildPaginationItems, buildPaginationRange } from '../pagination';
/** Re-exported pagination types for compatibility imports. */
export type {
  BuildPaginationItemsOptions,
  BuildPaginationRangeOptions,
  PaginationDot,
  PaginationEllipsis,
  PaginationItem,
  PaginationRangeItem,
} from '../pagination';
