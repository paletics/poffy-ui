import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createElement, createRef, forwardRef, type ComponentType, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { LocaleProvider } from '@/providers/LocaleProvider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from './index';

const RouterLink = forwardRef<HTMLAnchorElement, { children?: ReactNode; to: string }>(
  ({ children, to, ...props }, ref) => (
    <a ref={ref} href={to} {...props}>
      {children}
    </a>
  ),
);
RouterLink.displayName = 'RouterLink';
const RuntimeSidebarItem = SidebarItem as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;

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

  it('does not allow an active item aria-current to be overridden', () => {
    render(
      <Sidebar>
        <SidebarItem href="/test" isActive aria-current="step">
          Active
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByText('Active').closest('a')).toHaveAttribute('aria-current', 'page');
  });

  it('does not allow an active asChild item aria-current to be overridden', () => {
    render(
      <Sidebar>
        <SidebarItem asChild isActive>
          <a href="/test" aria-current="step">
            Active
          </a>
        </SidebarItem>
      </Sidebar>,
    );

    expect(screen.getByText('Active').closest('a')).toHaveAttribute('aria-current', 'page');
  });

  it('preserves router links whose destination is expressed with to', () => {
    render(
      <Sidebar>
        <SidebarItem asChild>
          <RouterLink to="/projects">Projects</RouterLink>
        </SidebarItem>
      </Sidebar>,
    );

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
  });

  it('removes anchor-only wrapper attributes from a passive asChild fallback', () => {
    render(
      <Sidebar>
        <RuntimeSidebarItem
          asChild
          data-testid="passive-item"
          download="guide.pdf"
          hrefLang="en"
          media="screen"
          ping="/audit"
          referrerPolicy="origin"
          rel="alternate"
          target="_blank"
          type="text/html"
        >
          <span>Passive item</span>
        </RuntimeSidebarItem>
      </Sidebar>,
    );

    const item = screen.getByTestId('passive-item');
    expect(item.tagName).toBe('SPAN');
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
      expect(item).not.toHaveAttribute(attribute);
    }
  });

  it('owns an explicitly provided inactive asChild aria-current value', () => {
    render(
      <Sidebar>
        <SidebarItem asChild aria-current="location">
          <a href="/test" aria-current="step">
            Nearby
          </a>
        </SidebarItem>
      </Sidebar>,
    );

    expect(screen.getByText('Nearby').closest('a')).toHaveAttribute('aria-current', 'location');
  });

  it('keeps one asChild link host while merging refs, classes, rest props, and events', () => {
    const childClick = vi.fn();
    const itemClick = vi.fn();
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Sidebar>
        <SidebarItem
          ref={ref}
          asChild
          className="item-class"
          icon={<svg data-testid="sidebar-icon" />}
          isActive
          onClick={itemClick}
          data-testid="sidebar-link"
        >
          <a className="host-class" href="/projects" onClick={childClick}>
            Projects
          </a>
        </SidebarItem>
      </Sidebar>,
    );

    const link = screen.getByTestId('sidebar-link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('item-class', 'host-class');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(ref.current).toBe(link);
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(screen.getByTestId('sidebar-icon')).toBeInTheDocument();
    expect(screen.getByText('Projects').parentElement).toBe(link);
    fireEvent.click(link);
    expect(childClick).toHaveBeenCalledOnce();
    expect(itemClick).toHaveBeenCalledOnce();
  });

  it('falls back to an anchor when a native asChild host is not a link', () => {
    render(
      <Sidebar>
        <SidebarItem asChild href="/dashboard">
          <button type="button">Dashboard</button>
        </SidebarItem>
      </Sidebar>,
    );

    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link.querySelector('button')).toBeNull();
  });

  it.each([
    ['img', <img key="img" alt="Artwork" />],
    ['input', <input key="input" aria-label="Nested field" />],
    ['Fragment', <>Fragment content</>],
    ['text', 'Text content'],
    ['multiple children', [<span key="a">First</span>, <span key="b">Second</span>]],
  ] as [string, ReactNode][])(
    'falls back to one owned anchor with icon and label for %s asChild content',
    (_name, children) => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { container } = render(
        <Sidebar>
          <SidebarItem
            asChild
            href="/fallback"
            icon={<svg data-testid="fallback-icon" />}
            isActive
            data-testid="fallback-item"
          >
            {children}
          </SidebarItem>
        </Sidebar>,
      );

      const link = screen.getByTestId('fallback-item');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/fallback');
      expect(link).toHaveAttribute('aria-current', 'page');
      expect(container.querySelectorAll('a')).toHaveLength(1);
      expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
      expect(Array.from(link.children).filter((child) => child.tagName === 'SPAN')).toHaveLength(2);
      if (_name === 'img') {
        expect(screen.queryByRole('img', { name: 'Artwork' })).not.toBeInTheDocument();
        expect(link).toHaveTextContent('Artwork');
      }
      if (_name === 'input') {
        expect(screen.queryByRole('textbox', { name: 'Nested field' })).not.toBeInTheDocument();
        expect(link).toHaveTextContent('Nested field');
      }
      if (_name === 'Fragment') expect(link).toHaveTextContent('Fragment content');
      if (_name === 'text') expect(link).toHaveTextContent('Text content');
      if (_name === 'multiple children') expect(link).toHaveTextContent('FirstSecond');
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    },
  );

  it('removes nested interactive hosts from an owned anchor fallback while retaining labels', () => {
    render(
      <Sidebar>
        <SidebarItem asChild href="/fallback" data-testid="fallback-item">
          <>
            <button type="button">Button label</button>
            <a href="/nested">Nested link label</a>
            {createElement('span', { tabIndex: 0 }, 'Focusable label')}
          </>
        </SidebarItem>
      </Sidebar>,
    );

    const link = screen.getByTestId('fallback-item');
    expect(link).toHaveTextContent('Button labelNested link labelFocusable label');
    expect(link.querySelector('a, button, input, [tabindex]')).toBeNull();
    expect(document.querySelectorAll('a')).toHaveLength(1);
  });

  it('removes nested interactive descendants from a valid asChild anchor', async () => {
    const { container } = render(
      <Sidebar>
        <SidebarItem asChild>
          <a href="/projects">
            <button type="button">Project action</button>
          </a>
        </SidebarItem>
      </Sidebar>,
    );

    const link = screen.getByRole('link', { name: 'Project action' });
    expect(link.querySelector('button')).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses one link host for valid and fallback SidebarItem server markup', () => {
    const validMarkup = renderToString(
      <Sidebar>
        <SidebarItem asChild icon={<svg />}>
          <a href="/valid">Valid</a>
        </SidebarItem>
      </Sidebar>,
    );
    const fallbackMarkup = renderToString(
      <Sidebar>
        <SidebarItem asChild href="/fallback" icon={<svg />}>
          <img alt="Artwork" />
        </SidebarItem>
      </Sidebar>,
    );

    expect(validMarkup.match(/<a\b/g)).toHaveLength(1);
    expect(fallbackMarkup.match(/<a\b/g)).toHaveLength(1);
    expect(fallbackMarkup).not.toContain('<img');
    expect(fallbackMarkup).toContain('Artwork');
  });

  it('keeps an inactive item aria-current value', () => {
    render(
      <Sidebar>
        <SidebarItem href="/test" aria-current="location">
          Nearby
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByText('Nearby').closest('a')).toHaveAttribute('aria-current', 'location');
  });

  it('does not leak asChild from fixed semantic slots', () => {
    const legacyAsChild = { asChild: true };
    const { container } = render(
      <Sidebar {...legacyAsChild}>
        <SidebarHeader {...legacyAsChild}>Logo</SidebarHeader>
        <SidebarContent {...legacyAsChild}>
          <SidebarGroup {...legacyAsChild} label="Navigation">
            <SidebarItem href="/test">Item</SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter {...legacyAsChild}>Footer</SidebarFooter>
      </Sidebar>,
    );
    expect(container.querySelectorAll('[aschild]')).toHaveLength(0);
  });

  it('keeps a collapsed item accessible by its visible label', () => {
    render(
      <Sidebar collapsed>
        <SidebarItem href="/dashboard" icon={<svg />}>
          Dashboard
        </SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('keeps an asChild collapsed item accessible without displaying its label', () => {
    render(
      <Sidebar collapsed>
        <SidebarItem asChild icon={<svg />}>
          <a href="/dashboard">Dashboard</a>
        </SidebarItem>
      </Sidebar>,
    );
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(screen.getByText('Dashboard')).toHaveClass('poffy-sidebar__itemLabel');
    expect(link).toContainElement(screen.getByText('Dashboard'));
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

  it('uses zero as a SidebarGroup label', () => {
    render(
      <Sidebar>
        <SidebarGroup label={0}>
          <SidebarItem href="/test">Item</SidebarItem>
        </SidebarGroup>
      </Sidebar>,
    );
    expect(screen.getByRole('group', { name: '0' })).toBeInTheDocument();
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

  it('localizes the default landmark label from LocaleProvider', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Sidebar />
      </LocaleProvider>,
    );

    expect(screen.getByRole('complementary', { name: 'サイドバーナビゲーション' })).toBeVisible();
  });

  it('prefers locale prop over LocaleProvider for the default landmark label', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Sidebar locale="en-US" />
      </LocaleProvider>,
    );

    const sidebar = screen.getByRole('complementary', { name: 'Sidebar navigation' });
    expect(sidebar).not.toHaveAttribute('locale');
  });

  it('prefers an explicit aria-label over localized defaults', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Sidebar aria-label="Workspace" />
      </LocaleProvider>,
    );

    expect(screen.getByRole('complementary', { name: 'Workspace' })).toBeVisible();
  });

  it('prefers aria-labelledby and omits the fallback aria-label', () => {
    render(
      <>
        <h2 id="workspace-navigation">Workspace navigation</h2>
        <Sidebar aria-label="Ignored label" aria-labelledby="workspace-navigation" />
      </>,
    );

    const sidebar = screen.getByRole('complementary', { name: 'Workspace navigation' });
    expect(sidebar).toHaveAttribute('aria-labelledby', 'workspace-navigation');
    expect(sidebar).not.toHaveAttribute('aria-label');
  });

  it('falls back to the localized label for blank explicit naming props', () => {
    render(<Sidebar aria-label="  " aria-labelledby="  " locale="ja" />);

    expect(screen.getByRole('complementary', { name: 'サイドバーナビゲーション' })).toBeVisible();
  });

  it('applies public appearance classes', () => {
    const { container } = render(<Sidebar appearance="outline" />);
    expect(container.querySelector('aside')).toHaveClass('poffy-sidebar__root--appearance_outline');
  });

  it('protects new-window navigation from opener access', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem href="https://example.com" target="_blank" rel="opener">
              Docs
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('normalizes unsafe new-window attributes supplied by an asChild anchor', () => {
    render(
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarItem asChild>
              <a href="https://example.com" target="_blank" rel="opener noreferrer">
                Docs
              </a>
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
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
