import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DateTimePicker } from './DateTimePicker';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';
import { LocaleProvider } from '@/providers/LocaleProvider';

describe('DateTimePicker', () => {
  it('owns its group role and derived disabled semantics at runtime', () => {
    render(
      <DateTimePicker
        aria-label="Starts at"
        disabled
        {...({ role: 'button', 'aria-disabled': false } as never)}
      />,
    );

    expect(screen.getByRole('group', { name: 'Starts at' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('does not forward field-only required and readonly states to its group root', () => {
    render(
      <DateTimePicker
        aria-label="Starts at"
        {...({ 'aria-readonly': true, 'aria-required': true } as never)}
      />,
    );

    const group = screen.getByRole('group', { name: 'Starts at' });
    expect(group).not.toHaveAttribute('aria-readonly');
    expect(group).not.toHaveAttribute('aria-required');
  });

  it('treats an invalid Date value as empty instead of throwing or submitting NaN', () => {
    const invalid = new Date(Number.NaN);
    const { container } = render(
      <DateTimePicker value={invalid} name="startsAt" aria-label="Starts at" />,
    );

    expect(container.querySelector('input[type="hidden"]')).toHaveValue('');
    expect(container.textContent).not.toContain('NaN');
  });

  it('renders both date and time controls', () => {
    render(<DateTimePicker defaultValue={new Date(2026, 3, 14, 9, 30)} />);

    expect(screen.getByRole('button', { name: 'Date' })).toHaveTextContent('Apr 14, 2026');
    expect(screen.getByRole('button', { name: 'Date' })).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(9);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(30);
  });

  it('composes localized date and time defaults while preserving explicit labels', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <DateTimePicker />
      </LocaleProvider>,
    );

    expect(screen.getByRole('button', { name: '日付' })).toHaveTextContent('日付を選択');
    expect(screen.getByRole('group', { name: '時刻' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: '時' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: '分' })).toBeInTheDocument();
  });

  it('falls back to English labels for an invalid locale', () => {
    expect(() =>
      render(
        <DateTimePicker
          defaultValue={new Date(2026, 3, 14, 9, 30)}
          locale="ja-@"
          aria-label="Starts at"
        />,
      ),
    ).not.toThrow();

    expect(screen.getByRole('button', { name: 'Starts at date' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Starts at time' })).toBeInTheDocument();
  });

  it('inherits FormControl state and reuses one required validation owner', async () => {
    const { container } = render(
      <FormControl id="starts-at" labelTarget="group" isInvalid isRequired>
        <FormLabel>Starts at</FormLabel>
        <DateTimePicker name="startsAt" aria-label="   " />
        <FormHelperText>Choose a date and time.</FormHelperText>
        <FormErrorMessage>Starts at is required.</FormErrorMessage>
      </FormControl>,
    );

    const group = screen.getByRole('group', { name: 'Starts at' });
    expect(screen.getByText('Starts at').closest('label')).not.toHaveAttribute('for');
    expect(group).toHaveAttribute('id', 'starts-at');
    expect(group).toHaveAttribute('aria-labelledby', 'starts-at-label');
    await waitFor(() => {
      expect(group).toHaveAttribute('aria-describedby');
    });
    const dateTrigger = screen.getByRole('button', { name: 'Date' });
    expect(dateTrigger).toHaveAttribute('data-invalid');
    expect(dateTrigger).toHaveAttribute('aria-invalid', 'true');
    expect(dateTrigger.getAttribute('aria-describedby')?.split(/\s+/)).toContain(
      screen.getByText('Required').id,
    );
    expect(screen.getByRole('group', { name: 'Time' })).toBeInTheDocument();
    expect(container.querySelectorAll('input[required]')).toHaveLength(1);
    expect(container.querySelectorAll('input[type="hidden"][name="startsAt"]')).toHaveLength(1);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('prefers a trimmed explicit aria-labelledby while preserving child labels', () => {
    render(
      <>
        <span id="datetime-name">Publication date</span>
        <DateTimePicker aria-label="  Publish at  " aria-labelledby="  datetime-name  " />
      </>,
    );

    const group = screen.getByRole('group', { name: 'Publication date' });
    expect(group).toHaveAttribute('aria-labelledby', 'datetime-name');
    expect(group).not.toHaveAttribute('aria-label');
    expect(screen.getByRole('button', { name: 'Publish at date' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Publish at time' })).toBeInTheDocument();
  });

  it('associates explicit invalid state and error messages with child controls', () => {
    render(
      <>
        <DateTimePicker
          aria-label="Starts at"
          aria-invalid="true"
          aria-errormessage="starts-at-error"
        />
        <span id="starts-at-error">Choose a valid start time.</span>
      </>,
    );

    screen.getByRole('group', { name: 'Starts at' });
    expect(screen.getByRole('button', { name: 'Starts at date' })).toHaveAttribute('data-invalid');
    expect(screen.getByRole('button', { name: 'Starts at date' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Starts at date' })).toHaveAttribute(
      'aria-describedby',
      'starts-at-error',
    );
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveAttribute(
      'aria-errormessage',
      'starts-at-error',
    );
  });

  it('focuses its date field when the enclosing FormLabel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <FormControl id="starts-at" labelTarget="group">
        <FormLabel>Starts at</FormLabel>
        <DateTimePicker />
      </FormControl>,
    );

    await user.click(screen.getByText('Starts at'));

    expect(screen.getByRole('button', { name: 'Date' })).toHaveFocus();
  });

  it('requires a date before enabling time selection by default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker onChange={onChange} />);

    const hour = screen.getByRole('spinbutton', { name: 'Hours' });
    expect(hour).toBeDisabled();
    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('enables time selection after a controlled date is supplied', () => {
    const { rerender } = render(<DateTimePicker value={null} onChange={() => undefined} />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toBeDisabled();

    rerender(<DateTimePicker value={new Date(2026, 3, 14, 9, 30)} onChange={() => undefined} />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).not.toBeDisabled();
  });

  it('allows explicit time-first editing with today as the date', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<DateTimePicker requireDateBeforeTime={false} onChange={onChange} />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).not.toBeDisabled();
    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);
    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
  });

  it('gives date and time fields distinct accessible names', () => {
    render(<DateTimePicker defaultValue={new Date(2026, 3, 14, 9, 30)} aria-label="Starts at" />);

    expect(screen.getByRole('button', { name: 'Starts at date' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Starts at time' })).toBeInTheDocument();
  });

  it('allows explicit date and time child labels', () => {
    render(
      <DateTimePicker
        aria-label="Starts at"
        dateAriaLabel="Start date"
        timeAriaLabel="Start time"
      />,
    );

    expect(screen.getByRole('button', { name: 'Start date' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Start time' })).toBeInTheDocument();
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

  it('prevents time changes from emitting dates outside date constraints', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        value={new Date(2026, 3, 5, 9, 30)}
        minDate={new Date(2026, 3, 10)}
        maxDate={new Date(2026, 3, 20)}
        onChange={onChange}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(9);
  });

  it('keeps time controls visible but rejects changes for a controlled date outside constraints', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        value={new Date(2026, 3, 5, 9, 30)}
        minDate={new Date(2026, 3, 10)}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).not.toBeDisabled();
    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('prevents time changes from emitting dates disabled by predicate', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        value={new Date(2026, 3, 14, 9, 30)}
        isDateDisabled={(date) => date.getDay() === 2}
        onChange={onChange}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('passes date constraints to the date segment', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        value={new Date(2026, 3, 14, 9, 30)}
        minDate={new Date(2026, 3, 10)}
        maxDate={new Date(2026, 3, 20)}
        onChange={onChange}
        locale="en-US"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Date' }));

    const day5 = screen.getByRole('button', { name: /Sunday, April 5, 2026/i });
    expect(day5).toHaveAttribute('aria-disabled', 'true');

    await user.click(day5);
    expect(onChange).not.toHaveBeenCalled();
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

    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Hours' })).getByRole('radio', {
        name: '10',
      }),
    );

    const nextDate = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(nextDate.getHours()).toBe(10);
    expect(nextDate.getMinutes()).toBe(30);
  });

  it('passes wheel input changes through to the combined datetime value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        value={new Date(2026, 3, 14, 9, 30)}
        onChange={onChange}
        timeInputMode="wheel"
      />,
    );

    await user.click(
      within(screen.getByRole('listbox', { name: 'Hours' })).getByRole('option', {
        name: '10',
      }),
    );

    expect(onChange).toHaveBeenCalled();
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

  it('retains the latest controlled datetime and form value when becoming uncontrolled', () => {
    const first = new Date(2026, 3, 14, 9, 30);
    const latest = new Date(2026, 3, 15, 14, 45);
    const { container, rerender } = render(
      <DateTimePicker value={first} name="startsAt" valueFormat="iso-local" />,
    );

    rerender(<DateTimePicker value={latest} name="startsAt" valueFormat="iso-local" />);
    rerender(<DateTimePicker name="startsAt" valueFormat="iso-local" />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(14);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(45);
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue(
      '2026-04-15T14:45',
    );
  });

  it('does not notify when its date button reselects the current local day', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DateTimePicker
        value={new Date(2026, 3, 14, 9, 30)}
        onChange={onChange}
        locale="en-US"
        aria-label="Starts at"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Starts at date' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: /Tuesday, April 14, 2026/i }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('submits local hidden datetime values with seconds', () => {
    const { container } = render(
      <DateTimePicker
        name="startsAt"
        defaultValue={new Date(2026, 3, 14, 9, 30, 7)}
        valueFormat="iso-local"
        withSeconds
      />,
    );

    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue(
      '2026-04-14T09:30:07',
    );
  });

  it('restores the latest uncontrolled value when its nearest form resets', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <DateTimePicker
          defaultValue={new Date(2026, 3, 14, 9, 30)}
          name="startsAt"
          valueFormat="iso-local"
        />
      </form>,
    );

    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);
    rerender(
      <form>
        <DateTimePicker
          defaultValue={new Date(2026, 3, 15, 11, 0)}
          name="startsAt"
          valueFormat="iso-local"
        />
      </form>,
    );
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue(
        '2026-04-15T11:00',
      ),
    );
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(11);
  });

  it('keeps its uncontrolled value when a form reset is cancelled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form onReset={(event) => event.preventDefault()}>
        <DateTimePicker
          defaultValue={new Date(2026, 3, 14, 9, 30)}
          name="startsAt"
          valueFormat="iso-local"
        />
      </form>,
    );

    await user.click(screen.getAllByRole('button', { name: 'Increment' })[0]!);
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue(
        '2026-04-14T10:30',
      ),
    );
  });

  it('participates in required validation and reset through an external form', async () => {
    const user = userEvent.setup();
    const initial = new Date(2026, 3, 14, 9, 30);
    const { container } = render(
      <>
        <form id="appointment" />
        <DateTimePicker
          form="appointment"
          required
          name="startsAt"
          defaultValue={initial}
          valueFormat="iso-local"
        />
      </>,
    );

    const form = document.getElementById('appointment') as HTMLFormElement;
    expect(form).toBeValid();
    await user.click(screen.getByRole('button', { name: 'Date' }));
    await user.click(screen.getByRole('button', { name: /Monday, April 20, 2026/i }));
    form.reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue(
        '2026-04-14T09:30',
      ),
    );
  });

  it('makes an empty required picker invalid through an external form', async () => {
    render(
      <>
        <form id="appointment" />
        <DateTimePicker form="appointment" required name="startsAt" />
      </>,
    );

    const form = document.getElementById('appointment') as HTMLFormElement;
    await waitFor(() => expect(form).toBeInvalid());
  });

  it('uses DatePicker as the sole validation owner for an unavailable wheel datetime', async () => {
    const { container } = render(
      <form>
        <DateTimePicker
          defaultValue={new Date(2026, 3, 5, 9, 30)}
          minDate={new Date(2026, 3, 10)}
          required
          timeInputMode="wheel"
        />
      </form>,
    );

    expect(container.querySelectorAll('[data-form-control-validation-proxy]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-time-picker-validation-proxy]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-wheel-picker-validation-proxy]')).toHaveLength(0);
    expect(container.querySelector('form')?.reportValidity()).toBe(false);

    await waitFor(() => expect(screen.getByRole('button', { name: 'Date' })).toHaveFocus());
  });
});
