import { describe, expect, it } from 'vitest';
import { sanitizeNavigationUrl } from './sanitizeNavigationUrl';

describe('sanitizeNavigationUrl', () => {
  it('accepts ordinary relative, fragment, and web navigation destinations', () => {
    for (const href of [
      '/docs',
      './docs',
      '../docs',
      '#details',
      'https://example.com',
      'http://localhost',
    ])
      expect(sanitizeNavigationUrl(href)).toBe(href);
  });

  it('rejects ambiguous, executable, credential-bearing, and fetching URLs', () => {
    for (const href of [
      ' javascript:alert(1)',
      'javascript:alert(1)',
      'data:text/html,test',
      'blob:https://example.com/id',
      '//example.com',
      '/\\example.com',
      'https:\\example.com',
      'https:/\\example.com',
      'https://user:password@example.com',
      'https://example.com\u0000',
    ])
      expect(sanitizeNavigationUrl(href)).toBeUndefined();
  });

  it('permits mailto only for callers that opt in', () => {
    expect(sanitizeNavigationUrl('mailto:team@example.com')).toBeUndefined();
    expect(sanitizeNavigationUrl('mailto:team@example.com', { allowMailto: true })).toBe(
      'mailto:team@example.com',
    );
  });
});
