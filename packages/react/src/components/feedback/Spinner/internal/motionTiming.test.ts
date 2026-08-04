import { describe, expect, it } from 'vitest';
import { getSpinnerMotionDuration } from './motionTiming';

describe('getSpinnerMotionDuration', () => {
  it.each([
    ['subtle', 1.5],
    ['standard', 1],
    ['pop', 0.8],
    ['none', 1],
  ] as const)('scales %s motion durations by %s', (style, scale) => {
    expect(getSpinnerMotionDuration(2, style)).toBe(2 * scale);
  });
});
