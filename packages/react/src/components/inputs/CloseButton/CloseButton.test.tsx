import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { CloseButton } from './CloseButton';

/**
 * ### Test Strategy: CloseButton
 * - **Focus**: Default and custom `aria-label`, click handling, disabled state,
 *   SVG icon presence, polymorphic `asChild` delegation, and full WAI-ARIA Button compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 */
describe('CloseButton', () => {
  it('renders with button role and default aria-label', () => {
    render(<CloseButton />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<CloseButton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('accepts a custom aria-label', () => {
    render(<CloseButton aria-label="Close modal" />);
    expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
  });

  it('contains the SVG close icon', () => {
    render(<CloseButton />);
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<CloseButton onClick={handleClick} />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  describe('when disabled', () => {
    it('is marked disabled', () => {
      render(<CloseButton disabled />);
      expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    });

    it('does not fire onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<CloseButton disabled onClick={handleClick} />);

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  it('delegates rendering to child element when asChild is true', () => {
    render(
      <CloseButton asChild aria-label="Dismiss notification">
        <a href="#close">Dismiss notification</a>
      </CloseButton>,
    );
    expect(screen.getByRole('link', { name: 'Dismiss notification' })).toBeInTheDocument();
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null };
    render(<CloseButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
