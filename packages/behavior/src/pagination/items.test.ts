import { describe, expect, it } from 'vitest';
import { buildPaginationItems } from './items';

describe('buildPaginationItems', () => {
  it('returns all pages when truncation is unnecessary', () => {
    expect(
      buildPaginationItems({
        count: 5,
        page: 3,
      }),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  it('adds a right ellipsis near the start of the range', () => {
    expect(
      buildPaginationItems({
        count: 10,
        page: 2,
      }),
    ).toEqual([1, 2, 3, 4, 5, 6, 'dots-right', 10]);
  });

  it('adds both ellipses in the middle of the range', () => {
    expect(
      buildPaginationItems({
        count: 10,
        page: 5,
      }),
    ).toEqual([1, 'dots-left', 4, 5, 6, 'dots-right', 10]);
  });
});
