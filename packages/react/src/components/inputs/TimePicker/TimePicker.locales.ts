import type { TimePickerMessages } from './TimePicker.types';

const ENGLISH_TIME_PICKER_MESSAGES: TimePickerMessages = {
  time: 'Time',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  meridiem: 'AM/PM',
  am: 'AM',
  pm: 'PM',
  unavailable: 'Selected time is unavailable.',
};

const TIME_PICKER_MESSAGES: Record<string, TimePickerMessages> = {
  en: ENGLISH_TIME_PICKER_MESSAGES,
  ja: {
    time: '時刻',
    hours: '時',
    minutes: '分',
    seconds: '秒',
    meridiem: '午前/午後',
    am: '午前',
    pm: '午後',
    unavailable: '選択した時刻は利用できません。',
  },
};

/**
 * Resolves TimePicker defaults by exact locale, then base language, then English and applies caller
 * overrides last. The lookup is case-insensitive but does not perform broader Intl locale matching.
 */
export const getTimePickerMessages = (
  locale = 'en-US',
  overrides?: Partial<TimePickerMessages>,
): TimePickerMessages => ({
  ...(TIME_PICKER_MESSAGES[locale.toLowerCase()] ??
    TIME_PICKER_MESSAGES[locale.toLowerCase().split('-')[0]] ??
    ENGLISH_TIME_PICKER_MESSAGES),
  ...overrides,
});
