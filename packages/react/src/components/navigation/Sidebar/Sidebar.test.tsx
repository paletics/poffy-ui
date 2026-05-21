import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from './index';

describe('Sidebar', () => {
  it('renders items', () => {
    render(
      <Sidebar>
        <SidebarItem href="/test">Dashboard</SidebarItem>
        <SidebarItem href="/test">Settings</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders active item with aria-current', () => {
    render(
      <Sidebar>
        <SidebarItem href="/test" isActive>
          Active
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByText('Active').closest('a')).toHaveAttribute('aria-current', 'page');
  });

  it('renders icon inside SidebarItem', () => {
    render(
      <Sidebar>
        <SidebarItem href="/test" icon={<svg data-testid="icon" />}>
          Home
        </SidebarItem>
      </Sidebar>,
    );
    const icon = screen.getByTestId('icon');
    expect(icon.closest('span')).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports asChild router links with icons', () => {
    render(
      <Sidebar>
        <SidebarItem asChild icon={<svg data-testid="router-icon" />}>
          <a href="/dashboard">Dashboard</a>
        </SidebarItem>
      </Sidebar>,
    );

    const link = screen.getByRole('link', { name: /Dashboard/i });
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(screen.getByTestId('router-icon').closest('span')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('renders SidebarGroup with a label', () => {
    render(
      <Sidebar>
        <SidebarGroup label="Navigation">
          <SidebarItem href="/test">Item</SidebarItem>
        </SidebarGroup>
      </Sidebar>,
    );
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    const group = screen.getByRole('group', { name: 'Navigation' });
    expect(group).toBeInTheDocument();
  });

  it('renders SidebarGroup without a label', () => {
    render(
      <Sidebar>
        <SidebarGroup>
          <SidebarItem href="/test">Item</SidebarItem>
        </SidebarGroup>
      </Sidebar>,
    );
    const group = screen.getByRole('group');
    expect(group).not.toHaveAttribute('aria-labelledby');
  });

  it('renders SidebarHeader, SidebarContent, SidebarFooter', () => {
    render(
      <Sidebar>
        <SidebarHeader>Logo</SidebarHeader>
        <SidebarContent>
          <SidebarItem href="/test">Item</SidebarItem>
        </SidebarContent>
        <SidebarFooter>User</SidebarFooter>
      </Sidebar>,
    );
    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('removes aria-labelledby from SidebarGroup when collapsed', () => {
    render(
      <Sidebar collapsed>
        <SidebarGroup label="Navigation">
          <SidebarItem href="/test">Item</SidebarItem>
        </SidebarGroup>
      </Sidebar>,
    );
    expect(screen.getByRole('group')).not.toHaveAttribute('aria-labelledby');
  });

  it('retains aria-labelledby on SidebarGroup when not collapsed', () => {
    render(
      <Sidebar>
        <SidebarGroup label="Navigation">
          <SidebarItem href="/test">Item</SidebarItem>
        </SidebarGroup>
      </Sidebar>,
    );
    expect(screen.getByRole('group', { name: 'Navigation' })).toHaveAttribute('aria-labelledby');
  });

  it('has aria-label on the aside landmark', () => {
    const { container } = render(<Sidebar />);
    expect(container.querySelector('aside')).toHaveAttribute('aria-label', 'Sidebar navigation');
  });

  it('applies public appearance classes', () => {
    const { container } = render(<Sidebar appearance="outline" />);
    expect(container.querySelector('aside')).toHaveClass('poffy-sidebar__root--appearance_outline');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Sidebar>
        <SidebarHeader>Logo</SidebarHeader>
        <SidebarContent>
          <SidebarGroup label="Main">
            <SidebarItem href="/dashboard" isActive>
              Dashboard
            </SidebarItem>
            <SidebarItem href="/settings">Settings</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>User</SidebarFooter>
      </Sidebar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
