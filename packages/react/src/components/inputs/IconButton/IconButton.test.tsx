import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { IconButton } from './IconButton';

const TestIcon = () => (
  <svg data-testid="test-icon" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

/**
 * ### Test Strategy: IconButton
 * - **Focus**: Icon rendering, mandatory `aria-label`, click handling, loading/disabled ARIA attributes,
 *   polymorphic `asChild` delegation, and full WAI-ARIA Button compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names, size/variant/shape visual output — use Storybook for visual regression.
 * - **DON'T**: Do not test ActionMotion animation timing — that is covered in animation unit tests.
 */
describe('IconButton', () => {
  it('renders with button role and icon', () => {
    render(<IconButton icon={<TestIcon />} aria-label="Edit item" />);
    expect(screen.getByRole('button', { name: 'Edit item' })).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<IconButton icon={<TestIcon />} aria-label="Edit item" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<IconButton icon={<TestIcon />} aria-label="Submit" onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe('when disabled', () => {
    it('is marked disabled and has aria-disabled', () => {
      render(<IconButton icon={<TestIcon />} aria-label="Edit" disabled />);
      const button = screen.getByRole('button', { name: 'Edit' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not fire onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<IconButton icon={<TestIcon />} aria-label="Edit" disabled onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor activation before child handlers run', () => {
      const handleClick = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onClick={handleClick}>
            Edit
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor capture activation before child handlers run', () => {
      const handleClickCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onClickCapture={handleClickCapture}>
            Edit
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClickCapture).not.toHaveBeenCalled();
    });

    it('blocks asChild keyboard activation keys before child handlers run', () => {
      const handleKeyDown = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onKeyDown={handleKeyDown}>
            Edit
          </a>
        </IconButton>,
      );

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(enterEvent)).toBe(false);
      expect(handleKeyDown).not.toHaveBeenCalled();
    });

    it('blocks asChild capture keyboard activation keys before child handlers run', () => {
      const handleKeyDownCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Edit" disabled>
          <a href="/blocked" onKeyDownCapture={handleKeyDownCapture}>
            Edit
          </a>
        </IconButton>,
      );

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Edit' });

      expect(link.dispatchEvent(enterEvent)).toBe(false);
      expect(handleKeyDownCapture).not.toHaveBeenCalled();
    });
  });

  describe('when loading', () => {
    it('sets aria-busy, aria-disabled, and hides the icon', () => {
      render(<IconButton icon={<TestIcon />} aria-label="Save" loading />);
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
    });

    it('does not fire onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<IconButton icon={<TestIcon />} aria-label="Save" loading onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor activation while loading', () => {
      const handleClick = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onClick={handleClick}>
            Save
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('blocks asChild anchor capture activation while loading', () => {
      const handleClickCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onClickCapture={handleClickCapture}>
            Save
          </a>
        </IconButton>,
      );

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(event)).toBe(false);
      expect(handleClickCapture).not.toHaveBeenCalled();
    });

    it('blocks asChild keyboard activation keys while loading', () => {
      const handleKeyDown = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onKeyDown={handleKeyDown}>
            Save
          </a>
        </IconButton>,
      );

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(spaceEvent)).toBe(false);
      expect(handleKeyDown).not.toHaveBeenCalled();
    });

    it('blocks asChild capture keyboard activation keys while loading', () => {
      const handleKeyDownCapture = vi.fn();
      render(
        <IconButton asChild icon={<TestIcon />} aria-label="Save" loading>
          <a href="/blocked" onKeyDownCapture={handleKeyDownCapture}>
            Save
          </a>
        </IconButton>,
      );

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const link = screen.getByRole('link', { name: 'Save' });

      expect(link.dispatchEvent(spaceEvent)).toBe(false);
      expect(handleKeyDownCapture).not.toHaveBeenCalled();
    });
  });

  it('delegates rendering to child element when asChild is true', () => {
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Open link">
        <a href="/profile">Open link</a>
      </IconButton>,
    );
    expect(screen.getByRole('link', { name: 'Open link' })).toBeInTheDocument();
  });

  it('preserves child capture handlers when asChild is enabled', () => {
    const handleClickCapture = vi.fn();
    render(
      <IconButton asChild icon={<TestIcon />} aria-label="Open link">
        <a href="/profile" onClickCapture={handleClickCapture}>
          Open link
        </a>
      </IconButton>,
    );

    screen.getByRole('link', { name: 'Open link' }).click();
    expect(handleClickCapture).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null };
    render(<IconButton ref={ref} icon={<TestIcon />} aria-label="Edit" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
