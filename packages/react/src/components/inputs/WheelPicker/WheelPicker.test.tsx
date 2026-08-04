import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { WheelPicker } from './WheelPicker';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

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
  it('inherits FormControl group state and error references', async () => {
    const { container } = render(
      <FormControl id="time" labelTarget="group" isDisabled isInvalid isReadOnly isRequired>
        <FormLabel>Time</FormLabel>
        <WheelPicker columns={columns} aria-label="   " />
        <FormHelperText>Choose a time.</FormHelperText>
        <FormErrorMessage>Time is required.</FormErrorMessage>
      </FormControl>,
    );

    const group = screen.getByRole('group', { name: 'Time' });
    const hourListbox = screen.getByRole('listbox', { name: 'Hour' });
    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(group).toHaveAttribute('aria-describedby');
    expect(group).not.toHaveAttribute('aria-invalid');
    expect(group).not.toHaveAttribute('aria-errormessage');
    expect(hourListbox).toHaveAttribute('aria-disabled', 'true');
    expect(hourListbox).toHaveAttribute('aria-readonly', 'true');
    expect(hourListbox).toHaveAttribute('aria-required', 'true');
    expect(hourListbox).toHaveAttribute('aria-invalid', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not allow a consumer aria-disabled value to contradict disabled state', () => {
    render(
      <WheelPicker
        columns={columns}
        disabled
        readOnly
        aria-label="Time"
        {...({
          role: 'button',
          'aria-disabled': false,
          'aria-readonly': false,
        } as never)}
      />,
    );

    const group = screen.getByRole('group', { name: 'Time' });
    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(group).not.toHaveAttribute('aria-readonly');
    expect(screen.getByRole('listbox', { name: 'Hour' })).toHaveAttribute('aria-readonly', 'true');
  });

  it('blocks interaction and submission when disabled by an ancestor fieldset', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <fieldset>
          <WheelPicker
            aria-label="Time"
            columns={columns}
            defaultValue={{ hour: '8', minute: '0' }}
            name="time"
            onChange={onChange}
          />
        </fieldset>
      </form>,
    );
    const fieldset = container.querySelector('fieldset')!;
    const hourListbox = screen.getByRole('listbox', { name: 'Hour' });
    const valueInput = container.querySelector<HTMLInputElement>('input[name="time"]')!;

    fieldset.disabled = true;
    fireEvent.keyDown(hourListbox, { key: 'ArrowDown' });
    fireEvent.click(screen.getByRole('option', { name: '10' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('option', { name: '08' })).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(hourListbox).toHaveAttribute('aria-disabled', 'true'));
    expect(valueInput).toBeDisabled();

    fieldset.disabled = false;
    await waitFor(() => expect(hourListbox).not.toHaveAttribute('aria-disabled'));
    fireEvent.keyDown(hourListbox, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('prefers a trimmed explicit aria-labelledby over aria-label', () => {
    render(
      <>
        <span id="wheel-name">Appointment time</span>
        <WheelPicker columns={columns} aria-label="Ignored time" aria-labelledby="  wheel-name  " />
      </>,
    );

    const group = screen.getByRole('group', { name: 'Appointment time' });
    expect(group).toHaveAttribute('aria-labelledby', 'wheel-name');
    expect(group).not.toHaveAttribute('aria-label');
  });

  it('participates in native required validation for every placeholder column', async () => {
    const user = userEvent.setup();
    const requiredColumns = columns.map((column) => ({
      ...column,
      options: [
        { value: 'unset', label: `Choose ${column.label}`, placeholder: true },
        ...column.options,
      ],
    }));
    const { container } = render(
      <form>
        <WheelPicker
          aria-label="Time"
          columns={requiredColumns}
          defaultValue={{ hour: 'unset', minute: 'unset' }}
          name="time"
          required
        />
      </form>,
    );
    const formElement = container.querySelector('form')!;
    const proxies = container.querySelectorAll<HTMLInputElement>(
      'input[data-wheel-picker-validation-proxy]',
    );

    expect(proxies).toHaveLength(2);
    expect([...proxies].every((proxy) => proxy.name === '')).toBe(true);
    expect([...proxies].every((proxy) => proxy.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(formElement.checkValidity()).toBe(false);

    await user.click(screen.getByRole('option', { name: '09' }));
    expect(formElement.checkValidity()).toBe(false);
    expect(container.querySelectorAll('input[data-wheel-picker-validation-proxy]')).toHaveLength(1);
    await user.click(screen.getByRole('option', { name: '30' }));
    expect(formElement.checkValidity()).toBe(true);
    expect(container.querySelectorAll('input[data-wheel-picker-validation-proxy]')).toHaveLength(0);
    expect(container.querySelector('input[type="hidden"][name="time"]')).toHaveValue(
      '{"hour":"9","minute":"30"}',
    );
  });

  it('treats an empty-string option as complete unless it is a placeholder', () => {
    const { container } = render(
      <form>
        <WheelPicker
          columns={[
            { id: 'empty', label: 'Empty', options: [{ value: '', label: 'Empty value' }] },
          ]}
          required
        />
      </form>,
    );

    expect(container.querySelector('form')).toBeValid();
  });

  it('returns invalid focus to the corresponding listbox', async () => {
    const placeholderColumns = [
      {
        id: 'zone',
        label: 'Zone',
        options: [{ value: 'unset', label: 'Choose zone', placeholder: true }],
      },
    ];
    const { container } = render(<WheelPicker columns={placeholderColumns} required />);
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-wheel-picker-validation-proxy="zone"]',
    )!;

    fireEvent.invalid(proxy);

    await waitFor(() => expect(screen.getByRole('listbox', { name: 'Zone' })).toHaveFocus());
  });

  it('associates required proxies with an external form and excludes read-only validation', () => {
    const placeholderColumn = [
      {
        id: 'choice',
        label: 'Choice',
        options: [{ value: 'unset', label: 'Choose', placeholder: true }],
      },
    ];
    const { container, rerender } = render(
      <>
        <form id="external-wheel-form" />
        <WheelPicker columns={placeholderColumn} form="external-wheel-form" required />
      </>,
    );
    const formElement = container.querySelector('form')!;
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-wheel-picker-validation-proxy]',
    )!;

    expect(proxy).toHaveAttribute('form', 'external-wheel-form');
    expect(formElement.checkValidity()).toBe(false);

    rerender(
      <>
        <form id="external-wheel-form" />
        <WheelPicker columns={placeholderColumn} form="external-wheel-form" readOnly required />
      </>,
    );
    expect(container.querySelector('[data-wheel-picker-validation-proxy]')).toBeDisabled();
    expect(formElement.checkValidity()).toBe(true);
  });

  it('uses index-based DOM ids and preserves prototype-like selection keys', () => {
    const specialColumns = [
      {
        id: '__proto__',
        label: 'Special key',
        options: [{ value: 'value with / spaces', label: 'Special value' }],
      },
    ];
    const specialValue = Object.fromEntries([['__proto__', 'value with / spaces']]);
    const { container } = render(
      <WheelPicker columns={specialColumns} defaultValue={specialValue} name="special" />,
    );
    const listbox = screen.getByRole('listbox', { name: 'Special key' });
    const activeId = listbox.getAttribute('aria-activedescendant')!;

    expect(listbox.id).not.toContain('__proto__');
    expect(activeId).not.toContain('value with / spaces');
    expect(document.getElementById(activeId)).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('input[type="hidden"][name="special"]')).toHaveValue(
      '{"__proto__":"value with / spaces"}',
    );
  });
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

  it('does not emit a change when the selected option is chosen again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<WheelPicker columns={columns} defaultValue={{ hour: '9' }} onChange={onChange} />);

    await user.click(screen.getByRole('option', { name: '09' }));

    expect(onChange).not.toHaveBeenCalled();
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

  it('restores the latest uncontrolled default value when its form resets', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <WheelPicker columns={columns} defaultValue={{ hour: '9', minute: '0' }} name="time" />
      </form>,
    );
    await user.click(screen.getByRole('option', { name: '10' }));

    rerender(
      <form>
        <WheelPicker columns={columns} defaultValue={{ hour: '8', minute: '30' }} name="time" />
      </form>,
    );
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(screen.getByRole('option', { name: '08' })).toHaveAttribute('aria-selected', 'true'),
    );
    expect(screen.getByRole('option', { name: '30' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('input[type="hidden"][name="time"]')).toHaveValue(
      '{"hour":"8","minute":"30"}',
    );
  });

  it('restores required validity and placeholder serialization on form reset', async () => {
    const user = userEvent.setup();
    const placeholderColumns = [
      {
        id: 'duration',
        label: 'Duration',
        options: [
          { value: 'unset', label: 'Choose duration', placeholder: true },
          { value: '30', label: '30 minutes' },
        ],
      },
    ];
    const { container } = render(
      <form>
        <WheelPicker
          columns={placeholderColumns}
          defaultValue={{ duration: 'unset' }}
          name="duration"
          required
          valueFormat={(value) => `duration:${value.duration}`}
        />
      </form>,
    );
    const formElement = container.querySelector('form')!;

    await user.click(screen.getByRole('option', { name: '30 minutes' }));
    expect(formElement).toBeValid();
    expect(container.querySelector('[data-wheel-picker-validation-proxy]')).toBeNull();
    expect(container.querySelector('input[type="hidden"][name="duration"]')).toHaveValue(
      'duration:30',
    );

    formElement.reset();

    await waitFor(() => expect(formElement).toBeInvalid());
    expect(container.querySelector('[data-wheel-picker-validation-proxy]')).toBeInTheDocument();
    expect(container.querySelector('input[type="hidden"][name="duration"]')).toHaveValue(
      'duration:unset',
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

  it('retains the latest controlled selection and form value when becoming uncontrolled', () => {
    const { container, rerender } = render(
      <WheelPicker columns={columns} value={{ hour: '8', minute: '0' }} name="time" />,
    );

    rerender(<WheelPicker columns={columns} value={{ hour: '10', minute: '30' }} name="time" />);
    rerender(<WheelPicker columns={columns} name="time" />);

    expect(screen.getByRole('option', { name: '10' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: '30' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('input[type="hidden"][name="time"]')).toHaveValue(
      '{"hour":"10","minute":"30"}',
    );
  });

  it('accepts semantically equal fresh controlled values without repeated synchronization', () => {
    const { rerender } = render(
      <WheelPicker columns={columns} value={{ minute: '30', hour: '10' }} />,
    );

    rerender(<WheelPicker columns={columns} value={{ hour: '10', minute: '30' }} />);

    expect(screen.getByRole('option', { name: '10' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: '30' })).toHaveAttribute('aria-selected', 'true');
  });

  it('normalizes a controlled handoff against the current columns', () => {
    const hourColumn = [columns[0]];
    const { rerender } = render(<WheelPicker columns={hourColumn} value={{ hour: '10' }} />);

    rerender(<WheelPicker columns={columns} value={{ hour: '10' }} />);
    rerender(<WheelPicker columns={columns} />);

    expect(screen.getByRole('option', { name: '10' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: '00' })).toHaveAttribute('aria-selected', 'true');
  });

  it('fails closed for duplicate column ids and option values', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const { container } = render(
        <WheelPicker
          aria-label="Picker"
          columns={[
            {
              id: 'duplicate-column',
              label: 'First duplicate column',
              options: [{ value: 'first', label: 'First' }],
            },
            {
              id: 'safe-column',
              label: 'Safe column',
              options: [
                { value: 'duplicate-option', label: 'First ambiguous option' },
                { value: 'unique-option', label: 'Unique option' },
                { value: 'duplicate-option', label: 'Second ambiguous option' },
              ],
            },
            {
              id: 'duplicate-column',
              label: 'Second duplicate column',
              options: [{ value: 'second', label: 'Second' }],
            },
          ]}
          defaultValue={{
            'duplicate-column': 'first',
            'safe-column': 'duplicate-option',
          }}
          name="picker"
        />,
      );

      expect(screen.queryByRole('listbox', { name: /duplicate column/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('option', { name: /ambiguous option/i })).not.toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Unique option' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      expect(container.querySelector('input[type="hidden"][name="picker"]')).toHaveValue(
        '{"safe-column":"unique-option"}',
      );
      expect(warn).toHaveBeenCalledTimes(2);
    } finally {
      warn.mockRestore();
    }
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
