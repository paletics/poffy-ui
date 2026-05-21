import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { WheelPicker } from './WheelPicker';

const columns = [
  {
    id: 'hour',
    label: 'Hour',
    options: [
      { value: '8', label: '08' },
      { value: '9', label: '09' },
      { value: '10', label: '10' },
    ],
  },
  {
    id: 'minute',
    label: 'Minute',
    options: [
      { value: '0', label: '00' },
      { value: '15', label: '15', disabled: true },
      { value: '30', label: '30' },
    ],
  },
];

/**
 * ### Test Strategy: WheelPicker
 * - **Focus**: Multi-column listbox rendering, controlled/uncontrolled selection,
 *   keyboard and wheel navigation, disabled option handling, and axe compliance.
 * - **DON'T**: Do not assert generated classes or browser scroll physics.
 */
describe('WheelPicker', () => {
  it('renders selected values for each column', () => {
    render(<WheelPicker columns={columns} defaultValue={{ hour: '9', minute: '30' }} />);

    expect(screen.getByRole('option', { name: '09' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: '30' })).toHaveAttribute('aria-selected', 'true');
  });

  it('selects an option by click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<WheelPicker columns={columns} defaultValue={{ hour: '9' }} onChange={onChange} />);

    await user.click(screen.getByRole('option', { name: '10' }));

    expect(onChange).toHaveBeenCalledWith({ hour: '10', minute: '0' }, 'hour');
  });

  it('supports keyboard navigation and skips disabled options', () => {
    const onChange = vi.fn();
    render(
      <WheelPicker
        columns={columns}
        defaultValue={{ hour: '9', minute: '0' }}
        onChange={onChange}
      />,
    );

    const minuteListbox = screen.getByRole('listbox', { name: 'Minute' });
    fireEvent.keyDown(minuteListbox, { key: 'ArrowDown' });

    expect(onChange).toHaveBeenCalledWith({ hour: '9', minute: '30' }, 'minute');
  });

  it('commits the nearest centered option after native scrolling', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    try {
      render(
        <WheelPicker
          columns={columns}
          defaultValue={{ hour: '9', minute: '0' }}
          onChange={onChange}
        />,
      );
      act(() => {
        vi.advanceTimersByTime(16);
      });

      const minuteListbox = screen.getByRole('listbox', { name: 'Minute' });
      const minuteZero = within(minuteListbox).getByRole('option', { name: '00' });
      const minuteThirty = within(minuteListbox).getByRole('option', { name: '30' });

      minuteListbox.getBoundingClientRect = () =>
        ({
          top: 0,
          height: 90,
          bottom: 90,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => undefined,
        }) as DOMRect;
      minuteZero.getBoundingClientRect = () =>
        ({
          top: 0,
          height: 30,
          bottom: 30,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => undefined,
        }) as DOMRect;
      minuteThirty.getBoundingClientRect = () =>
        ({
          top: 30,
          height: 30,
          bottom: 60,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: 0,
          toJSON: () => undefined,
        }) as DOMRect;

      fireEvent.scroll(minuteListbox);
      act(() => {
        vi.advanceTimersByTime(180);
      });

      expect(onChange).toHaveBeenCalledWith({ hour: '9', minute: '30' }, 'minute');
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not select disabled options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<WheelPicker columns={columns} defaultValue={{ minute: '0' }} onChange={onChange} />);

    const minuteListbox = screen.getByRole('listbox', { name: 'Minute' });
    await user.click(within(minuteListbox).getByRole('option', { name: '15' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders a JSON hidden input when name is provided', () => {
    const { container } = render(
      <WheelPicker
        columns={columns}
        defaultValue={{ hour: '9', minute: '30' }}
        name="time"
        form="booking"
      />,
    );

    expect(container.querySelector('input[type="hidden"][name="time"]')).toHaveValue(
      '{"hour":"9","minute":"30"}',
    );
    expect(container.querySelector('input[type="hidden"][name="time"]')).toHaveAttribute(
      'form',
      'booking',
    );
  });

  it('can render one hidden input per column', () => {
    const { container } = render(
      <WheelPicker
        columns={columns}
        defaultValue={{ hour: '9', minute: '30' }}
        name="time"
        valueFormat="entries"
      />,
    );

    expect(container.querySelector('input[type="hidden"][name="time[hour]"]')).toHaveValue('9');
    expect(container.querySelector('input[type="hidden"][name="time[minute]"]')).toHaveValue('30');
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(
      <WheelPicker
        columns={columns}
        defaultValue={{ hour: '9', minute: '30' }}
        aria-label="Time"
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
