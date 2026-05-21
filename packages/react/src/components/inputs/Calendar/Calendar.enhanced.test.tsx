import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Calendar } from './Calendar';

describe('Molecules / Calendar (Enhanced Features)', () => {
  const today = new Date(2023, 9, 15); // Oct 15, 2023

  afterEach(() => {
    vi.useRealTimers();
  });

  it('has no accessibility violations with enhanced controls', async () => {
    const { container } = render(
      <Calendar defaultMonth={today} showYearMonthSelect locale="en-US" />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports controlled month state via month and onMonthChange', async () => {
    const user = userEvent.setup();
    const handleMonthChange = vi.fn();

    const { rerender } = render(
      <Calendar
        month={today}
        onMonthChange={handleMonthChange}
        showYearMonthSelect={false}
        locale="en-US"
      />,
    );

    expect(screen.getByText(/October 2023/i)).toBeInTheDocument();

    const nextBtn = screen.getByLabelText(/Next month/i);
    await user.click(nextBtn);

    expect(handleMonthChange).toHaveBeenCalled();
    const newMonth = handleMonthChange.mock.calls[0][0];
    expect(newMonth.getMonth()).toBe(10); // November

    rerender(
      <Calendar
        month={new Date(2023, 10, 1)}
        onMonthChange={handleMonthChange}
        showYearMonthSelect={false}
        locale="en-US"
      />,
    );
    expect(screen.getByText(/November 2023/i)).toBeInTheDocument();
  });

  it('renders Year and Month select dropdowns and allowing navigation', async () => {
    const { container } = render(
      <Calendar defaultMonth={today} showYearMonthSelect={true} locale="en-US" />,
    );

    const monthSelect = screen.getByRole('combobox', { name: /Select month/i });
    const yearSelect = screen.getByRole('combobox', { name: /Select year/i });
    const [nativeMonthSelect, nativeYearSelect] = container.querySelectorAll('select');

    expect(monthSelect).toHaveTextContent('October');
    expect(yearSelect).toHaveTextContent('2023');

    fireEvent.change(nativeMonthSelect!, { target: { value: '11' } });
    expect(monthSelect).toHaveTextContent('December');

    fireEvent.change(nativeYearSelect!, { target: { value: '2025' } });
    expect(yearSelect).toHaveTextContent('2025');
  });

  it('renders outside days and correctly identifies them via data-outside', async () => {
    const nov1 = new Date(2023, 10, 1);
    const { container } = render(
      <Calendar defaultMonth={nov1} showOutsideDays={true} locale="en-US" />,
    );

    const oct31 = container.querySelector('button[data-date="2023-10-31"]');
    expect(oct31).toBeInTheDocument();
    expect(oct31).toHaveAttribute('data-outside', '');
  });

  it('hides outside days when showOutsideDays is false', () => {
    render(<Calendar defaultMonth={today} showOutsideDays={false} />);

    const sept30 = screen.queryByRole('button', { name: /Saturday, September 30, 2023/i });
    expect(sept30).not.toBeInTheDocument();
  });

  it('respects weekStartsOn prop (e.g., Monday = 1)', () => {
    const nov1 = new Date(2023, 10, 1); // Wednesday
    const { container } = render(<Calendar defaultMonth={nov1} weekStartsOn={1} locale="en-US" />);

    const cells = container.querySelectorAll('td[role="gridcell"]');
    const firstCellButton = cells[0].querySelector('button');
    expect(firstCellButton).toHaveAttribute('data-date', '2023-10-30');
  });

  it('disables dates based on isDateDisabled callback', () => {
    const isWeekend = (date: Date) => [0, 6].includes(date.getDay());
    render(<Calendar defaultMonth={today} isDateDisabled={isWeekend} locale="en-US" />);

    const sat14 = screen.getByRole('button', { name: /Saturday, October 14, 2023/i });
    expect(sat14).toBeDisabled();

    const mon16 = screen.getByRole('button', { name: /Monday, October 16, 2023/i });
    expect(mon16).not.toBeDisabled();
  });

  it('clamps navigation buttons based on minDate and maxDate', () => {
    const minDate = new Date(2023, 9, 1); // Oct 1
    const maxDate = new Date(2023, 10, 30); // Nov 30

    const { rerender } = render(
      <Calendar month={new Date(2023, 9, 15)} minDate={minDate} maxDate={maxDate} locale="en-US" />,
    );

    const prevBtn = screen.getByLabelText(/Previous month/i);
    const nextBtn = screen.getByLabelText(/Next month/i);

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    rerender(
      <Calendar
        month={new Date(2023, 10, 15)}
        minDate={minDate}
        maxDate={maxDate}
        locale="en-US"
      />,
    );
    expect(screen.getByLabelText(/Previous month/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/Next month/i)).toBeDisabled();
  });

  it('clamps navigation buttons using calendar days when bounds include times', () => {
    const minDate = new Date(2023, 9, 31, 12, 30); // Oct 31
    const maxDate = new Date(2023, 10, 1, 12, 30); // Nov 1

    const { rerender } = render(
      <Calendar
        month={new Date(2023, 10, 15)}
        minDate={minDate}
        maxDate={maxDate}
        locale="en-US"
      />,
    );

    expect(screen.getByLabelText(/Previous month/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/Next month/i)).toBeDisabled();

    rerender(
      <Calendar month={new Date(2023, 9, 15)} minDate={minDate} maxDate={maxDate} locale="en-US" />,
    );

    expect(screen.getByLabelText(/Previous month/i)).toBeDisabled();
    expect(screen.getByLabelText(/Next month/i)).not.toBeDisabled();
  });

  it('navigates to the current month when "Today" button is clicked', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 18));
    const nov2023 = new Date(2023, 10, 15);
    render(<Calendar defaultMonth={nov2023} locale="en-US" />);

    expect(screen.getByText(/November 2023/i)).toBeInTheDocument();

    const todayBtn = screen.getByRole('button', { name: /Go to today/i });
    fireEvent.click(todayBtn);

    expect(screen.getByText(/May 2026/i)).toBeInTheDocument();
  });
});
