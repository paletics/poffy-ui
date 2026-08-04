import { describe, expect, it } from 'vitest';
import {
  floatingAvailableHeight,
  floatingAvailableWidth,
  floatingViewportFallbackStyles,
} from './floatingViewportFallback';

describe('floatingViewportFallback', () => {
  it('locally resets inherited measurements while leaving inline values authoritative', () => {
    expect(floatingViewportFallbackStyles['--floating-available-width']).toBe('initial');
    expect(floatingViewportFallbackStyles['--floating-available-height']).toBe('initial');
  });

  it('reserves the configured padding on both viewport edges', () => {
    expect(floatingViewportFallbackStyles['--floating-fallback-width']).toContain(
      '100vw - var(--floating-fallback-padding) - var(--floating-fallback-padding)',
    );
    expect(floatingViewportFallbackStyles['--floating-fallback-height']).toContain(
      '100vh - var(--floating-fallback-padding) - var(--floating-fallback-padding)',
    );
    expect(floatingViewportFallbackStyles['--floating-fallback-padding']).toBe('8px');
  });

  it('upgrades each axis independently to dynamic viewport units', () => {
    expect(
      floatingViewportFallbackStyles['@supports (width: 100dvw)']['--floating-fallback-width'],
    ).toContain('100dvw');
    expect(
      floatingViewportFallbackStyles['@supports (height: 100dvh)']['--floating-fallback-height'],
    ).toContain('100dvh');
  });

  it('uses fallback variables only when measured availability is absent', () => {
    expect(floatingAvailableWidth).toBe(
      'var(--floating-available-width, var(--floating-fallback-width))',
    );
    expect(floatingAvailableHeight).toBe(
      'var(--floating-available-height, var(--floating-fallback-height))',
    );
  });
});
