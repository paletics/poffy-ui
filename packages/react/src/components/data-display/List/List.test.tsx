import { render, screen } from '@testing-library/react';
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ReactNode,
} from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { List, ListItem, ListItemIcon, ListItemText } from './index';
import type { ListVariant } from './List.types';

const RuntimeList = List as ComponentType<{
  asChild?: boolean;
  children?: ReactNode;
  variant?: ListVariant;
}>;
const ForwardedListRoot = forwardRef<HTMLUListElement, ComponentPropsWithoutRef<'ul'>>(
  (props, ref) => <ul ref={ref} data-custom-list-root="" {...props} />,
);
ForwardedListRoot.displayName = 'ForwardedListRoot';

describe('List', () => {
  it('renders list items', () => {
    render(
      <List>
        <ListItem>
          <ListItemText>Item 1</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>Item 2</ListItemText>
        </ListItem>
      </List>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders ordered list', () => {
    const { container } = render(
      <List variant="ordered">
        <ListItem>1</ListItem>
      </List>,
    );
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('falls back to a semantic list for non-list asChild hosts', () => {
    const { container } = render(
      <RuntimeList asChild>
        <nav>
          <ListItem>Link</ListItem>
        </nav>
      </RuntimeList>,
    );
    expect(container.firstChild?.nodeName).toBe('UL');
    expect(screen.getByRole('listitem')).toHaveTextContent('Link');
    expect(container.querySelector('nav')).not.toBeInTheDocument();
  });

  it('preserves listitem semantics when an item contains a link', async () => {
    const { container } = render(
      <List>
        <ListItem>
          <a href="/test">Link</a>
        </ListItem>
      </List>,
    );

    expect(screen.getByRole('listitem')).toContainElement(
      screen.getByRole('link', { name: 'Link' }),
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('preserves listitem semantics for a delegated native list host', async () => {
    const { container } = render(
      <List asChild>
        <ul>
          <ListItem>
            <a href="/test">Link</a>
          </ListItem>
        </ul>
      </List>,
    );

    expect(screen.getByRole('listitem')).toContainElement(
      screen.getByRole('link', { name: 'Link' }),
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders zero-valued primary and secondary text', () => {
    render(
      <List>
        <ListItem>
          <ListItemText primary={0} secondary={0} />
        </ListItem>
      </List>,
    );

    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  it('supports asChild text with primary and secondary content', () => {
    render(
      <List>
        <ListItem>
          <ListItemText asChild primary="Primary" secondary="Secondary">
            <a href="/settings">Settings</a>
          </ListItemText>
        </ListItem>
      </List>,
    );

    expect(screen.getByRole('link', { name: /Settings.*Primary.*Secondary/ })).toBeInTheDocument();
  });

  it('falls back to a text container for form-control asChild hosts', async () => {
    const { container } = render(
      <List>
        <ListItem>
          <ListItemText asChild primary="Primary" secondary="Secondary">
            <select aria-label="Destination">
              <option>Settings</option>
            </select>
          </ListItemText>
        </ListItem>
      </List>,
    );

    const select = screen.getByRole('combobox', { name: 'Destination' });
    expect(select.parentElement?.tagName).toBe('DIV');
    expect(select.querySelector('span, div')).toBeNull();
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back to native hosts for invalid delegated roots and text anchors', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, rerender } = render(
      <RuntimeList asChild>
        <>List content</>
      </RuntimeList>,
    );
    expect(container.firstChild?.nodeName).toBe('UL');
    expect(screen.getByRole('listitem')).toHaveTextContent('List content');
    expect(warning).toHaveBeenCalled();

    rerender(
      <List>
        <ListItem>
          <ListItemText asChild primary="Primary">
            <img src="avatar.jpg" alt="Avatar" />
          </ListItemText>
        </ListItem>
      </List>,
    );
    expect(screen.getByText('Primary').parentElement?.tagName).toBe('DIV');
    warning.mockRestore();
  });

  it('does not wrap opaque components that render List.Item', () => {
    const WrappedItem = ({ children }: { children: string }) => <ListItem>{children}</ListItem>;
    const { container } = render(
      <List>
        <WrappedItem>Settings</WrappedItem>
      </List>,
    );

    expect(screen.getByRole('listitem')).toHaveTextContent('Settings');
    expect(container.querySelector('li li')).toBeNull();
  });

  it('wraps known-invalid direct children while warning about the contract', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <List>
        <div>Profile</div>
      </List>,
    );

    expect(screen.getByText('Profile').parentElement).toBe(screen.getByRole('listitem'));
    expect(warning).toHaveBeenCalledWith(
      '[List] List.Root children must render list items. Use List.Item or a component that forwards to List.Item.',
    );
    expect(await axe(container)).toHaveNoViolations();
    warning.mockRestore();
  });

  it('preserves props on a single direct list item', () => {
    const onClick = () => undefined;
    render(
      <List>
        <ListItem
          aria-label="Inbox item"
          className="custom-item"
          data-testid="inbox"
          onClick={onClick}
        >
          Inbox
        </ListItem>
      </List>,
    );

    const item = screen.getByTestId('inbox');
    expect(item.tagName).toBe('LI');
    expect(item).toHaveAttribute('aria-label', 'Inbox item');
    expect(item).toHaveClass('custom-item');
  });

  it('falls back to the variant-matching root when an asChild list host mismatches', () => {
    const { container, rerender } = render(
      <RuntimeList variant="ordered" asChild>
        <ul>
          <ListItem>First</ListItem>
        </ul>
      </RuntimeList>,
    );

    expect(container.firstChild?.nodeName).toBe('OL');
    expect(container.querySelector('ul')).not.toBeInTheDocument();

    rerender(
      <RuntimeList variant="marker" asChild>
        <ol>
          <ListItem>First</ListItem>
        </ol>
      </RuntimeList>,
    );

    expect(container.firstChild?.nodeName).toBe('UL');
    expect(container.querySelector('ol')).not.toBeInTheDocument();
  });

  it('falls back instead of trusting an opaque custom list root', () => {
    const { container } = render(
      <RuntimeList asChild>
        <ForwardedListRoot>
          <ListItem>First</ListItem>
        </ForwardedListRoot>
      </RuntimeList>,
    );

    expect(container.firstChild?.nodeName).toBe('UL');
    expect(container.querySelector('[data-custom-list-root]')).toBeNull();
    expect(screen.getByRole('listitem')).toHaveTextContent('First');
  });

  it('falls back to a non-interactive icon container for interactive asChild hosts', async () => {
    const { container } = render(
      <List>
        <ListItem>
          <ListItemIcon asChild aria-hidden>
            <button type="button">Remove</button>
          </ListItemIcon>
          <ListItemText>Inbox</ListItemText>
        </ListItem>
      </List>,
    );

    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon?.tagName).toBe('DIV');
    expect(icon).toHaveTextContent('Remove');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('preserves leaf element semantics inside a safe implicit list item', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <RuntimeList asChild>
        <nav>
          <a href="/settings">Settings</a>
        </nav>
      </RuntimeList>,
    );

    const link = screen.getByRole('link', { name: 'Settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link.parentElement).toBe(screen.getByRole('listitem'));
    expect(link.closest('ul')).toBe(screen.getByRole('list'));
    expect(warning).toHaveBeenCalled();
    warning.mockRestore();
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <List>
        <ListItem>Item 1</ListItem>
      </List>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
