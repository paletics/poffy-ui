'use client';

import {
  formatDateTimeFormValue,
  formatDateTimeValue,
  mergeDateAndTime,
  mergeTimeValueIntoDate,
} from '@poffy-ui/behavior/datetime';
import { isDateUnavailable, isValidDate } from '@poffy-ui/behavior/date';
import type { TimeParts } from '@poffy-ui/behavior/time';
import { useControllableState, useMergeRefs } from '@poffy-ui/behavior/hooks';
import { cx } from '@/styled-system/css';
import { dateTimePicker } from '@/styled-system/recipes';
import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { DatePicker } from '../DatePicker';
import { TimePicker } from '../TimePicker';
import type { DateTimePickerProps } from './DateTimePicker.types';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getDatePickerMessages } from '../DatePicker/DatePicker.locales';
import { getTimePickerMessages } from '../TimePicker/TimePicker.locales';
import { resolveDateTimeLocale } from '@/components/shared/resolveDateTimeLocale';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';

/**
 * Combined date and time controls that own one `Date | null` value.
 *
 * Date changes retain the existing time and time changes retain the existing local date. By
 * default time controls stay disabled until a date exists; with `requireDateBeforeTime={false}` a
 * time-first edit uses today's local date. Unavailable dates are rejected for either change path.
 * `name` serializes the merged value, while uncontrolled reset restores `defaultValue`.
 */
export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>((rawProps, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    size = 'md',
    appearance = 'outline',
    variant: _unsupportedVariant,
    error,
    disabled,
    readOnly,
    required,
    locale: localeProp,
    dateMessages,
    timeMessages,
    minDate,
    maxDate,
    isDateDisabled,
    datePlaceholder,
    dateAriaLabel: dateAriaLabelProp,
    timeAriaLabel: timeAriaLabelProp,
    timeFormat = '24h',
    timeInputMode = 'segments',
    withSeconds = false,
    requireDateBeforeTime = true,
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    name,
    form,
    valueFormat = 'iso-datetime',
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    role: _role,
    'aria-disabled': _ariaDisabled,
    'aria-readonly': _ariaReadonly,
    'aria-required': _ariaRequired,
    ...props
  } = rawProps as DateTimePickerProps & {
    variant?: unknown;
    role?: unknown;
    'aria-disabled'?: unknown;
    'aria-readonly'?: unknown;
    'aria-required'?: unknown;
  };
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  useWarnInvalidControllableState({
    componentName: 'DateTimePicker',
    value: valueProp,
    defaultValue,
    handler: onChange,
  });
  const validValueProp =
    valueProp === undefined ? undefined : isValidDate(valueProp) ? valueProp : null;
  const validDefaultValue = isValidDate(defaultValue) ? defaultValue : null;
  const validMinDate = isValidDate(minDate) ? minDate : undefined;
  const validMaxDate = isValidDate(maxDate) ? maxDate : undefined;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const providerLocale = useOptionalLocale()?.locale;
  const locale = resolveDateTimeLocale(localeProp ?? providerLocale ?? 'en-US');
  const resolvedDateMessages = getDatePickerMessages(locale, dateMessages);
  const resolvedTimeMessages = getTimePickerMessages(locale, timeMessages);
  const formControl = useFormControl();
  const isInvalid = error ?? formControl.isInvalid ?? false;
  const isDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: isDisabled, form });
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const hasInvalidState = [isInvalid, hasExplicitInvalid].some(Boolean);
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: hasInvalidState,
  });
  const accessibleLabel = resolveAccessibleLabel({
    ariaLabel,
    ariaLabelledBy,
    autoLabelledBy: formControl.labelId,
  });
  const resolvedId = id ?? formControl.id;
  const {
    value,
    isControlled,
    setValue: setInternalValue,
  } = useControllableState({
    value: validValueProp,
    defaultValue: validDefaultValue,
  });
  const defaultValueRef = useRef(validDefaultValue);
  useLayoutEffect(() => {
    defaultValueRef.current = validDefaultValue;
  }, [validDefaultValue]);
  const setRootRef = useMergeRefs(rootRef, ref);
  const explicitAriaLabel = ariaLabel?.trim();
  const dateLabelSuffix =
    locale.toLowerCase().split('-')[0] === 'en'
      ? resolvedDateMessages.date.toLocaleLowerCase(locale)
      : resolvedDateMessages.date;
  const timeLabelSuffix =
    locale.toLowerCase().split('-')[0] === 'en'
      ? resolvedTimeMessages.time.toLocaleLowerCase(locale)
      : resolvedTimeMessages.time;
  const dateAriaLabel = dateAriaLabelProp ?? (explicitAriaLabel
    ? `${explicitAriaLabel} ${dateLabelSuffix}`
    : resolvedDateMessages.date);
  const timeAriaLabel = timeAriaLabelProp ?? (explicitAriaLabel
    ? `${explicitAriaLabel} ${timeLabelSuffix}`
    : resolvedTimeMessages.time);
  const valueIsUnavailable = isDateUnavailable(value, {
    minDate: validMinDate,
    maxDate: validMaxDate,
    isDateDisabled,
  });
  const isCurrentTime = (parts: TimeParts) =>
    [
      isValidDate(value),
      isValidDate(value) && parts.hour === value.getHours(),
      isValidDate(value) && parts.minute === value.getMinutes(),
      [!withSeconds, isValidDate(value) && parts.second === value.getSeconds()].some(Boolean),
    ].every(Boolean);
  // DatePicker owns validation for an unavailable date. Keep the current time
  // selectable so TimePicker can reject changes without adding a duplicate
  // unavailable validation proxy for the same DateTime value.
  const isTimeDisabledForUnavailableDate = (parts: TimeParts) =>
    [valueIsUnavailable, !isCurrentTime(parts)].every(Boolean);
  const timeDisabled = [isDisabled, requireDateBeforeTime && value === null].some(Boolean);

  const emitChange = (nextValue: Date | null) => {
    if (
      (value === null && nextValue === null) ||
      (isValidDate(value) && isValidDate(nextValue) && value.getTime() === nextValue.getTime())
    ) {
      return;
    }
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    resolvedOnChange?.(nextValue);
  };

  const timeValue = useMemo(
    () => (isValidDate(value) ? formatDateTimeValue(value, withSeconds) : null),
    [value, withSeconds],
  );
  const classes = dateTimePicker();
  const formValue = formatDateTimeFormValue(value, valueFormat, withSeconds);

  const emitConstrainedChange = (nextValue: Date | null) => {
    if (
      isDateUnavailable(nextValue, {
        minDate: validMinDate,
        maxDate: validMaxDate,
        isDateDisabled,
      })
    )
      return;
    emitChange(nextValue);
  };

  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    if (isControlled) return;
    setInternalValue(defaultValueRef.current);
  });
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

  return (
    <div
      {...props}
      ref={setRootRef}
      id={resolvedId}
      role="group"
      aria-label={accessibleLabel.ariaLabel}
      aria-labelledby={accessibleLabel.ariaLabelledBy}
      aria-describedby={describedBy}
      aria-disabled={isDisabled ? true : undefined}
      className={cx(classes.root, className)}
    >
      <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
      {name && (
        <input
          type="hidden"
          name={name}
          value={formValue}
          form={form}
          disabled={isDisabled}
          readOnly
        />
      )}
      <div className={classes.date}>
        <DatePicker
          value={value}
          onChange={(nextDate) =>
            emitConstrainedChange(mergeDateAndTime(nextDate, value, withSeconds))
          }
          locale={locale}
          messages={resolvedDateMessages}
          minDate={validMinDate}
          maxDate={validMaxDate}
          isDateDisabled={isDateDisabled}
          placeholder={datePlaceholder}
          size={size}
          appearance={appearance}
          error={hasInvalidState}
          id={resolvedId ? `${resolvedId}-date` : undefined}
          aria-label={dateAriaLabel}
          aria-describedby={describedBy}
          aria-errormessage={errorMessage}
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={isRequired}
          form={form}
        />
      </div>

      <div className={classes.time}>
        <TimePicker
          value={timeValue}
          locale={locale}
          messages={resolvedTimeMessages}
          onChange={(nextTime) =>
            emitConstrainedChange(mergeTimeValueIntoDate(value, nextTime, withSeconds))
          }
          isTimeDisabled={isTimeDisabledForUnavailableDate}
          size={size}
          appearance={appearance}
          error={hasInvalidState}
          id={resolvedId ? `${resolvedId}-time` : undefined}
          aria-label={timeAriaLabel}
          aria-describedby={describedBy}
          aria-errormessage={errorMessage}
          disabled={timeDisabled}
          readOnly={isReadOnly}
          required={false}
          form={form}
          inputMode={timeInputMode}
          format={timeFormat}
          withSeconds={withSeconds}
          hourStep={hourStep}
          minuteStep={minuteStep}
          secondStep={secondStep}
        />
      </div>
    </div>
  );
});

DateTimePicker.displayName = 'DateTimePicker';
