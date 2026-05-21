import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Calendar } from './Calendar';

/**
 * ### Test Strategy
 * - **Focus**: The Calendar component must be fully accessible (ARIA grid), support localization,
 *   handle keyboard navigation (arrows, page up/down), and respect date constraints (min/max).
 */
describe('Molecules / Calendar', () => {
  const today = new Date(2023, 9, 15); // Oct 15, 2023

  it('passes accessibility compliance', async () => {
    const { container } = render(<Calendar defaultMonth={today} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
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

  it('autofocuses on mount when prop is set', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus -- this test verifies the component's explicit autoFocus behavior.
    render(<Calendar autoFocus defaultMonth={today} selected={today} />);
    const selectedDay = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    expect(selectedDay).toHaveFocus();
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
});
