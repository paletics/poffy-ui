import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Navbar, NavbarBrand, NavbarContent, NavbarLink } from './index';

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

  it('applies public appearance classes', () => {
    const { container } = render(<Navbar appearance="ghost" />);
    expect(container.querySelector('nav')).toHaveClass('poffy-navbar__root--appearance_ghost');
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
