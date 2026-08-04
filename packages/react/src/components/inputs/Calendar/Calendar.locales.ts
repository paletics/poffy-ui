import { CalendarLabels } from './Calendar.types';

type ResolvedCalendarLabels = Omit<CalendarLabels, 'calendar'> & {
  calendar: string;
};

const ENGLISH_CALENDAR_LABELS: ResolvedCalendarLabels = {
  calendar: 'Calendar',
  unavailable: 'Selected date is unavailable.',
  today: 'Today',
  goToToday: 'Go to today',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  selectMonth: 'Select month',
  selectYear: 'Select year',
};

const DEFAULT_CALENDAR_LOCALES: Record<string, ResolvedCalendarLabels> = {
  en: ENGLISH_CALENDAR_LABELS,
  ja: {
    calendar: 'カレンダー',
    unavailable: '選択した日付は利用できません。',
    today: '今日',
    goToToday: '今日へ移動',
    previousMonth: '前の月へ',
    nextMonth: '次の月へ',
    selectMonth: '月を選択',
    selectYear: '年を選択',
  },
  'en-us': {
    calendar: 'Calendar',
    unavailable: 'Selected date is unavailable.',
    today: 'Today',
    goToToday: 'Go to today',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    selectMonth: 'Select month',
    selectYear: 'Select year',
  },
  'ja-jp': {
    calendar: 'カレンダー',
    unavailable: '選択した日付は利用できません。',
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
 * @returns A complete set of Calendar labels.
 */
export const getCalendarLabels = (
  locale = 'en-US',
  overrides?: Partial<CalendarLabels>,
): ResolvedCalendarLabels => {
  const normalizedLocale = locale.toLowerCase();
  const lang = normalizedLocale.split('-')[0];
  const defaults =
    DEFAULT_CALENDAR_LOCALES[normalizedLocale] ||
    DEFAULT_CALENDAR_LOCALES[lang] ||
    ENGLISH_CALENDAR_LABELS;

  return {
    ...defaults,
    ...overrides,
    calendar: overrides?.calendar?.trim() ? overrides.calendar : defaults.calendar,
  };
};
