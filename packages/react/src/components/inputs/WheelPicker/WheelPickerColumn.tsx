import { getWheelPickerSelectedOption } from '@poffy-ui/behavior/wheel-picker';
import type { KeyboardEvent, UIEvent } from 'react';
import type {
  WheelPickerColumn as WheelPickerColumnType,
  WheelPickerValue,
} from './WheelPicker.types';
import { WheelPickerOption } from './WheelPickerOption';

interface WheelPickerClasses {
  column: string;
  columnLabel: string;
  option: string;
  selectionIndicator: string;
  viewport: string;
  viewportShell: string;
}

interface WheelPickerColumnProps {
  classes: WheelPickerClasses;
  column: WheelPickerColumnType;
  columnListId: string;
  commitValue: (columnId: string, nextOptionValue: string) => void;
  disabled: boolean;
  error: boolean;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>, columnId: string) => void;
  handleScroll: (event: UIEvent<HTMLDivElement>, columnId: string) => void;
  readOnly: boolean;
  selectedValue: WheelPickerValue;
  setOptionRef: (key: string, node: HTMLDivElement | null) => void;
  setViewportRef: (columnId: string, node: HTMLDivElement | null) => void;
}

/**
 * Single scrollable column inside WheelPicker.
 */
export const WheelPickerColumn = ({
  classes,
  column,
  columnListId,
  commitValue,
  disabled,
  error,
  handleKeyDown,
  handleScroll,
  readOnly,
  selectedValue,
  setOptionRef,
  setViewportRef,
}: WheelPickerColumnProps) => {
  const selectedOption = getWheelPickerSelectedOption(column.options, selectedValue[column.id]);

  return (
    <div className={classes.column}>
      <span id={`${columnListId}-label`} className={classes.columnLabel}>
        {column.label}
      </span>
      <div className={classes.viewportShell}>
        <div className={classes.selectionIndicator} aria-hidden="true" />
        <div
          className={classes.viewport}
          ref={(node) => {
            setViewportRef(column.id, node);
          }}
          role="listbox"
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={`${columnListId}-label`}
          aria-activedescendant={
            selectedOption ? `${columnListId}-option-${selectedOption.value}` : undefined
          }
          aria-disabled={disabled ? true : undefined}
          aria-readonly={readOnly ? true : undefined}
          aria-invalid={error ? true : undefined}
          onKeyDown={(event) => handleKeyDown(event, column.id)}
          onScroll={(event) => handleScroll(event, column.id)}
        >
          {column.options.map((option) => {
            const isSelected = option.value === selectedValue[column.id];

            return (
              <WheelPickerOption
                key={option.value}
                className={classes.option}
                columnId={column.id}
                columnListId={columnListId}
                commitValue={commitValue}
                isSelected={isSelected}
                option={option}
                setOptionRef={setOptionRef}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
