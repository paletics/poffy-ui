import { Calendar } from '@/components/inputs/Calendar';
import { DatePicker } from '@/components/inputs/DatePicker';
import type { CalendarDateFormatOptions } from '@/components/inputs/Calendar';
import { DiffViewer } from '@/components/data-display/DiffViewer';
import type { DiffLine } from '@/components/data-display/DiffViewer';
import type { DateOnlyFormatOptions } from '@poffy-ui/types';

const date = new Date(2026, 6, 27);

<Calendar defaultValue={date} />;
<Calendar mode="multiple" defaultValue={[date]} />;
<Calendar mode="range" defaultValue={{ from: date }} />;

// @ts-expect-error Single Calendar defaults to one Date.
<Calendar defaultValue={[date]} />;
// @ts-expect-error Multiple Calendar defaults to a Date array.
<Calendar mode="multiple" defaultValue={date} />;
// @ts-expect-error Range Calendar defaults to a DateRange.
<Calendar mode="range" defaultValue={[date]} />;

const dateStyle: CalendarDateFormatOptions = { calendar: 'gregory', dateStyle: 'full' };
const dateParts: CalendarDateFormatOptions = {
  day: 'numeric',
  formatMatcher: 'best fit',
  month: 'long',
  year: 'numeric',
};
// @ts-expect-error Calendar labels do not accept time fields.
const timeParts: CalendarDateFormatOptions = { hour: 'numeric' };
// @ts-expect-error Calendar labels intentionally ignore time zones.
const timeZone: CalendarDateFormatOptions = { timeZone: 'UTC' };
// @ts-expect-error Intl dateStyle cannot be combined with component fields.
const mixedStyle: CalendarDateFormatOptions = { dateStyle: 'full', month: 'long' };
const timeOptionsVariable = { calendar: 'gregory', hour: 'numeric' as const };
// @ts-expect-error Time fields remain forbidden when options come through a variable.
const variableTimeParts: CalendarDateFormatOptions = timeOptionsVariable;

const sharedDateParts: DateOnlyFormatOptions = { day: 'numeric', month: 'short' };
<DatePicker formatOptions={sharedDateParts} aria-label="Date" />;
// @ts-expect-error DatePicker is date-only and does not accept time fields.
<DatePicker formatOptions={{ minute: 'numeric' }} aria-label="Date" />;
// @ts-expect-error DatePicker does not accept time-zone conversion for local calendar days.
<DatePicker formatOptions={{ timeZone: 'UTC' }} aria-label="Date" />;
// @ts-expect-error DatePicker dateStyle cannot be combined with component fields.
<DatePicker formatOptions={{ dateStyle: 'long', year: 'numeric' }} aria-label="Date" />;
// @ts-expect-error Variable time options remain outside the DatePicker contract.
<DatePicker formatOptions={timeOptionsVariable} aria-label="Date" />;

const modifiedLine: DiffLine = {
  kind: 'modified',
  content: 'new',
  oldContent: 'old',
  newContent: 'new',
};
// @ts-expect-error Modified lines require original-side content.
const missingOldContent: DiffLine = {
  kind: 'modified',
  content: 'new',
  newContent: 'new',
};
// @ts-expect-error Modified lines require changed-side content.
const missingNewContent: DiffLine = {
  kind: 'modified',
  content: 'new',
  oldContent: 'old',
};
// @ts-expect-error Ordinary lines cannot provide split-only content.
const ordinarySplitContent: DiffLine = {
  kind: 'unchanged',
  content: 'same',
  oldContent: 'old',
};
// @ts-expect-error Ordinary lines cannot provide changed-side split content.
const ordinaryNewContent: DiffLine = {
  kind: 'added',
  content: 'new',
  newContent: 'new',
};

<DiffViewer
  caption="Configuration change"
  captionDisclosure={{ summary: 'Show scope', content: 'Generated files are excluded.' }}
  hunks={[]}
/>;
// @ts-expect-error Supporting disclosure content requires a persistent visible caption.
<DiffViewer
  captionDisclosure={{ summary: 'Show scope', content: 'Generated files are excluded.' }}
  hunks={[]}
/>;

void [
  dateStyle,
  dateParts,
  timeParts,
  timeZone,
  mixedStyle,
  variableTimeParts,
  sharedDateParts,
  modifiedLine,
  missingOldContent,
  missingNewContent,
  ordinarySplitContent,
  ordinaryNewContent,
];
