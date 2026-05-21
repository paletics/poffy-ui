import {
  getNextWheelPickerOption,
  normalizeWheelPickerValue,
} from '@poffy-ui/behavior/wheel-picker';
import { useMemo, useState, type KeyboardEvent } from 'react';
import type { WheelPickerColumn, WheelPickerValue } from './WheelPicker.types';

interface UseWheelPickerStateOptions {
  columns: WheelPickerColumn[];
  defaultValue?: WheelPickerValue;
  disabled: boolean;
  loop: boolean;
  onChange?: (value: WheelPickerValue, columnId: string) => void;
  readOnly: boolean;
  value?: WheelPickerValue;
}

/**
 * Manages WheelPicker controlled/uncontrolled selected values and keyboard movement.
 */
export const useWheelPickerState = ({
  columns,
  defaultValue,
  disabled,
  loop,
  onChange,
  readOnly,
  value,
}: UseWheelPickerStateOptions) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<WheelPickerValue>(() =>
    normalizeWheelPickerValue(columns, defaultValue),
  );
  const selectedValue = useMemo(
    () => normalizeWheelPickerValue(columns, isControlled ? value : internalValue),
    [columns, internalValue, isControlled, value],
  );

  const commitValue = (columnId: string, nextOptionValue: string) => {
    if (disabled || readOnly) return;

    const nextValue = { ...selectedValue, [columnId]: nextOptionValue };
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue, columnId);
  };

  const moveColumn = (columnId: string, direction: 1 | -1) => {
    const column = columns.find((item) => item.id === columnId);
    if (!column) return;

    const nextOption = getNextWheelPickerOption(
      column.options,
      selectedValue[column.id],
      direction,
      { loop },
    );
    if (nextOption) {
      commitValue(column.id, nextOption.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, columnId: string) => {
    handleWheelPickerKeyDown({
      columns,
      columnId,
      commitValue,
      event,
      moveColumn,
    });
  };

  return {
    commitValue,
    handleKeyDown,
    selectedValue,
  };
};

const handleWheelPickerKeyDown = ({
  columns,
  columnId,
  commitValue,
  event,
  moveColumn,
}: {
  columns: WheelPickerColumn[];
  columnId: string;
  commitValue: (columnId: string, nextOptionValue: string) => void;
  event: KeyboardEvent<HTMLDivElement>;
  moveColumn: (columnId: string, direction: 1 | -1) => void;
}) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      moveColumn(columnId, 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      moveColumn(columnId, -1);
      break;
    case 'Home':
      event.preventDefault();
      commitEdgeOption(columns, columnId, commitValue, 'first');
      break;
    case 'End':
      event.preventDefault();
      commitEdgeOption(columns, columnId, commitValue, 'last');
      break;
  }
};

const commitEdgeOption = (
  columns: WheelPickerColumn[],
  columnId: string,
  commitValue: (columnId: string, nextOptionValue: string) => void,
  edge: 'first' | 'last',
) => {
  const column = columns.find((item) => item.id === columnId);
  const options = column?.options.filter((option) => !option.disabled);
  const option = edge === 'first' ? options?.[0] : options?.at(-1);
  if (option) commitValue(columnId, option.value);
};
