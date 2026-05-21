import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Switch } from './Switch';

/**
 * ### Test Strategy: Switch
 * - **Focus**: Correct rendering, toggle behavior, disabled/controlled states, ref forwarding,
 *   and full WAI-ARIA Switch compliance via `axe`.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 */
describe('Switch', () => {
  it('renders correctly with label', () => {
    render(<Switch>Notifications</Switch>);
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<Switch>Enable feature</Switch>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('toggles checked state on click', async () => {
    const user = userEvent.setup();
    render(<Switch>Label</Switch>);
    const input = screen.getByRole('switch');

    expect(input).not.toBeChecked();
    await user.click(input);
    expect(input).toBeChecked();
    await user.click(input);
    expect(input).not.toBeChecked();
  });

  it('respects defaultChecked', () => {
    render(<Switch defaultChecked>Label</Switch>);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch disabled>Label</Switch>);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    render(<Switch disabled>Label</Switch>);
    const input = screen.getByRole('switch');

    expect(input).not.toBeChecked();
    await user.click(input);
    expect(input).not.toBeChecked();
  });

  it('fires onChange in controlled mode', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Switch checked={false} onChange={handleChange}>
        Label
      </Switch>,
    );

    await user.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the underlying input element', () => {
    const ref = { current: null };
    render(<Switch ref={ref}>Label</Switch>);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
