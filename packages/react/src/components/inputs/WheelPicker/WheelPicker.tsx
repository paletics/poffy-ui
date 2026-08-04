'use client';

import { cx } from '@/styled-system/css';
import { wheelPicker } from '@/styled-system/recipes';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { forwardRef, useEffect, useId, useMemo, useRef } from 'react';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import {
  getDuplicateWheelPickerColumnIds,
  getDuplicateWheelPickerOptionValues,
  getUnambiguousWheelPickerColumns,
  normalizeWheelPickerValue,
} from '@poffy-ui/behavior/wheel-picker';
import { useWheelPickerState } from '@poffy-ui/behavior/wheel-picker/react';
import { WheelPickerColumn } from './WheelPickerColumn';
import { WheelPickerHiddenInputs } from './WheelPickerHiddenInputs';
import type { WheelPickerProps } from './WheelPicker.types';
import { useWheelPickerScroll } from './useWheelPickerScroll';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { scrollIntoInlineView } from '@/components/inputs/shared/scrollIntoInlineView';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

/**
 * Multi-column wheel picker for independent option values.
 *
 * Column IDs and option values must be unique within their respective scopes; ambiguous entries
 * are ignored before selection state is normalized. Scrolling, keyboard navigation, and option
 * activation request an updated value, which controlled callers must reflect. `loop` controls
 * wraparound navigation. Required validation demands an enabled, non-placeholder option per
 * column, and `name` serializes the selected map as JSON, entries, or a custom string. Disabled
 * and read-only state block value changes; uncontrolled reset restores normalized defaults.
 */
export const WheelPicker = forwardRef<HTMLDivElement, WheelPickerProps>(
  (
    {
      columns: providedColumns,
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      disabled,
      readOnly,
      error,
      loop = true,
      name,
      form,
      valueFormat = 'json',
      className,
      id: idProp,
      required,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
      'aria-invalid': ariaInvalid,
      role: _role,
      'aria-disabled': _ariaDisabled,
      'aria-readonly': _ariaReadOnly,
      ...props
    },
    ref,
  ) => {
    const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
    useWarnInvalidControllableState({
      componentName: 'WheelPicker',
      value: valueProp,
      defaultValue,
      handler: onChange,
    });
    const columns = useMemo(
      () => getUnambiguousWheelPickerColumns(providedColumns),
      [providedColumns],
    );
    const duplicateColumnIds = useMemo(
      () => getDuplicateWheelPickerColumnIds(providedColumns),
      [providedColumns],
    );
    const duplicateOptionValues = useMemo(
      () => getDuplicateWheelPickerOptionValues(providedColumns),
      [providedColumns],
    );
    useEffect(() => {
      const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
      if (nodeEnv === 'production') return;
      if (duplicateColumnIds.length > 0) {
        console.warn(
          `[WheelPicker] column ids must be unique. Ambiguous columns were ignored: ${duplicateColumnIds.join(', ')}`,
        );
      }
      if (duplicateOptionValues.length > 0) {
        console.warn(
          `[WheelPicker] option values must be unique within each column. Ambiguous values were ignored: ${duplicateOptionValues
            .map(({ columnId, values }) => `${columnId}: ${values.join(', ')}`)
            .join('; ')}`,
        );
      }
    }, [duplicateColumnIds, duplicateOptionValues]);
    const idBase = useId();
    const formControl = useFormControl();
    const explicitDisabled = disabled ?? formControl.isDisabled ?? false;
    const formBridge = useFormControlBridge({ disabled: explicitDisabled, form });
    const isDisabled = formBridge.effectivelyDisabled;
    const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
    const isRequired = required ?? formControl.isRequired ?? false;
    const isInvalid = error === true ? true : error === undefined && formControl.isInvalid === true;
    const resolvedAriaInvalid =
      ariaInvalid === true || ariaInvalid === false || typeof ariaInvalid === 'string'
        ? ariaInvalid
        : undefined;
    const hasExplicitInvalid = hasAriaInvalid(resolvedAriaInvalid);
    const { describedBy, errorMessage } = resolveFormControlAria({
      ariaDescribedBy,
      ariaErrorMessage,
      errorMessageIds: formControl.errorMessageIds,
      helperTextIds: formControl.helperTextIds,
      isInvalid: isInvalid ? true : hasExplicitInvalid,
    });
    const accessibleLabel = resolveAccessibleLabel({
      ariaLabel,
      ariaLabelledBy,
      autoLabelledBy: formControl.labelId,
    });
    const classes = wheelPicker({ size, error: error ?? formControl.isInvalid ?? false });
    const containerRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(containerRef, ref);
    const { commitValue, handleKeyDown, isControlled, resetValue, selectedValue } =
      useWheelPickerState({
        columns,
        defaultValue,
        disabled: isDisabled,
        isInteractionDisabled: formBridge.isEffectivelyDisabledNow,
        loop,
        onChange: resolvedOnChange,
        readOnly: isReadOnly,
        value: valueProp,
      });
    const { handleScroll, setOptionRef, setViewportRef } = useWheelPickerScroll({
      columns,
      commitValue,
      disabled: isDisabled,
      layoutKey: size,
      readOnly: isReadOnly,
      selectedValue,
    });

    const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
      if (isControlled) return;
      resetValue(normalizeWheelPickerValue(columns, defaultValue));
    });
    const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

    return (
      <div
        {...props}
        ref={mergedRef}
        className={cx(classes.root, className)}
        id={idProp ?? formControl.id}
        role="group"
        data-disabled={isDisabled ? '' : undefined}
        aria-label={accessibleLabel.ariaLabel}
        aria-labelledby={accessibleLabel.ariaLabelledBy}
        aria-describedby={describedBy}
        aria-disabled={isDisabled ? true : undefined}
        data-wheel-picker-root=""
      >
        <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
        {name && (
          <WheelPickerHiddenInputs
            name={name}
            form={form}
            disabled={isDisabled}
            selectedValue={selectedValue}
            valueFormat={valueFormat}
          />
        )}

        {columns.map((column, columnIndex) => {
          const columnListId = `${idBase}-column-${columnIndex}`;

          return (
            <WheelPickerColumn
              key={column.id}
              classes={classes}
              column={column}
              columnListId={columnListId}
              commitValue={commitValue}
              disabled={isDisabled}
              error={isInvalid}
              form={form}
              handleKeyDown={handleKeyDown}
              handleScroll={handleScroll}
              readOnly={isReadOnly}
              required={isRequired}
              ariaDescribedBy={describedBy}
              ariaErrorMessage={errorMessage}
              selectedValue={selectedValue}
              setOptionRef={setOptionRef}
              setViewportRef={setViewportRef}
              revealColumn={(columnElement) => {
                if (containerRef.current) {
                  const scrollPadding = Number.parseFloat(
                    getComputedStyle(containerRef.current).scrollPaddingInlineStart,
                  );
                  scrollIntoInlineView(
                    containerRef.current,
                    columnElement,
                    Number.isFinite(scrollPadding) ? scrollPadding : 0,
                  );
                }
              }}
            />
          );
        })}
      </div>
    );
  },
);

WheelPicker.displayName = 'WheelPicker';
