import { render, screen } from '@testing-library/react';
import { createElement, type ComponentType, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Reference } from './Reference';
import { ReferenceList } from './ReferenceList';
import { LocaleProvider } from '@/providers/LocaleProvider';

const RuntimeReference = Reference as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;
const RuntimeReferenceList = ReferenceList as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;

/**
 * ### Test Strategy: Reference
 * - **Focus**: Link/span rendering, accessible numbered labels, list navigation semantics,
 *   and automated accessibility checks.
 * - **DON'T**: Do not assert generated Panda class names or visual token values.
 */
describe('Reference', () => {
  it('renders a numbered reference as a link', () => {
    render(<Reference index={1} label="Design docs" href="/docs" />);

    expect(screen.getByRole('link', { name: '[1] Design docs' })).toHaveAttribute('href', '/docs');
  });

  it('renders an inert labelled reference without href', () => {
    render(<Reference label="Inline source" />);

    expect(screen.getByText('Inline source')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('removes anchor-only attributes from passive runtime fallbacks', () => {
    render(
      <RuntimeReference
        data-testid="passive-reference"
        label="Inline source"
        download="source.txt"
        hrefLang="en"
        media="screen"
        ping="/audit"
        referrerPolicy="origin"
        rel="alternate"
        target="_blank"
        type="text/plain"
      />,
    );

    const reference = screen.getByTestId('passive-reference');
    expect(reference.tagName).toBe('SPAN');
    for (const attribute of [
      'download',
      'hreflang',
      'media',
      'ping',
      'referrerpolicy',
      'rel',
      'target',
      'type',
    ]) {
      expect(reference).not.toHaveAttribute(attribute);
    }
  });

  it('gives otherwise unnamed links a stable accessible name', () => {
    const { rerender } = render(<Reference href="/docs" />);

    expect(screen.getByRole('link', { name: 'Reference' })).toHaveAttribute('href', '/docs');

    rerender(<Reference href="/docs" label={<span aria-hidden="true">↗</span>} />);

    expect(screen.getByRole('link', { name: 'Reference' })).toHaveAttribute('href', '/docs');
  });

  it('localizes fallback names and allows explicit message overrides', () => {
    const { rerender } = render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Reference href="/docs" />
        <ReferenceList />
      </LocaleProvider>,
    );

    expect(screen.getByRole('link', { name: '参照' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '参照一覧' })).toBeInTheDocument();

    rerender(
      <>
        <Reference href="/docs" locale="ja" messages={{ reference: '出典' }} />
        <ReferenceList locale="ja" messages={{ references: '出典一覧' }} />
      </>,
    );

    expect(screen.getByRole('link', { name: '出典' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '出典一覧' })).toBeInTheDocument();
  });

  it('does not add a title when long content is truncated or wrapped', () => {
    const { rerender } = render(
      <Reference label="A very long reference label" href="/docs" overflow="truncate" />,
    );

    expect(screen.getByRole('link')).not.toHaveAttribute('title');

    rerender(<Reference label="A very long reference label" href="/docs" overflow="wrap" />);

    expect(screen.getByRole('link')).not.toHaveAttribute('title');
  });

  it('does not render unsafe URL schemes as links', () => {
    render(
      <RuntimeReference
        label="Unsafe source"
        href="javascript:alert(1)"
        rel="opener"
        download="source.txt"
        hrefLang="en"
      />,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    const fallback = screen.getByText('Unsafe source').closest('a');
    expect(fallback).not.toHaveAttribute('href');
    expect(fallback).not.toHaveAttribute('rel');
    expect(fallback).not.toHaveAttribute('download');
    expect(fallback).not.toHaveAttribute('hreflang');
  });

  it('does not retain an unsafe slotted link destination', () => {
    render(
      <Reference asChild label="Safe source" href="javascript:alert(1)">
        {createElement('a', { href: 'javascript:alert(1)' }, 'Unsafe')}
      </Reference>,
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('removes interactive descendants from link reference content', async () => {
    const { container } = render(<Reference href="/docs" label={<button>Open docs</button>} />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('link', { name: 'Open docs' })).toHaveAttribute('href', '/docs');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('removes interactive descendants from link reference descriptions', async () => {
    const { container } = render(
      <Reference href="/docs" label="Docs" description={<button>More details</button>} />,
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('link', { name: 'Docs More details' })).toHaveAttribute(
      'href',
      '/docs',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('preserves zero-valued markers and descriptions', () => {
    render(<Reference index={0} label={0} description={0} href="/zero" />);

    expect(screen.getByRole('link', { name: '[0] 0 0' })).toBeInTheDocument();
  });

  it('marks indexed references so wrapped layouts can group the marker with the label', () => {
    const { rerender } = render(
      <Reference index={1} label="Design docs" description="Guide" overflow="wrap" />,
    );

    expect(screen.getByText('Design docs').closest('[data-has-marker]')).toBeInTheDocument();

    rerender(<Reference label="Design docs" description="Guide" overflow="wrap" />);

    expect(screen.getByText('Design docs').closest('[data-has-marker]')).toBeNull();
  });

  it('keeps marker ownership when a consumer supplies a conflicting data attribute', () => {
    const { rerender } = render(
      <Reference
        index={1}
        label="Design docs"
        overflow="wrap"
        {...({ 'data-has-marker': 'consumer' } as never)}
      />,
    );

    expect(screen.getByText('Design docs').closest('[data-has-marker]')).toHaveAttribute(
      'data-has-marker',
      '',
    );

    rerender(
      <Reference
        label="Design docs"
        overflow="wrap"
        {...({ 'data-has-marker': 'consumer' } as never)}
      />,
    );

    expect(screen.getByText('Design docs').closest('[data-has-marker]')).toBeNull();
  });

  it('slots an asChild link with generated reference content', () => {
    render(
      <Reference asChild index={1} label="Design docs" href="/docs">
        {createElement('a')}
      </Reference>,
    );

    expect(screen.getByRole('link', { name: '[1] Design docs' })).toHaveAttribute('href', '/docs');
  });

  it('keeps destination and external-link safety attributes component-owned when slotted', () => {
    render(
      <Reference asChild index={1} label="Design docs" href="/docs" external>
        {createElement('a', { href: '/other', rel: 'opener', target: '_self' })}
      </Reference>,
    );

    const link = screen.getByRole('link', { name: '[1] Design docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('preserves a slotted link name unless Reference explicitly supplies one', async () => {
    const { container } = render(
      <Reference asChild label={<span aria-hidden="true">↗</span>} href="/docs">
        {createElement('a', { 'aria-label': 'Read design docs' })}
      </Reference>,
    );

    expect(screen.getByRole('link', { name: 'Read design docs' })).toHaveAttribute('href', '/docs');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('preserves relationship tokens for regular links', () => {
    render(<Reference label="License" href="/license" rel="license" />);

    expect(screen.getByRole('link', { name: 'License' })).toHaveAttribute('rel', 'license');
  });

  it('adds security tokens only for case-insensitive blank targets', () => {
    render(<Reference label="External source" href="/external" target="_BLANK" rel="NoOpener" />);

    expect(screen.getByRole('link', { name: 'External source' })).toHaveAttribute(
      'rel',
      'NoOpener noreferrer',
    );
  });

  it('preserves relationship tokens without expansion for named targets', () => {
    render(<Reference label="Preview source" href="/preview" target="preview" rel="opener" />);

    expect(screen.getByRole('link', { name: 'Preview source' })).toHaveAttribute('rel', 'opener');
  });

  it('falls back to a native link when the slotted host is not an anchor', () => {
    render(
      <RuntimeReference asChild label="Design docs" href="/docs">
        <span>Child label</span>
      </RuntimeReference>,
    );

    expect(screen.getByRole('link', { name: 'Child label' })).toHaveAttribute('href', '/docs');
  });

  it('renders a labelled reference list', () => {
    render(<ReferenceList references={[{ label: 'API', href: '/api' }]} />);

    expect(screen.getByRole('navigation', { name: 'References' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '[1] API' })).toHaveAttribute('href', '/api');
  });

  it('does not spread React keys into generated reference props', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      render(
        <ReferenceList
          references={[
            { id: 'linked', label: 'API', href: '/api' },
            { id: 'passive', label: 'Inline source' },
          ]}
        />,
      );

      expect(screen.getByRole('link', { name: '[1] API' })).toHaveAttribute('href', '/api');
      expect(screen.getByText('Inline source')).toBeInTheDocument();
      expect(consoleError.mock.calls.flat().join(' ')).not.toContain(
        'A props object containing a "key" prop is being spread into JSX',
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it('injects data-driven references into a slotted navigation landmark', () => {
    render(
      <ReferenceList asChild references={[{ label: 'API', href: '/api' }]}>
        <nav />
      </ReferenceList>,
    );

    expect(screen.getByRole('navigation', { name: 'References' })).toContainElement(
      screen.getByRole('link', { name: '[1] API' }),
    );
  });

  it('keeps the ReferenceList label component-owned when slotted', () => {
    render(
      <ReferenceList asChild aria-label="Sources">
        <nav aria-label="Other" />
      </ReferenceList>,
    );

    expect(screen.getByRole('navigation', { name: 'Sources' })).toBeInTheDocument();
  });

  it('falls back to a native navigation landmark for an invalid slotted host', () => {
    render(
      <RuntimeReferenceList asChild references={[{ label: 'API', href: '/api' }]}>
        <div />
      </RuntimeReferenceList>,
    );

    expect(screen.getByRole('navigation', { name: 'References' })).toContainElement(
      screen.getByRole('link', { name: '[1] API' }),
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ReferenceList references={[{ label: 'Docs', href: '/docs', description: 'Guide' }]} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
