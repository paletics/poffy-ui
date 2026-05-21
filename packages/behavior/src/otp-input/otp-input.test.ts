import { describe, expect, it } from 'vitest';
import { applyOtpBackspace, applyOtpInputChange, applyOtpPaste, toOtpSegments } from './otp-input';

describe('otp-input behavior helpers', () => {
  it('creates fixed-length OTP segments', () => {
    expect(toOtpSegments('123', 5)).toEqual(['1', '2', '3', '', '']);
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

  it('clears stale trailing segments when pasted text is shorter than the input', () => {
    expect(applyOtpPaste(['1', '2', '3', '4'], 4, '9')).toEqual({
      otp: ['9', '', '', ''],
      value: '9',
      nextFocusIndex: 1,
      isComplete: false,
    });
  });
});
