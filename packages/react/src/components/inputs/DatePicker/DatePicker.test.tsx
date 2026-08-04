import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DatePicker } from './DatePicker';
import type { DateOnlyFormatOptions } from '@poffy-ui/types';
import { FormControl, FormErrorMessage, FormLabel } from '../FormControl';
import { LocaleProvider } from '@/providers/LocaleProvider';

/**

 * ### Test Strategy
 * - **Focus**: DatePicker must render a custom button or native input, open a Calendar on interaction,
 * allow date selection, and maintain accessibility standards across different locales.
 * - **Design Verification**: Verifies that the input-styled button, Popover, and Calendar
 * behave predictably and expose selected dates as visible trigger text.
 */
describe('Molecules / DatePicker', () => {
  it('forwards refs and runs callback cleanup when switching rendering modes', () => {
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);
    const { rerender, unmount } = render(<DatePicker ref={callbackRef} aria-label="Date" />);

    expect(callbackRef).toHaveBeenLastCalledWith(expect.any(HTMLButtonElement));
    expect(callbackRef).not.toHaveBeenCalledWith(null);
    expect(cleanup).toHaveBeenCalledTimes(callbackRef.mock.calls.length - 1);
    const attachCountBeforeSwitch = callbackRef.mock.calls.length;
    const cleanupCountBeforeSwitch = cleanup.mock.calls.length;

    rerender(<DatePicker ref={callbackRef} aria-label="Date" native />);

    expect(callbackRef.mock.calls.length).toBeGreaterThan(attachCountBeforeSwitch);
    expect(callbackRef).toHaveBeenLastCalledWith(expect.any(HTMLInputElement));
    expect(cleanup.mock.calls.length).toBeGreaterThan(cleanupCountBeforeSwitch);
    expect(callbackRef).not.toHaveBeenCalledWith(null);
    expect(cleanup).toHaveBeenCalledTimes(callbackRef.mock.calls.length - 1);

    unmount();

    expect(cleanup).toHaveBeenCalledTimes(callbackRef.mock.calls.length);
    expect(callbackRef).not.toHaveBeenCalledWith(null);
  });

  it('forwards and clears an object ref', () => {
    const ref = createRef<HTMLButtonElement>();
    const { unmount } = render(<DatePicker ref={ref} aria-label="Date" />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);

    unmount();

    expect(ref.current).toBeNull();
  });

  it('renders correctly and is accessible', async () => {
    const { container } = render(<DatePicker placeholder="Pick a date" aria-label="Date Picker" />);
    const trigger = screen.getByRole('button', { name: 'Date Picker' });

    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveTextContent('Pick a date');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps custom mode on a non-empty native button trigger', () => {
    const { container } = render(
      <DatePicker defaultValue={new Date(2023, 9, 10)} locale="en-US" aria-label="Due date" />,
    );

    const trigger = screen.getByRole('button', { name: 'Due date' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveTextContent('Oct 10, 2023');
    expect(trigger).not.toBeEmptyDOMElement();
    expect(container.querySelector('[data-input-group-element] svg')).toBeInTheDocument();
  });

  it('formats a selected date with the English fallback for an invalid locale', () => {
    expect(() =>
      render(
        <DatePicker defaultValue={new Date(2023, 9, 10)} locale="ja-@" aria-label="Date Picker" />,
      ),
    ).not.toThrow();

    expect(screen.getByRole('button', { name: 'Date Picker' })).toHaveTextContent('Oct 10, 2023');
  });

  it('treats an invalid Date value as empty instead of throwing or submitting NaN', () => {
    const invalid = new Date(Number.NaN);
    const { container } = render(
      <DatePicker value={invalid} name="date" aria-label="Date" required />,
    );

    expect(screen.getByRole('button', { name: 'Date' })).toHaveTextContent('Select date');
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('');
    expect(container.textContent).not.toContain('NaN');
  });

  it('keeps local calendar-day display when format options include a time zone', () => {
    render(
      <DatePicker
        aria-label="Date"
        defaultValue={new Date(2023, 0, 1)}
        locale="en-US"
        formatOptions={
          {
            dateStyle: 'medium',
            timeZone: 'Pacific/Honolulu',
          } as unknown as DateOnlyFormatOptions
        }
      />,
    );

    expect(screen.getByRole('button', { name: 'Date' })).toHaveTextContent('Jan 1, 2023');
  });

  it('accepts explicit date fields while ignoring time-only format options', () => {
    render(
      <DatePicker
        aria-label="Date"
        defaultValue={new Date(2023, 0, 1)}
        locale="en-US"
        formatOptions={
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Pacific/Honolulu',
          } as unknown as DateOnlyFormatOptions
        }
      />,
    );

    expect(screen.getByRole('button', { name: 'Date' })).toHaveTextContent('January 1, 2023');
  });

  it('preserves years below 100 when parsing a native date value', () => {
    const onChange = vi.fn();
    render(<DatePicker native aria-label="Date" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '0005-01-02' } });

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(onChange.mock.calls[0]?.[0]?.getFullYear()).toBe(5);
  });

  it('opens calendar on click', async () => {
    const user = userEvent.setup();
    render(<DatePicker placeholder="Pick a date" aria-label="Date Picker" />);
    const input = screen.getByRole('button', { name: 'Date Picker' });

    await user.click(input);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
  });

  it.each(['{ArrowDown}', '{Enter}', ' '])(
    'opens the calendar with %s and focuses the selected day',
    async (key) => {
      const user = userEvent.setup();
      const selectedDate = new Date(2023, 9, 10);

      render(
        <DatePicker
          defaultValue={selectedDate}
          locale="en-US"
          placeholder="Pick a date"
          aria-label="Date Picker"
        />,
      );

      const input = screen.getByRole('button', { name: 'Date Picker' });
      input.focus();
      await user.keyboard(key);

      expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Tuesday, October 10, 2023/i })).toHaveFocus();
    },
  );

  it('focuses the nearest available calendar day when its selected day is unavailable', async () => {
    const user = userEvent.setup();
    const selectedDate = new Date(2023, 9, 10);
    render(
      <DatePicker
        defaultValue={selectedDate}
        locale="en-US"
        aria-label="Date Picker"
        isDateDisabled={(date) => date.getDate() === 10}
      />,
    );

    const input = screen.getByRole('button', { name: 'Date Picker' });
    input.focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('button', { name: /Wednesday, October 11, 2023/i })).toHaveFocus();
  });

  it('connects the button trigger to its named calendar dialog', async () => {
    const user = userEvent.setup();
    render(<DatePicker aria-label="Date Picker" />);
    const input = screen.getByRole('button', { name: 'Date Picker' });

    await user.click(input);

    const dialog = screen.getByRole('dialog', { name: 'Calendar' });
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).toHaveAttribute('aria-controls', dialog.id);
    expect(await axe(dialog)).toHaveNoViolations();

    await user.keyboard('{Escape}');
    expect(input).not.toHaveAttribute('aria-controls');
  });

  it('returns focus to the trigger after closing the calendar with Escape', async () => {
    const user = userEvent.setup();

    render(<DatePicker defaultValue={new Date(2023, 9, 10)} locale="en-US" aria-label="Date" />);

    const input = screen.getByRole('button', { name: 'Date' });
    input.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /Tuesday, October 10, 2023/i })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Calendar' })).not.toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('preserves logical tab order after the portalled calendar', async () => {
    const user = userEvent.setup();
    render(
      <>
        <DatePicker defaultValue={new Date(2023, 9, 10)} locale="en-US" aria-label="Date" />
        <button type="button">After</button>
      </>,
    );

    const input = screen.getByRole('button', { name: 'Date' });
    input.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: /Tuesday, October 10, 2023/i })).toHaveFocus();

    await user.tab();
    await waitFor(() => expect(screen.getByRole('button', { name: 'After' })).toHaveFocus());
    expect(screen.queryByRole('dialog', { name: 'Calendar' })).not.toBeInTheDocument();
  });

  it('updates value and closes on date selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const defaultValue = new Date(2023, 9, 10); // Oct 10, 2023

    render(
      <DatePicker
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder="Pick a date"
        locale="en-US"
        aria-label="Date Picker"
      />,
    );

    const input = screen.getByRole('button', { name: 'Date Picker' });
    expect(input).toHaveTextContent('Oct 10, 2023');

    await user.click(input);

    const day15 = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    await user.click(day15);

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(input).toHaveTextContent('Oct 15, 2023');

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('blocks a portalled date selection when an ancestor fieldset becomes disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <fieldset>
        <DatePicker
          defaultValue={new Date(2023, 9, 10)}
          onChange={onChange}
          locale="en-US"
          aria-label="Date Picker"
        />
      </fieldset>,
    );
    const fieldset = container.querySelector('fieldset') as HTMLFieldSetElement;
    const trigger = screen.getByRole('button', { name: 'Date Picker' });

    await user.click(trigger);
    const day15 = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });

    fieldset.disabled = true;
    fireEvent.click(day15);

    expect(onChange).not.toHaveBeenCalled();
    expect(trigger).toHaveTextContent('Oct 10, 2023');
    await waitFor(() => expect(screen.queryByRole('grid')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).not.toHaveFocus());

    fieldset.disabled = false;
    await waitFor(() => expect(trigger).not.toBeDisabled());
    await user.click(trigger);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('closes and restores focus without notifying when the selected local day is unchanged', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(
      <DatePicker
        defaultValue={new Date(2023, 9, 10, 18, 30)}
        onChange={onChange}
        name="startDate"
        valueFormat="iso-datetime"
        locale="en-US"
        aria-label="Date Picker"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Date Picker' });
    const initialFormValue = container
      .querySelector('input[name="startDate"]')
      ?.getAttribute('value');
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: /Tuesday, October 10, 2023/i }));

    expect(onChange).not.toHaveBeenCalled();
    expect(container.querySelector('input[name="startDate"]')).toHaveValue(initialFormValue);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('does not open or change when readOnly', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const defaultValue = new Date(2023, 9, 10);

    render(
      <DatePicker
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder="Pick a date"
        locale="en-US"
        readOnly
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Oct 10, 2023' }));

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each([
    ['disabled', { disabled: true }],
    ['read only', { readOnly: true }],
  ] as const)('closes an open calendar after becoming %s', async (_state, pickerProps) => {
    const user = userEvent.setup();
    const { rerender } = render(<DatePicker aria-label="Date Picker" />);
    const input = screen.getByRole('button', { name: 'Date Picker' });

    await user.click(input);
    expect(screen.getByRole('grid')).toBeInTheDocument();

    rerender(<DatePicker aria-label="Date Picker" {...pickerProps} />);
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports custom locales', () => {
    const date = new Date(2023, 9, 10);
    render(<DatePicker value={date} locale="ja-JP" />);

    const input = screen.getByRole('button', { name: /2023.*10.*10/ });
    expect(input).toBeInTheDocument();
  });

  it('retains the latest controlled value and form value when becoming uncontrolled', () => {
    const first = new Date(2023, 9, 10);
    const latest = new Date(2023, 9, 15);
    const { container, rerender } = render(
      <DatePicker value={first} name="startDate" locale="en-US" aria-label="Date Picker" />,
    );

    rerender(
      <DatePicker value={latest} name="startDate" locale="en-US" aria-label="Date Picker" />,
    );
    rerender(<DatePicker name="startDate" locale="en-US" aria-label="Date Picker" />);

    expect(screen.getByRole('button')).toHaveTextContent('Oct 15, 2023');
    expect(container.querySelector('input[type="hidden"][name="startDate"]')).toHaveValue(
      '2023-10-15',
    );
  });

  it('applies error state styles', () => {
    render(<DatePicker error placeholder="Error picker" />);
    const input = screen.getByRole('button', { name: 'Error picker' });
    expect(input).toHaveAttribute('data-invalid');
  });

  it('marks an explicit invalid value on the custom trigger', () => {
    render(<DatePicker aria-invalid="spelling" aria-label="Date Picker" />);

    expect(screen.getByRole('button', { name: 'Date Picker' })).toHaveAttribute('data-invalid');
  });

  it('inherits FormControl state while keeping one custom validation proxy', () => {
    const { container } = render(
      <form>
        <FormControl id="due-date" isInvalid isDisabled isReadOnly isRequired>
          <FormLabel>Due date</FormLabel>
          <DatePicker name="dueDate" />
          <FormErrorMessage>Due date is required.</FormErrorMessage>
        </FormControl>
      </form>,
    );

    const trigger = screen.getByRole('button', { name: 'Due date' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('data-invalid');
    expect(trigger).toHaveAttribute('aria-describedby');
    const describedBy = trigger.getAttribute('aria-describedby')?.split(/\s+/) ?? [];
    expect(describedBy).toContain(screen.getByText('Required').id);
    expect(describedBy).toContain(screen.getByText('Due date is required.').id);
    expect(container.querySelectorAll('input[required]')).toHaveLength(1);
    expect(container.querySelector('input[required]')).toBeDisabled();
    expect(container.querySelector('input[data-form-control-validation-proxy]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('keeps dialog trigger state attributes owned by the picker', () => {
    const conflictingRuntimeProps = {
      'aria-controls': 'wrong-dialog',
      'aria-expanded': 'true',
      'aria-haspopup': 'listbox',
      'aria-required': 'false',
      role: 'textbox',
    } as const;
    render(<DatePicker {...conflictingRuntimeProps} aria-label="Date Picker" required />);

    const input = screen.getByRole('button', { name: 'Date Picker' });
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).toHaveAttribute('aria-haspopup', 'dialog');
    expect(input).not.toHaveAttribute('aria-required');
  });

  it('discards custom trigger semantics in native mode', () => {
    render(
      <DatePicker
        {...({
          'aria-controls': 'wrong-dialog',
          'aria-expanded': true,
          'aria-haspopup': 'dialog',
          'aria-required': false,
          role: 'combobox',
        } as never)}
        native
        required
        aria-label="Date Picker"
      />,
    );

    const input = screen.getByLabelText('Date Picker');
    expect(input).not.toHaveAttribute('role');
    expect(input).not.toHaveAttribute('aria-controls');
    expect(input).not.toHaveAttribute('aria-expanded');
    expect(input).not.toHaveAttribute('aria-haspopup');
    expect(input).not.toHaveAttribute('aria-required');
    expect(input).toBeRequired();
  });

  it('submits an ISO date through a hidden input', () => {
    const date = new Date(2023, 9, 10);
    const { container } = render(
      <DatePicker name="startDate" value={date} locale="en-US" aria-label="Date Picker" />,
    );

    const hiddenInput = container.querySelector('input[type="hidden"][name="startDate"]');
    expect(hiddenInput).toHaveValue('2023-10-10');
    expect(screen.getByRole('button')).not.toHaveAttribute('name');
  });

  it('validates an unselected required custom picker without duplicating its form value', () => {
    const { container } = render(
      <form>
        <DatePicker required name="startDate" aria-label="Start date" />
      </form>,
    );
    const form = container.querySelector('form');
    const trigger = screen.getByRole('button');
    const validationProxy = container.querySelector('input[required]');

    expect(form?.checkValidity()).toBe(false);
    expect(validationProxy).not.toHaveAttribute('name');
    expect(trigger).not.toHaveAttribute('aria-required');
    expect(new FormData(form ?? undefined).getAll('startDate')).toEqual(['']);
  });

  it('announces a localized required description from a standalone custom trigger', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <DatePicker required aria-label="開始日" />
      </LocaleProvider>,
    );

    const requiredDescription = screen.getByText('必須');
    expect(requiredDescription).toHaveAttribute('id');
    expect(screen.getByRole('button', { name: '開始日' })).toHaveAttribute(
      'aria-describedby',
      requiredDescription.id,
    );
  });

  it('satisfies custom required validation when a value is present', () => {
    const { container } = render(
      <form>
        <DatePicker
          required
          name="startDate"
          value={new Date(2023, 9, 15)}
          aria-label="Start date"
        />
      </form>,
    );
    const form = container.querySelector('form');

    expect(form?.checkValidity()).toBe(true);
    expect(new FormData(form ?? undefined).getAll('startDate')).toEqual(['2023-10-15']);
  });

  it('makes a custom picker invalid when dynamic constraints reject its selected value', async () => {
    const selectedDate = new Date(2023, 9, 15);
    const { container, rerender } = render(
      <form>
        <DatePicker value={selectedDate} name="startDate" aria-label="Start date" />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    expect(form).toBeValid();

    rerender(
      <form>
        <DatePicker
          value={selectedDate}
          maxDate={new Date(2023, 9, 10)}
          name="startDate"
          aria-label="Start date"
        />
      </form>,
    );

    await waitFor(() => expect(form).toBeInvalid());
    expect(container.querySelector('input[data-form-control-validation-proxy]')).toBeInvalid();
    expect(container.querySelector('input[type="hidden"][name="startDate"]')).toHaveValue(
      '2023-10-15',
    );
  });

  it('makes a native picker invalid when a custom disabled-date rule rejects its value', async () => {
    const selectedDate = new Date(2023, 9, 15);
    const { container } = render(
      <form>
        <DatePicker
          native
          value={selectedDate}
          isDateDisabled={(date) => date.getDay() === 0}
          name="startDate"
          aria-label="Start date"
        />
      </form>,
    );

    const form = container.querySelector('form') as HTMLFormElement;
    const input = screen.getByLabelText('Start date');

    await waitFor(() => expect(form).toBeInvalid());
    expect(input).toBeInvalid();
    expect(input.validationMessage).not.toBe('');
  });

  it('restores an uncontrolled custom picker to its initial value when its form resets', async () => {
    const user = userEvent.setup();
    const initialDate = new Date(2023, 9, 10);
    const { container } = render(
      <form>
        <DatePicker defaultValue={initialDate} name="startDate" aria-label="Start date" />
        <button type="reset">Reset</button>
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Start date' }));
    await user.click(screen.getByRole('button', { name: /October 15, 2023/i }));
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('2023-10-15');

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('2023-10-10');
  });

  it('restores the latest uncontrolled custom default value when its form resets', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <DatePicker
          defaultValue={new Date(2023, 9, 10)}
          name="startDate"
          locale="en-US"
          aria-label="Start date"
        />
      </form>,
    );
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: /October 15, 2023/i }));

    rerender(
      <form>
        <DatePicker
          defaultValue={new Date(2023, 9, 20)}
          name="startDate"
          locale="en-US"
          aria-label="Start date"
        />
      </form>,
    );
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"]')).toHaveValue('2023-10-20'),
    );
  });

  it('keeps the uncontrolled value when a form reset is cancelled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form onReset={(event) => event.preventDefault()}>
        <DatePicker
          defaultValue={new Date(2023, 9, 10)}
          name="startDate"
          locale="en-US"
          aria-label="Start date"
        />
      </form>,
    );
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button', { name: /October 15, 2023/i }));

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"]')).toHaveValue('2023-10-15'),
    );
  });

  it('excludes a read-only custom required picker from native validation', () => {
    const { container } = render(
      <form>
        <DatePicker required readOnly name="startDate" aria-label="Start date" />
      </form>,
    );
    expect(container.querySelector('form')).toBeValid();
  });

  it('supports custom hidden value formatting', () => {
    const date = new Date(2023, 9, 10);
    const { container } = render(
      <DatePicker
        name="startDate"
        value={date}
        valueFormat={(selectedDate) => `custom:${selectedDate.getFullYear()}`}
        aria-label="Date Picker"
      />,
    );

    expect(container.querySelector('input[type="hidden"][name="startDate"]')).toHaveValue(
      'custom:2023',
    );
  });

  it('passes date constraints to the custom calendar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DatePicker
        defaultValue={new Date(2023, 9, 15)}
        minDate={new Date(2023, 9, 10)}
        maxDate={new Date(2023, 9, 20)}
        isDateDisabled={(date) => date.getDay() === 0}
        onChange={onChange}
        locale="en-US"
        aria-label="Date Picker"
      />,
    );

    await user.click(screen.getByRole('button'));

    const day5 = screen.getByRole('button', { name: /Thursday, October 5, 2023/i });
    expect(day5).toHaveAttribute('aria-disabled', 'true');

    await user.click(day5);
    expect(onChange).not.toHaveBeenCalled();

    const day25 = screen.getByRole('button', { name: /Wednesday, October 25, 2023/i });
    expect(day25).toHaveAttribute('aria-disabled', 'true');

    await user.click(day25);
    expect(onChange).not.toHaveBeenCalled();

    const sunday15 = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(sunday15).toHaveAttribute('aria-disabled', 'true');

    await user.click(sunday15);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('can render a native date input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatePicker native name="startDate" onChange={onChange} aria-label="Date Picker" />);

    const input = screen.getByLabelText('Date Picker');
    expect(input).toHaveAttribute('type', 'date');
    expect(input).toHaveAttribute('name', 'startDate');

    await user.type(input, '2023-10-10');
    expect(onChange).toHaveBeenLastCalledWith(new Date(2023, 9, 10));
  });

  it('does not notify for equivalent empty or local-day native values', () => {
    const onChange = vi.fn();
    const { rerender } = render(<DatePicker native onChange={onChange} aria-label="Date Picker" />);
    const input = screen.getByLabelText('Date Picker');

    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <DatePicker
        native
        value={new Date(2023, 9, 10, 23, 45)}
        onChange={onChange}
        aria-label="Date Picker"
      />,
    );
    fireEvent.change(input, { target: { value: '2023-10-10' } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('restores an uncontrolled native picker when its nearest form resets', async () => {
    const { container } = render(
      <form>
        <DatePicker native defaultValue={new Date(2023, 9, 10)} aria-label="Date Picker" />
      </form>,
    );
    const input = screen.getByLabelText('Date Picker');
    fireEvent.change(input, { target: { value: '2023-10-15' } });
    expect(input).toHaveValue('2023-10-15');

    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() => expect(input).toHaveValue('2023-10-10'));
  });

  it('applies native date constraints and rejects unavailable native values', () => {
    const onChange = vi.fn();

    render(
      <DatePicker
        native
        defaultValue={new Date(2023, 9, 15)}
        minDate={new Date(2023, 9, 10, 12, 30)}
        maxDate={new Date(2023, 9, 20, 12, 30)}
        isDateDisabled={(date) => date.getDay() === 0}
        onChange={onChange}
        aria-label="Date Picker"
      />,
    );

    const input = screen.getByLabelText('Date Picker');
    expect(input).toHaveAttribute('min', '2023-10-10');
    expect(input).toHaveAttribute('max', '2023-10-20');

    fireEvent.change(input, { target: { value: '2023-10-05' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '2023-10-15' } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: '2023-10-16' } });
    expect(onChange).toHaveBeenLastCalledWith(new Date(2023, 9, 16));
  });

  it('keeps native date display format separate from custom form value', () => {
    const date = new Date(2023, 9, 10, 12, 30);
    const { container } = render(
      <DatePicker
        native
        name="startDate"
        value={date}
        valueFormat="iso-datetime"
        aria-label="Date Picker"
      />,
    );

    const input = screen.getByLabelText('Date Picker');
    expect(input).toHaveValue('2023-10-10');
    expect(input).not.toHaveAttribute('name');
    expect(container.querySelector('input[type="hidden"][name="startDate"]')).toHaveValue(
      date.toISOString(),
    );
  });
});
