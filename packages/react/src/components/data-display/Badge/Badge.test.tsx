import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';
import { Avatar } from '../Avatar';
import { Button } from '@/components/inputs/Button';

describe('Badge', () => {
  it('forwards a delegated HTMLElement ref to the anchor', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Badge asChild ref={ref} content="1">
        <button type="button">Inbox</button>
      </Badge>,
    );

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Inbox1' }));
  });

  it('renders with content', () => {
    render(
      <Badge content="99">
        <div>Child</div>
      </Badge>,
    );
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('renders zero content', () => {
    render(
      <Badge content={0}>
        <div>Child</div>
      </Badge>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders styles based on intent', () => {
    const { container } = render(
      <Badge content="Test" intent="danger">
        Child
      </Badge>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain('badge__root');
  });

  it('accepts logical placements for writing-direction-safe positioning', () => {
    const { container } = render(
      <Badge content="1" placement="top-start">
        Child
      </Badge>,
    );

    expect(container.querySelector('.poffy-badge__badge')).toHaveClass(/placement_top-start/);
  });

  it('supports polymorphism via asChild', () => {
    render(
      <Badge asChild content="Poly">
        <span data-testid="poly-child">Child</span>
      </Badge>,
    );
    const child = screen.getByTestId('poly-child');
    expect(child).toBeInTheDocument();
    expect(child.tagName).toBe('SPAN');
    expect(screen.getByText('Poly')).toBeInTheDocument();
  });

  it('renders zero content with asChild', () => {
    render(
      <Badge asChild content={0}>
        <span data-testid="poly-child">Child</span>
      </Badge>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('falls back to a wrapper for form-control asChild hosts', async () => {
    const { container } = render(
      <Badge asChild content="1">
        <select aria-label="Destination">
          <option>Settings</option>
        </select>
      </Badge>,
    );

    const select = screen.getByRole('combobox', { name: 'Destination' });
    expect(select.parentElement?.tagName).toBe('DIV');
    expect(select.querySelector('span')).toBeNull();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps safe interactive asChild hosts delegated', () => {
    render(
      <Badge asChild content="1">
        <button type="button">Notifications</button>
      </Badge>,
    );

    expect(screen.getByRole('button', { name: 'Notifications1' })).toBeInTheDocument();
  });

  it('keeps custom asChild hosts delegated', () => {
    render(
      <Badge asChild content="1">
        <Button>Notifications</Button>
      </Badge>,
    );

    expect(screen.getByRole('button', { name: 'Notifications1' })).toBeInTheDocument();
  });

  it('preserves flow content in delegated asChild anchors', async () => {
    const { container } = render(
      <Badge asChild content="1">
        <a href="/settings">
          <div data-testid="anchor-content">Settings</div>
        </a>
      </Badge>,
    );

    const anchor = screen.getByRole('link', { name: 'Settings 1' });
    expect(anchor.firstElementChild).toHaveAttribute('data-testid', 'anchor-content');
    expect(anchor.querySelector('span > div')).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders properly without children', () => {
    const { container } = render(<Badge content="Standalone" />);
    expect(screen.getByText('Standalone')).toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('data-standalone');
    expect(container.querySelector('[data-badge-standalone-content]')).toHaveTextContent(
      'Standalone',
    );
  });

  it('uses the standalone layout when a conditional anchor is not rendered', () => {
    const { container } = render(<Badge content="Standalone">{false}</Badge>);

    expect(container.firstChild).toHaveAttribute('data-standalone');
  });

  it('keeps the standalone marker consistent when a consumer supplies the internal attribute', () => {
    const { container, rerender } = render(
      <Badge content="Standalone" data-standalone={undefined} />,
    );

    expect(container.firstChild).toHaveAttribute('data-standalone');

    rerender(
      <Badge content="Anchored" data-standalone="">
        <div>Inbox</div>
      </Badge>,
    );
    expect(container.firstChild).not.toHaveAttribute('data-standalone');
  });

  it('does not add the standalone content wrapper to anchored indicators', () => {
    const { container } = render(
      <Badge content="99+">
        <div>Inbox</div>
      </Badge>,
    );

    expect(container.querySelector('[data-badge-standalone-content]')).toBeNull();
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('supports a compound indicator with an asChild anchor', () => {
    render(
      <Badge.Root asChild>
        <button type="button">Notifications</button>
        <Badge.Indicator>3</Badge.Indicator>
      </Badge.Root>,
    );

    expect(screen.getByRole('button', { name: 'Notifications3' })).toBeInTheDocument();
  });

  it('falls back safely for invalid compound asChild hosts', () => {
    const { container, rerender } = render(
      <Badge.Root asChild>
        <img src="avatar.jpg" alt="Jane Doe" />
        <Badge.Indicator>1</Badge.Indicator>
      </Badge.Root>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');

    rerender(
      <Badge.Root>
        <Badge.Indicator asChild>1</Badge.Indicator>
      </Badge.Root>,
    );
    expect(screen.getByText('1').tagName).toBe('SPAN');
  });

  it('keeps indicators visual-only when given interactive content', () => {
    render(
      <Badge.Root asChild>
        <button type="button">Notifications</button>
        <Badge.Indicator asChild>
          <button type="button">3</button>
        </Badge.Indicator>
      </Badge.Root>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Notifications3' })).toBeInTheDocument();
  });

  it('reduces opaque interactive indicator content to text', () => {
    render(
      <Badge.Root asChild>
        <button type="button">Notifications</button>
        <Badge.Indicator asChild>
          <Button>3</Button>
        </Badge.Indicator>
      </Badge.Root>,
    );

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Notifications3' })).toBeInTheDocument();
  });

  it('preserves noninteractive custom indicator content in a non-delegated root', () => {
    const CustomIndicator = () => <span data-testid="custom-indicator">New</span>;
    render(
      <Badge.Root>
        <span>Notifications</span>
        <Badge.Indicator>
          <CustomIndicator />
        </Badge.Indicator>
      </Badge.Root>,
    );

    expect(screen.getByTestId('custom-indicator')).toHaveTextContent('New');
  });

  it('falls back to avoid nesting interactive children in a delegated root', () => {
    const { container } = render(
      <Badge.Root asChild>
        <button type="button">Primary</button>
        <button type="button">Secondary</button>
      </Badge.Root>,
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('falls back to a wrapper when asChild receives a void element', () => {
    const { container } = render(
      <Badge asChild content="1">
        <img src="avatar.jpg" alt="Jane Doe" />
      </Badge>,
    );

    expect(container.firstChild).toHaveProperty('tagName', 'DIV');
    expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('keeps its indicator when an asChild Avatar finishes loading', () => {
    render(
      <Badge asChild content="1">
        <Avatar src="avatar.jpg" alt="Jane Doe" name="Jane Doe" />
      </Badge>,
    );

    fireEvent.load(screen.getByRole('img', { name: 'Jane Doe' }));

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('falls back to a wrapper when asChild receives a fragment', () => {
    const { container } = render(
      <Badge asChild content="1">
        <>
          <span>Avatar</span>
        </>
      </Badge>,
    );

    expect(container.firstChild).toHaveProperty('tagName', 'DIV');
    expect(screen.getByText('Avatar')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <Badge content="1">
        <button>Button</button>
      </Badge>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations for compound delegated badges', async () => {
    const { container } = render(
      <Badge.Root asChild>
        <button type="button" aria-label="Notifications">
          <span>Notifications</span>
        </button>
        <Badge.Indicator asChild>
          <span aria-hidden="true">3</span>
        </Badge.Indicator>
      </Badge.Root>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
