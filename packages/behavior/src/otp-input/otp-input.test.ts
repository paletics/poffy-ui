import { describe, expect, it } from 'vitest';
import {
  applyOtpBackspace,
  applyOtpInputChange,
  applyOtpPaste,
  applyOtpPasteAtIndex,
  normalizeOtpDigits,
  normalizeOtpSegments,
  resizeOtpSegments,
  toOtpSegments,
} from './otp-input';

describe('otp-input behavior helpers', () => {
  it('normalizes fixed-position public segments without compacting holes', () => {
    expect(normalizeOtpSegments(['１', '', '23'], 4)).toEqual(['1', '', '3', '']);
  });

  it('creates fixed-length OTP segments', () => {
    expect(toOtpSegments('123', 5)).toEqual(['1', '2', '3', '', '']);
  });

  it('normalizes invalid runtime segment lengths', () => {
    expect(toOtpSegments('123', 0)).toEqual(['1']);
    expect(toOtpSegments('123', Number.NaN)).toEqual(['1']);
    expect(applyOtpPaste([], -1, '123')).toMatchObject({ otp: ['1'], nextFocusIndex: 0 });
    expect(toOtpSegments('123', 1_000_000_000)).toHaveLength(32);
  });

  it('resizes normalized segments without compacting empty positions', () => {
    expect(resizeOtpSegments(['1', '', '3'], 5)).toEqual(['1', '', '3', '', '']);
    expect(resizeOtpSegments(['1', '', '3', '4'], 2)).toEqual(['1', '']);
  });

  it('returns a fresh segment array without mutating retained slot values', () => {
    const segments = ['１', '', 'x'];
    const resized = resizeOtpSegments(segments, 4);

    expect(resized).not.toBe(segments);
    expect(resized).toEqual(['１', '', 'x', '']);
    expect(segments).toEqual(['１', '', 'x']);
  });

  it('uses the shared normalized length policy and fills sparse slots', () => {
    const sparse = Array<string>(3);
    sparse[0] = '1';
    sparse[2] = '3';

    expect(resizeOtpSegments(sparse, 3)).toEqual(['1', '', '3']);
    expect(resizeOtpSegments(['1', '2'], 0)).toEqual(['1']);
    expect(resizeOtpSegments(['1', '2'], Number.NaN)).toEqual(['1']);
    expect(resizeOtpSegments(['1', '2', '3'], 2.9)).toEqual(['1', '2']);
    expect(resizeOtpSegments([], 1_000_000_000)).toHaveLength(32);
  });

  it('applies single-segment changes and advances focus', () => {
    expect(applyOtpInputChange(['1', '', ''], 1, '9')).toEqual({
      otp: ['1', '9', ''],
      value: '19',
      nextFocusIndex: 2,
      isComplete: false,
    });
  });

  it('applies backspace semantics', () => {
    expect(applyOtpBackspace(['1', '2', ''], 1)).toEqual({
      otp: ['1', '', ''],
      value: '1',
      nextFocusIndex: null,
      isComplete: false,
    });

    expect(applyOtpBackspace(['1', '', ''], 1)).toEqual({
      otp: ['', '', ''],
      value: '',
      nextFocusIndex: 0,
      isComplete: false,
    });
  });

  it('distributes pasted values and reports completion', () => {
    expect(applyOtpPaste(['', '', '', ''], 4, '1234')).toEqual({
      otp: ['1', '2', '3', '4'],
      value: '1234',
      nextFocusIndex: 3,
      isComplete: true,
    });
  });

  it('normalizes ASCII and full-width digits while rejecting other characters', () => {
    expect(normalizeOtpDigits('１a2-３')).toBe('123');
    expect(toOtpSegments('a１2', 4)).toEqual(['1', '2', '', '']);
    expect(applyOtpInputChange(['1', '2'], 1, 'x')).toMatchObject({ value: '12' });
  });

  it('pastes from the focused segment without overwriting surrounding values', () => {
    expect(applyOtpPasteAtIndex(['1', '2', '3', '4'], 2, '９8')).toEqual({
      otp: ['1', '2', '9', '8'],
      value: '1298',
      nextFocusIndex: 3,
      isComplete: true,
    });
  });

  it('clears stale trailing segments when pasted text is shorter than the input', () => {
    expect(applyOtpPaste(['1', '2', '3', '4'], 4, '9')).toEqual({
      otp: ['9', '', '', ''],
      value: '9',
      nextFocusIndex: 1,
      isComplete: false,
    });
  });
});
