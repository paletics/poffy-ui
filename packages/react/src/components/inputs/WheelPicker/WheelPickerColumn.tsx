import { css } from '@/styled-system/css';
import { getTreeElementById } from '@poffy-ui/behavior/hooks';
import {
  getWheelPickerSelectedOption,
  isWheelPickerColumnValueComplete,
} from '@poffy-ui/behavior/wheel-picker';
import { useCallback, type UIEvent } from 'react';
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
  ariaDescribedBy?: string;
  ariaErrorMessage?: string;
  classes: WheelPickerClasses;
  column: WheelPickerColumnType;
  columnListId: string;
  commitValue: (columnId: string, nextOptionValue: string) => void;
  disabled: boolean;
  error: boolean;
  form?: string;
  handleKeyDown: (input: { defaultPrevented?: boolean; key: string }, columnId: string) => boolean;
  handleScroll: (event: UIEvent<HTMLDivElement>, columnId: string) => void;
  readOnly: boolean;
  revealColumn: (columnElement: HTMLElement) => void;
  required: boolean;
  selectedValue: WheelPickerValue;
  setOptionRef: (columnId: string, optionValue: string, node: HTMLDivElement | null) => void;
  setViewportRef: (columnId: string, node: HTMLDivElement | null) => void;
}

/**
 * Single scrollable column inside WheelPicker.
 */
export const WheelPickerColumn = ({
  classes,
  ariaDescribedBy,
  ariaErrorMessage,
  column,
  columnListId,
  commitValue,
  disabled,
  error,
  form,
  handleKeyDown,
  handleScroll,
  readOnly,
  revealColumn,
  required,
  selectedValue,
  setOptionRef,
  setViewportRef,
}: WheelPickerColumnProps) => {
  const selectedOption = getWheelPickerSelectedOption(column.options, selectedValue[column.id]);
  const selectedOptionIndex = selectedOption ? column.options.indexOf(selectedOption) : -1;
  const isValueComplete = isWheelPickerColumnValueComplete(column, selectedValue);
  const listboxId = `${columnListId}-listbox`;
  const viewportRef = useCallback(
    (node: HTMLDivElement | null) => setViewportRef(column.id, node),
    [column.id, setViewportRef],
  );

  return (
    <div className={classes.column} data-wheel-picker-column-container="">
      <span id={`${columnListId}-label`} className={classes.columnLabel}>
        {column.label}
      </span>
      {required && !isValueComplete && (
        <input
          aria-hidden="true"
          className={css({ srOnly: true })}
          data-wheel-picker-validation-proxy={column.id}
          disabled={disabled ? true : readOnly}
          form={form}
          onChange={() => undefined}
          onInvalid={(event) => {
            const validationProxy = event.currentTarget;
            queueMicrotask(() =>
              getTreeElementById<HTMLElement>(validationProxy, listboxId)?.focus(),
            );
          }}
          required
          tabIndex={-1}
          type="text"
          value=""
        />
      )}
      <div className={classes.viewportShell}>
        <div className={classes.selectionIndicator} aria-hidden="true" />
        <div
          id={listboxId}
          className={classes.viewport}
          ref={viewportRef}
          role="listbox"
          data-wheel-picker-column={column.id}
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={`${columnListId}-label`}
          aria-activedescendant={
            selectedOptionIndex >= 0 ? `${columnListId}-option-${selectedOptionIndex}` : undefined
          }
          aria-disabled={disabled ? true : undefined}
          aria-readonly={readOnly ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required ? true : undefined}
          aria-describedby={ariaDescribedBy}
          aria-errormessage={ariaErrorMessage}
          onKeyDown={(event) => {
            if (
              handleKeyDown({ defaultPrevented: event.defaultPrevented, key: event.key }, column.id)
            ) {
              event.preventDefault();
            }
          }}
          onFocus={(event) => {
            const columnElement = event.currentTarget.closest<HTMLElement>(
              '[data-wheel-picker-column-container]',
            );
            if (columnElement) revealColumn(columnElement);
          }}
          onScroll={(event) => handleScroll(event, column.id)}
        >
          {column.options.map((option, optionIndex) => {
            const isSelected = option.value === selectedValue[column.id];

            return (
              <WheelPickerOption
                key={option.value}
                className={classes.option}
                columnId={column.id}
                commitValue={commitValue}
                isSelected={isSelected}
                option={option}
                optionId={`${columnListId}-option-${optionIndex}`}
                setOptionRef={setOptionRef}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
