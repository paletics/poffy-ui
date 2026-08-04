import { cleanup, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DirectionProvider } from './DirectionProvider';
import { LocaleProvider } from './LocaleProvider';

describe('provider document ownership', () => {
  it('applies global locale and direction attributes to the supplied document', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument;
    if (!ownerDocument) throw new Error('Expected an iframe document');

    try {
      const { unmount } = render(
        <LocaleProvider defaultLocale="ja-JP" ownerDocument={ownerDocument}>
          <DirectionProvider defaultDir="rtl" ownerDocument={ownerDocument}>
            <span>Content</span>
          </DirectionProvider>
        </LocaleProvider>,
        { container: ownerDocument.body },
      );

      expect(ownerDocument.documentElement).toHaveAttribute('lang', 'ja-JP');
      expect(ownerDocument.documentElement).toHaveAttribute('dir', 'rtl');
      expect(document.documentElement).not.toHaveAttribute('lang', 'ja-JP');
      expect(document.documentElement).not.toHaveAttribute('dir', 'rtl');

      unmount();
      expect(ownerDocument.documentElement).not.toHaveAttribute('lang');
      expect(ownerDocument.documentElement).not.toHaveAttribute('dir');
    } finally {
      cleanup();
      iframe.remove();
    }
  });

  it('keeps global provider ownership independent across documents', () => {
    const firstFrame = document.createElement('iframe');
    const secondFrame = document.createElement('iframe');
    document.body.append(firstFrame, secondFrame);
    const firstDocument = firstFrame.contentDocument;
    const secondDocument = secondFrame.contentDocument;
    if (!firstDocument || !secondDocument) throw new Error('Expected iframe documents');

    try {
      render(
        <LocaleProvider defaultLocale="ja-JP" ownerDocument={firstDocument}>
          <DirectionProvider defaultDir="rtl" ownerDocument={firstDocument}>
            <span>First</span>
          </DirectionProvider>
        </LocaleProvider>,
        { container: firstDocument.body },
      );
      render(
        <LocaleProvider defaultLocale="en-US" ownerDocument={secondDocument}>
          <DirectionProvider defaultDir="ltr" ownerDocument={secondDocument}>
            <span>Second</span>
          </DirectionProvider>
        </LocaleProvider>,
        { container: secondDocument.body },
      );

      expect(firstDocument.documentElement).toHaveAttribute('lang', 'ja-JP');
      expect(firstDocument.documentElement).toHaveAttribute('dir', 'rtl');
      expect(secondDocument.documentElement).toHaveAttribute('lang', 'en-US');
      expect(secondDocument.documentElement).toHaveAttribute('dir', 'ltr');
    } finally {
      cleanup();
      firstFrame.remove();
      secondFrame.remove();
    }
  });
});
