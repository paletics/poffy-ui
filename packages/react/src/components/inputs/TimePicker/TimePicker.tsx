'use client';

import { css, cx } from '@/styled-system/css';
import { timePicker } from '@/styled-system/recipes';
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { getDeepActiveElement, getDOMTreeRoot, useMergeRefs } from '@poffy-ui/behavior/hooks';
import { isTimeUnavailable } from '@poffy-ui/behavior/time';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { TimePickerInput } from './TimePickerInput';
import type { TimePickerProps } from './TimePicker.types';
import { useTimePickerModel } from './useTimePickerModel';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getTimePickerMessages } from './TimePicker.locales';
import type { DOMTreeRoot } from '@poffy-ui/behavior/hooks';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';

const normalizeStep = (step: number | undefined) => {
  if (step === undefined) return undefined;
  return Number.isFinite(step) && step > 0 ? Math.max(1, Math.floor(step)) : 1;
};

const canRestoreDelayedFocus = (source: Element, treeRoot: DOMTreeRoot) => {
  const activeElement = getDeepActiveElement(treeRoot);
  if (activeElement === source || (activeElement !== null && source.contains(activeElement))) {
    return true;
  }
  if (source.isConnected) return false;

  const ownerDocument = source.ownerDocument;
  if (!('host' in treeRoot)) return activeElement === ownerDocument.body;
  if (activeElement !== null) return false;

  const documentActiveElement = getDeepActiveElement(ownerDocument);
  if (documentActiveElement === null) return true;
  if (documentActiveElement === treeRoot.host) return true;
  return documentActiveElement === ownerDocument.body;
};

/**
 * Time-only field with segment, clock, or wheel interaction modes.
 *
 * It accepts normalized time strings and rejects user selections outside configured time
 * constraints without silently correcting the existing value. An unavailable selected value makes
 * the form validation proxy invalid. `name` submits the normalized value; uncontrolled form reset
 * restores `defaultValue` and preserves focus where the active mode supports it. Disabled and
 * read-only state block edits while retaining the field's ARIA and form semantics.
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>((rawProps, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    size = 'md',
    appearance = 'outline',
    variant: _unsupportedVariant,
    inputMode = 'segments',
    format = '24h',
    locale: localeProp,
    messages,
    withSeconds = false,
    error,
    disabled,
    readOnly,
    required,
    minTime,
    maxTime,
    isTimeDisabled,
    hourStep = 1,
    minuteStep,
    secondStep,
    name,
    form,
    separator = ':',
    hourLabel: hourLabelProp,
    minuteLabel: minuteLabelProp,
    secondLabel: secondLabelProp,
    meridiemLabel: meridiemLabelProp,
    className,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...props
  } = rawProps as TimePickerProps & { variant?: unknown };
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  useWarnInvalidControllableState({
    componentName: 'TimePicker',
    value: valueProp,
    defaultValue,
    handler: onChange,
  });
  const {
    'aria-readonly': _ariaReadOnly,
    'aria-required': _ariaRequired,
    ...safeProps
  } = props as typeof props & {
    'aria-readonly'?: unknown;
    'aria-required'?: unknown;
  };
  const rootRef = useRef<HTMLDivElement | null>(null);
  const providerLocale = useOptionalLocale()?.locale;
  const locale = localeProp ?? providerLocale ?? 'en-US';
  const resolvedMessages = getTimePickerMessages(locale, messages);
  const hourLabel = hourLabelProp ?? resolvedMessages.hours;
  const minuteLabel = minuteLabelProp ?? resolvedMessages.minutes;
  const secondLabel = secondLabelProp ?? resolvedMessages.seconds;
  const meridiemLabel = meridiemLabelProp ?? resolvedMessages.meridiem;
  const classes = timePicker({ size });
  const normalizedHourStep = normalizeStep(hourStep) ?? 1;
  const normalizedMinuteStep = normalizeStep(minuteStep);
  const normalizedSecondStep = normalizeStep(secondStep);
  const formControl = useFormControl();
  const isInvalid = error ?? formControl.isInvalid ?? false;
  const explicitDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: explicitDisabled, form });
  const isDisabled = formBridge.effectivelyDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = [isInvalid, hasExplicitInvalid].some(Boolean);
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const accessibleLabel = resolveAccessibleLabel({
    ariaLabel,
    ariaLabelledBy,
    autoLabelledBy: formControl.labelId,
  });
  const resolvedId = id ?? formControl.id;
  const model = useTimePickerModel({
    defaultValue,
    format,
    amLabel: resolvedMessages.am,
    hourLabel,
    hourStep: normalizedHourStep,
    id: resolvedId,
    meridiemLabel,
    minuteLabel,
    minuteStep: normalizedMinuteStep,
    minTime,
    maxTime,
    onChange: resolvedOnChange,
    pmLabel: resolvedMessages.pm,
    secondLabel,
    secondStep: normalizedSecondStep,
    isTimeDisabled,
    value: valueProp,
    withSeconds,
  });
  const defaultValueRef = useRef(defaultValue ?? null);
  useLayoutEffect(() => {
    defaultValueRef.current = defaultValue ?? null;
  }, [defaultValue]);
  const setRootRef = useMergeRefs(rootRef, ref);
  const hasUnavailableSelection = [
    model.hasValue,
    isTimeUnavailable(model.parts, { minTime, maxTime, isTimeDisabled }),
  ].every(Boolean);
  const validationProxyRef = useRef<HTMLInputElement | null>(null);
  const needsValidationProxy = [
    isRequired,
    hasUnavailableSelection,
    shouldAssociateErrorMessage,
  ].some(Boolean);

  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    if (model.isControlled) return;
    const activeElement = rootRef.current
      ? getDeepActiveElement(getDOMTreeRoot(rootRef.current))
      : null;
    const shouldRestoreClockFocus =
      inputMode === 'clock' && Boolean(activeElement && rootRef.current?.contains(activeElement));
    const focusRoot = activeElement ? getDOMTreeRoot(activeElement) : undefined;
    model.resetValue(defaultValueRef.current);
    if (!shouldRestoreClockFocus || !activeElement || !focusRoot) return;
    queueMicrotask(() => {
      if (!canRestoreDelayedFocus(activeElement, focusRoot)) return;
      rootRef.current
        ?.querySelector<HTMLElement>('[role="radio"][data-selected][tabindex="0"]')
        ?.focus();
    });
  });
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

  useEffect(() => {
    validationProxyRef.current?.setCustomValidity(
      hasUnavailableSelection ? resolvedMessages.unavailable : '',
    );
  }, [hasUnavailableSelection, resolvedMessages.unavailable]);
  const focusFirstControl = useCallback(() => {
    queueMicrotask(() => {
      const root = rootRef.current;
      const selector =
        inputMode === 'clock'
          ? '[role="radio"][tabindex="0"]:not(:disabled):not([aria-disabled="true"])'
          : inputMode === 'wheel'
            ? '[data-wheel-picker-column]:not([aria-disabled="true"])'
            : 'input:not([type="hidden"]):not([data-time-picker-validation-proxy]):not(:disabled), select:not(:disabled)';
      root?.querySelector<HTMLElement>(selector)?.focus();
    });
  }, [inputMode]);

  return (
    <div
      {...safeProps}
      id={resolvedId}
      ref={setRootRef}
      role="group"
      data-time-picker-overflow-viewport=""
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
          value={model.hasValue ? model.formattedValue : ''}
          form={form}
          disabled={isDisabled}
          readOnly
        />
      )}
      {needsValidationProxy && (
        <input
          aria-hidden="true"
          className={css({ srOnly: true })}
          data-time-picker-validation-proxy=""
          ref={validationProxyRef}
          disabled={[isDisabled, isReadOnly].some(Boolean)}
          form={form}
          onChange={() => undefined}
          onInvalid={focusFirstControl}
          required={isRequired}
          tabIndex={-1}
          type="text"
          value={model.hasValue ? model.formattedValue : ''}
        />
      )}

      <TimePickerInput
        appearance={appearance}
        amLabel={resolvedMessages.am}
        classes={classes}
        disabled={isDisabled}
        describedBy={describedBy}
        error={isInvalid}
        errorMessage={errorMessage}
        format={format}
        getRootElement={() => rootRef.current}
        hourLabel={hourLabel}
        hourStep={normalizedHourStep}
        inputMode={inputMode}
        invalid={isInvalid ? true : ariaInvalid}
        meridiemLabel={meridiemLabel}
        minuteLabel={minuteLabel}
        minuteStep={normalizedMinuteStep}
        model={model}
        locale={locale}
        messages={resolvedMessages}
        pmLabel={resolvedMessages.pm}
        readOnly={isReadOnly}
        required={isRequired}
        secondLabel={secondLabel}
        secondStep={normalizedSecondStep}
        separator={separator}
        size={size}
        withSeconds={withSeconds}
      />
    </div>
  );
});

TimePicker.displayName = 'TimePicker';
