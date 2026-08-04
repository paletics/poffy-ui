import { describe, expect, it } from 'vitest';
import { omitNativeButtonOnlyProps } from './buttonDelegation';

describe('omitNativeButtonOnlyProps', () => {
  it('removes button host ownership attributes and preserves delegated props', () => {
    const onClick = () => undefined;

    expect(
      omitNativeButtonOnlyProps({
        'aria-label': 'Open',
        className: 'trigger',
        form: 'settings',
        formAction: '/save',
        formEncType: 'multipart/form-data',
        formMethod: 'post',
        formNoValidate: true,
        formTarget: '_blank',
        name: 'intent',
        onClick,
        type: 'submit',
        value: 'save',
      }),
    ).toEqual({
      'aria-label': 'Open',
      className: 'trigger',
      onClick,
    });
  });
});
