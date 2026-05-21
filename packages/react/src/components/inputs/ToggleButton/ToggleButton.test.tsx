import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ToggleButton } from './ToggleButton';

/**
 * ### Test Strategy: ToggleButton
 * - **Focus**: Uncontrolled toggle, controlled mode, `aria-pressed` management, `onPressedChange` callback,
 *   disabled state, icon slots, and full WAI-ARIA Button compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **DON'T**: Do not test ActionMotion animation timing — that is covered in animation unit tests.
 */
describe('ToggleButton', () => {
  it('renders with button role and visible label', () => {
    render(<ToggleButton>Toggle me</ToggleButton>);
    expect(screen.getByRole('button', { name: 'Toggle me' })).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<ToggleButton>Bold</ToggleButton>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('starts with aria-pressed="false" by default', () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles aria-pressed on click (uncontrolled)', async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Toggle</ToggleButton>);
    const button = screen.getByRole('button');

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');

    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects defaultPressed', () => {
    render(<ToggleButton defaultPressed>Toggle</ToggleButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onPressedChange with the new state on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<ToggleButton onPressedChange={handleChange}>Toggle</ToggleButton>);

    await user.click(screen.getByRole('button'));
    expect(handleChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole('button'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('supports controlled mode — state does not update until parent changes prop', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <ToggleButton pressed={false} onPressedChange={handleChange}>
        Toggle
      </ToggleButton>,
    );
    const button = screen.getByRole('button');

    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <ToggleButton pressed={true} onPressedChange={handleChange}>
        Toggle
      </ToggleButton>,
    );
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  describe('when disabled', () => {
    it('is marked disabled with aria-disabled', () => {
      render(<ToggleButton disabled>Toggle</ToggleButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not toggle when clicked', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ToggleButton disabled onPressedChange={handleChange}>
          Toggle
        </ToggleButton>,
      );

      await user.click(screen.getByRole('button'));
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  it('renders leftIcon and rightIcon', () => {
    const LeftIcon = () => <svg data-testid="left-icon" />;
    const RightIcon = () => <svg data-testid="right-icon" />;
    render(
      <ToggleButton leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        Toggle
      </ToggleButton>,
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('forwards ref to the underlying button element', () => {
    const ref = { current: null };
    render(<ToggleButton ref={ref}>Toggle</ToggleButton>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
