import { CalendarLabels } from './Calendar.types';

const DEFAULT_CALENDAR_LOCALES: Record<string, CalendarLabels> = {
  'en-US': {
    today: 'Today',
    goToToday: 'Go to today',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    selectMonth: 'Select month',
    selectYear: 'Select year',
  },
  'ja-JP': {
    today: '今日',
    goToToday: '今日へ移動',
    previousMonth: '前の月へ',
    nextMonth: '次の月へ',
    selectMonth: '月を選択',
    selectYear: '年を選択',
  },
};

/**
 * Resolves the calendar labels based on the provided locale and custom overrides.
 * @param locale The locale string (e.g. 'ja-JP').
 * @param overrides Optional custom labels to override defaults.
 * @returns A complete CalendarLabels object.
 */
export const getCalendarLabels = (
  locale = 'en-US',
  overrides?: Partial<CalendarLabels>,
): CalendarLabels => {
  const lang = locale.split('-')[0];
  const defaults =
    DEFAULT_CALENDAR_LOCALES[locale] ||
    DEFAULT_CALENDAR_LOCALES[lang] ||
    DEFAULT_CALENDAR_LOCALES['en-US'];

  return {
    ...defaults,
    ...overrides,
  };
};
