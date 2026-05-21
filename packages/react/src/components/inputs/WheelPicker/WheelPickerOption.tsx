import type { KeyboardEvent } from 'react';
import type { WheelPickerOption as WheelPickerOptionType } from './WheelPicker.types';

interface WheelPickerOptionProps {
  className: string;
  columnId: string;
  columnListId: string;
  commitValue: (columnId: string, nextOptionValue: string) => void;
  isSelected: boolean;
  option: WheelPickerOptionType;
  setOptionRef: (key: string, node: HTMLDivElement | null) => void;
}

/**
 * Selectable option row inside a WheelPicker column.
 */
export const WheelPickerOption = ({
  className,
  columnId,
  columnListId,
  commitValue,
  isSelected,
  option,
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

  return (
    <div
      id={`${columnListId}-option-${option.value}`}
      ref={(node) => {
        setOptionRef(`${columnId}:${option.value}`, node);
      }}
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
