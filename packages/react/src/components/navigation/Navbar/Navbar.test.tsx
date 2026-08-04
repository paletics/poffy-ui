import { render, screen } from '@testing-library/react';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Navbar, NavbarBrand, NavbarContent, NavbarLink } from './index';

const RouterLink = forwardRef<
  HTMLAnchorElement,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string | { pathname: string } }
>(({ to, children, ...props }, ref) => (
  <a ref={ref} data-to={typeof to === 'string' ? to : to.pathname} {...props}>
    {children}
  </a>
));
RouterLink.displayName = 'RouterLink';

describe('Navbar', () => {
  it('renders brand and links', () => {
    render(
      <Navbar>
        <NavbarBrand href="/test">My Brand</NavbarBrand>
        <NavbarContent>
          <NavbarLink href="/test">Home</NavbarLink>
        </NavbarContent>
      </Navbar>,
    );
    expect(screen.getByText('My Brand')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders active link', () => {
    render(
      <Navbar>
        <NavbarLink href="/test" isActive>
          Active Link
        </NavbarLink>
      </Navbar>,
    );
    const link = screen.getByText('Active Link');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('does not allow an active link aria-current to be overridden', () => {
    render(
      <Navbar>
        <NavbarLink href="/test" isActive aria-current="step">
          Active Link
        </NavbarLink>
      </Navbar>,
    );
    expect(screen.getByText('Active Link')).toHaveAttribute('aria-current', 'page');
  });

  it('does not allow an active asChild link aria-current to be overridden', () => {
    render(
      <Navbar>
        <NavbarLink asChild isActive>
          <a href="/test" aria-current="step">
            Active Link
          </a>
        </NavbarLink>
      </Navbar>,
    );

    expect(screen.getByText('Active Link')).toHaveAttribute('aria-current', 'page');
  });

  it('preserves custom router destinations for brands and active links', () => {
    render(
      <Navbar>
        <NavbarBrand asChild>
          <RouterLink to="/">Router brand</RouterLink>
        </NavbarBrand>
        <NavbarLink asChild isActive>
          <RouterLink to={{ pathname: '/docs' }}>Router docs</RouterLink>
        </NavbarLink>
      </Navbar>,
    );

    const brand = screen.getByText('Router brand').closest('a');
    const docs = screen.getByText('Router docs').closest('a');
    expect(brand).not.toBeNull();
    expect(docs).not.toBeNull();
    expect(brand).toHaveAttribute('data-to', '/');
    expect(brand).not.toHaveAttribute('href');
    expect(docs).toHaveAttribute('data-to', '/docs');
    expect(docs).not.toHaveAttribute('href');
    expect(docs).toHaveAttribute('aria-current', 'page');
  });

  it('removes nested interactive descendants from valid asChild links and brands', async () => {
    const { container } = render(
      <Navbar>
        <NavbarBrand asChild>
          <a href="/">
            <button type="button">Brand action</button>
          </a>
        </NavbarBrand>
        <NavbarLink asChild>
          <a href="/docs">
            <button type="button">Docs action</button>
          </a>
        </NavbarLink>
      </Navbar>,
    );

    expect(screen.getByRole('link', { name: 'Brand action' }).querySelector('button')).toBeNull();
    expect(screen.getByRole('link', { name: 'Docs action' }).querySelector('button')).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back to a native anchor when an asChild link host is invalid', () => {
    render(
      <Navbar>
        <NavbarLink asChild href="/docs">
          <div>
            <button type="button">Docs</button>
          </div>
        </NavbarLink>
      </Navbar>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link.querySelector('button')).toBeNull();
  });

  it('falls back safely when an asChild brand is not a link host', () => {
    render(
      <Navbar>
        <NavbarBrand asChild href="/">
          <>Poffy</>
        </NavbarBrand>
      </Navbar>,
    );

    expect(screen.getByRole('link', { name: 'Poffy' })).toHaveAttribute('href', '/');
  });

  it('does not leak native anchor attributes onto destination-less fallbacks', () => {
    const unsafeAnchorProps = {
      download: 'asset.pdf',
      hrefLang: 'en',
      media: 'print',
      ping: '/audit',
      referrerPolicy: 'origin',
      type: 'text/html',
    } as Record<string, string>;

    render(
      <Navbar>
        <NavbarBrand asChild {...unsafeAnchorProps}>
          <span>Brand text</span>
        </NavbarBrand>
        <NavbarLink asChild {...unsafeAnchorProps}>
          <span>Link text</span>
        </NavbarLink>
      </Navbar>,
    );

    for (const fallback of [screen.getByText('Brand text'), screen.getByText('Link text')]) {
      expect(fallback.tagName).toBe('SPAN');
      for (const attribute of ['download', 'hreflang', 'media', 'ping', 'referrerpolicy', 'type']) {
        expect(fallback).not.toHaveAttribute(attribute);
      }
    }
  });

  it('preserves anchor attributes on outer-destination fallbacks', () => {
    render(
      <Navbar>
        <NavbarBrand asChild href="/" download="brand.svg">
          <span>Brand asset</span>
        </NavbarBrand>
        <NavbarLink asChild href="/docs" download="docs.pdf">
          <span>Docs asset</span>
        </NavbarLink>
      </Navbar>,
    );

    expect(screen.getByRole('link', { name: 'Brand asset' })).toHaveAttribute(
      'download',
      'brand.svg',
    );
    expect(screen.getByRole('link', { name: 'Docs asset' })).toHaveAttribute(
      'download',
      'docs.pdf',
    );
  });

  it('preserves an explicit aria-current value on a non-active link', () => {
    render(
      <Navbar>
        <NavbarLink href="/section" aria-current="location">
          Section
        </NavbarLink>
      </Navbar>,
    );

    expect(screen.getByText('Section')).toHaveAttribute('aria-current', 'location');
  });

  it('does not leak the content-only justify variant onto the nav element', () => {
    const { container } = render(<Navbar justify="end" />);

    expect(container.querySelector('nav')).not.toHaveAttribute('justify');
  });

  it('uses scrolling as the default narrow layout without leaking the prop', () => {
    const { container } = render(<Navbar />);
    const nav = container.querySelector('nav');

    expect(nav).toHaveClass('poffy-navbar__root--narrowLayout_scroll');
    expect(nav).not.toHaveAttribute('narrowLayout');
  });

  it('keeps wrap layout classes when NavbarContent overrides justification', () => {
    render(
      <Navbar narrowLayout="wrap">
        <NavbarContent justify="end" data-testid="actions">
          Actions
        </NavbarContent>
      </Navbar>,
    );

    const content = screen.getByTestId('actions');
    expect(content).toHaveClass('poffy-navbar__content--narrowLayout_wrap');
    expect(content).toHaveClass('poffy-navbar__content--justify_end');
  });

  it('applies public appearance classes', () => {
    const { container } = render(<Navbar appearance="ghost" />);
    expect(container.querySelector('nav')).toHaveClass('poffy-navbar__root--appearance_ghost');
  });

  it('protects new-window navigation links and brands from opener access', () => {
    render(
      <Navbar>
        <NavbarBrand href="https://example.com" target="_blank" rel="opener">
          Brand
        </NavbarBrand>
        <NavbarContent>
          <NavbarLink href="https://example.com" target="_blank" rel="opener">
            Docs
          </NavbarLink>
        </NavbarContent>
      </Navbar>,
    );

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    }
  });

  it('normalizes unsafe new-window attributes supplied by asChild anchors', () => {
    render(
      <Navbar>
        <NavbarBrand asChild>
          <a href="https://example.com" target="_blank" rel="opener noreferrer">
            Brand
          </a>
        </NavbarBrand>
        <NavbarContent>
          <NavbarLink asChild>
            <a href="https://example.com" target="_blank" rel="opener noreferrer">
              Docs
            </a>
          </NavbarLink>
        </NavbarContent>
      </Navbar>,
    );

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    }
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Navbar>
        <NavbarBrand href="/">My Brand</NavbarBrand>
        <NavbarContent>
          <NavbarLink href="/home" isActive>
            Home
          </NavbarLink>
          <NavbarLink href="/about">About</NavbarLink>
        </NavbarContent>
      </Navbar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
