import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AvatarGroup } from './AvatarGroup';
import { Avatar } from '../Avatar/Avatar';

describe('AvatarGroup Component', () => {
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

  it('should have no a11y violations', async () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar name="A11y" />
      </AvatarGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
