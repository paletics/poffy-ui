import type { WheelPickerOption as WheelPickerOptionType } from './WheelPicker.types';
import { useCallback, type KeyboardEvent } from 'react';

interface WheelPickerOptionProps {
  className: string;
  columnId: string;
  commitValue: (columnId: string, nextOptionValue: string) => void;
  isSelected: boolean;
  option: WheelPickerOptionType;
  optionId: string;
  setOptionRef: (columnId: string, optionValue: string, node: HTMLDivElement | null) => void;
}

/**
 * Selectable option row inside a WheelPicker column.
 */
export const WheelPickerOption = ({
  className,
  columnId,
  commitValue,
  isSelected,
  option,
  optionId,
  setOptionRef,
}: WheelPickerOptionProps) => {
  const handleSelect = () => {
    if (!option.disabled) commitValue(columnId, option.value);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleSelect();
  };
  const optionRef = useCallback(
    (node: HTMLDivElement | null) => setOptionRef(columnId, option.value, node),
    [columnId, option.value, setOptionRef],
  );
  return (
    <div
      id={optionId}
      ref={optionRef}
      className={className}
      role="option"
      tabIndex={-1}
      aria-selected={isSelected}
      aria-disabled={option.disabled ? true : undefined}
      data-selected={isSelected ? '' : undefined}
      data-disabled={option.disabled ? '' : undefined}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      {option.label}
    </div>
  );
};
