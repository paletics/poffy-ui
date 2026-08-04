import { describe, expect, it } from 'vitest';
import { hasAccessibleCaptionContent } from './CodeViewer.utils';

describe('hasAccessibleCaptionContent', () => {
  it('ignores hidden intrinsic caption content before inspecting labels or descendants', () => {
    expect(hasAccessibleCaptionContent(<span hidden aria-label="Hidden label" />)).toBe(false);
    expect(hasAccessibleCaptionContent(<img aria-hidden alt="Hidden image" />)).toBe(false);
    expect(
      hasAccessibleCaptionContent(
        <span aria-hidden="true">
          <strong>Hidden text</strong>
        </span>,
      ),
    ).toBe(false);
  });

  it('keeps explicitly visible content and visible siblings accessible', () => {
    expect(hasAccessibleCaptionContent(<span aria-hidden={false}>Visible</span>)).toBe(true);
    expect(
      hasAccessibleCaptionContent(
        <>
          <span aria-hidden>Hidden</span>
          <span>Visible sibling</span>
        </>,
      ),
    ).toBe(true);
  });
});
