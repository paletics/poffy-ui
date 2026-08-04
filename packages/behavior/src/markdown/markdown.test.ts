import { describe, expect, it } from 'vitest';
import { parseMarkdown } from './markdown';
import { sanitizeMarkdownUrl } from './sanitizeMarkdownUrl';

/**
 * ### Test Strategy: Markdown behavior
 * - **Focus**: Renderer-neutral Markdown normalization, safe URL policy,
 *   Mermaid code preservation, raw HTML text preservation, and unsupported inline unwrapping.
 * - **DON'T**: Do not test React rendering, visual styling, or full GFM support here.
 */
describe('markdown behavior', () => {
  it('normalizes common prose blocks', () => {
    const document = parseMarkdown(
      [
        '## Notes',
        '',
        'Use `pnpm test`.',
        '',
        '- Unit tests',
        '- Typecheck',
        '',
        '> Keep scope narrow.',
      ].join('\n'),
    );

    expect(document.children[0]).toMatchObject({ type: 'heading', depth: 2 });
    expect(document.children[1]).toMatchObject({ type: 'paragraph' });
    expect(document.children[2]).toMatchObject({
      type: 'list',
      ordered: false,
      items: [{ type: 'listItem' }, { type: 'listItem' }],
    });
    expect(document.children[3]).toMatchObject({ type: 'blockquote' });
  });

  it('preserves code language and metadata without deciding renderer support', () => {
    const document = parseMarkdown(
      ['```mermaid title="Flow"', 'flowchart TD', 'A --> B', '```'].join('\n'),
    );

    expect(document.children[0]).toEqual({
      type: 'code',
      language: 'mermaid',
      meta: 'title="Flow"',
      value: 'flowchart TD\nA --> B',
    });
  });

  it('marks safe and unsafe links', () => {
    const document = parseMarkdown(
      '[Docs](https://example.com) [Bad](javascript:alert(1)) [Protocol](//example.com)',
    );
    const paragraph = document.children[0];

    expect(paragraph).toMatchObject({
      type: 'paragraph',
      children: [
        { type: 'link', href: 'https://example.com', safe: true },
        { type: 'text', value: ' ' },
        { type: 'link', href: '', safe: false },
        { type: 'text', value: ' ' },
        { type: 'link', href: '', safe: false },
      ],
    });
  });

  it('preserves safe images and unsafe image alt text metadata', () => {
    const document = parseMarkdown(
      '![Architecture diagram](https://example.com/diagram.png) ![Blocked image](javascript:alert(1))',
    );
    const paragraph = document.children[0];

    expect(paragraph).toMatchObject({
      type: 'paragraph',
      children: [
        { type: 'image', alt: 'Architecture diagram', safe: true },
        { type: 'text', value: ' ' },
        { type: 'image', alt: 'Blocked image', safe: false },
      ],
    });
  });

  it('does not expose unsafe urls from the normalized document', () => {
    const document = parseMarkdown(
      '![Blocked](javascript:alert(1)) [Also blocked](data:text/html,test)',
    );
    const paragraph = document.children[0];

    expect(paragraph).toMatchObject({
      type: 'paragraph',
      children: [
        { type: 'image', href: '', safe: false },
        { type: 'text', value: ' ' },
        { type: 'link', href: '', safe: false },
      ],
    });
  });

  it('preserves raw html as escaped text by default', () => {
    const document = parseMarkdown('<script>alert(1)</script>');

    expect(document.children[0]).toEqual({
      type: 'paragraph',
      children: [{ type: 'text', value: '<script>alert(1)</script>' }],
    });
  });

  it('can drop raw html when requested', () => {
    const document = parseMarkdown('<script>alert(1)</script>', { preserveHtmlAsText: false });

    expect(document.children).toEqual([]);
  });

  it('unwraps unsupported inline formatting into text', () => {
    const document = parseMarkdown('This is **important**.');

    expect(document.children[0]).toMatchObject({
      type: 'paragraph',
      children: [
        { type: 'text', value: 'This is ' },
        { type: 'text', value: 'important' },
        { type: 'text', value: '.' },
      ],
    });
  });

  it('sanitizes urls with a strict allowlist', () => {
    expect(sanitizeMarkdownUrl('/docs')).toBe('/docs');
    expect(sanitizeMarkdownUrl('./docs')).toBe('./docs');
    expect(sanitizeMarkdownUrl('../docs')).toBe('../docs');
    expect(sanitizeMarkdownUrl('#section')).toBe('#section');
    expect(sanitizeMarkdownUrl('mailto:team@example.com')).toBe('mailto:team@example.com');
    expect(sanitizeMarkdownUrl('data:text/html,<script>')).toBeUndefined();
    expect(sanitizeMarkdownUrl('//example.com')).toBeUndefined();
    expect(sanitizeMarkdownUrl('/\\example.com')).toBeUndefined();
  });
});
