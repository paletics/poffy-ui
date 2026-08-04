import { describe, expect, it } from 'vitest';
import { resolveLiveRegionProps } from './resolveLiveRegionProps';

/**
 * ### Test Strategy: resolveLiveRegionProps
 * - **Focus**: Priority-to-role mapping, explicit override precedence, compatibility defaults,
 *   and disabling implicit live semantics.
 * - **DON'T**: Do not test assistive-technology announcement timing in a pure resolver test.
 */
describe('resolveLiveRegionProps', () => {
  it.each([
    ['polite', 'status'],
    ['assertive', 'alert'],
    ['off', undefined],
  ] as const)('maps %s priority to its implicit role', (live, role) => {
    expect(resolveLiveRegionProps({ live, defaultLive: 'off' })).toEqual({
      role,
      ariaLive: live === 'off' ? 'off' : undefined,
    });
  });

  it('keeps an explicit role and uses an explicit priority to override its implicit live value', () => {
    expect(
      resolveLiveRegionProps({
        live: 'assertive',
        defaultLive: 'off',
        role: 'status',
      }),
    ).toEqual({ role: 'status', ariaLive: 'assertive' });
  });

  it('keeps an explicit role while disabling its implicit live value', () => {
    expect(
      resolveLiveRegionProps({
        live: 'off',
        defaultLive: 'polite',
        role: 'alert',
      }),
    ).toEqual({ role: 'alert', ariaLive: 'off' });
  });

  it('prioritizes an explicit aria-live value', () => {
    expect(
      resolveLiveRegionProps({
        live: 'polite',
        defaultLive: 'off',
        role: 'status',
        ariaLive: 'assertive',
      }),
    ).toEqual({ role: 'status', ariaLive: 'assertive' });
  });

  it('lets an explicit role own its implicit priority instead of applying a passive default', () => {
    expect(
      resolveLiveRegionProps({
        defaultLive: 'polite',
        role: 'alert',
      }),
    ).toEqual({ role: 'alert', ariaLive: undefined });
  });

  it('can retain a component compatibility default for an explicit role', () => {
    expect(
      resolveLiveRegionProps({
        defaultLive: 'assertive',
        role: 'region',
        announceDefaultWithExplicitRole: true,
      }),
    ).toEqual({ role: 'region', ariaLive: 'assertive' });
  });
});
