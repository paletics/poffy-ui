interface UnsupportedTimeFormatOptions {
  dayPeriod?: never;
  fractionalSecondDigits?: never;
  hour?: never;
  hour12?: never;
  hourCycle?: never;
  minute?: never;
  second?: never;
  timeStyle?: never;
  timeZone?: never;
  timeZoneName?: never;
}

type DateFormatSharedOptions = Pick<
  Intl.DateTimeFormatOptions,
  'calendar' | 'localeMatcher' | 'numberingSystem'
> &
  UnsupportedTimeFormatOptions;

type DateStyleFormatOptions = DateFormatSharedOptions & {
  dateStyle: NonNullable<Intl.DateTimeFormatOptions['dateStyle']>;
  day?: never;
  era?: never;
  formatMatcher?: never;
  month?: never;
  weekday?: never;
  year?: never;
};

type DateComponentFormatOptions = DateFormatSharedOptions &
  Pick<
    Intl.DateTimeFormatOptions,
    'day' | 'era' | 'formatMatcher' | 'month' | 'weekday' | 'year'
  > & {
    dateStyle?: never;
  };

/**
 * Date-only `Intl.DateTimeFormat` options.
 *
 * `dateStyle` and individual date components are mutually exclusive. Time and
 * time-zone options are excluded because date-only controls represent local
 * calendar days without an instant or time of day.
 */
export type DateOnlyFormatOptions = DateStyleFormatOptions | DateComponentFormatOptions;
