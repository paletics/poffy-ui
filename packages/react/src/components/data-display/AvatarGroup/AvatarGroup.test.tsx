import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, Fragment, StrictMode, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from '../Avatar/Avatar';
import { LocaleProvider } from '@/providers/LocaleProvider';

describe('AvatarGroup Component', () => {
  it('replays generated avatars during StrictMode rendering', () => {
    function* avatars() {
      yield <Avatar key="one" name="Generated 1" />;
      yield <Avatar key="two" name="Generated 2" />;
    }

    render(
      <StrictMode>
        <AvatarGroup>{avatars()}</AvatarGroup>
      </StrictMode>,
    );

    expect(screen.getByRole('group', { name: 'Avatar group' }).children).toHaveLength(2);
  });

  it('renders children correctly', () => {
    render(
      <AvatarGroup data-testid="group">
        <Avatar name="Test 1" />
        <Avatar name="Test 2" />
      </AvatarGroup>,
    );
    const group = screen.getByTestId('group');
    expect(group.children).toHaveLength(2);
  });

  it('does not add a redundant tab stop to an unbounded group', () => {
    render(
      <AvatarGroup>
        <Avatar name="Test 1" />
        <Avatar name="Test 2" />
      </AvatarGroup>,
    );

    expect(screen.getByRole('group', { name: 'Avatar group' })).not.toHaveAttribute('tabindex');
  });

  it('preserves an explicit tab index and calls the consumer keyboard handler', () => {
    const onKeyDown = vi.fn();
    render(
      <AvatarGroup tabIndex={-1} onKeyDown={onKeyDown}>
        <Avatar name="Test 1" />
        <Avatar name="Test 2" />
      </AvatarGroup>,
    );

    const group = screen.getByRole('group', { name: 'Avatar group' });
    expect(group).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it('does not auto-focus a presentational group', () => {
    render(
      <AvatarGroup role="presentation" data-testid="presentational-avatar-group">
        <Avatar name="Test 1" />
        <Avatar name="Test 2" />
      </AvatarGroup>,
    );

    expect(screen.getByTestId('presentational-avatar-group')).not.toHaveAttribute('tabindex');
  });

  it('respects presentational semantics delegated by an asChild host', () => {
    render(
      <AvatarGroup asChild>
        <section role="presentation" data-testid="presentational-avatar-group">
          <Avatar name="Test 1" />
          <Avatar name="Test 2" />
        </section>
      </AvatarGroup>,
    );

    const group = screen.getByTestId('presentational-avatar-group');
    expect(group).not.toHaveAttribute('tabindex');
    expect(group).not.toHaveAttribute('aria-label');
  });

  it('merges the forwarded ref when delegating the group host', () => {
    const ref = createRef<HTMLElement>();
    render(
      <AvatarGroup asChild ref={ref}>
        <section data-testid="delegated-avatar-group">
          <Avatar name="Test 1" />
        </section>
      </AvatarGroup>,
    );

    expect(ref.current).toBe(screen.getByTestId('delegated-avatar-group'));
  });

  it('localizes default group and excess labels', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <AvatarGroup max={1}>
          <Avatar name="1" />
          <Avatar name="2" />
        </AvatarGroup>
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'アバターグループ' })).toBeInTheDocument();
    expect(screen.getByText('他1件のアバターを表示')).toBeInTheDocument();
  });

  it('respects max prop', () => {
    render(
      <AvatarGroup max={2} data-testid="group">
        <Avatar name="1" />
        <Avatar name="2" />
        <Avatar name="3" />
      </AvatarGroup>,
    );
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('supports max zero', () => {
    render(
      <AvatarGroup max={0}>
        <Avatar name="1" />
        <Avatar name="2" />
      </AvatarGroup>,
    );

    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('normalizes invalid maximum and total counts', () => {
    const { rerender } = render(
      <AvatarGroup max={Number.NaN} total={Number.POSITIVE_INFINITY}>
        <Avatar name="1" />
        <Avatar name="2" />
      </AvatarGroup>,
    );

    expect(screen.queryByText('+2')).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    rerender(
      <AvatarGroup max={1.9} total={3.8}>
        <Avatar name="1" />
        <Avatar name="2" />
      </AvatarGroup>,
    );

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('marks visible avatars and passes the group size by default', () => {
    render(
      <AvatarGroup size="lg">
        <Avatar name="1" data-testid="avatar-one" />
        <Avatar name="2" size="sm" data-testid="avatar-two" />
      </AvatarGroup>,
    );

    expect(screen.getByTestId('avatar-one')).toHaveClass('avatar');
    expect(screen.getByTestId('avatar-one').className).toContain('size_lg');
    expect(screen.getByTestId('avatar-two').className).toContain('size_sm');
  });

  it('respects total prop', () => {
    render(
      <AvatarGroup max={2} total={10} data-testid="group">
        <Avatar name="1" />
        <Avatar name="2" />
      </AvatarGroup>,
    );
    expect(screen.getByText('+8')).toBeInTheDocument();
  });

  it('does not lose rendered avatars from the excess count when total is lower', () => {
    render(
      <AvatarGroup max={1} total={0}>
        <Avatar name="1" />
        <Avatar name="2" />
        <Avatar name="3" />
      </AvatarGroup>,
    );

    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('counts avatars nested in fragments when applying max', () => {
    render(
      <AvatarGroup max={1}>
        <>
          <Avatar name="1" />
          <Avatar name="2" />
          <Avatar name="3" />
        </>
      </AvatarGroup>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('flattens nested arrays and keeps internal excess keys separate from user keys', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const first = [<Avatar key="excess" name="1" />];
    const second = [<Avatar key="excess" name="2" />];

    render(
      <AvatarGroup max={1}>
        {first}
        <>{second}</>
      </AvatarGroup>,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalledWith(
      expect.stringContaining('Each child in a list should have a unique "key" prop'),
    );
    consoleError.mockRestore();
  });

  it('preserves keyed child state when only a Fragment boundary changes', () => {
    const mounted = vi.fn();
    const StatefulChild = () => {
      useEffect(() => {
        mounted();
      }, []);
      return <span>Stateful member</span>;
    };
    const { rerender } = render(
      <AvatarGroup>
        <StatefulChild key="stable" />
      </AvatarGroup>,
    );

    rerender(
      <AvatarGroup>
        <Fragment>
          <StatefulChild key="stable" />
        </Fragment>
      </AvatarGroup>,
    );

    expect(screen.getByText('Stateful member')).toBeInTheDocument();
    expect(mounted).toHaveBeenCalledOnce();
  });

  it('renders Fragment children and internal excess content on the server', () => {
    const markup = renderToString(
      <AvatarGroup max={1}>
        <>
          <Avatar name="1" />
          <Avatar name="2" />
        </>
      </AvatarGroup>,
    );

    expect(markup).toContain('>1<');
    expect(markup).toContain('Show 1 more avatar');
  });

  it('does not forward avatar-only size props to non-avatar children', () => {
    render(
      <AvatarGroup size="lg">
        <span data-testid="non-avatar">Content</span>
      </AvatarGroup>,
    );

    expect(screen.getByTestId('non-avatar')).not.toHaveAttribute('size');
  });

  it('uses group semantics when an accessible name is supplied', () => {
    render(
      <AvatarGroup aria-label="Project members">
        <Avatar name="1" />
      </AvatarGroup>,
    );

    expect(screen.getByRole('group', { name: 'Project members' })).toBeInTheDocument();
  });

  it('keeps named group semantics when delegating to a valid child host', () => {
    render(
      <AvatarGroup asChild aria-label="Project members">
        <section>
          <Avatar name="1" />
        </section>
      </AvatarGroup>,
    );

    expect(screen.getByRole('group', { name: 'Project members' }).tagName).toBe('SECTION');
  });

  it('gives a static excess indicator descriptive screen reader text', () => {
    render(
      <AvatarGroup max={1}>
        <Avatar name="1" />
        <Avatar name="2" />
      </AvatarGroup>,
    );

    expect(screen.getByText('Show 1 more avatar')).toBeInTheDocument();
  });

  it('normalizes direct excess counts to finite non-negative integers', () => {
    const { rerender } = render(<AvatarGroup.Excess count={Number.NaN} />);
    expect(screen.getByText('+0')).toBeInTheDocument();
    expect(screen.getByText('Show 0 more avatars')).toBeInTheDocument();

    rerender(<AvatarGroup.Excess count={2.8} />);
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByText('Show 2 more avatars')).toBeInTheDocument();

    rerender(<AvatarGroup.Excess count={-1} />);
    expect(screen.getByText('+0')).toBeInTheDocument();
  });

  it('localizes direct excess indicators through LocaleProvider', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <AvatarGroup.Excess count={2} />
      </LocaleProvider>,
    );

    expect(screen.getByText('他2件のアバターを表示')).toBeInTheDocument();
  });

  it('handles excess click', () => {
    const handleClick = vi.fn();
    render(
      <AvatarGroup max={1} onExcessClick={handleClick}>
        <Avatar name="1" />
        <Avatar name="2" />
      </AvatarGroup>,
    );
    const excess = screen.getByRole('button', { name: 'Show 1 more avatar' });
    expect(excess).toHaveTextContent('+1');
    expect(excess.querySelector('img')).toBeNull();
    fireEvent.click(excess);
    expect(handleClick).toHaveBeenCalled();
    expect(excess.tagName).toBe('BUTTON');
  });

  it('falls back from an opaque interactive host for clickable excess content', async () => {
    const handleClick = vi.fn();
    const { container } = render(
      <AvatarGroup asChild max={1} onExcessClick={handleClick}>
        <button type="button">
          <Avatar name="1" />
          <Avatar name="2" />
        </button>
      </AvatarGroup>,
    );

    const group = screen.getByRole('group', { name: 'Avatar group' });
    const excess = screen.getByRole('button', { name: 'Show 1 more avatar' });
    expect(group.tagName).toBe('DIV');
    expect(container.querySelector('button button')).toBeNull();
    expect(container.querySelectorAll('button')).toHaveLength(1);

    fireEvent.click(excess);
    expect(handleClick).toHaveBeenCalledOnce();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders as a different element when "asChild" prop is provided', () => {
    render(
      <AvatarGroup asChild data-testid="group-section">
        <section>
          <Avatar name="1" />
          <Avatar name="2" />
        </section>
      </AvatarGroup>,
    );
    const group = screen.getByTestId('group-section');
    expect(group.tagName).toBe('SECTION');
    expect(group.children).toHaveLength(2);
  });

  it('falls back to a div for invalid or void asChild children', () => {
    const { container, rerender } = render(
      <AvatarGroup asChild>
        <>Invalid host</>
      </AvatarGroup>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');

    rerender(
      <AvatarGroup asChild>
        <img alt="Invalid host" />
      </AvatarGroup>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="A11y" />
      </AvatarGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations for named delegated and clickable excess groups', async () => {
    const { container } = render(
      <AvatarGroup asChild aria-label="Project members" max={1} onExcessClick={() => undefined}>
        <section>
          <Avatar name="A11y" />
          <Avatar name="Hidden" />
        </section>
      </AvatarGroup>,
    );
    const group = screen.getByRole('group', { name: 'Project members' });
    const excess = screen.getByRole('button', { name: 'Show 1 more avatar' });
    expect(group.tagName).toBe('SECTION');
    expect(group).toContainElement(excess);
    expect(await axe(container)).toHaveNoViolations();
  });
});
