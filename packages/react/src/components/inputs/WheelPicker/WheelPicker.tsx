'use client';

import { cx } from '@/styled-system/css';
import { wheelPicker } from '@/styled-system/recipes';
import { forwardRef, useId } from 'react';
import { WheelPickerColumn } from './WheelPickerColumn';
import { WheelPickerHiddenInputs } from './WheelPickerHiddenInputs';
import type { WheelPickerProps } from './WheelPicker.types';
import { useWheelPickerScroll } from './useWheelPickerScroll';
import { useWheelPickerState } from './useWheelPickerState';

/**
 * Generic drumroll-style picker for one or more independent option columns.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS slot recipe and shared wheel-picker behavior helpers
 * - **Accessibility**: Each column is a keyboard-operable listbox with selected option state.
 *
 * @example
 * ```tsx
 * <WheelPicker
 *   columns={[{ id: 'size', label: 'Size', options: sizes }]}
 *   defaultValue={{ size: 'md' }}
 * />
 * ```
 */
export const WheelPicker = forwardRef<HTMLDivElement, WheelPickerProps>(
  (
    {
      columns,
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      disabled = false,
      readOnly = false,
      error = false,
      loop = true,
      name,
      form,
      valueFormat = 'json',
      className,
      ...props
    },
    ref,
  ) => {
    const idBase = useId();
    const classes = wheelPicker({ size, error });
    const { commitValue, handleKeyDown, selectedValue } = useWheelPickerState({
      columns,
      defaultValue,
      disabled,
      loop,
      onChange,
      readOnly,
      value: valueProp,
    });
    const { handleScroll, setOptionRef, setViewportRef } = useWheelPickerScroll({
      columns,
      commitValue,
      disabled,
      readOnly,
      selectedValue,
    });

    return (
      <div
        ref={ref}
        className={cx(classes.root, className)}
        data-disabled={disabled ? '' : undefined}
        aria-disabled={disabled ? true : undefined}
        {...props}
      >
        {name && (
          <WheelPickerHiddenInputs
            name={name}
            form={form}
            disabled={disabled}
            selectedValue={selectedValue}
            valueFormat={valueFormat}
          />
        )}

        {columns.map((column) => {
          const columnListId = `${idBase}-${column.id}`;

          return (
            <WheelPickerColumn
              key={column.id}
              classes={classes}
              column={column}
              columnListId={columnListId}
              commitValue={commitValue}
              disabled={disabled}
              error={error}
              handleKeyDown={handleKeyDown}
              handleScroll={handleScroll}
              readOnly={readOnly}
              selectedValue={selectedValue}
              setOptionRef={setOptionRef}
              setViewportRef={setViewportRef}
            />
          );
        })}
      </div>
    );
  },
);

WheelPicker.displayName = 'WheelPicker';
