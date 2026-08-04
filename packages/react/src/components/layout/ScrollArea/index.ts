/**
 * Renders an owned overflow viewport and vertical, horizontal, or two-axis draggable scrollbars.
 *
 * The viewport, rather than the root, owns region semantics, tab order, and scroll callbacks.
 */
export { ScrollArea } from './ScrollArea';

/** ScrollArea orientation, recipe variants, and owned-viewport props. */
export type { ScrollAreaProps, ScrollAreaVariants, ScrollOrientation } from './ScrollArea.types';

/** Focus-order policy shared by scrollable components. */
export type { OverflowFocusMode } from '@/components/shared/useOverflowFocusability';
