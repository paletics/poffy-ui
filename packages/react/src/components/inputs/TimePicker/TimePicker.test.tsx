import { createRef } from 'react';
import type { ComponentProps } from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TimeParts } from '@poffy-ui/behavior/time';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import type { TimePickerProps as InputsTimePickerProps } from '..';
import { TimePicker } from './TimePicker';
import type { TimePickerProps } from './TimePicker.types';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

describe('TimePicker', () => {
  it('owns the overflow viewport for constrained segmented controls', () => {
    render(<TimePicker aria-label="Constrained time" withSeconds format="12h" />);

    expect(screen.getByRole('group', { name: 'Constrained time' })).toHaveAttribute(
      'data-time-picker-overflow-viewport',
    );
  });

  it('consumes legacy group required and readonly ARIA overrides', () => {
    render(
      <TimePicker
        {...({
          'aria-label': 'Legacy time',
          'aria-readonly': true,
          'aria-required': true,
        } as never)}
      />,
    );

    const group = screen.getByRole('group', { name: 'Legacy time' });
    expect(group).not.toHaveAttribute('aria-readonly');
    expect(group).not.toHaveAttribute('aria-required');
  });
  it('forwards and clears its group ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(<TimePicker ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('role', 'group');

    unmount();

    expect(ref.current).toBeNull();
  });

  it('keeps group disabled state while moving invalid state to its input widget', () => {
    const conflictingProps = {
      'aria-disabled': 'false',
      'aria-invalid': 'false',
      disabled: true,
      error: true,
      role: 'presentation',
    } as unknown as ComponentProps<typeof TimePicker>;
    render(<TimePicker {...conflictingProps} />);

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('disables clock controls through an ancestor fieldset', async () => {
    const { container } = render(
      <fieldset disabled>
        <TimePicker defaultValue="09:30" inputMode="clock" name="startsAt" />
      </fieldset>,
    );

    await waitFor(() =>
      expect(container.querySelector('.poffy-time-picker__root')).toHaveAttribute('aria-disabled'),
    );
    expect(screen.getAllByRole('button').every((button) => button.disabled)).toBe(true);
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toBeDisabled();
  });

  it('inherits FormControl state and IDREFs on the composite group', async () => {
    const { container } = render(
      <FormControl id="start-time" labelTarget="group" isInvalid isDisabled isReadOnly isRequired>
        <FormLabel>Start time</FormLabel>
        <TimePicker name="startsAt" aria-label="   " />
        <FormHelperText>Choose a local time.</FormHelperText>
        <FormErrorMessage>Time is required.</FormErrorMessage>
      </FormControl>,
    );

    const group = screen.getByRole('group', { name: 'Start time' });
    expect(screen.getByText('Start time').closest('label')).not.toHaveAttribute('for');
    expect(group).toHaveAttribute('id', 'start-time');
    expect(group).toHaveAttribute('aria-labelledby', 'start-time-label');
    await waitFor(() => {
      expect(group).toHaveAttribute('aria-describedby');
    });
    expect(group).toHaveAttribute('aria-disabled', 'true');
    const hour = screen.getByRole('spinbutton', { name: 'Hours' });
    expect(hour).toBeDisabled();
    expect(hour).toHaveAttribute('aria-invalid', 'true');
    expect(hour).toHaveAttribute('aria-errormessage');
    expect(hour).toHaveAttribute('aria-required', 'true');
    const validationProxy = container.querySelector('input[required]');
    expect(validationProxy).toBeDisabled();
    expect(validationProxy).toHaveAttribute('aria-hidden', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('prefers a trimmed explicit aria-labelledby over aria-label', () => {
    render(
      <>
        <span id="time-name">Office hours</span>
        <TimePicker aria-label="Ignored time" aria-labelledby="  time-name  " />
      </>,
    );

    const group = screen.getByRole('group', { name: 'Office hours' });
    expect(group).toHaveAttribute('aria-labelledby', 'time-name');
    expect(group).not.toHaveAttribute('aria-label');
  });

  it('keeps the validation proxy out of the accessibility tree', () => {
    const { container } = render(<TimePicker required />);

    const validationProxy = container.querySelector('[data-time-picker-validation-proxy]');
    expect(validationProxy).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('textbox', { name: 'Time' })).not.toBeInTheDocument();
  });

  it.each([
    ['segments', () => screen.getByRole('spinbutton', { name: 'Hours' })],
    ['clock', () => document.querySelector<HTMLElement>('[data-time-clock-control="hour"]')!],
  ] as const)('focuses the first %s control when its FormLabel is clicked', (inputMode, target) => {
    render(
      <FormControl id="start-time" labelTarget="group">
        <FormLabel>Start time</FormLabel>
        <TimePicker inputMode={inputMode} />
      </FormControl>,
    );

    fireEvent.click(screen.getByText('Start time'));

    expect(target()).toHaveFocus();
  });

  it('focuses a composite time control from an iframe FormLabel', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');
    const host = frameDocument.createElement('div');
    frameDocument.body.append(host);

    const { container, unmount } = render(
      <FormControl id="start-time" labelTarget="group">
        <FormLabel>Start time</FormLabel>
        <TimePicker />
      </FormControl>,
      { baseElement: frameDocument.body, container: host },
    );
    const label = container.querySelector('label');
    const hour = container.querySelector<HTMLInputElement>('input[aria-label="Hours"]');
    if (!label || !hour) throw new Error('The test did not render time controls.');

    fireEvent.click(label);
    expect(hour).toHaveFocus();

    unmount();
    frame.remove();
  });

  it('returns required validation focus to the first interactive control', async () => {
    const { container } = render(
      <form>
        <TimePicker required aria-label="Start time" />
      </form>,
    );

    expect(container.querySelector('form')?.reportValidity()).toBe(false);

    await waitFor(() => {
      expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveFocus();
    });
  });

  it.each([
    ['clock', () => screen.getByRole('radio', { name: '00' })],
    ['wheel', () => screen.getByRole('listbox', { name: 'Hours' })],
  ] as const)(
    'returns required validation focus to the active %s widget',
    async (inputMode, target) => {
      const { container } = render(
        <form>
          <TimePicker required inputMode={inputMode} aria-label="Start time" />
        </form>,
      );

      expect(container.querySelector('form')?.reportValidity()).toBe(false);

      await waitFor(() => expect(target()).toHaveFocus());
    },
  );

  it('uses only the outer validation proxy for a required wheel input', async () => {
    const { container } = render(
      <form>
        <TimePicker required inputMode="wheel" aria-label="Start time" />
      </form>,
    );

    expect(container.querySelectorAll('[data-time-picker-validation-proxy]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-wheel-picker-validation-proxy]')).toHaveLength(0);
    expect(screen.getAllByRole('listbox')).toHaveLength(2);
    for (const listbox of screen.getAllByRole('listbox')) {
      expect(listbox).toHaveAttribute('aria-required', 'true');
    }
    expect(container.querySelector('form')?.reportValidity()).toBe(false);

    await waitFor(() => expect(screen.getByRole('listbox', { name: 'Hours' })).toHaveFocus());
  });

  it('exposes time constraint props from the public type surface', () => {
    expectTypeOf<InputsTimePickerProps>().toEqualTypeOf<TimePickerProps>();
    expectTypeOf<TimePickerProps>().toMatchTypeOf<{
      minTime?: string | TimeParts;
      maxTime?: string | TimeParts;
      isTimeDisabled?: (parts: TimeParts) => boolean;
    }>();
  });

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

  it('normalizes invalid step values before segment changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker defaultValue="09:30" minuteStep={Number.POSITIVE_INFINITY} onChange={onChange} />,
    );

    const minuteSegment = screen.getByRole('spinbutton', { name: 'Minutes' }).closest('div');
    await user.click(
      within(minuteSegment as HTMLElement).getByRole('button', { name: 'Increment' }),
    );

    expect(onChange).toHaveBeenLastCalledWith('09:31');
  });

  it('prevents segment changes outside time constraints', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker value="08:30" minTime="09:00" onChange={onChange} />);

    const minuteSegment = screen.getByRole('spinbutton', { name: 'Minutes' }).closest('div');

    const increment = within(minuteSegment as HTMLElement).getByRole('button', {
      name: 'Increment',
    });
    await user.click(increment);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(8);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(30);
    expect(
      within(screen.getByRole('spinbutton', { name: 'Minutes' }).closest('div')!).getByRole(
        'button',
        { name: 'Increment' },
      ),
    ).toHaveFocus();
  });

  it('prevents segment changes disabled by a predicate', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker
        defaultValue="09:30"
        isTimeDisabled={(parts) => parts.hour === 9 && parts.minute === 31}
        onChange={onChange}
      />,
    );

    const minuteSegment = screen.getByRole('spinbutton', { name: 'Minutes' }).closest('div');

    await user.click(
      within(minuteSegment as HTMLElement).getByRole('button', { name: 'Increment' }),
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(30);
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

  it('retains the latest controlled value and form value when becoming uncontrolled', () => {
    const { container, rerender } = render(<TimePicker value="09:30" name="startsAt" />);

    rerender(<TimePicker value="14:45" name="startsAt" />);
    rerender(<TimePicker name="startsAt" />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(14);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(45);
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue('14:45');
  });

  it('restores the latest uncontrolled default value when its form resets', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <form>
        <TimePicker defaultValue="09:30" name="startsAt" aria-label="Start time" />
      </form>,
    );
    const hourSegment = screen.getByRole('spinbutton', { name: 'Hours' }).closest('div');
    await user.click(within(hourSegment as HTMLElement).getByRole('button', { name: 'Increment' }));

    rerender(
      <form>
        <TimePicker defaultValue="11:00" name="startsAt" aria-label="Start time" />
      </form>,
    );
    (container.querySelector('form') as HTMLFormElement).reset();

    await waitFor(() =>
      expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue('11:00'),
    );
    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(11);
  });

  it('does not reclaim ShadowRoot focus moved outside during a clock reset', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    const external = document.createElement('button');
    external.textContent = 'External action';
    shadowRoot.append(container, external);
    document.body.append(host);
    const { unmount } = render(
      <form>
        <TimePicker defaultValue="09:30" format="12h" inputMode="clock" aria-label="Start time" />
      </form>,
      { container },
    );
    const queries = within(container);
    fireEvent.click(queries.getByRole('button', { name: 'Minutes 30' }));
    queries.getByRole('radio', { name: 'Minutes 30' }).focus();
    const form = container.querySelector('form') as HTMLFormElement;
    form.addEventListener('reset', () => queueMicrotask(() => external.focus()), { once: true });

    await act(async () => {
      form.reset();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(shadowRoot.activeElement).toBe(external);
    unmount();
    host.remove();
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

  it('applies second-level constraints when seconds are enabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker defaultValue="09:30:00" maxTime="09:30:00" withSeconds onChange={onChange} />,
    );

    const secondSegment = screen.getByRole('spinbutton', { name: 'Seconds' }).closest('div');

    await user.click(
      within(secondSegment as HTMLElement).getByRole('button', { name: 'Increment' }),
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('spinbutton', { name: 'Seconds' })).toHaveValue(0);
  });

  it('ignores hidden seconds when seconds are disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker defaultValue="09:30:30" maxTime="09:31" onChange={onChange} />);

    const minuteSegment = screen.getByRole('spinbutton', { name: 'Minutes' }).closest('div');

    await user.click(
      within(minuteSegment as HTMLElement).getByRole('button', { name: 'Increment' }),
    );

    expect(onChange).toHaveBeenLastCalledWith('09:31');
  });

  it('restores rejected segment stepper focus within an iframe document', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');
    const host = frameDocument.createElement('div');
    frameDocument.body.append(host);
    const { unmount } = render(<TimePicker defaultValue="09:30" maxTime="09:30" />, {
      baseElement: frameDocument.body,
      container: host,
    });
    const queries = within(host);
    const minuteSegment = queries.getByRole('spinbutton', { name: 'Minutes' }).closest('div');
    if (!minuteSegment) throw new Error('The test did not render a minute segment.');
    const increment = within(minuteSegment).getByRole('button', { name: 'Increment' });

    increment.focus();
    fireEvent.click(increment);

    const replacementMinuteSegment = queries
      .getByRole('spinbutton', { name: 'Minutes' })
      .closest('div');
    if (!replacementMinuteSegment) throw new Error('The test did not rerender a minute segment.');
    expect(
      within(replacementMinuteSegment).getByRole('button', { name: 'Increment' }),
    ).toHaveFocus();
    unmount();
    frame.remove();
  });

  it('restores rejected segment stepper focus within a ShadowRoot', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.append(container);
    document.body.append(host);
    const { unmount } = render(<TimePicker defaultValue="09:30" maxTime="09:30" />, {
      container,
    });
    const queries = within(container);
    const minuteSegment = queries.getByRole('spinbutton', { name: 'Minutes' }).closest('div');
    if (!minuteSegment) throw new Error('The test did not render a minute segment.');
    const increment = within(minuteSegment).getByRole('button', { name: 'Increment' });

    increment.focus();
    fireEvent.click(increment);

    const replacementSegment = queries.getByRole('spinbutton', { name: 'Minutes' }).closest('div');
    if (!replacementSegment) throw new Error('The test did not rerender a minute segment.');
    const replacementIncrement = within(replacementSegment).getByRole('button', {
      name: 'Increment',
    });
    expect(shadowRoot.activeElement).toBe(replacementIncrement);
    unmount();
    host.remove();
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

    await user.click(screen.getByRole('radio', { name: '10' }));
    expect(onChange).toHaveBeenLastCalledWith('10:30');

    await user.click(screen.getByRole('radio', { name: 'Minutes 35' }));
    expect(onChange).toHaveBeenLastCalledWith('10:35');
  });

  it('prevents clock changes outside time constraints', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker inputMode="clock" defaultValue="09:30" maxTime="09:30" onChange={onChange} />,
    );

    await user.click(screen.getByRole('radio', { name: '10' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: '09' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '10' })).toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'Minutes 35' })).not.toBeInTheDocument();
  });

  it('restores focus after a rejected clock meridiem change', async () => {
    const user = userEvent.setup();

    render(<TimePicker inputMode="clock" defaultValue="09:30" format="12h" maxTime="09:30" />);

    await user.click(screen.getByRole('button', { name: 'PM' }));

    expect(screen.getByRole('button', { name: 'PM' })).toHaveFocus();
  });

  it('uses a true 24-hour clock face in 24-hour value mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker inputMode="clock" defaultValue="14:30" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Hours 14' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('radio', { name: '14' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.queryByRole('button', { name: 'PM' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '23' }));
    expect(onChange).toHaveBeenLastCalledWith('23:30');
  });

  it('restores the attempted clock option focus after an arrow change is rejected', async () => {
    const user = userEvent.setup();
    render(<TimePicker inputMode="clock" defaultValue="09:30" maxTime="09:30" />);

    const selected = screen.getByRole('radio', { name: '09' });
    selected.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: '09' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '10' })).toHaveFocus();
  });

  it('restores rejected clock option focus within an iframe document', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');
    const host = frameDocument.createElement('div');
    frameDocument.body.append(host);
    const { unmount } = render(
      <TimePicker inputMode="clock" defaultValue="09:30" maxTime="09:30" />,
      { baseElement: frameDocument.body, container: host },
    );
    const queries = within(host);
    const selected = queries.getByRole('radio', { name: '09' });

    selected.focus();
    fireEvent.keyDown(selected, { key: 'ArrowRight' });

    expect(queries.getByRole('radio', { name: '10' })).toHaveFocus();
    unmount();
    frame.remove();
  });

  it('restores rejected clock option focus within a ShadowRoot', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.append(container);
    document.body.append(host);
    const { unmount } = render(
      <TimePicker inputMode="clock" defaultValue="09:30" maxTime="09:30" />,
      { container },
    );
    const queries = within(container);
    const selected = queries.getByRole('radio', { name: '09' });

    selected.focus();
    fireEvent.keyDown(selected, { key: 'ArrowRight' });

    expect(shadowRoot.activeElement).toBe(queries.getByRole('radio', { name: '10' }));
    unmount();
    host.remove();
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

  it('prevents wheel changes outside time constraints', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <TimePicker inputMode="wheel" defaultValue="09:30" maxTime="09:30" onChange={onChange} />,
    );

    await user.click(
      within(screen.getByRole('listbox', { name: 'Hours' })).getByRole('option', { name: '10' }),
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(
      within(screen.getByRole('listbox', { name: 'Hours' })).getByRole('option', { name: '09' }),
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('restores focus after a rejected keyboard wheel change', async () => {
    const user = userEvent.setup();

    render(<TimePicker inputMode="wheel" defaultValue="09:30" maxTime="09:30" />);

    const hours = screen.getByRole('listbox', { name: 'Hours' });
    hours.focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox', { name: 'Hours' })).toHaveFocus();
  });

  it('restores rejected wheel focus within an iframe document', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');
    const host = frameDocument.createElement('div');
    frameDocument.body.append(host);
    const { unmount } = render(
      <TimePicker inputMode="wheel" defaultValue="09:30" maxTime="09:30" />,
      { baseElement: frameDocument.body, container: host },
    );
    const queries = within(host);
    const hours = queries.getByRole('listbox', { name: 'Hours' });

    hours.focus();
    fireEvent.keyDown(hours, { key: 'ArrowDown' });

    expect(queries.getByRole('listbox', { name: 'Hours' })).toHaveFocus();
    unmount();
    frame.remove();
  });

  it('restores rejected wheel focus within a ShadowRoot', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.append(container);
    document.body.append(host);
    const { unmount } = render(
      <TimePicker inputMode="wheel" defaultValue="09:30" maxTime="09:30" />,
      { container },
    );
    const hours = within(container).getByRole('listbox', { name: 'Hours' });

    hours.focus();
    fireEvent.keyDown(hours, { key: 'ArrowDown' });

    expect(shadowRoot.activeElement).toBe(
      within(container).getByRole('listbox', { name: 'Hours' }),
    );
    unmount();
    host.remove();
  });

  it('keeps controlled out-of-range values while rejecting unavailable actions', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimePicker value="22:45" maxTime="21:00" onChange={onChange} />);

    expect(screen.getByRole('spinbutton', { name: 'Hours' })).toHaveValue(22);
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(45);

    const minuteSegment = screen.getByRole('spinbutton', { name: 'Minutes' }).closest('div');

    await user.click(
      within(minuteSegment as HTMLElement).getByRole('button', { name: 'Decrement' }),
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('spinbutton', { name: 'Minutes' })).toHaveValue(45);
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
