import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';
import { axe } from 'vitest-axe';
import { TimeClock } from './TimeClock';
import { FormControl, FormErrorMessage, FormLabel } from '../FormControl';

/**
 * ### Test Strategy: TimeClock
 * - **Focus**: Clock-face time selection, controlled form value output, 12-hour meridiem changes,
 *   and baseline accessibility.
 * - **DON'T**: Do not assert geometric placement or visual styling; Playwright covers visual review.
 */
describe('TimeClock', () => {
  it('consumes legacy group required and readonly ARIA overrides', () => {
    render(
      <TimeClock
        {...({
          'aria-label': 'Legacy clock',
          'aria-readonly': true,
          'aria-required': true,
        } as never)}
      />,
    );

    const group = screen.getByRole('group', { name: 'Legacy clock' });
    expect(group).not.toHaveAttribute('aria-readonly');
    expect(group).not.toHaveAttribute('aria-required');
  });
  it('keeps disabled semantics owned by the clock', () => {
    const conflictingProps = {
      'aria-disabled': 'false',
      disabled: true,
      role: 'presentation',
    } as unknown as ComponentProps<typeof TimeClock>;
    render(<TimeClock {...conflictingProps} />);

    expect(screen.getAllByRole('group')[0]).toHaveAttribute('aria-disabled', 'true');
  });

  it('inherits FormControl state and validates a required time through a native proxy', async () => {
    const { container } = render(
      <form>
        <FormControl isRequired isInvalid>
          <FormLabel>Start time</FormLabel>
          <TimeClock value={null} />
          <FormErrorMessage>Start time is required.</FormErrorMessage>
        </FormControl>
      </form>,
    );

    const clock = container.querySelector<HTMLElement>('.poffy-time-clock__root');
    const proxy = container.querySelector<HTMLInputElement>('[data-time-clock-validation-proxy]');
    expect(clock).toHaveAttribute('aria-describedby');
    expect(proxy).toBeRequired();
    expect(proxy).toHaveAttribute('aria-hidden', 'true');
    expect(proxy).not.toHaveAttribute('aria-invalid');
    expect(proxy).not.toHaveAttribute('aria-errormessage');
    expect(screen.getByRole('radiogroup', { name: 'Hours' })).toHaveAttribute(
      'aria-required',
      'true',
    );
    expect(screen.getByRole('radiogroup', { name: 'Hours' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(container.querySelector('form')?.reportValidity()).toBe(false);

    await Promise.resolve();
    expect(screen.getByRole('radio', { name: '00' })).toHaveFocus();
  });

  it('removes required validation when disabled through FormControl', () => {
    const { container } = render(
      <FormControl isDisabled isRequired>
        <FormLabel>Start time</FormLabel>
        <TimeClock value={null} />
      </FormControl>,
    );

    expect(container.querySelector('[data-time-clock-validation-proxy]')).toBeDisabled();
    expect(screen.getAllByRole('button').every((button) => button.disabled)).toBe(true);
  });

  it('renders the provided default value and hidden input', () => {
    const { container } = render(<TimeClock name="startsAt" defaultValue="09:30" format="12h" />);

    expect(screen.getByRole('button', { name: 'Hours 09' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Minutes 30' })).toHaveTextContent('30');
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue('09:30');
  });

  it('uses localized meridiem content as the visible accessible button names', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TimeClock
        defaultValue="09:30"
        format="12h"
        messages={{
          am: 'AnteMeridiemLocalization',
          pm: 'PostMeridiemLocalization',
          meridiem: 'Localized meridiem',
        }}
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('group', { name: 'Localized meridiem' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'PostMeridiemLocalization' }));
    expect(onChange).toHaveBeenLastCalledWith('21:30');
  });

  it('restores an uncontrolled value when its containing form resets', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <TimeClock name="startsAt" defaultValue="09:30" format="12h" />
      </form>,
    );

    await user.click(screen.getByRole('radio', { name: 'Hours 10' }));
    expect(container.querySelector('input[name="startsAt"]')).toHaveValue('10:30');

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(container.querySelector('input[name="startsAt"]')).toHaveValue('09:30');
    expect(screen.getByRole('button', { name: 'Hours 09' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('restores dial focus to the reset hour selection', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <TimeClock defaultValue="09:30" format="12h" />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));
    const minute = screen.getByRole('radio', { name: 'Minutes 30' });
    minute.focus();

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(screen.getByRole('radio', { name: 'Hours 9' })).toHaveFocus();
  });

  it('restores ShadowRoot focus to the reset hour selection', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    shadowRoot.append(container);
    document.body.append(host);
    const { unmount } = render(
      <form>
        <TimeClock defaultValue="09:30" format="12h" />
      </form>,
      { container },
    );
    const queries = within(container);
    fireEvent.click(queries.getByRole('button', { name: 'Minutes 30' }));
    const minute = queries.getByRole('radio', { name: 'Minutes 30' });
    minute.focus();

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(shadowRoot.activeElement).toBe(queries.getByRole('radio', { name: 'Hours 9' }));
    unmount();
    host.remove();
  });

  it('does not reclaim ShadowRoot focus moved outside during reset', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const container = document.createElement('div');
    const external = document.createElement('button');
    external.textContent = 'External action';
    shadowRoot.append(container, external);
    document.body.append(host);
    const { unmount } = render(
      <form>
        <TimeClock defaultValue="09:30" format="12h" />
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

  it('restores an uncontrolled value through an externally associated form', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <form id="clock-form" />
        <TimeClock name="startsAt" form="clock-form" defaultValue="09:30" format="12h" />
      </>,
    );

    await user.click(screen.getByRole('radio', { name: 'Hours 10' }));
    const form = container.querySelector('form') as HTMLFormElement;
    expect(new FormData(form).get('startsAt')).toBe('10:30');

    await act(async () => {
      form.reset();
      await Promise.resolve();
    });

    expect(new FormData(form).get('startsAt')).toBe('09:30');
  });

  it('retains the latest controlled value and submits an empty value for null', () => {
    const { container, rerender } = render(
      <TimeClock value="09:30" name="startsAt" format="12h" />,
    );

    rerender(<TimeClock value="14:45" name="startsAt" format="12h" />);
    rerender(<TimeClock name="startsAt" form="booking" format="12h" />);

    expect(screen.getByRole('button', { name: 'Hours 02' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue('14:45');
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveAttribute(
      'form',
      'booking',
    );

    rerender(<TimeClock value={null} name="startsAt" format="12h" />);
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue('');
  });

  it('selects an hour and then advances to minute selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" format="12h" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Hours 10' }));

    expect(onChange).toHaveBeenLastCalledWith('10:30');
    expect(screen.getByRole('radiogroup', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('does not emit when selecting the current semantic value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TimeClock value="09:30" format="12h" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Hours 09' }));
    await user.click(screen.getByRole('radio', { name: 'Hours 9' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves keyboard focus to the newly active dial unit', async () => {
    const user = userEvent.setup();

    render(<TimeClock defaultValue="09:30" format="12h" />);

    const hour = screen.getByRole('radio', { name: 'Hours 10' });
    hour.focus();
    await user.keyboard('{Enter}');

    expect(
      screen.getByRole('radiogroup', { name: 'Minutes' }).querySelector('[data-selected]'),
    ).toHaveFocus();
  });

  it('keeps direct clock steps usable for invalid runtime values', async () => {
    const user = userEvent.setup();

    render(<TimeClock defaultValue="09:30" format="12h" minuteStep={Number.POSITIVE_INFINITY} />);

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));
    expect(screen.getByRole('radio', { name: 'Minutes 31' })).toBeInTheDocument();
  });

  it('keeps a stepped clock value represented on the dial', () => {
    render(<TimeClock defaultValue="09:30" format="12h" hourStep={2} />);

    expect(screen.getByRole('radio', { name: 'Hours 9' })).toHaveAttribute('aria-checked', 'true');
  });

  it('keeps readOnly clock controls focusable without allowing changes', async () => {
    const user = userEvent.setup();

    render(<TimeClock defaultValue="09:30" format="12h" readOnly />);

    expect(screen.getByRole('button', { name: 'Hours 09' })).not.toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Hours 9' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Hours 09' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Hours 9' })).not.toHaveAttribute('aria-disabled');
    expect(screen.getAllByRole('group')[0]).toHaveAttribute('data-readonly');

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));
    expect(screen.getByRole('radiogroup', { name: 'Hours' })).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup', { name: 'Minutes' })).not.toBeInTheDocument();
  });

  it('has no obvious accessibility violations when readOnly', async () => {
    const { container } = render(<TimeClock defaultValue="08:15" format="12h" readOnly />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses a two-ring 24-hour clock face by default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="14:30" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Hours 14' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('radio', { name: '14' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '14' })).toHaveAttribute('data-ring', 'inner');
    expect(screen.getByRole('radio', { name: '12' })).toHaveAttribute('data-ring', 'outer');
    expect(screen.getByRole('radio', { name: '00' })).toHaveAttribute('data-ring', 'inner');
    expect(screen.queryByRole('group', { name: 'AM/PM' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: '15' }));

    expect(onChange).toHaveBeenLastCalledWith('15:30');
  });

  it('advances to minute selection when selecting an hour from a labeled hit area', () => {
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" format="12h" onChange={onChange} />);

    const dial = screen.getByRole('radiogroup', { name: 'Hours' });
    mockClockDialRect(dial);
    const hour10 = screen.getByRole('radio', { name: 'Hours 10' });

    fireEvent.pointerDown(hour10, { ...getPointOnHourFace(10), isPrimary: true });
    fireEvent.pointerUp(dial, getPointOnHourFace(10));
    fireEvent.click(hour10);

    expect(onChange).toHaveBeenLastCalledWith('10:30');
    expect(screen.getByRole('radiogroup', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('supports a 12-hour clock face when requested', () => {
    render(<TimeClock defaultValue="14:30" format="12h" />);

    expect(screen.getByRole('button', { name: 'Hours 02' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'PM' })).toHaveAttribute('data-selected');
    expect(screen.getByRole('radio', { name: 'Hours 2' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.queryByRole('radio', { name: 'Hours 23' })).not.toBeInTheDocument();
  });

  it('selects minute values using the configured step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" minuteStep={15} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));
    await user.click(screen.getByRole('radio', { name: 'Minutes 45' }));

    expect(onChange).toHaveBeenLastCalledWith('09:45');
  });

  it('selects intermediate minute values when configured', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" minuteStep={1} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));
    await user.click(screen.getByRole('radio', { name: 'Minutes 31' }));

    expect(onChange).toHaveBeenLastCalledWith('09:31');
  });

  it('selects intermediate minute values from the dial without rendering every label', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));

    expect(screen.queryByRole('radio', { name: 'Minutes 31' })).not.toBeInTheDocument();

    const dial = screen.getByRole('radiogroup', { name: 'Minutes' });
    mockClockDialRect(dial);

    fireEvent.pointerDown(dial, { ...getPointOnClockFace(31), isPrimary: true });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.pointerUp(dial, getPointOnClockFace(31));

    expect(onChange).toHaveBeenLastCalledWith('09:31');
  });

  it('ignores non-primary pointer presses and unmeasurable dials', () => {
    const onChange = vi.fn();
    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    const dial = screen.getByRole('radiogroup', { name: 'Hours' });
    mockClockDialRect(dial);
    const point = getPointOn24HourFace(13, 'inner');

    fireEvent.pointerDown(dial, { ...point, button: 2, pointerId: 1 });
    fireEvent.pointerUp(dial, { ...point, button: 2, pointerId: 1 });
    expect(onChange).not.toHaveBeenCalled();

    vi.spyOn(dial, 'getBoundingClientRect').mockReturnValue({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.pointerDown(dial, { ...point, isPrimary: true, pointerId: 2 });
    fireEvent.pointerUp(dial, { ...point, pointerId: 2 });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('selects intermediate minute values from labeled hit areas by angle', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));

    const dial = screen.getByRole('radiogroup', { name: 'Minutes' });
    mockClockDialRect(dial);

    const minute45 = screen.getByRole('radio', { name: 'Minutes 45' });

    fireEvent.pointerDown(minute45, { ...getPointOnClockFace(44), isPrimary: true });
    fireEvent.pointerUp(dial, getPointOnClockFace(44));
    fireEvent.click(minute45);

    expect(onChange).toHaveBeenLastCalledWith('09:44');
  });

  it('updates intermediate minute values while dragging on the dial', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));

    const dial = screen.getByRole('radiogroup', { name: 'Minutes' });
    mockClockDialRect(dial);
    Object.assign(dial, {
      setPointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => true),
      releasePointerCapture: vi.fn(),
    });

    fireEvent.pointerDown(dial, { ...getPointOnClockFace(31), isPrimary: true, pointerId: 1 });
    fireEvent.pointerMove(dial, { ...getPointOnClockFace(44), pointerId: 1 });
    fireEvent.pointerUp(dial, { ...getPointOnClockFace(44), pointerId: 1 });

    expect(onChange).toHaveBeenLastCalledWith('09:44');
  });

  it('keeps minute dragging on the minute unit when seconds are enabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30:15" withSeconds onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Minutes 30' }));

    const dial = screen.getByRole('radiogroup', { name: 'Minutes' });
    mockClockDialRect(dial);
    Object.assign(dial, {
      setPointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => true),
      releasePointerCapture: vi.fn(),
    });

    fireEvent.pointerDown(dial, { ...getPointOnClockFace(31), isPrimary: true, pointerId: 1 });
    fireEvent.pointerMove(dial, { ...getPointOnClockFace(44), pointerId: 1 });
    fireEvent.pointerUp(dial, { ...getPointOnClockFace(44), pointerId: 1 });

    expect(onChange).toHaveBeenLastCalledWith('09:44:15');
    expect(screen.getByRole('radiogroup', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('returns to the minute dial when seconds are removed dynamically', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TimeClock defaultValue="09:30:15" withSeconds />);

    await user.click(screen.getByRole('button', { name: 'Seconds 15' }));
    expect(screen.getByRole('radiogroup', { name: 'Seconds' })).toBeInTheDocument();

    rerender(<TimeClock defaultValue="09:30:15" withSeconds={false} />);

    expect(screen.queryByRole('radiogroup', { name: 'Seconds' })).not.toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('restores dial focus when the focused seconds control is removed', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TimeClock defaultValue="09:30:15" withSeconds />);

    await user.click(screen.getByRole('button', { name: 'Seconds 15' }));
    expect(screen.getByRole('button', { name: 'Seconds 15' })).toHaveFocus();

    rerender(<TimeClock defaultValue="09:30:15" withSeconds={false} />);

    await waitFor(() => expect(screen.getByRole('radio', { name: 'Minutes 30' })).toHaveFocus());
  });

  it('restores dial focus when an automatically opened seconds dial is removed', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<TimeClock defaultValue="09:30:15" withSeconds />);

    await user.click(screen.getByRole('radio', { name: '09' }));
    await user.click(screen.getByRole('radio', { name: 'Minutes 30' }));
    expect(screen.getByRole('radio', { name: 'Seconds 15' })).toHaveFocus();

    rerender(<TimeClock defaultValue="09:30:15" withSeconds={false} />);

    await waitFor(() => expect(screen.getByRole('radio', { name: 'Minutes 30' })).toHaveFocus());
  });

  it('supports 12-hour meridiem switching', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock value="14:30" format="12h" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Hours 02' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'AM' }));
    expect(onChange).toHaveBeenLastCalledWith('02:30');
  });

  it('commits 24-hour radio navigation without advancing until activation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="23:30" onChange={onChange} />);

    const hour23 = screen.getByRole('radio', { name: '23' });
    hour23.focus();
    await user.keyboard('{ArrowRight}');

    expect(onChange).toHaveBeenLastCalledWith('00:30');
    expect(screen.getByRole('radio', { name: '00' })).toHaveFocus();
    expect(screen.getByRole('radiogroup', { name: 'Hours' })).toBeInTheDocument();

    await user.keyboard(' ');
    expect(screen.getByRole('radiogroup', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('previews pointer movement without changing aria selection and cancels cleanly', () => {
    const onChange = vi.fn();
    render(<TimeClock defaultValue="14:30" onChange={onChange} />);

    const dial = screen.getByRole('radiogroup', { name: 'Hours' });
    mockClockDialRect(dial);
    const point = getPointOn24HourFace(13, 'inner');

    fireEvent.pointerDown(dial, { ...point, isPrimary: true, pointerId: 7 });
    expect(screen.getByRole('radio', { name: '13' })).toHaveAttribute('data-preview');
    expect(screen.getByRole('radio', { name: '14' })).toHaveAttribute('aria-checked', 'true');
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.pointerCancel(dial, { ...point, pointerId: 7 });
    expect(screen.getByRole('radio', { name: '13' })).not.toHaveAttribute('data-preview');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('honors a consumer capture handler that already prevented pointer selection', () => {
    const onChange = vi.fn();
    render(
      <TimeClock
        defaultValue="14:30"
        onChange={onChange}
        onPointerDownCapture={(event) => event.preventDefault()}
      />,
    );
    const dial = screen.getByRole('radiogroup', { name: 'Hours' });
    mockClockDialRect(dial);
    const point = getPointOn24HourFace(13, 'inner');

    fireEvent.pointerDown(dial, { ...point, isPrimary: true, pointerId: 6 });
    fireEvent.pointerUp(dial, { ...point, pointerId: 6 });

    expect(screen.getByRole('radio', { name: '13' })).not.toHaveAttribute('data-preview');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('releases pointer capture and clears preview when disabled during a gesture', () => {
    const onChange = vi.fn();
    const { rerender } = render(<TimeClock defaultValue="14:30" onChange={onChange} />);
    const dial = screen.getByRole('radiogroup', { name: 'Hours' });
    const setPointerCapture = vi.fn();
    const releasePointerCapture = vi.fn();
    Object.assign(dial, {
      hasPointerCapture: () => true,
      releasePointerCapture,
      setPointerCapture,
    });
    mockClockDialRect(dial);
    const point = getPointOn24HourFace(13, 'inner');

    fireEvent.pointerDown(dial, { ...point, isPrimary: true, pointerId: 7 });
    expect(setPointerCapture).toHaveBeenCalledWith(7);
    expect(screen.getByRole('radio', { name: '13' })).toHaveAttribute('data-preview');

    rerender(<TimeClock defaultValue="14:30" disabled onChange={onChange} />);

    expect(releasePointerCapture).toHaveBeenCalledWith(7);
    expect(screen.getByRole('radio', { name: '13' })).not.toHaveAttribute('data-preview');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('cancels a pointer gesture immediately when an ancestor fieldset becomes disabled', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <fieldset>
        <TimeClock defaultValue="14:30" onChange={onChange} />
      </fieldset>,
    );
    const ancestor = container.querySelector('fieldset');
    const dial = screen.getByRole('radiogroup', { name: 'Hours' });
    if (!ancestor) throw new Error('Expected an ancestor fieldset');
    mockClockDialRect(dial);
    const point = getPointOn24HourFace(13, 'inner');

    fireEvent.pointerDown(dial, { ...point, isPrimary: true, pointerId: 8 });
    expect(screen.getByRole('radio', { name: '13' })).toHaveAttribute('data-preview');
    ancestor.disabled = true;
    fireEvent.pointerUp(dial, { ...point, pointerId: 8 });

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: '13' })).not.toHaveAttribute('data-preview');
    const clock = container.querySelector('.poffy-time-clock__root');
    await waitFor(() => expect(clock).toHaveAttribute('aria-disabled'));

    ancestor.disabled = false;
    await waitFor(() => expect(clock).not.toHaveAttribute('aria-disabled'));
    fireEvent.pointerDown(dial, { ...point, isPrimary: true, pointerId: 9 });
    fireEvent.pointerUp(dial, { ...point, pointerId: 9 });
    expect(onChange).toHaveBeenCalledWith('13:30');
  });

  it('keeps a step-external current 24-hour value represented', () => {
    render(<TimeClock defaultValue="13:30" hourStep={2} />);

    expect(screen.getByRole('radio', { name: '13' })).toHaveAttribute('aria-checked', 'true');
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(<TimeClock defaultValue="08:15" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

const mockClockDialRect = (dial: HTMLElement) => {
  vi.spyOn(dial, 'getBoundingClientRect').mockReturnValue({
    bottom: 200,
    height: 200,
    left: 0,
    right: 200,
    top: 0,
    width: 200,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
};

const getPointOnClockFace = (value: number) => {
  const angle = (value / 60) * Math.PI * 2;
  const radius = 90;

  return {
    clientX: 100 + Math.sin(angle) * radius,
    clientY: 100 - Math.cos(angle) * radius,
  };
};

const getPointOnHourFace = (hour: number) => {
  const angle = ((hour % 12) / 12) * Math.PI * 2;
  const radius = 90;

  return {
    clientX: 100 + Math.sin(angle) * radius,
    clientY: 100 - Math.cos(angle) * radius,
  };
};

const getPointOn24HourFace = (hour: number, ring: 'inner' | 'outer') => {
  const angle = ((hour % 12) / 12) * Math.PI * 2;
  const radius = ring === 'inner' ? 50 : 90;

  return {
    clientX: 100 + Math.sin(angle) * radius,
    clientY: 100 - Math.cos(angle) * radius,
  };
};
