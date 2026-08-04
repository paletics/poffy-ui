'use client';

// Thumb position/size are updated via direct DOM style mutations (not JSX props) on every scroll event.

import { RefObject, PointerEvent } from 'react';

interface ScrollAreaScrollbarProps {
  orientation: 'vertical' | 'horizontal';
  scrollbarClass: string;
  thumbClass: string;
  scrollbarRef: RefObject<HTMLDivElement | null>;
  thumbRef: RefObject<HTMLDivElement | null>;
  onThumbPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
}


export function ScrollAreaScrollbar({
  orientation,
  scrollbarClass,
  thumbClass,
  scrollbarRef,
  thumbRef,
  onThumbPointerDown,
}: ScrollAreaScrollbarProps) {
  return (
    <div
      ref={scrollbarRef}
      aria-hidden="true"
      data-orientation={orientation}
      className={scrollbarClass}
    >
      <div ref={thumbRef} className={thumbClass} onPointerDown={onThumbPointerDown} />
    </div>
  );
}
