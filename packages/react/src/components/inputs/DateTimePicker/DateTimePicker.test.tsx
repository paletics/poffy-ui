import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DateTimePicker } from './DateTimePicker';

describe('DateTimePicker', () => {
  it('renders both date and time controls', () => {
    render(<DateTimePicker defaultValue={new Date(2026, 3, 14, 9, 30)} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(9);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(30);
  });

  it('updates the selected datetime when the time changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker value={new Date(2026, 3, 14, 9, 30)} onChange={onChange} />);

    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);

    expect(onChange).toHaveBeenCalled();
    const nextDate = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(nextDate.getHours()).toBe(10);
    expect(nextDate.getMinutes()).toBe(30);
  });

  it('passes clock input mode to the time segment', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        value={new Date(2026, 3, 14, 9, 30)}
        onChange={onChange}
        timeInputMode="clock"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Hours 10' }));

    const nextDate = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(nextDate.getHours()).toBe(10);
    expect(nextDate.getMinutes()).toBe(30);
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(<DateTimePicker defaultValue={new Date(2026, 3, 14, 9, 30)} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('submits a single hidden datetime value', () => {
    const { container } = render(
      <DateTimePicker
        name="startsAt"
        defaultValue={new Date(2026, 3, 14, 9, 30)}
        valueFormat="iso-local"
      />,
    );

    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue(
      '2026-04-14T09:30',
    );
    expect(container.querySelectorAll('input[type="hidden"][name="startsAt"]')).toHaveLength(1);
  });
});
