import { useControllableState } from '@poffy-ui/behavior/hooks';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { getCalendarInitialSelection } from '@poffy-ui/behavior/calendar';
import type { CalendarProps, DateRange } from './Calendar.types';

type CalendarSelectionValue = Date | Date[] | DateRange | undefined;
type CalendarMode = NonNullable<CalendarProps['mode']>;

interface CalendarSelectionState {
  mode: CalendarMode;
  value: CalendarSelectionValue;
}

const callCalendarOnSelect = (
  mode: CalendarMode,
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
  isControlled: boolean;
  mode: NonNullable<CalendarProps['mode']>;
  onSelect: CalendarProps['onSelect'];
  selectedProp: CalendarProps['selected'];
}

/**
 * Normalizes controlled and uncontrolled Calendar selection state.
 */
export const useCalendarControlledSelection = ({
  defaultValue,
  isControlled,
  mode,
  onSelect,
  selectedProp,
}: UseCalendarControlledSelectionParams) => {
  const controlledState = useMemo<CalendarSelectionState | undefined>(
    () => (!isControlled ? undefined : { mode, value: selectedProp as CalendarSelectionValue }),
    [isControlled, mode, selectedProp],
  );
  const currentModeDefault = useMemo<CalendarSelectionState>(
    () => ({
      mode,
      value: getCalendarInitialSelection(mode, defaultValue) as CalendarSelectionValue,
    }),
    [defaultValue, mode],
  );
  const { value: selectionState, setValue: setSelectionState } =
    useControllableState<CalendarSelectionState>({
      value: controlledState,
      defaultValue: currentModeDefault,
    });
  const resolvedState = selectionState.mode === mode ? selectionState : currentModeDefault;

  useLayoutEffect(() => {
    if (selectionState.mode !== mode) {
      setSelectionState(currentModeDefault);
    }
  }, [currentModeDefault, mode, selectionState.mode, setSelectionState]);

  const handleSelect = useCallback(
    (value: CalendarSelectionValue) => {
      setSelectionState({ mode, value });
      callCalendarOnSelect(mode, onSelect, value);
    },
    [mode, onSelect, setSelectionState],
  );

  const resetSelection = useCallback(
    (value: CalendarSelectionValue) => {
      setSelectionState({ mode, value: getCalendarInitialSelection(mode, value) });
    },
    [mode, setSelectionState],
  );

  return { handleSelect, resetSelection, selected: resolvedState.value };
};
