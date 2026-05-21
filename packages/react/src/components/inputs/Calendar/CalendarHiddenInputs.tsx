'use client';

import { DateRange } from './Calendar.types';
import { formatDateISO } from './Calendar.utils';

interface CalendarHiddenInputsProps {
  name: string;
  form?: string;
  mode: 'single' | 'multiple' | 'range';
  selected: Date | Date[] | DateRange | undefined;
  disabled: boolean;
}

/**
 * Renders hidden `<input type="hidden">` elements for native form integration.
 * Supports single date, multiple dates, and date ranges.
 *
 * ### AI Context & Architecture
 * - Extracted from Calendar to keep that file under 200 lines.
 * Only rendered when `name` prop is provided.
 */
export const CalendarHiddenInputs = ({
  name,
  form,
  mode,
  selected,
  disabled,
}: CalendarHiddenInputsProps) => {
  if (mode === 'single' && (selected as Date | undefined)) {
    return (
      <input
        type="hidden"
        name={name}
        form={form}
        value={formatDateISO(selected as Date)}
        disabled={disabled}
      />
    );
  }

  if (mode === 'multiple' && Array.isArray(selected)) {
    return (
      <>
        {selected.map((date) => (
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

  if (mode === 'range' && (selected as DateRange | undefined)) {
    const range = selected as DateRange;
    return (
      <>
        {range.from && (
          <input
            type="hidden"
            name={`${name}_from`}
            form={form}
            value={formatDateISO(range.from)}
            disabled={disabled}
          />
        )}
        {range.to && (
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
