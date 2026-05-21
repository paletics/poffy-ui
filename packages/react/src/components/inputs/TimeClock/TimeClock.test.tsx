import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TimeClock } from './TimeClock';

/**
 * ### Test Strategy: TimeClock
 * - **Focus**: Clock-face time selection, controlled form value output, 12-hour meridiem changes,
 *   and baseline accessibility.
 * - **DON'T**: Do not assert geometric placement or visual styling; Playwright covers visual review.
 */
describe('TimeClock', () => {
  it('renders the provided default value and hidden input', () => {
    const { container } = render(<TimeClock name="startsAt" defaultValue="09:30" />);

    expect(screen.getByRole('button', { name: '09' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '30' })).toHaveTextContent('30');
    expect(container.querySelector('input[type="hidden"][name="startsAt"]')).toHaveValue('09:30');
  });

  it('selects an hour and then advances to minute selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Hours 10' }));

    expect(onChange).toHaveBeenLastCalledWith('10:30');
    expect(screen.getByRole('group', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('uses a 12-hour clock face with meridiem controls by default', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="14:30" onChange={onChange} />);

    expect(screen.getByRole('button', { name: '02' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Hours 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'PM' })).toHaveAttribute('data-selected');
    expect(screen.queryByRole('button', { name: 'Hours 23' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hours 3' }));

    expect(onChange).toHaveBeenLastCalledWith('15:30');
  });

  it('advances to minute selection when selecting an hour from a labeled hit area', () => {
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    const dial = screen.getByRole('group', { name: 'Hours' });
    mockClockDialRect(dial);
    const hour10 = screen.getByRole('button', { name: 'Hours 10' });

    fireEvent.pointerDown(hour10, getPointOnHourFace(10));
    fireEvent.click(hour10);

    expect(onChange).toHaveBeenLastCalledWith('10:30');
    expect(screen.getByRole('group', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('supports a 12-hour clock face when requested', () => {
    render(<TimeClock defaultValue="14:30" format="12h" />);

    expect(screen.getByRole('button', { name: '02' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'PM' })).toHaveAttribute('data-selected');
    expect(screen.getByRole('button', { name: 'Hours 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: 'Hours 23' })).not.toBeInTheDocument();
  });

  it('selects minute values using the configured step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" minuteStep={15} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '30' }));
    await user.click(screen.getByRole('button', { name: 'Minutes 45' }));

    expect(onChange).toHaveBeenLastCalledWith('09:45');
  });

  it('selects intermediate minute values when configured', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" minuteStep={1} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '30' }));
    await user.click(screen.getByRole('button', { name: 'Minutes 31' }));

    expect(onChange).toHaveBeenLastCalledWith('09:31');
  });

  it('selects intermediate minute values from the dial without rendering every label', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '30' }));

    expect(screen.queryByRole('button', { name: 'Minutes 31' })).not.toBeInTheDocument();

    const dial = screen.getByRole('group', { name: 'Minutes' });
    mockClockDialRect(dial);

    fireEvent.pointerDown(dial, getPointOnClockFace(31));

    expect(onChange).toHaveBeenLastCalledWith('09:31');
  });

  it('selects intermediate minute values from labeled hit areas by angle', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '30' }));

    const dial = screen.getByRole('group', { name: 'Minutes' });
    mockClockDialRect(dial);

    const minute45 = screen.getByRole('button', { name: 'Minutes 45' });

    fireEvent.pointerDown(minute45, getPointOnClockFace(44));
    fireEvent.click(minute45);

    expect(onChange).toHaveBeenLastCalledWith('09:44');
  });

  it('updates intermediate minute values while dragging on the dial', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '30' }));

    const dial = screen.getByRole('group', { name: 'Minutes' });
    mockClockDialRect(dial);
    Object.assign(dial, {
      setPointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => true),
      releasePointerCapture: vi.fn(),
    });

    fireEvent.pointerDown(dial, { ...getPointOnClockFace(31), pointerId: 1 });
    fireEvent.pointerMove(dial, { ...getPointOnClockFace(44), pointerId: 1 });
    fireEvent.pointerUp(dial, { ...getPointOnClockFace(44), pointerId: 1 });

    expect(onChange).toHaveBeenLastCalledWith('09:44');
  });

  it('keeps minute dragging on the minute unit when seconds are enabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock defaultValue="09:30:15" withSeconds onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '30' }));

    const dial = screen.getByRole('group', { name: 'Minutes' });
    mockClockDialRect(dial);
    Object.assign(dial, {
      setPointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => true),
      releasePointerCapture: vi.fn(),
    });

    fireEvent.pointerDown(dial, { ...getPointOnClockFace(31), pointerId: 1 });
    fireEvent.pointerMove(dial, { ...getPointOnClockFace(44), pointerId: 1 });
    fireEvent.pointerUp(dial, { ...getPointOnClockFace(44), pointerId: 1 });

    expect(onChange).toHaveBeenLastCalledWith('09:44:15');
    expect(screen.getByRole('group', { name: 'Minutes' })).toBeInTheDocument();
  });

  it('supports 12-hour meridiem switching', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimeClock value="14:30" format="12h" onChange={onChange} />);

    expect(screen.getByRole('button', { name: '02' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'AM' }));
    expect(onChange).toHaveBeenLastCalledWith('02:30');
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
