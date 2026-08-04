import type { DatePickerMessages } from './DatePicker.types';

const ENGLISH_DATE_PICKER_MESSAGES: DatePickerMessages = {
  date: 'Date',
  placeholder: 'Select date',
  calendar: 'Calendar',
  unavailable: 'Selected date is unavailable.',
};

const DATE_PICKER_MESSAGES: Record<string, DatePickerMessages> = {
  en: ENGLISH_DATE_PICKER_MESSAGES,
  ja: {
    date: '日付',
    placeholder: '日付を選択',
    calendar: 'カレンダー',
    unavailable: '選択した日付は利用できません。',
  },
};

/**
 * Resolves DatePicker defaults by exact locale, then base language, then English and applies caller
 * overrides last. The lookup is case-insensitive but does not perform broader Intl locale matching.
 */
export const getDatePickerMessages = (
  locale = 'en-US',
  overrides?: Partial<DatePickerMessages>,
): DatePickerMessages => ({
  ...(DATE_PICKER_MESSAGES[locale.toLowerCase()] ??
    DATE_PICKER_MESSAGES[locale.toLowerCase().split('-')[0]] ??
    ENGLISH_DATE_PICKER_MESSAGES),
  ...overrides,
});
