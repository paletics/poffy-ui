import { describe, expect, it } from 'vitest';
import { buildPaginationItems } from './items';
import * as paginationExports from './index';

describe('buildPaginationItems', () => {
  it('does not expose the removed range builder alias', () => {
    expect(paginationExports).not.toHaveProperty('buildPaginationRange');
  });

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

  it('normalizes non-finite and non-integer inputs to a finite page range', () => {
    expect(
      buildPaginationItems({
        count: Number.POSITIVE_INFINITY,
        page: Number.NaN,
        siblingCount: -1,
        boundaryCount: 1.5,
      }),
    ).toEqual([1]);
    expect(buildPaginationItems({ count: 5.9, page: 5.9, siblingCount: 0.8 })).toEqual([1]);
  });

  it('caps huge display configuration without omitting the active page', () => {
    const items = buildPaginationItems({
      count: 1_000_000_000,
      page: 500_000_000,
      siblingCount: 1_000_000_000,
      boundaryCount: 1_000_000_000,
    });

    expect(items.length).toBeLessThanOrEqual(100);
    expect(items).toContain(500_000_000);
    expect(buildPaginationItems({ count: Number.MAX_SAFE_INTEGER + 1, page: 1 })).toEqual([1]);
  });
});
