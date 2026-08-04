import type { PointerEventHandler, RefObject } from 'react';

/**
 * State, refs, and pointer handlers returned by `useScrollArea`.
 */
export interface UseScrollAreaReturn {
  /** Stable ID assigned to the scroll viewport. */
  viewportId: string;
  /** Ref for the scroll viewport element. */
  viewportRef: RefObject<HTMLDivElement | null>;
  /** Ref for the vertical scrollbar track. */
  vScrollbarRef: RefObject<HTMLDivElement | null>;
  /** Ref for the horizontal scrollbar track. */
  hScrollbarRef: RefObject<HTMLDivElement | null>;
  /** Ref for the vertical scrollbar thumb. */
  vThumbRef: RefObject<HTMLDivElement | null>;
  /** Ref for the horizontal scrollbar thumb. */
  hThumbRef: RefObject<HTMLDivElement | null>;
  /**
   * Returns a thumb pointer handler for this orientation. It ignores non-primary/secondary-button
   * interactions and tracks an accepted drag on the viewport's owner window until up or cancel.
   */
  getThumbPointerDown: (
    orientation: 'vertical' | 'horizontal',
  ) => PointerEventHandler<HTMLDivElement>;
}
