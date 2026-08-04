import { afterEach, describe, expect, it, vi } from 'vitest';
import { normalizeMinChildWidth } from './gridValidation';

describe('normalizeMinChildWidth', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([
    [200, '200px'],
    [0.5, '0.5px'],
    ['12rem', '12rem'],
    ['50%', '50%'],
    ['10dvw', '10dvw'],
    ['25cqi', '25cqi'],
    ['  calc(100% / 3)  ', 'calc(100% / 3)'],
    ['min(20rem, 100%)', 'min(20rem, 100%)'],
    ['clamp(10rem, 25vw, 30rem)', 'clamp(10rem, 25vw, 30rem)'],
    ['var(--card-min-width)', 'var(--card-min-width)'],
    ['env(safe-area-inset-left)', 'env(safe-area-inset-left)'],
  ] as const)('normalizes %p to %p', (value, expected) => {
    expect(normalizeMinChildWidth(value, 'Grid')).toBe(expected);
  });

  it.each([
    0,
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    '',
    '   ',
    'red',
    'auto',
    '1fr',
    '0',
    '0px',
    '-1px',
    'calc(100% - 1rem',
    'var(--width); color: red',
  ] as const)('ignores invalid value %p and warns in development', (value) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(normalizeMinChildWidth(value, 'Grid')).toBeUndefined();
    expect(warn).toHaveBeenCalledOnce();
  });

  it('does not depend on browser-only CSS validation', () => {
    vi.stubGlobal('CSS', { supports: vi.fn(() => false) });

    expect(normalizeMinChildWidth('12rem', 'Grid')).toBe('12rem');
    expect(normalizeMinChildWidth('calc(100% / 3)', 'Grid')).toBe('calc(100% / 3)');
  });

  it('does not warn when no value is provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(normalizeMinChildWidth(undefined, 'Grid')).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
  });
});
