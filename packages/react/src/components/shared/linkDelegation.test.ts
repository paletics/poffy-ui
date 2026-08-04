import { describe, expect, it } from 'vitest';
import { omitNativeAnchorOnlyProps } from './linkDelegation';

describe('omitNativeAnchorOnlyProps', () => {
  it('removes anchor ownership attributes and preserves passive host props', () => {
    expect(
      omitNativeAnchorOnlyProps({
        'aria-label': 'Details',
        className: 'custom',
        download: 'details.pdf',
        href: '/details',
        hrefLang: 'en',
        id: 'details',
        media: 'print',
        ping: '/audit',
        referrerPolicy: 'origin',
        rel: 'nofollow',
        target: '_blank',
        type: 'text/html',
      }),
    ).toEqual({
      'aria-label': 'Details',
      className: 'custom',
      id: 'details',
    });
  });
});
