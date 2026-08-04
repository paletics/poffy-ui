import { describe, expect, it } from 'vitest';
import { resolveOverlayAria } from './resolveOverlayAria';

/**
 * ### Test Strategy: resolveOverlayAria
 *
 * ### Focus
 * - Preserves explicit labels and descriptions over generated IDs.
 * - Applies generated IDs and fallback labels only when accessible attributes are absent.
 *
 * ### DON'T
 * - Do not test component-specific role, portal, or focus behavior.
 */
describe('resolveOverlayAria', () => {
  it('prioritizes explicit labelledby over every other label source', () => {
    expect(
      resolveOverlayAria({
        ariaLabel: 'Explicit label',
        ariaLabelledBy: 'title-id',
        autoLabelledBy: 'generated-title',
        fallbackLabel: 'Fallback',
      }),
    ).toEqual({ ariaLabel: undefined, ariaLabelledBy: 'title-id', ariaDescribedBy: undefined });
  });

  it('uses an explicit label before a generated title', () => {
    expect(resolveOverlayAria({ ariaLabel: 'Details', autoLabelledBy: 'generated-title' })).toEqual(
      { ariaLabel: 'Details', ariaLabelledBy: undefined, ariaDescribedBy: undefined },
    );
  });

  it('uses generated IDs and preserves an explicit empty description override', () => {
    expect(
      resolveOverlayAria({
        ariaDescribedBy: '',
        autoDescribedBy: 'generated-description',
        autoLabelledBy: 'generated-title',
      }),
    ).toEqual({ ariaLabel: undefined, ariaLabelledBy: 'generated-title', ariaDescribedBy: '' });
  });

  it('treats whitespace labels as absent and falls back when configured', () => {
    expect(
      resolveOverlayAria({ ariaLabel: ' ', ariaLabelledBy: ' ', fallbackLabel: 'Popover' }),
    ).toEqual({
      ariaLabel: 'Popover',
      ariaLabelledBy: undefined,
      ariaDescribedBy: undefined,
    });
  });
});
