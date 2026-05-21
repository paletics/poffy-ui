import { describe, expect, it } from 'vitest';
import { MIN_SCROLL_AREA_THUMB_SIZE, calcScrollAreaThumb } from './scroll-area';

describe('scroll-area behavior helpers', () => {
  it('returns guarded values when layout metrics are unavailable', () => {
    expect(calcScrollAreaThumb(0, 0, 0)).toEqual({
      thumbSize: MIN_SCROLL_AREA_THUMB_SIZE,
      thumbOffset: 0,
      isOverflowing: false,
    });
  });

  it('calculates thumb metrics for overflowing content', () => {
    expect(calcScrollAreaThumb(100, 400, 150)).toEqual({
      thumbSize: 25,
      thumbOffset: 37.5,
      isOverflowing: true,
    });
  });

  it('keeps thumb metrics inside the track', () => {
    expect(calcScrollAreaThumb(10, 100, 90)).toEqual({
      thumbSize: 10,
      thumbOffset: 0,
      isOverflowing: true,
    });

    expect(calcScrollAreaThumb(100, 80, 0)).toEqual({
      thumbSize: 100,
      thumbOffset: 0,
      isOverflowing: false,
    });

    expect(calcScrollAreaThumb(100, 400, -50)).toEqual({
      thumbSize: 25,
      thumbOffset: 0,
      isOverflowing: true,
    });

    expect(calcScrollAreaThumb(100, 400, 500)).toEqual({
      thumbSize: 25,
      thumbOffset: 75,
      isOverflowing: true,
    });
  });
});
