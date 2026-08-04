import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { CodeViewer } from './CodeViewer';

/**
 * ### Test Strategy: CodeViewer
 * - **Focus**: Figure/caption semantics, line-number accessibility, source text rendering,
 *   and malicious source remaining inert after syntax highlighting.
 * - **DON'T**: Do not assert generated Panda class names or Prism token structure.
 */
describe('CodeViewer', () => {
  it('renders source text with a visible caption', () => {
    const { container } = render(
      <CodeViewer caption="Example.ts" language="typescript">
        {'const enabled = true;'}
      </CodeViewer>,
    );

    expect(screen.getByText('Example.ts')).toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('const enabled = true;');
  });

  it('reuses a nested one-shot iterable caption for naming and rendering', () => {
    function* caption() {
      yield 'Generated source';
    }

    const { container } = render(
      <CodeViewer caption={<span>{caption()}</span>}>{'const enabled = true;'}</CodeViewer>,
    );

    expect(container.querySelector('figcaption')).toHaveTextContent('Generated source');
    expect(screen.getByRole('region', { name: 'Generated source' })).toBeInTheDocument();
  });

  it('hides visual line numbers from assistive technology', () => {
    const { container } = render(<CodeViewer showLineNumbers>{'first\nsecond\nthird'}</CodeViewer>);

    const gutter = container.querySelector('[aria-hidden="true"]');
    expect(gutter).toHaveTextContent('1 2 3');
    expect(container.querySelector('code')).toHaveTextContent('first second third');
  });

  it('keeps source visible while skipping costly highlighting and gutters beyond configured limits', () => {
    const { container } = render(
      <CodeViewer
        language="typescript"
        showLineNumbers
        maxHighlightedCharacters={4}
        maxLineNumberCount={2}
      >
        {'first\nsecond\nthird'}
      </CodeViewer>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    expect(container.querySelector('code')).not.toHaveClass('language-typescript');
    expect(container.querySelector('code')).toHaveTextContent('first second third');
  });

  it('allows zero to explicitly disable highlighting and line numbers', () => {
    const { container } = render(
      <CodeViewer
        language="typescript"
        showLineNumbers
        maxHighlightedCharacters={0}
        maxLineNumberCount={0}
      >
        {'const enabled = true;'}
      </CodeViewer>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    expect(container.querySelector('code')).not.toHaveClass('language-typescript');
  });

  it('keeps zero limits disabled for empty source', () => {
    const { container } = render(
      <CodeViewer
        language="typescript"
        showLineNumbers
        maxHighlightedCharacters={0}
        maxLineNumberCharacters={0}
      >
        {''}
      </CodeViewer>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    expect(container.querySelector('code')).not.toHaveClass('language-typescript');
  });

  it('skips line-number measurement when source exceeds its character limit', () => {
    const { container } = render(
      <CodeViewer showLineNumbers maxLineNumberCharacters={5}>
        {'first\nsecond'}
      </CodeViewer>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('first second');
  });

  it('updates highlighting and line numbers when a source crosses configured limits', () => {
    const source = 'const enabled = true;';
    const { container, rerender } = render(
      <CodeViewer
        language="typescript"
        showLineNumbers
        maxHighlightedCharacters={100}
        maxLineNumberCount={10}
      >
        {source}
      </CodeViewer>,
    );

    expect(container.querySelector('code')).toHaveClass('language-typescript');
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();

    rerender(
      <CodeViewer
        language="typescript"
        showLineNumbers
        maxHighlightedCharacters={1}
        maxLineNumberCount={0}
      >
        {source}
      </CodeViewer>,
    );
    expect(container.querySelector('code')).not.toHaveClass('language-typescript');
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();

    rerender(
      <CodeViewer
        language="typescript"
        showLineNumbers
        maxHighlightedCharacters={100}
        maxLineNumberCount={10}
      >
        {source}
      </CodeViewer>,
    );
    expect(container.querySelector('code')).toHaveClass('language-typescript');
  });

  it('counts CRLF source lines once for the gutter', () => {
    const { container } = render(<CodeViewer showLineNumbers>{'one\r\ntwo\r\nthree'}</CodeViewer>);

    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('1 2 3');
  });

  it('names the focusable source region without a caption', () => {
    render(<CodeViewer>{'const status = "ok";'}</CodeViewer>);

    expect(screen.getByRole('region', { name: 'Source code' })).toBeInTheDocument();
  });

  it('localizes the fallback source region name', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <CodeViewer>{'const status = "ok";'}</CodeViewer>
      </LocaleProvider>,
    );

    expect(screen.getByRole('region', { name: 'ソースコード' })).toBeInTheDocument();
  });

  it('keeps only the scroll region in the tab order', () => {
    render(<CodeViewer focusMode="always">{'const status = "ok";'}</CodeViewer>);

    expect(screen.getByRole('region', { name: 'Source code' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('group', { name: 'Code block' })).toHaveAttribute('tabindex', '-1');
  });

  it('uses an explicit accessible label instead of the default', () => {
    render(<CodeViewer aria-label="  Runtime configuration  ">{'enabled = true'}</CodeViewer>);

    expect(screen.getByRole('region', { name: 'Runtime configuration' })).toHaveAttribute(
      'aria-label',
      'Runtime configuration',
    );
  });

  it('uses the default name for empty accessible labels', () => {
    render(
      <CodeViewer aria-label="" aria-labelledby=" ">
        {'const status = "ok";'}
      </CodeViewer>,
    );

    expect(screen.getByRole('region', { name: 'Source code' })).toBeInTheDocument();
  });

  it('uses the default name when its caption is empty', () => {
    render(<CodeViewer caption="">{'const status = "ok";'}</CodeViewer>);

    expect(screen.getByRole('region', { name: 'Source code' })).toBeInTheDocument();
  });

  it('uses the default name when its caption renders no accessible content', () => {
    render(<CodeViewer caption={<></>}>{'const status = "ok";'}</CodeViewer>);

    expect(screen.getByRole('region', { name: 'Source code' })).toBeInTheDocument();
  });

  it('ignores hidden caption content but uses an explicitly visible sibling', () => {
    const { rerender } = render(
      <CodeViewer caption={<span hidden>Hidden source</span>}>{'enabled = true'}</CodeViewer>,
    );

    expect(screen.getByRole('region', { name: 'Source code' })).toBeInTheDocument();

    rerender(
      <CodeViewer
        caption={
          <>
            <span aria-hidden>Hidden source</span>
            <span aria-hidden={false}>Visible source</span>
          </>
        }
      >
        {'enabled = true'}
      </CodeViewer>,
    );

    expect(screen.getByRole('region', { name: 'Visible source' })).toBeInTheDocument();
  });

  it('uses the default name when an opaque caption component renders nothing', () => {
    const EmptyCaption = (_props: { 'aria-label'?: string }) => null;
    render(
      <CodeViewer caption={<EmptyCaption aria-label="Ignored label" />}>
        {'const status = "ok";'}
      </CodeViewer>,
    );

    expect(screen.getByRole('region', { name: 'Source code' })).toBeInTheDocument();
  });

  it('keeps opaque caption components visible while using a stable fallback name', () => {
    const Caption = () => <>Response payload</>;
    render(<CodeViewer caption={<Caption />}>{'const status = "ok";'}</CodeViewer>);

    expect(screen.getByText('Response payload')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Source code' })).toBeInTheDocument();
  });

  it('uses image alternative text as a caption name', () => {
    render(
      <CodeViewer caption={<img alt="Response payload" />}>{'const status = "ok";'}</CodeViewer>,
    );

    expect(screen.getByRole('region', { name: 'Response payload' })).toBeInTheDocument();
  });

  it('prioritizes explicit labels over the generated caption label', () => {
    render(
      <CodeViewer caption="config.ts" aria-label="Runtime configuration source">
        {'enabled = true'}
      </CodeViewer>,
    );

    expect(
      screen.getByRole('region', { name: 'Runtime configuration source' }),
    ).toBeInTheDocument();
  });

  it('prioritizes an explicit labelled-by value over other source labels', () => {
    render(
      <>
        <span id="source-context">Deployment configuration</span>
        <CodeViewer
          caption="config.ts"
          aria-label="Runtime configuration source"
          aria-labelledby="source-context"
        >
          {'enabled = true'}
        </CodeViewer>
      </>,
    );

    expect(screen.getByRole('region', { name: 'Deployment configuration' })).toBeInTheDocument();
  });

  it('keeps html-looking source as code text', () => {
    const { container } = render(
      <CodeViewer language="html">
        {'<img src=x onerror=alert(1)><script>alert(1)</script>'}
      </CodeViewer>,
    );

    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container.querySelector('code')).toHaveTextContent('onerror=alert(1)');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CodeViewer caption="Accessible source" showLineNumbers>
        {'const status = "ok";'}
      </CodeViewer>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
