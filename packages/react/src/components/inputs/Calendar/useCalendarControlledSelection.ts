import { useCallback, useState } from 'react';
import { getCalendarInitialSelection } from '@poffy-ui/behavior/calendar';
import type { CalendarProps, DateRange } from './Calendar.types';

type CalendarSelectionValue = Date | Date[] | DateRange | undefined;

const callCalendarOnSelect = (
  mode: NonNullable<CalendarProps['mode']>,
  onSelect: CalendarProps['onSelect'],
  value: CalendarSelectionValue,
) => {
  if (!onSelect) return;

  if (mode === 'multiple') {
    (onSelect as ((dates: Date[] | undefined) => void) | undefined)?.(value as Date[] | undefined);
    return;
  }

  if (mode === 'range') {
    (onSelect as ((range: DateRange | undefined) => void) | undefined)?.(
      value as DateRange | undefined,
    );
    return;
  }

  (onSelect as ((date: Date | undefined) => void) | undefined)?.(value as Date | undefined);
};

interface UseCalendarControlledSelectionParams {
  defaultValue: CalendarProps['defaultValue'];
  mode: NonNullable<CalendarProps['mode']>;
  onSelect: CalendarProps['onSelect'];
  selectedProp: CalendarProps['selected'];
}

/**
 * Normalizes controlled and uncontrolled Calendar selection state.
 */
export const useCalendarControlledSelection = ({
  defaultValue,
  mode,
  onSelect,
  selectedProp,
}: UseCalendarControlledSelectionParams) => {
  const [uncontrolledState, setUncontrolledState] = useState(() => ({
    defaultValue,
    mode,
    value: getCalendarInitialSelection(mode, defaultValue) as CalendarSelectionValue,
  }));

  let selected =
    selectedProp === undefined ? uncontrolledState.value : (selectedProp as CalendarSelectionValue);
  if (
    selectedProp === undefined &&
    (uncontrolledState.defaultValue !== defaultValue || uncontrolledState.mode !== mode)
  ) {
    selected = getCalendarInitialSelection(mode, defaultValue) as CalendarSelectionValue;
    setUncontrolledState({ defaultValue, mode, value: selected });
  }

  const handleSelect = useCallback(
    (value: CalendarSelectionValue) => {
      if (selectedProp === undefined) {
        setUncontrolledState({ defaultValue, mode, value });
      }
      callCalendarOnSelect(mode, onSelect, value);
    },
    [defaultValue, mode, onSelect, selectedProp],
  );

  return { handleSelect, selected };
};
