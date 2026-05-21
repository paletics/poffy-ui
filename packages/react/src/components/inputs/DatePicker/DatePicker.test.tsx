import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DatePicker } from './DatePicker';

/**

 * ### Test Strategy
 * - **Focus**: The DatePicker component must render a trigger input, open a Calendar on interaction,
 * allow date selection, and maintain accessibility standards across different locales.
 * - **Design Verification**: Verifies that the composite structure (Input + Popover + Calendar)
 * behaves predictably and reflects selected dates in the trigger field.
 */
describe('Molecules / DatePicker', () => {
  it('renders correctly and is accessible', async () => {
    const { container } = render(<DatePicker placeholder="Pick a date" aria-label="Date Picker" />);
    const input = screen.getByPlaceholderText('Pick a date');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('readonly');

    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens calendar on click', async () => {
    const user = userEvent.setup();
    render(<DatePicker placeholder="Pick a date" aria-label="Date Picker" />);
    const input = screen.getByPlaceholderText('Pick a date');

    await user.click(input);

    const calendar = screen.getByRole('grid');
    expect(calendar).toBeInTheDocument();
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

    const input = screen.getByPlaceholderText('Pick a date') as HTMLInputElement;
    expect(input.value).toContain('Oct 10, 2023');

    await user.click(input);

    const day15 = screen.getByRole('button', { name: /Sunday, October 15, 2023/i });
    await user.click(day15);

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(input.value).toContain('Oct 15, 2023');

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
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

    await user.click(screen.getByPlaceholderText('Pick a date'));

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports custom locales', () => {
    const date = new Date(2023, 9, 10);
    render(<DatePicker value={date} locale="ja-JP" />);

    const input = screen.getByDisplayValue(/2023.*10.*10/);
    expect(input).toBeInTheDocument();
  });

  it('applies error state styles', () => {
    render(<DatePicker error placeholder="Error picker" />);
    const input = screen.getByPlaceholderText('Error picker');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits an ISO date through a hidden input', () => {
    const date = new Date(2023, 9, 10);
    const { container } = render(
      <DatePicker name="startDate" value={date} locale="en-US" aria-label="Date Picker" />,
    );

    const hiddenInput = container.querySelector('input[type="hidden"][name="startDate"]');
    expect(hiddenInput).toHaveValue('2023-10-10');
    expect(screen.getByRole('combobox')).not.toHaveAttribute('name');
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
