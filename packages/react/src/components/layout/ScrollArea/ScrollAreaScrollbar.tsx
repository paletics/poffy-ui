'use client';

// Thumb position/size are updated via direct DOM style mutations (not JSX props) on every scroll event.

import { RefObject, PointerEvent } from 'react';

interface ScrollAreaScrollbarProps {
  orientation: 'vertical' | 'horizontal';
  /** ID of the viewport element — required for aria-controls (WAI-ARIA scrollbar pattern). */
  viewportId: string;
  scrollbarClass: string;
  thumbClass: string;
  scrollbarRef: RefObject<HTMLDivElement | null>;
  thumbRef: RefObject<HTMLDivElement | null>;
  onThumbPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
}

/**
 * ### AI Context & Architecture
 * Internal component — not exported from index.ts.
 * forwardRef is intentionally omitted: the ref is passed as the `scrollbarRef` prop
 * to allow the parent hook to access the element imperatively.
 */
export function ScrollAreaScrollbar({
  orientation,
  viewportId,
  scrollbarClass,
  thumbClass,
  scrollbarRef,
  thumbRef,
  onThumbPointerDown,
}: ScrollAreaScrollbarProps) {
  return (
    <div
      ref={scrollbarRef}
      role="scrollbar"
      aria-orientation={orientation}
      aria-controls={viewportId}
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      data-orientation={orientation}
      className={scrollbarClass}
    >
      <div ref={thumbRef} className={thumbClass} onPointerDown={onThumbPointerDown} />
    </div>
  );
}
