import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Switch } from './Switch';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';
import { DirectionProvider } from '@/providers/DirectionProvider';

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

  it('inherits provider direction on the root while retaining an explicit input dir', () => {
    const { rerender } = render(
      <DirectionProvider defaultDir="rtl" global={false}>
        <Switch>Notifications</Switch>
      </DirectionProvider>,
    );
    const input = screen.getByRole('switch');
    expect(input.closest('label')).toHaveAttribute('dir', 'rtl');
    expect(input).not.toHaveAttribute('dir');

    rerender(
      <DirectionProvider defaultDir="rtl" global={false}>
        <Switch dir="ltr">Notifications</Switch>
      </DirectionProvider>,
    );
    expect(screen.getByRole('switch')).toHaveAttribute('dir', 'ltr');
    expect(screen.getByRole('switch').closest('label')).toHaveAttribute('dir', 'ltr');
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

  it('preserves switch semantics when conflicting runtime props are provided', () => {
    render(
      <Switch
        disabled
        readOnly
        required
        {...({
          type: 'text',
          role: 'presentation',
          'aria-checked': true,
          'aria-disabled': false,
          'aria-readonly': false,
          'aria-required': false,
        } as never)}
      >
        Label
      </Switch>,
    );

    const input = screen.getByRole('switch');
    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).not.toHaveAttribute('aria-checked');
    expect(input).toHaveAttribute('aria-disabled', 'true');
    expect(input).toHaveAttribute('aria-readonly', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
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

  it('does not toggle when readOnly', async () => {
    const user = userEvent.setup();
    render(<Switch readOnly>Label</Switch>);
    const input = screen.getByRole('switch');

    await user.click(input);
    await user.keyboard(' ');

    expect(input).not.toBeChecked();
    expect(input).toHaveAttribute('aria-readonly', 'true');
  });

  it('does not notify controlled consumers when readOnly interaction is blocked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Switch checked={false} readOnly onChange={onChange}>
        Label
      </Switch>,
    );

    const input = screen.getByRole('switch');
    await user.click(input);
    await user.keyboard(' ');
    expect(input).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('suspends native required validation while read-only and restores it when writable', () => {
    const { container, rerender } = render(
      <form>
        <Switch name="alerts" required readOnly>
          Alerts
        </Switch>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const input = screen.getByRole('switch');

    expect(input).not.toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(form.checkValidity()).toBe(true);

    rerender(
      <form>
        <Switch name="alerts" required>
          Alerts
        </Switch>
      </form>,
    );

    expect(screen.getByRole('switch')).toBeRequired();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-required', 'true');
    expect(form.checkValidity()).toBe(false);
  });

  it('inherits FormControl field state and message references', () => {
    render(
      <FormControl id="alerts" isDisabled isInvalid isReadOnly isRequired>
        <FormLabel>Alerts</FormLabel>
        <Switch />
        <FormHelperText id="alerts-help">Choose alert delivery.</FormHelperText>
        <FormErrorMessage id="alerts-error">Alerts are required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('switch', { name: 'Alerts' });
    expect(input).toHaveAttribute('id', 'alerts');
    expect(input).toBeDisabled();
    expect(input).not.toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-readonly', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'alerts-help alerts-error');
    expect(input).toHaveAttribute('aria-errormessage', 'alerts-error');
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl id="alerts">
        <FormLabel>Alerts</FormLabel>
        <Switch aria-invalid />
        <FormHelperText id="alerts-help">Choose alert delivery.</FormHelperText>
        <FormErrorMessage id="alerts-error">Alerts are required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('switch', { name: 'Alerts' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'alerts-help alerts-error');
    expect(input).toHaveAttribute('aria-errormessage', 'alerts-error');
  });

  it.each(['grammar', 'spelling'] as const)(
    'associates FormControl errors when aria-invalid is %s',
    (ariaInvalid) => {
      render(
        <FormControl id="alerts">
          <FormLabel>Alerts</FormLabel>
          <Switch aria-invalid={ariaInvalid} />
          <FormHelperText id="alerts-help">Choose alert delivery.</FormHelperText>
          <FormErrorMessage id="alerts-error">Alerts need attention.</FormErrorMessage>
        </FormControl>,
      );

      const input = screen.getByRole('switch', { name: 'Alerts' });
      expect(input).toHaveAttribute('aria-invalid', ariaInvalid);
      expect(input).toHaveAttribute('aria-describedby', 'alerts-help alerts-error');
      expect(input).toHaveAttribute('aria-errormessage', 'alerts-error');
    },
  );

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
