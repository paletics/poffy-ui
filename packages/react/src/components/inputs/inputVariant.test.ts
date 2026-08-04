import { describe, expect, it } from 'vitest';
import {
  resolveInputVariant,
  resolveNeoInputVariant,
  resolveNeoPopupVariant,
} from './inputVariant';

/**
 * ### Test Strategy: inputVariant
 *
 * ### Focus
 * - Maps each public appearance to its matching recipe variant.
 * - Recursively maps every Panda conditional-value leaf.
 *
 * ### DON'T
 * - Do not assert recipe class names; Panda recipe output is verified by component tests.
 */
describe('inputVariant', () => {
  it.each([
    ['outline', 'outline'],
    ['soft', 'filled'],
    ['flushed', 'flushed'],
    [undefined, 'outline'],
  ] as const)('maps the standard %s appearance to %s', (appearance, expected) => {
    expect(resolveInputVariant(appearance)).toBe(expected);
  });

  it.each([
    ['outline', 'outline'],
    ['soft', 'filled'],
    ['flushed', 'flushed'],
    ['neo', 'neo'],
    [undefined, 'outline'],
  ] as const)('maps the neo-capable %s appearance to %s', (appearance, expected) => {
    expect(resolveNeoInputVariant(appearance)).toBe(expected);
  });

  it('recursively maps conditional objects and arrays without mutating the appearance', () => {
    const appearance = {
      base: 'soft',
      md: ['outline', null, 'flushed'],
      _dark: { base: 'flushed', lg: 'soft' },
    } as const;

    expect(resolveInputVariant(appearance)).toEqual({
      base: 'filled',
      md: ['outline', null, 'flushed'],
      _dark: { base: 'flushed', lg: 'filled' },
    });
    expect(appearance).toEqual({
      base: 'soft',
      md: ['outline', null, 'flushed'],
      _dark: { base: 'flushed', lg: 'soft' },
    });
  });

  it('maps neo leaves independently for fields and popups', () => {
    const appearance = { base: 'neo', md: ['soft', null, 'neo'] } as const;

    expect(resolveNeoInputVariant(appearance)).toEqual({
      base: 'neo',
      md: ['filled', null, 'neo'],
    });
    expect(resolveNeoPopupVariant(appearance)).toEqual({
      base: 'outline',
      md: ['filled', null, 'outline'],
    });
  });
});
