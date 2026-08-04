import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { MarkdownViewer } from './MarkdownViewer';
import { LocaleProvider } from '@/providers/LocaleProvider';

/**
 * ### Test Strategy: MarkdownViewer
 * - **Focus**: Limited Markdown block rendering, safe link handling, heading-level offset,
 *   fenced code rendering, inert raw HTML text, and accessibility.
 * - **DON'T**: Do not claim or test full CommonMark/GFM compatibility.
 */
describe('MarkdownViewer', () => {
  it('renders common prose blocks', () => {
    const { container } = render(
      <MarkdownViewer
        source={[
          '## Notes',
          '',
          'Use `pnpm test` before release.',
          '',
          '- Unit tests',
          '- Typecheck',
          '',
          '> Keep scope narrow.',
          '',
          '```json',
          '{"status":"ok"}',
          '```',
        ].join('\n')}
      />,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Notes' })).toBeInTheDocument();
    expect(screen.getByText('pnpm test')).toBeInTheDocument();
    expect(screen.getByText('Unit tests')).toBeInTheDocument();
    expect(screen.getByText('Keep scope narrow.')).toBeInTheDocument();
    expect(container.querySelector('code.language-json')).toHaveTextContent('{"status":"ok"}');
  });

  it('does not parse or render Markdown that exceeds the source limit', () => {
    const { container } = render(
      <MarkdownViewer
        maxSourceCharacters={10}
        source="# This heading exceeds the configured source limit"
      />,
    );

    expect(container).toHaveTextContent('Markdown content exceeds the rendering limit.');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('allows callers with bounded input to opt out of the source limit', () => {
    render(
      <MarkdownViewer
        maxSourceCharacters={Infinity}
        source="# This heading is deliberately long"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'This heading is deliberately long' }),
    ).toBeInTheDocument();
  });

  it('falls back safely for deeply nested source within the character limit', () => {
    const { container } = render(<MarkdownViewer source={`${'> '.repeat(5000)}x`} />);

    expect(container).toHaveTextContent('Markdown content could not be rendered safely.');
    expect(screen.queryByText('x')).not.toBeInTheDocument();
  });

  it('keeps oversized and parse-error messages independently configurable', () => {
    const { rerender } = render(
      <MarkdownViewer
        maxSourceCharacters={1}
        oversizedSourceText="Too large"
        parseErrorText="Invalid markdown"
        source="## heading"
      />,
    );

    expect(screen.getByText('Too large')).toBeInTheDocument();

    rerender(
      <MarkdownViewer
        oversizedSourceText="Too large"
        parseErrorText="Invalid markdown"
        source={`${'> '.repeat(5000)}x`}
      />,
    );

    expect(screen.getByText('Invalid markdown')).toBeInTheDocument();
  });

  it('allows safe links and renders unsafe links as text', () => {
    const { container } = render(
      <MarkdownViewer
        source={[
          '[Docs](https://example.com)',
          '[Bad](javascript:alert(1))',
          '[Protocol relative](//example.com)',
        ].join(' ')}
      />,
    );

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(container).toHaveTextContent('Bad');
    expect(screen.queryByRole('link', { name: 'Bad' })).not.toBeInTheDocument();
    expect(container).toHaveTextContent('Protocol relative');
    expect(screen.queryByRole('link', { name: 'Protocol relative' })).not.toBeInTheDocument();
  });

  it('does not render unnamed links', () => {
    render(<MarkdownViewer source={'[](https://example.com)'} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('keeps raw html inert', () => {
    const { container } = render(
      <MarkdownViewer source={'<img src=x onerror=alert(1)>\n\n<script>alert(1)</script>'} />,
    );

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(screen.getByText(/<img src=x/)).toBeInTheDocument();
  });

  it('preserves image alt text without making network requests by default', () => {
    const { container } = render(
      <MarkdownViewer
        source={
          '![Architecture diagram](https://example.com/diagram.png) ![Blocked image](javascript:alert(1))'
        }
      />,
    );

    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(container).toHaveTextContent('Architecture diagram');
    expect(container).toHaveTextContent('Blocked image');
  });

  it('renders safe images only when explicitly enabled', () => {
    const { container } = render(
      <MarkdownViewer
        renderImages
        source={
          '![Architecture diagram](https://example.com/diagram.png) ![Blocked image](javascript:alert(1))'
        }
      />,
    );

    expect(screen.getByRole('img', { name: 'Architecture diagram' })).toHaveAttribute(
      'src',
      'https://example.com/diagram.png',
    );
    expect(screen.getByRole('img', { name: 'Architecture diagram' })).toHaveAttribute(
      'referrerpolicy',
      'no-referrer',
    );
    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(screen.getByText('Blocked image')).toBeInTheDocument();
  });

  it('does not render unnamed links around decorative images', () => {
    const source = '[![](https://example.com/icon.svg)](/target)';
    const { rerender } = render(<MarkdownViewer source={source} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();

    rerender(<MarkdownViewer renderImages source={source} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('gives multiple fenced code blocks distinct accessible names', () => {
    render(<MarkdownViewer source={'```json\n{}\n```\n\n```json\n{}\n```'} />);

    expect(screen.getByRole('region', { name: 'JSON block 1' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'JSON block 2' })).toBeInTheDocument();
  });

  it('localizes code-block labels and fallback status text', () => {
    const { rerender } = render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <MarkdownViewer source={'```json\n{}\n```'} />
      </LocaleProvider>,
    );

    expect(screen.getByRole('region', { name: 'JSON コードブロック 1' })).toBeInTheDocument();

    rerender(
      <MarkdownViewer
        maxSourceCharacters={1}
        messages={{ oversizedSource: 'Custom size warning' }}
        source="long"
      />,
    );

    expect(screen.getByText('Custom size warning')).toBeInTheDocument();
  });

  it('clamps heading levels to h6', () => {
    render(<MarkdownViewer baseHeadingLevel={5} source={'### Deep heading'} />);

    expect(screen.getByRole('heading', { level: 6, name: 'Deep heading' })).toBeInTheDocument();
  });

  it('normalizes invalid runtime heading levels to h1', () => {
    render(<MarkdownViewer baseHeadingLevel={0 as 2} source={'# Heading'} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeInTheDocument();
  });

  it('renders lists with native list semantics', () => {
    render(<MarkdownViewer source={'1. First\n2. Second'} />);

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <MarkdownViewer source={'## Accessible\n\nA [safe link](/docs).'} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
