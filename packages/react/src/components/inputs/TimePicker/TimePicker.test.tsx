import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TimePicker } from './TimePicker';

describe('TimePicker', () => {
  it('renders with the provided default value', () => {
    render(<TimePicker defaultValue="09:30" />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(9);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(30);
  });

  it('updates the combined time when the hour or minute changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30" onChange={onChange} />);

    const hourSegment = screen.getByRole('spinbutton', { name: 'Hours' }).closest('div');
    const minuteSegment = screen.getByRole('spinbutton', { name: 'Minutes' }).closest('div');

    await user.click(within(hourSegment as HTMLElement).getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenLastCalledWith('10:30');

    await user.click(
      within(minuteSegment as HTMLElement).getByRole('button', { name: 'Increment' }),
    );
    expect(onChange).toHaveBeenLastCalledWith('10:31');
  });

  it('supports controlled values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker value="22:45" onChange={onChange} />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(22);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(45);

    await user.click(screen.getAllByRole('button', { name: 'Decrement' })[1]!);
    expect(onChange).toHaveBeenCalledWith('22:44');
  });

  it('supports 12-hour display with AM/PM switching', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<TimePicker value="14:30" format="12h" onChange={onChange} />);

    const meridiemField = screen.getByRole('combobox', { name: 'AM/PM' });

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(2);
    expect(meridiemField).toHaveTextContent('PM');
    expect(container.querySelector('select')).toHaveValue('pm');

    await user.selectOptions(meridiemField, 'am');
    expect(onChange).toHaveBeenCalledWith('02:30');
  });

  it('prevents AM/PM changes when readOnly in 12-hour display', () => {
    const onChange = vi.fn();

    render(<TimePicker value="14:30" format="12h" readOnly onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: 'AM/PM' })).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports seconds when enabled', async () => {
    render(<TimePicker defaultValue="09:30:45" withSeconds />);

    expect(screen.getByRole('spinbutton', { name: 'Seconds' })).toHaveValue(45);
  });

  it('renders a hidden input for form submission when name is provided', () => {
    const { container } = render(
      <TimePicker name="appointmentTime" form="booking" defaultValue="14:05:20" withSeconds />,
    );
    const hiddenInput = container.querySelector('input[type="hidden"][name="appointmentTime"]');

    expect(hiddenInput).toHaveValue('14:05:20');
    expect(hiddenInput).toHaveAttribute('form', 'booking');
  });

  it('supports clock input mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker inputMode="clock" defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Hours 10' }));
    expect(onChange).toHaveBeenLastCalledWith('10:30');

    await user.click(screen.getByRole('button', { name: 'Minutes 35' }));
    expect(onChange).toHaveBeenLastCalledWith('10:35');
  });

  it('uses a 12-hour clock face with meridiem controls in 24-hour value mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker inputMode="clock" defaultValue="14:30" onChange={onChange} />);

    expect(screen.getByRole('button', { name: '02' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Hours 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'PM' })).toHaveAttribute('data-selected');
    expect(screen.queryByRole('button', { name: 'Hours 23' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'AM' }));
    expect(onChange).toHaveBeenLastCalledWith('02:30');
  });

  it('supports wheel input mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker inputMode="wheel" defaultValue="09:30" onChange={onChange} />);

    await user.click(
      within(screen.getByRole('listbox', { name: 'Hours' })).getByRole('option', { name: '10' }),
    );
    expect(onChange).toHaveBeenLastCalledWith('10:30');

    await user.click(
      within(screen.getByRole('listbox', { name: 'Minutes' })).getByRole('option', { name: '31' }),
    );
    expect(onChange).toHaveBeenLastCalledWith('10:31');
  });

  it('supports 12-hour wheel input with AM/PM switching', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker inputMode="wheel" defaultValue="14:30" format="12h" onChange={onChange} />);

    expect(
      within(screen.getByRole('listbox', { name: 'Hours' })).getByRole('option', { name: '02' }),
    ).toHaveAttribute('aria-selected', 'true');

    await user.click(screen.getByRole('option', { name: 'AM' }));
    expect(onChange).toHaveBeenLastCalledWith('02:30');
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(<TimePicker defaultValue="08:15" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
