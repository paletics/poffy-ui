import { render, screen } from '@testing-library/react';
import { createElement, forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Link } from './Link';

const RouterLink = forwardRef<
  HTMLAnchorElement,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string | { pathname: string } }
>(({ to, children, ...props }, ref) => (
  <a ref={ref} data-to={typeof to === 'string' ? to : to.pathname} {...props}>
    {children}
  </a>
));
RouterLink.displayName = 'RouterLink';

describe('Atoms / Link', () => {
  it('renders as an anchor element by default', () => {
    render(<Link href="/home">Home</Link>);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('renders children correctly', () => {
    render(<Link href="/about">About Us</Link>);
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('preserves element children during normal rendering', () => {
    render(
      <Link href="/about">
        <span data-testid="link-icon" aria-hidden="true">
          ↗
        </span>
        About Us
      </Link>,
    );

    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
  });

  it('sets target="_blank" and rel="noopener noreferrer" when external={true}', () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('auto-adds noopener noreferrer when target="_blank" is passed directly', () => {
    render(
      <Link href="https://example.com" target="_blank">
        Direct Blank
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Direct Blank' });
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('preserves consumer-provided rel values and appends security tokens', () => {
    render(
      <Link href="https://example.com" external rel="nofollow">
        External with rel
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'External with rel' });
    const rel = link.getAttribute('rel') ?? '';
    expect(rel).toContain('nofollow');
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  it('deduplicates blank-target relationship tokens case-insensitively', () => {
    render(
      <Link href="https://example.com" target="_BLANK" rel="NoOpener license NOOPENER Noreferrer">
        External with mixed-case rel
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'External with mixed-case rel' })).toHaveAttribute(
      'rel',
      'NoOpener license Noreferrer',
    );
  });

  it('preserves rel without adding security tokens for named targets', () => {
    render(
      <Link href="/preview" target="preview" rel="opener">
        Preview
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Preview' })).toHaveAttribute('rel', 'opener');
  });

  it('does not set rel when link is not blank-targeted', () => {
    render(<Link href="/internal">Internal</Link>);
    const link = screen.getByRole('link', { name: 'Internal' });
    expect(link).not.toHaveAttribute('rel');
  });

  it('treats an empty href as a valid same-document destination', () => {
    render(
      <Link href="" external>
        Current document
      </Link>,
    );

    const link = screen.getByText('Current document').closest('a');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('href', '');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('keeps an empty slotted href as a valid destination', () => {
    render(
      <Link asChild external>
        {createElement('a', { href: '' }, 'Current document')}
      </Link>,
    );

    const link = screen.getByText('Current document').closest('a');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('href', '');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('delegates rendering to an anchor child when asChild is true', () => {
    render(
      <Link asChild href="/docs">
        {createElement('a', null, 'Docs Link')}
      </Link>,
    );
    const el = screen.getByRole('link', { name: 'Docs Link' });
    expect(el.tagName).toBe('A');
    expect(el).toHaveClass('poffy-link');
  });

  it('delegates a custom router destination without synthesizing href', () => {
    const ref = { current: null as HTMLAnchorElement | null };
    render(
      <Link asChild ref={ref}>
        <RouterLink to={{ pathname: '/docs' }}>Router docs</RouterLink>
      </Link>,
    );

    const link = screen.getByText('Router docs').closest('a');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('data-to', '/docs');
    expect(link).not.toHaveAttribute('href');
    expect(ref.current).toBe(link);
  });

  it('falls back to an anchor for invalid native asChild hosts', () => {
    render(
      <Link asChild href="/docs">
        <button type="button">Docs Link</button>
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Docs Link' })).toHaveAttribute('href', '/docs');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('preserves an invalid native host accessible name on the fallback anchor', () => {
    render(
      <Link asChild href="/docs">
        <button type="button" aria-label="Documentation" />
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute('href', '/docs');
  });

  it('removes interactive descendants from an invalid asChild anchor fallback', async () => {
    const { container } = render(
      <Link asChild href="/docs">
        <button type="button">
          <a href="/nested">Nested documentation</a>
        </button>
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Nested documentation' })).toHaveAttribute(
      'href',
      '/docs',
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders non-navigational text instead of an anchor without a destination', () => {
    render(<Link>Details</Link>);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Details').tagName).toBe('SPAN');
  });

  it('uses the same non-link fallback for an asChild anchor without a destination', () => {
    render(<Link asChild>{createElement('a', null, 'Details')}</Link>);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Details').tagName).toBe('SPAN');
  });

  it('does not leak native anchor attributes onto a destination-less fallback', () => {
    render(
      <Link
        asChild
        {...({
          download: 'details.pdf',
          hrefLang: 'en',
          media: 'print',
          ping: '/audit',
          referrerPolicy: 'origin',
          type: 'text/html',
        } as Record<string, string>)}
      >
        <span>Details</span>
      </Link>,
    );

    const fallback = screen.getByText('Details');
    expect(fallback.tagName).toBe('SPAN');
    for (const attribute of ['download', 'hreflang', 'media', 'ping', 'referrerpolicy', 'type']) {
      expect(fallback).not.toHaveAttribute(attribute);
    }
  });

  it('preserves anchor attributes when an invalid host falls back with an outer destination', () => {
    render(
      <Link asChild href="/docs" download="docs.pdf" hrefLang="en">
        <span>Docs</span>
      </Link>,
    );

    const fallback = screen.getByRole('link', { name: 'Docs' });
    expect(fallback.tagName).toBe('A');
    expect(fallback).toHaveAttribute('href', '/docs');
    expect(fallback).toHaveAttribute('download', 'docs.pdf');
    expect(fallback).toHaveAttribute('hreflang', 'en');
  });

  it('owns blank-target security attributes for slotted links', () => {
    render(
      <Link asChild external href="https://example.com">
        {createElement('a', { rel: 'xnoopener xnoreferrer', target: '_self' }, 'External')}
      </Link>,
    );

    const externalLink = screen.getByRole('link', { name: 'External' });
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(externalLink).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('adds security tokens when a slotted link owns a blank target', () => {
    render(
      <Link asChild>
        <a href="https://example.com" rel="xnoopener x noreferrer" target="_blank">
          External
        </a>
      </Link>,
    );

    const externalLink = screen.getByRole('link', { name: 'External' });
    expect(externalLink).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(externalLink).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('forwards ref to the anchor element', () => {
    const ref = { current: null };
    render(
      <Link href="/" ref={ref}>
        Ref Link
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('merges custom className with recipe class', () => {
    render(
      <Link href="/" className="custom-class">
        Classed Link
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Classed Link' });
    expect(link).toHaveClass('custom-class');
    expect(link).toHaveClass('poffy-link');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(<Link href="/home">Home</Link>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no a11y violations (external)', async () => {
    const { container } = render(
      <Link href="https://example.com" external>
        External Site
      </Link>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
