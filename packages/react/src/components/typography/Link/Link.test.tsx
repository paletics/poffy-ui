import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Link } from './Link';

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

  it('does not set rel when link is not blank-targeted', () => {
    render(<Link href="/internal">Internal</Link>);
    const link = screen.getByRole('link', { name: 'Internal' });
    expect(link).not.toHaveAttribute('rel');
  });

  /**
   *           When rendered, Then the child's tag is used and recipe classes are merged.
   */
  it('delegates rendering to child element when asChild is true', () => {
    render(
      <Link asChild>
        <button type="button">Button Link</button>
      </Link>,
    );
    const el = screen.getByRole('button', { name: 'Button Link' });
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveClass('poffy-link');
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
