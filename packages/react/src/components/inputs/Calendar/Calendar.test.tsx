import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement, useState } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Calendar } from './Calendar';
import type { CalendarDateFormatOptions } from './Calendar.types';
import { LocaleProvider, useLocale } from '@/providers/LocaleProvider';
import { FormControl, FormErrorMessage, FormLabel } from '@/components/inputs/FormControl';

const CalendarLocaleSwitch = () => {
  const { setLocale } = useLocale();
  return (
    <>
      <button onClick={() => setLocale('ja-JP')}>Switch locale</button>
      <Calendar defaultMonth={new Date(2023, 9, 15)} />
    </>
  );
};

/**
 * ### Test Strategy
 * - **Focus**: The Calendar component must be fully accessible (ARIA grid), support localization,
 *   handle keyboard navigation (arrows, page up/down), and respect date constraints (min/max).
 */
describe('Molecules / Calendar', () => {
  const today = new Date(2023, 9, 15); // Oct 15, 2023

  it('treats invalid dates as empty values without rendering or submitting NaN', () => {
    const invalid = new Date(Number.NaN);
    const { container } = render(
      <Calendar
        defaultMonth={today}
        selected={invalid}
        minDate={invalid}
        maxDate={invalid}
        name="appointment"
        required
      />,
    );

    expect(container.textContent).not.toContain('NaN');
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
    expect(container.querySelector('[data-calendar-validation-proxy]')).toHaveValue('');
  });

  it('rejects externally supplied unavailable dates during native form validation', async () => {
    const selectedDate = new Date(2023, 9, 15);
    const { container } = render(
      <form>
        <Calendar
          defaultMonth={today}
          selected={selectedDate}
          isDateDisabled={(date) => date.getDay() === 0}
          name="appointment"
        />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const proxy = container.querySelector<HTMLInputElement>('[data-calendar-validation-proxy]');

    await waitFor(() => expect(form).toBeInvalid());
    expect(proxy).toBeInvalid();
    expect(proxy.validationMessage).not.toBe('');
    expect(new FormData(form).get('appointment')).toBe('2023-10-15');
  });

  it('uses a deterministic initial month during server rendering', () => {
    const markup = renderToString(<Calendar locale="en-US" />);

    expect(markup).toContain('January 2000');
  });

  it('hydrates deterministically when the calendar day changes', async () => {
    vi.useFakeTimers();
    const host = document.createElement('div');
    const recoverableErrors: unknown[] = [];
    let root: Root | undefined;
    const ui = (
      <Calendar
        month={new Date(2024, 0, 1)}
        isDateDisabled={(date) => date.getDate() === 1}
        locale="en-US"
      />
    );

    try {
      vi.setSystemTime(new Date(2024, 0, 1));
      host.innerHTML = renderToString(ui);
      expect(host.querySelector('[data-today]')).toBeNull();

      vi.setSystemTime(new Date(2024, 0, 2));
      document.body.append(host);
      await act(async () => {
        root = hydrateRoot(host, ui, {
          onRecoverableError: (error) => recoverableErrors.push(error),
        });
        await Promise.resolve();
      });

      expect(recoverableErrors).toHaveLength(0);
      expect(host.querySelector('button[data-today][data-date="2024-01-02"]')).not.toBeNull();
    } finally {
      await act(async () => root?.unmount());
      host.remove();
      vi.useRealTimers();
    }
  });

  it('falls back to English when server rendering with an invalid locale', () => {
    expect(() => renderToString(<Calendar locale="ja-@" />)).not.toThrow();
  });

  it('localizes the visible calendar fallback label and hides its validation proxy from AT', () => {
    const { container, rerender } = render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Calendar required />
      </LocaleProvider>,
    );
    const proxy = container.querySelector<HTMLInputElement>('[data-calendar-validation-proxy]');

    expect(proxy).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('group', { name: 'カレンダー' })).toHaveAccessibleDescription('必須');

    rerender(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Calendar required locale="en-US" labels={{ calendar: 'Appointment calendar' }} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'Appointment calendar' })).toHaveAccessibleDescription(
      'Required',
    );

    rerender(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Calendar required labels={{ calendar: ' ' }} />
      </LocaleProvider>,
    );
    expect(screen.getByRole('group', { name: 'カレンダー' })).toBeInTheDocument();
  });

  it('uses the English fallback for all calendar formatters with an invalid locale', () => {
    expect(() =>
      render(<Calendar defaultMonth={today} locale="ja-@" showYearMonthSelect />),
    ).not.toThrow();

    expect(screen.getByText('October 2023')).toBeInTheDocument();
    expect(screen.getByLabelText('Select month')).toHaveValue('9');
  });

  it('autofocuses today after the deterministic initial month is synchronized', () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date(2026, 4, 18));
      render(createElement(Calendar, { autoFocus: true, locale: 'en-US' }));

      expect(screen.getByRole('button', { name: 'Monday, May 18, 2026' })).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it('applies formatOptions to day button labels', () => {
    render(
      <Calendar
        month={new Date(2023, 9, 1)}
        locale="en-US"
        formatOptions={{ month: 'short', day: 'numeric', year: 'numeric' }}
      />,
    );

    expect(screen.getByRole('button', { name: 'Oct 15, 2023' })).toBeInTheDocument();
  });

  it('normalizes invalid runtime date format options instead of throwing', () => {
    expect(() =>
      render(
        <Calendar
          month={new Date(2023, 9, 1)}
          formatOptions={
            {
              dateStyle: 'short',
              hour: 'numeric',
              timeStyle: 'short',
            } as unknown as CalendarDateFormatOptions
          }
        />,
      ),
    ).not.toThrow();
  });

  it('passes accessibility compliance', async () => {
    const { container } = render(<Calendar defaultMonth={today} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('inherits FormControl state and validates a required selection through a native proxy', async () => {
    const { container } = render(
      <form>
        <FormControl isRequired isInvalid>
          <FormLabel>Date</FormLabel>
          <Calendar name="appointment" defaultMonth={today} />
          <FormErrorMessage>Date is required.</FormErrorMessage>
        </FormControl>
      </form>,
    );

    const group = container.querySelector<HTMLElement>('.poffy-calendar__root');
    const proxy = container.querySelector<HTMLInputElement>('[data-calendar-validation-proxy]');
    expect(group).not.toBeNull();
    expect(group).toHaveAttribute('aria-labelledby');
    expect(group).toHaveAttribute('aria-describedby');
    expect(group).toHaveAttribute('data-invalid');
    expect(proxy).toBeRequired();
    expect(proxy).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('form')?.reportValidity()).toBe(false);

    const focusedDay = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    await waitFor(() => expect(focusedDay).toHaveFocus());
    expect(focusedDay).toHaveAttribute('aria-describedby');
  });

  it('disables FormControl-owned calendars and removes their required validation', () => {
    const { container } = render(
      <FormControl isDisabled isReadOnly isRequired>
        <FormLabel>Date</FormLabel>
        <Calendar defaultMonth={today} />
      </FormControl>,
    );

    const group = container.querySelector<HTMLElement>('.poffy-calendar__root');
    expect(group).not.toBeNull();
    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(
      container.querySelector<HTMLInputElement>('[data-calendar-validation-proxy]'),
    ).toBeDisabled();
    expect(
      Array.from(group?.querySelectorAll<HTMLButtonElement>('button') ?? []).every(
        (button) => button.disabled,
      ),
    ).toBe(true);
  });

  it('does not allow a consumer aria-disabled value to contradict disabled state', () => {
    const { container } = render(<Calendar defaultMonth={today} disabled aria-disabled="false" />);

    expect(container.querySelector<HTMLElement>('.poffy-calendar__root')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('reveals focused controls inside a constrained calendar mounted in an iframe realm', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document.');
    const host = frameDocument.createElement('div');
    frameDocument.body.append(host);

    const { container, unmount } = render(<Calendar defaultMonth={today} />, {
      container: host,
      baseElement: frameDocument.body,
    });
    const calendarRoot = container.querySelector<HTMLElement>('.poffy-calendar__root');
    const day = container.querySelector<HTMLButtonElement>('button[data-date]');
    if (!calendarRoot || !day) throw new Error('Expected calendar focus targets.');
    Object.defineProperties(calendarRoot, {
      clientWidth: { configurable: true, value: 120 },
      scrollWidth: { configurable: true, value: 360 },
    });
    const scrollIntoView = vi.fn();
    day.scrollIntoView = scrollIntoView;

    fireEvent.focus(day);

    expect(day instanceof HTMLElement).toBe(false);
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'nearest',
      inline: 'nearest',
    });
    unmount();
    frame.remove();
  });

  it('renders current month and year in the specified locale', () => {
    const { rerender } = render(<Calendar defaultMonth={today} locale="en-US" />);
    expect(screen.getByText(/October 2023/i)).toBeInTheDocument();

    rerender(<Calendar defaultMonth={today} locale="ja-JP" />);
    expect(screen.getByText(/2023年10月/i)).toBeInTheDocument();
  });

  it('navigates to next and previous months', async () => {
    const user = userEvent.setup();
    render(<Calendar defaultMonth={today} />);

    const nextBtn = screen.getByLabelText(/Next month/i);
    const prevBtn = screen.getByLabelText(/Previous month/i);

    await user.click(nextBtn);
    expect(screen.getByText(/November 2023/i)).toBeInTheDocument();

    await user.click(prevBtn);
    expect(screen.getByText(/October 2023/i)).toBeInTheDocument();
  });

  it('mirrors month navigation icons in RTL while preserving their month actions', async () => {
    const user = userEvent.setup();
    render(<Calendar dir="rtl" defaultMonth={today} />);

    const previous = screen.getByLabelText('Previous month');
    const next = screen.getByLabelText('Next month');
    expect(previous).toHaveAttribute('data-calendar-navigation-direction', 'right');
    expect(next).toHaveAttribute('data-calendar-navigation-direction', 'left');

    await user.click(next);
    expect(screen.getByText(/November 2023/i)).toBeInTheDocument();
  });

  it('skips unavailable dates during roving keyboard focus', async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        defaultMonth={today}
        selected={new Date(2023, 9, 10)}
        isDateDisabled={(date) =>
          date.getFullYear() === 2023 && date.getMonth() === 9 && date.getDate() === 11
        }
      />,
    );

    const day10 = screen.getByRole('button', { name: /Tuesday, October 10, 2023/i });
    const day12 = screen.getByRole('button', { name: /Thursday, October 12, 2023/i });
    day10.focus();
    await user.keyboard('{ArrowRight}');

    expect(day12).toHaveFocus();
    expect(day12).toHaveAttribute('tabindex', '0');
  });

  it('uses localized labels based on locale and supports overrides', () => {
    const { rerender } = render(<Calendar defaultMonth={today} locale="ja-JP" />);
    expect(screen.getByLabelText(/次の月へ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/前の月へ/i)).toBeInTheDocument();
    expect(screen.getByText(/今日/i)).toBeInTheDocument();

    rerender(<Calendar defaultMonth={today} labels={{ today: 'Now', nextMonth: 'Go Next' }} />);
    expect(screen.getByText(/Now/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Go Next/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Previous month/i)).toBeInTheDocument();
  });

  it('uses LocaleProvider defaults at runtime while explicit props remain authoritative', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <LocaleProvider defaultLocale="en-US" global={false}>
        <CalendarLocaleSwitch />
      </LocaleProvider>,
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Switch locale' }));
    expect(screen.getByLabelText('次の月へ')).toBeInTheDocument();

    rerender(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Calendar locale="en-US" defaultMonth={today} />
      </LocaleProvider>,
    );
    expect(screen.getByLabelText('Next month')).toBeInTheDocument();
  });

  it('calls onSelect when a day is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Calendar defaultMonth={today} onSelect={handleSelect} />);

    const day10 = screen.getByRole('button', { name: /Tuesday, October 10, 2023/i });
    await user.click(day10);

    expect(handleSelect).toHaveBeenCalledWith(expect.any(Date));
    const selectedDate = handleSelect.mock.calls[0][0];
    expect(selectedDate.getDate()).toBe(10);
    expect(selectedDate.getMonth()).toBe(9);
  });

  it('keeps an explicitly undefined selected value controlled', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Calendar
        defaultMonth={today}
        defaultValue={new Date(2023, 9, 15)}
        selected={undefined}
        onSelect={onSelect}
      />,
    );

    const day10 = screen.getByRole('button', { name: /Tuesday, October 10, 2023/i });
    await user.click(day10);

    expect(onSelect).toHaveBeenCalledWith(expect.any(Date));
    expect(day10).not.toHaveAttribute('data-selected');
  });

  it('supports keyboard navigation via arrow keys', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<Calendar defaultMonth={today} onSelect={handleSelect} selected={today} />);

    const initialFocus = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    initialFocus.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /Monday, October 16, 2023/i })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /Monday, October 23, 2023/i })).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleSelect).toHaveBeenCalled();
    expect(handleSelect.mock.calls[0][0].getDate()).toBe(23);
  });

  it('respects minDate and maxDate constraints', () => {
    const minDate = new Date(2023, 9, 10);
    const maxDate = new Date(2023, 9, 20);
    render(<Calendar defaultMonth={today} minDate={minDate} maxDate={maxDate} />);

    const day5 = screen.getByRole('button', { name: /Thursday, October 5, 2023/i });
    expect(day5).toHaveAttribute('aria-disabled', 'true');
    expect(day5).toHaveAttribute('data-disabled');

    const day15 = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(day15).not.toHaveAttribute('aria-disabled', 'true');
    expect(day15).not.toHaveAttribute('data-disabled');

    const day25 = screen.getByRole('button', { name: /Wednesday, October 25, 2023/i });
    expect(day25).toHaveAttribute('aria-disabled', 'true');
    expect(day25).toHaveAttribute('data-disabled');
  });

  it('treats minDate with a time component as an inclusive calendar day', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const minDate = new Date(2023, 9, 15, 12, 30);

    render(<Calendar defaultMonth={today} minDate={minDate} onSelect={handleSelect} />);

    const day15 = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(day15).not.toHaveAttribute('aria-disabled', 'true');

    await user.click(day15);

    expect(handleSelect).toHaveBeenCalledWith(expect.any(Date));
  });

  it('treats maxDate with a time component as an inclusive calendar day', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const maxDate = new Date(2023, 9, 15, 12, 30);

    render(<Calendar defaultMonth={today} maxDate={maxDate} onSelect={handleSelect} />);

    const day15 = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(day15).not.toHaveAttribute('aria-disabled', 'true');

    await user.click(day15);

    expect(handleSelect).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should not allow interaction when disabled', async () => {
    const onSelect = vi.fn();
    render(<Calendar selected={today} onSelect={onSelect} disabled />);

    const dayButton = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(dayButton).toHaveAttribute('aria-disabled', 'true');
    expect(dayButton).toHaveAttribute('data-disabled');

    await userEvent.click(dayButton);
    expect(onSelect).not.toHaveBeenCalled();

    const nextButton = screen.getByLabelText(/next month/i);
    expect(nextButton).toBeDisabled();
  });

  it('should not allow selection but allow navigation when readOnly', async () => {
    const onSelect = vi.fn();
    render(<Calendar selected={today} onSelect={onSelect} readOnly />);

    const dayButton = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(dayButton).not.toBeDisabled();

    await userEvent.click(dayButton);
    expect(onSelect).not.toHaveBeenCalled();

    const nextButton = screen.getByLabelText(/next month/i);
    expect(nextButton).not.toBeDisabled();
  });

  it('supports multiple date selection', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [selected, setSelected] = useState<Date[]>([]);
      return (
        <Calendar
          mode="multiple"
          defaultMonth={today}
          selected={selected}
          onSelect={(dates) => setSelected(dates ?? [])}
        />
      );
    };
    render(<TestComponent />);

    const day10 = screen.getByRole('button', { name: /Tuesday, October 10, 2023/i });
    const day12 = screen.getByRole('button', { name: /Thursday, October 12, 2023/i });

    await user.click(day10);
    expect(screen.getByRole('button', { name: /Tuesday, October 10, 2023/i })).toHaveAttribute(
      'data-selected',
      '',
    );

    await user.click(day12);
    expect(screen.getByRole('button', { name: /Tuesday, October 10, 2023/i })).toHaveAttribute(
      'data-selected',
      '',
    );
    expect(screen.getByRole('button', { name: /Thursday, October 12, 2023/i })).toHaveAttribute(
      'data-selected',
      '',
    );
    expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
  });

  it('supports range date selection', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [selected, setSelected] = useState<{ from?: Date; to?: Date }>({});
      return (
        <Calendar
          mode="range"
          defaultMonth={today}
          selected={selected}
          onSelect={(range) => setSelected(range ?? {})}
        />
      );
    };
    render(<TestComponent />);

    const fromDateButton = screen.getByRole('button', { name: /Tuesday, October 10, 2023/i });
    const toDateButton = screen.getByRole('button', { name: /Friday, October 13, 2023/i });

    await user.click(fromDateButton);
    expect(fromDateButton).toHaveAttribute('data-range-start', '');

    await user.click(toDateButton);
    expect(toDateButton).toHaveAttribute('data-range-end', '');
    expect(screen.getByRole('button', { name: /Wednesday, October 11, 2023/i })).toHaveAttribute(
      'data-range-middle',
      '',
    );
  });

  it('integrates with native forms via hidden inputs', async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [selected, setSelected] = useState<Date | undefined>();
      return (
        <Calendar
          name="test-date"
          form="calendar-form"
          mode="single"
          defaultMonth={today}
          selected={selected}
          onSelect={setSelected}
        />
      );
    };
    const { container } = render(<TestComponent />);

    const day10 = screen.getByRole('button', { name: /Tuesday, October 10, 2023/i });
    await user.click(day10);

    const input = container.querySelector<HTMLInputElement>('input[type="hidden"]')!;
    expect(input).toBeInTheDocument();
    expect(input.name).toBe('test-date');
    expect(input).toHaveAttribute('form', 'calendar-form');
    expect(input.value).toMatch(/2023-10-10/);
  });

  it('restores the latest uncontrolled selection when its nearest form resets', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <Calendar name="appointment" defaultMonth={today} defaultValue={new Date(2023, 9, 10)} />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: /Thursday, October 12, 2023/i }));
    rerender(
      <form>
        <Calendar name="appointment" defaultMonth={today} defaultValue={new Date(2023, 9, 14)} />
      </form>,
    );
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"]')).toHaveValue('2023-10-14'),
    );
    expect(screen.getByRole('button', { name: /Saturday, October 14, 2023/i })).toHaveAttribute(
      'data-selected',
      '',
    );
  });

  it('restores an uncontrolled selection through an external form', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <form id="appointment-form" />
        <Calendar
          name="appointment"
          form="appointment-form"
          defaultMonth={today}
          defaultValue={new Date(2023, 9, 10)}
        />
      </>,
    );

    await user.click(screen.getByRole('button', { name: /Thursday, October 12, 2023/i }));
    (document.getElementById('appointment-form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"]')).toHaveValue('2023-10-10'),
    );
  });

  it('autofocuses on mount when prop is set', () => {
    render(createElement(Calendar, { autoFocus: true, defaultMonth: today, selected: today }));
    const selectedDay = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(selectedDay).toHaveFocus();
  });

  it('moves the initial roving focus from an unavailable selected day to the nearest available day', () => {
    const unavailableDate = new Date(2023, 9, 15);
    render(
      createElement(Calendar, {
        autoFocus: true,
        defaultMonth: today,
        selected: unavailableDate,
        isDateDisabled: (date) => date.getDate() === 15,
      }),
    );

    const unavailableDay = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    const nextAvailableDay = screen.getByRole('button', { name: /Monday, October 16, 2023/i });
    expect(unavailableDay).toBeDisabled();
    expect(unavailableDay).toHaveAttribute('tabindex', '-1');
    expect(nextAvailableDay).toHaveAttribute('tabindex', '0');
    expect(nextAvailableDay).toHaveFocus();
  });

  it('resolves a constrained selected day toward the nearest date within the allowed range', () => {
    render(
      createElement(Calendar, {
        autoFocus: true,
        defaultMonth: today,
        selected: new Date(2023, 9, 25),
        maxDate: new Date(2023, 9, 20),
      }),
    );

    const constrainedDay = screen.getByRole('button', { name: /Friday, October 20, 2023/i });
    expect(constrainedDay).toHaveAttribute('tabindex', '0');
    expect(constrainedDay).toHaveFocus();
  });

  it('does not give an unavailable day a roving tab stop when every day is unavailable', () => {
    const { container } = render(
      createElement(Calendar, {
        autoFocus: true,
        defaultMonth: today,
        isDateDisabled: () => true,
      }),
    );

    expect(container.querySelectorAll('button[data-date][tabindex="0"]')).toHaveLength(0);
    expect(document.activeElement).not.toHaveAttribute('data-disabled');
  });

  it('keeps the roving tab stop on a rendered day when a controlled month changes and releases', () => {
    const { rerender } = render(
      <Calendar month={new Date(2023, 9, 1)} selected={new Date(2023, 9, 15)} />,
    );

    rerender(<Calendar month={new Date(2023, 10, 1)} selected={new Date(2023, 9, 15)} />);
    rerender(<Calendar selected={new Date(2023, 9, 15)} />);

    expect(screen.getByRole('button', { name: /Wednesday, November 1, 2023/i })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(document.querySelectorAll('button[data-date][tabindex="0"]')).toHaveLength(1);
  });

  it('retains the latest externally updated controlled month when becoming uncontrolled', () => {
    const october = new Date(2023, 9, 23);
    const november = new Date(2023, 10, 17);
    const { rerender } = render(<Calendar month={october} locale="en-US" />);

    rerender(<Calendar month={november} locale="en-US" />);
    rerender(<Calendar locale="en-US" />);

    expect(screen.getByText(/November 2023/i)).toBeInTheDocument();
  });

  it('notifies controlled month navigation without changing or handing off the requested month', async () => {
    const user = userEvent.setup();
    const october = new Date(2023, 9, 1);
    const onMonthChange = vi.fn();
    const { rerender } = render(
      <Calendar month={october} locale="en-US" onMonthChange={onMonthChange} />,
    );

    await user.click(screen.getByLabelText(/Next month/i));

    expect(onMonthChange).toHaveBeenCalledOnce();
    expect(onMonthChange.mock.calls[0]?.[0]).toEqual(new Date(2023, 10, 1));
    expect(screen.getByText(/October 2023/i)).toBeInTheDocument();

    rerender(<Calendar locale="en-US" />);

    expect(screen.getByText(/October 2023/i)).toBeInTheDocument();
  });

  it('keeps local calendar dates in accessible names when formatOptions has a timezone', () => {
    const date = new Date(2023, 0, 1);
    const { container } = render(
      <Calendar
        defaultMonth={date}
        locale="en-US"
        formatOptions={
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Pacific/Honolulu',
          } as unknown as CalendarDateFormatOptions
        }
      />,
    );

    expect(container.querySelector('button[data-date="2023-01-01"]')).toHaveAttribute(
      'aria-label',
      date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    );
  });

  it('resets uncontrolled selection when mode changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Calendar defaultMonth={today} />);

    const day10 = screen.getByRole('button', { name: /Tuesday, October 10, 2023/i });
    await user.click(day10);
    expect(day10).toHaveAttribute('data-selected', '');

    rerender(<Calendar defaultMonth={today} mode="multiple" />);

    expect(day10).not.toHaveAttribute('data-selected');
  });

  it('retains the latest controlled single selection and form value when becoming uncontrolled', () => {
    const first = new Date(2023, 9, 10);
    const latest = new Date(2023, 9, 14);
    const { container, rerender } = render(
      <Calendar selected={first} name="appointment" defaultMonth={today} />,
    );

    rerender(<Calendar selected={latest} name="appointment" defaultMonth={today} />);
    rerender(<Calendar name="appointment" defaultMonth={today} />);

    expect(screen.getByRole('button', { name: /Saturday, October 14, 2023/i })).toHaveAttribute(
      'data-selected',
      '',
    );
    expect(container.querySelector('input[type="hidden"]')).toHaveValue('2023-10-14');
  });

  it.each([
    ['multiple', [new Date(2023, 9, 10), new Date(2023, 9, 14)]],
    ['range', { from: new Date(2023, 9, 10), to: new Date(2023, 9, 14) }],
  ] as const)(
    'retains the latest controlled %s selection when becoming uncontrolled',
    (mode, selected) => {
      const { rerender } = render(
        <Calendar mode={mode} selected={selected} defaultMonth={today} />,
      );

      rerender(<Calendar mode={mode} defaultMonth={today} />);

      expect(screen.getByRole('button', { name: /Saturday, October 14, 2023/i })).toHaveAttribute(
        'data-selected',
        '',
      );
    },
  );
});
