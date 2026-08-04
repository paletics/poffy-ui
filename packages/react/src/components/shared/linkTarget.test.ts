import { describe, expect, it } from 'vitest';
import { resolveSafeLinkRel } from './linkTarget';

describe('resolveSafeLinkRel', () => {
  it('adds missing security tokens for ASCII-case-insensitive blank targets', () => {
    expect(resolveSafeLinkRel('_BLANK', 'nofollow')).toBe('nofollow noopener noreferrer');
  });

  it('deduplicates relationship tokens case-insensitively while preserving first spelling and order', () => {
    expect(resolveSafeLinkRel('_blank', 'NoOpener\tlicense NOOPENER\rNoreferrer noreferrer')).toBe(
      'NoOpener license Noreferrer',
    );
  });

  it('does not trim or reinterpret named targets', () => {
    expect(resolveSafeLinkRel(' _blank', 'opener')).toBe('opener');
    expect(resolveSafeLinkRel('preview', undefined)).toBeUndefined();
  });
});
