import { describe, expect, it } from 'vitest';
import * as rootExports from '..';
import * as calendarExports from '../calendar';
import * as dateExports from '.';
import {
  compareDateDay,
  formatDateFormValue,
  formatDateISO,
  isDateUnavailable,
  isSameDay,
  isValidDate,
  normalizeDateFormatOptions,
  parseDateISO,
} from './date';

describe('date constraints', () => {
  it('keeps canonical date utilities out of the calendar export surface', () => {
    expect(calendarExports).not.toHaveProperty('formatDateISO');
    expect(calendarExports).not.toHaveProperty('isSameDay');
  });

  it('exposes date utilities from the date and root public surfaces', () => {
    expect(dateExports).toHaveProperty('formatDateISO');
    expect(dateExports).toHaveProperty('isSameDay');
    expect(dateExports).toHaveProperty('compareDateDay');
    expect(dateExports).toHaveProperty('isDateUnavailable');
    expect(dateExports).toHaveProperty('isValidDate');
    expect(rootExports).toHaveProperty('formatDateISO');
    expect(rootExports).toHaveProperty('isSameDay');
    expect(rootExports).toHaveProperty('compareDateDay');
    expect(rootExports).toHaveProperty('isDateUnavailable');
    expect(rootExports).toHaveProperty('isValidDate');
  });

  it('keeps day normalization out of the public surface', () => {
    expect(dateExports).not.toHaveProperty('normalizeDateDay');
    expect(rootExports).not.toHaveProperty('normalizeDateDay');
  });

  it('formats a date in local YYYY-MM-DD form', () => {
    expect(formatDateISO(new Date(2026, 3, 5, 23, 30))).toBe('2026-04-05');
  });

  it('pads years below 1000 for native date and form values', () => {
    const date = new Date(0);
    date.setFullYear(5, 0, 2);

    expect(formatDateISO(date)).toBe('0005-01-02');
  });

  it('parses local ISO dates and rejects impossible dates', () => {
    expect(parseDateISO('2026-04-05')).toEqual(new Date(2026, 3, 5));
    expect(parseDateISO('2026-02-30')).toBeNull();
    expect(parseDateISO('2026-4-05')).toBeNull();
    expect(parseDateISO('2026-04-5')).toBeNull();
    expect(parseDateISO('2026-04-05-extra')).toBeNull();
    expect(parseDateISO('')).toBeNull();
  });

  it('normalizes date display options and strips time fields', () => {
    expect(normalizeDateFormatOptions(undefined, 'full')).toEqual({ dateStyle: 'full' });
    expect(
      normalizeDateFormatOptions({ year: 'numeric', month: 'short', hour: '2-digit' }),
    ).toEqual({
      day: undefined,
      era: undefined,
      month: 'short',
      weekday: undefined,
      year: 'numeric',
    });
  });

  it('serializes date form values through one policy helper', () => {
    const date = new Date(2026, 3, 5, 12, 30);
    expect(formatDateFormValue(date, 'iso-date')).toBe('2026-04-05');
    expect(formatDateFormValue(date, 'iso-datetime')).toBe(date.toISOString());
    expect(formatDateFormValue(date, (value) => String(value.getFullYear()))).toBe('2026');
  });

  it('recognizes valid Date instances across realms', () => {
    expect(isValidDate(new Date(2026, 3, 14))).toBe(true);
    expect(isValidDate(new Date(Number.NaN))).toBe(false);

    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ForeignDate = (iframe.contentWindow as (Window & typeof globalThis) | null)?.Date;
    if (!ForeignDate) throw new Error('Expected an iframe Date constructor');
    const foreignDate = new ForeignDate(2026, 3, 14);

    expect(foreignDate).not.toBeInstanceOf(Date);
    expect(isValidDate(foreignDate)).toBe(true);
    iframe.remove();
  });

  it('detects the same local calendar day', () => {
    expect(isSameDay(new Date(2026, 3, 14, 1), new Date(2026, 3, 14, 23))).toBe(true);
    expect(isSameDay(new Date(2026, 3, 14), new Date(2026, 3, 15))).toBe(false);
    expect(isSameDay(undefined, new Date(2026, 3, 14))).toBe(false);
    expect(isSameDay(new Date(2026, 3, 14), null)).toBe(false);
  });

  it('compares dates by local calendar day', () => {
    expect(compareDateDay(new Date(2026, 3, 14, 1), new Date(2026, 3, 14, 23))).toBe(0);
    expect(compareDateDay(new Date(2026, 3, 13), new Date(2026, 3, 14))).toBe(-1);
    expect(compareDateDay(new Date(2026, 3, 15), new Date(2026, 3, 14))).toBe(1);
    expect(compareDateDay(new Date(2025, 11, 31), new Date(2026, 0, 1))).toBe(-1);
  });

  it('treats missing dates as available', () => {
    expect(isDateUnavailable(null, { minDate: new Date(2026, 3, 14) })).toBe(false);
    expect(isDateUnavailable(undefined, { maxDate: new Date(2026, 3, 14) })).toBe(false);
  });

  it('applies inclusive min and max constraints by local calendar day', () => {
    const minDate = new Date(2026, 3, 14, 12, 30);
    const maxDate = new Date(2026, 3, 20, 12, 30);

    expect(isDateUnavailable(new Date(2026, 3, 13), { minDate, maxDate })).toBe(true);
    expect(isDateUnavailable(new Date(2026, 3, 14), { minDate, maxDate })).toBe(false);
    expect(isDateUnavailable(new Date(2026, 3, 20), { minDate, maxDate })).toBe(false);
    expect(isDateUnavailable(new Date(2026, 3, 21), { minDate, maxDate })).toBe(true);
  });

  it('applies custom disabled date predicates to normalized days', () => {
    const checkedDates: Date[] = [];
    const isDateDisabled = (date: Date) => {
      checkedDates.push(date);
      return date.getDay() === 2;
    };

    expect(isDateUnavailable(new Date(2026, 3, 14, 12, 30), { isDateDisabled })).toBe(true);
    expect(checkedDates[0]).toEqual(new Date(2026, 3, 14));
  });
});
