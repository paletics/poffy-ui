import { createElement, Fragment } from 'react';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  getFallbackAccessibleNamePropsForNativeButton,
  getFallbackChildrenForNativeAnchor,
  getFallbackChildrenForNativeButton,
  getFallbackChildrenPreservingVoidHost,
  isAsChildHost,
  isButtonCompatibleAsChildHost,
  isInputAsChildHost,
  isNonVoidAsChildHost,
  shouldEmulateButtonHost,
} from './asChild';

const voidElementNames = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
] as const;

describe('asChild helpers', () => {
  it.each(voidElementNames)('rejects the native void host <%s>', (elementName) => {
    const element = createElement(elementName);

    expect(isNonVoidAsChildHost(element)).toBe(false);
    expect(getFallbackChildrenPreservingVoidHost(element)).toBe(element);
  });

  it('accepts native non-void and custom component hosts', () => {
    const CustomHost = ({ children }: { children?: ReactNode }) => <section>{children}</section>;

    expect(isNonVoidAsChildHost(<div>Native</div>)).toBe(true);
    expect(isNonVoidAsChildHost(<CustomHost>Custom</CustomHost>)).toBe(true);
  });

  it('limits native asChild hosts while retaining custom component hosts', () => {
    const CustomHost = ({ children }: { children?: ReactNode }) => <section>{children}</section>;
    const allowedHosts = new Set(['span']);

    expect(isAsChildHost(<span>Label</span>, allowedHosts)).toBe(true);
    expect(isAsChildHost(<button type="button">Button</button>, allowedHosts)).toBe(false);
    expect(isAsChildHost(<CustomHost>Custom</CustomHost>, allowedHosts)).toBe(true);
  });

  it('limits input asChild hosts to native inputs and custom input components', () => {
    const CustomInput = ({ children: _children }: { children?: ReactNode }) => <input />;

    expect(isInputAsChildHost(<input />)).toBe(true);
    expect(isInputAsChildHost(<CustomInput />)).toBe(true);
    expect(isInputAsChildHost(<textarea />)).toBe(false);
    expect(isInputAsChildHost(<div />)).toBe(false);
    expect(isInputAsChildHost(<Fragment />)).toBe(false);
  });

  it('emulates only passive intrinsic button hosts', () => {
    const CustomHost = ({ children }: { children?: ReactNode }) => <section>{children}</section>;

    expect(shouldEmulateButtonHost(<div>Passive</div>)).toBe(true);
    expect(shouldEmulateButtonHost(<li>Passive</li>)).toBe(true);
    expect(shouldEmulateButtonHost(createElement('a', null, 'Href-less anchor'))).toBe(true);
    expect(
      shouldEmulateButtonHost(
        createElement('a', { href: null as unknown as string }, 'Null-href anchor'),
      ),
    ).toBe(true);
    expect(shouldEmulateButtonHost(createElement('a', { href: '' }, 'Link'))).toBe(false);
    expect(shouldEmulateButtonHost(<summary>Summary</summary>)).toBe(false);
    expect(shouldEmulateButtonHost(<select aria-label="Select" />)).toBe(false);
    expect(shouldEmulateButtonHost(<div role="button">Explicit button</div>)).toBe(false);
    expect(shouldEmulateButtonHost(<div role="region">Explicit region</div>)).toBe(false);
    expect(shouldEmulateButtonHost(<div role="presentation">Presentational</div>)).toBe(true);
    expect(shouldEmulateButtonHost(<div contentEditable>Editable</div>)).toBe(false);
    expect(shouldEmulateButtonHost(<object aria-label="Object" />)).toBe(false);
    expect(shouldEmulateButtonHost(<CustomHost>Custom</CustomHost>)).toBe(false);
  });

  it('classifies only native and destination-free custom button hosts as button-compatible', () => {
    const CustomHost = ({
      children,
      href: _href,
    }: {
      children?: ReactNode;
      href?: string;
    }) => <button>{children}</button>;

    expect(isButtonCompatibleAsChildHost(<button type="button">Native</button>)).toBe(true);
    expect(isButtonCompatibleAsChildHost(<CustomHost>Custom button</CustomHost>)).toBe(true);
    expect(
      isButtonCompatibleAsChildHost(<CustomHost href="/settings">Custom link</CustomHost>),
    ).toBe(false);
    expect(isButtonCompatibleAsChildHost(<a href="/settings">Native link</a>)).toBe(false);
    expect(isButtonCompatibleAsChildHost(<div>Emulated</div>)).toBe(false);
  });

  it('rejects fragments and unwraps their fallback children', () => {
    const fragment = <Fragment>Fragment content</Fragment>;

    expect(isNonVoidAsChildHost(fragment)).toBe(false);
    expect(getFallbackChildrenPreservingVoidHost(fragment)).toBe('Fragment content');
  });

  it('preserves primitive fallback children and unwraps non-void elements', () => {
    expect(getFallbackChildrenPreservingVoidHost('Plain content')).toBe('Plain content');
    expect(getFallbackChildrenPreservingVoidHost(<span>Wrapped content</span>)).toBe(
      'Wrapped content',
    );
  });

  it.each(['img', 'br', 'wbr'] as const)(
    'preserves the safe native-button void fallback <%s>',
    (elementName) => {
      const element = createElement(elementName);

      expect(getFallbackChildrenForNativeButton(element)).toBe(element);
    },
  );

  it.each(
    voidElementNames.filter(
      (elementName) => !(['img', 'br', 'wbr'] as const).includes(elementName as never),
    ),
  )('drops the unsafe native-button void fallback <%s>', (elementName) => {
    expect(getFallbackChildrenForNativeButton(createElement(elementName))).toBeNull();
  });

  it('preserves primitive and Fragment inner content for native-button fallbacks', () => {
    expect(getFallbackChildrenForNativeButton('Plain content')).toBe('Plain content');
    expect(
      getFallbackChildrenForNativeButton(
        <Fragment>
          Fragment content
          <img alt="Artwork" />
        </Fragment>,
      ),
    ).toEqual(['Fragment content', createElement('img', { alt: 'Artwork' })]);
  });

  it('drops unsafe void elements nested in Fragment and array fallback content', () => {
    const content = getFallbackChildrenForNativeButton(
      <Fragment>
        Safe
        <input aria-label="Unsafe input" />
        <img alt="Safe artwork" />
        <embed title="Unsafe embed" />
      </Fragment>,
    );

    expect(content).toEqual(['Safe', null, createElement('img', { alt: 'Safe artwork' }), null]);
  });

  it('preserves labelledby and a normalized label fallback together', () => {
    expect(
      getFallbackAccessibleNamePropsForNativeButton(
        <input aria-labelledby="  missing-name  " aria-label="  Fallback name  " />,
      ),
    ).toEqual({
      'aria-labelledby': 'missing-name',
      'aria-label': 'Fallback name',
    });
  });

  it.each([
    ['title', <input title="  Title fallback  " />, 'Title fallback'],
    ['alt', <input alt="  Alt fallback  " />, 'Alt fallback'],
  ])('normalizes the rejected host %s fallback', (_source, child, expectedName) => {
    expect(getFallbackAccessibleNamePropsForNativeButton(child)).toEqual({
      'aria-label': expectedName,
    });
  });

  it('recursively unwraps nested interactive and block hosts to safe button content', () => {
    const content = getFallbackChildrenForNativeButton(
      <Fragment>
        <button type="button">Nested button</button>
        <a href="#nested">Nested link</a>
        <div>
          Block content
          <input aria-label="Nested input" />
        </div>
      </Fragment>,
    );

    render(<button type="button">{content}</button>);

    const fallbackButton = screen.getByRole('button', {
      name: 'Nested buttonNested linkBlock content',
    });
    expect(fallbackButton.querySelector('button, a, div, input')).toBeNull();
    expect(fallbackButton).toHaveTextContent('Nested buttonNested linkBlock content');
  });

  it('keeps meaningful anchor fallback labels without interactive descendants', () => {
    const content = getFallbackChildrenForNativeAnchor(
      <Fragment>
        <img alt="Artwork" />
        <input aria-label="Nested field" />
        <embed title="Embedded content" />
        <button type="button">Nested button</button>
        <a href="#nested">Nested link</a>
        <span>Safe text</span>
      </Fragment>,
    );

    render(<a href="#fallback">{content}</a>);

    const fallbackLink = screen.getByRole('link', {
      name: 'ArtworkNested fieldEmbedded contentNested buttonNested linkSafe text',
    });
    expect(fallbackLink.querySelector('a, button, embed, input, img')).toBeNull();
    expect(fallbackLink.querySelector('span')).toHaveTextContent('Safe text');
  });
});
