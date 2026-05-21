import { describe, expect, it } from 'vitest';
import {
  applyTimeWheelValue,
  buildTimeWheelColumns,
  buildTimeWheelValue,
} from './TimePicker.wheel';

const labels = {
  hourLabel: 'Hours',
  meridiemLabel: 'AM/PM',
  minuteLabel: 'Minutes',
  secondLabel: 'Seconds',
};

describe('TimePicker wheel adapter', () => {
  it('builds 24-hour columns and preserves the current stepped value', () => {
    const columns = buildTimeWheelColumns({
      ...labels,
      displayHour: 9,
      format: '24h',
      hourStep: 2,
      minuteStep: 15,
      parts: { hour: 9, minute: 17, second: 0 },
      withSeconds: false,
    });

    expect(columns.map((column) => column.id)).toEqual(['hour', 'minute']);
    expect(columns[0]?.options.map((option) => option.value)).toContain('9');
    expect(columns[1]?.options.map((option) => option.value)).toContain('17');
  });

  it('adds seconds and meridiem columns for 12-hour values with seconds', () => {
    const columns = buildTimeWheelColumns({
      ...labels,
      displayHour: 2,
      format: '12h',
      hourStep: 1,
      parts: { hour: 14, minute: 30, second: 45 },
      secondStep: 10,
      withSeconds: true,
    });

    expect(columns.map((column) => column.id)).toEqual(['hour', 'minute', 'second', 'meridiem']);
    expect(columns[2]?.options.map((option) => option.value)).toContain('45');
    expect(columns[3]?.options).toEqual([
      { value: 'am', label: 'AM' },
      { value: 'pm', label: 'PM' },
    ]);
  });

  it('builds wheel values from normalized time parts', () => {
    expect(
      buildTimeWheelValue({
        displayHour: 12,
        format: '12h',
        parts: { hour: 0, minute: 5, second: 9 },
        withSeconds: true,
      }),
    ).toEqual({ hour: '12', minute: '5', second: '9', meridiem: 'am' });
  });

  it('applies 12-hour wheel changes back to normalized 24-hour parts', () => {
    expect(
      applyTimeWheelValue({
        displayHour: 2,
        format: '12h',
        parts: { hour: 14, minute: 30, second: 0 },
        value: { hour: '3', minute: '45', meridiem: 'am' },
      }),
    ).toEqual({ hour: 3, minute: 45, second: 0 });
  });

  it('keeps the current meridiem when the wheel value omits it', () => {
    expect(
      applyTimeWheelValue({
        displayHour: 2,
        format: '12h',
        parts: { hour: 14, minute: 30, second: 20 },
        value: { hour: '4', minute: '15' },
      }),
    ).toEqual({ hour: 16, minute: 15, second: 20 });
  });
});
