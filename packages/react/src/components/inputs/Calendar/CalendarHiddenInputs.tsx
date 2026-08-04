'use client';

import { DateRange } from './Calendar.types';
import { formatDateISO } from './Calendar.utils';
import { isValidDate } from '@poffy-ui/behavior/date';
import { normalizeCalendarSelection } from '@poffy-ui/behavior/calendar';

interface CalendarHiddenInputsProps {
  name: string;
  form?: string;
  mode: 'single' | 'multiple' | 'range';
  selected: Date | Date[] | DateRange | undefined;
  disabled: boolean;
}

/**
 * Emits normalized Calendar selection values as native hidden form controls.
 *
 * Single values use `name`, multiple values use repeated `name[]`, and range edges use
 * `name_from` / `name_to`. Invalid or incomplete selection parts emit no field; disabled Calendar
 * values remain disabled so native form submission omits them.
 */
export const CalendarHiddenInputs = ({
  name,
  form,
  mode,
  selected,
  disabled,
}: CalendarHiddenInputsProps) => {
  const normalizedSelected = normalizeCalendarSelection(mode, selected);

  if (mode === 'single' && isValidDate(normalizedSelected as Date | undefined)) {
    return (
      <input
        type="hidden"
        name={name}
        form={form}
        value={formatDateISO(normalizedSelected as Date)}
        disabled={disabled}
      />
    );
  }

  if (mode === 'multiple' && Array.isArray(normalizedSelected)) {
    const dates = normalizedSelected;
    return (
      <>
        {dates.map((date) => (
          <input
            key={formatDateISO(date)}
            type="hidden"
            name={`${name}[]`}
            form={form}
            value={formatDateISO(date)}
            disabled={disabled}
          />
        ))}
      </>
    );
  }

  if (mode === 'range' && (normalizedSelected as DateRange | undefined)) {
    const range = normalizedSelected as DateRange;
    return (
      <>
        {isValidDate(range.from) && (
          <input
            type="hidden"
            name={`${name}_from`}
            form={form}
            value={formatDateISO(range.from)}
            disabled={disabled}
          />
        )}
        {isValidDate(range.to) && (
          <input
            type="hidden"
            name={`${name}_to`}
            form={form}
            value={formatDateISO(range.to)}
            disabled={disabled}
          />
        )}
      </>
    );
  }

  return null;
};
