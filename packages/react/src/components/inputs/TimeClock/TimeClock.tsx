'use client';

import { formatTimeParts } from '@poffy-ui/behavior/time';
import { css, cx } from '@/styled-system/css';
import { timeClock } from '@/styled-system/recipes';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { TimeClockDial } from './TimeClockDial';
import { TimeClockHeader } from './TimeClockHeader';
import type { TimeClockProps } from './TimeClock.types';
import { useTimeClockPointer } from './useTimeClockPointer';
import { scrollIntoInlineView } from '@/components/inputs/shared/scrollIntoInlineView';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getTimePickerMessages } from '../TimePicker/TimePicker.locales';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';
import { useTimeClockDialFocus } from './useTimeClockDialFocus';
import { useTimeClockModel } from './useTimeClockModel';

const dialViewportClass = css({
  '--time-clock-focus-clearance':
    'calc(var(--poffy-focus-ring-width) + var(--poffy-focus-ring-offset))',
  width: 'full',
  maxWidth: 'full',
  display: 'flex',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain',
  scrollbarWidth: '[thin]',
  // The clock's outer options use an external focus ring. Reserve clearance on both
  // axes because an x-axis scroller also clips its block axis in browsers.
  py: 'var(--time-clock-focus-clearance)',
  scrollPaddingBlock: 'var(--time-clock-focus-clearance)',
  scrollPaddingInline: 'var(--time-clock-focus-clearance)',
  px: 'var(--time-clock-focus-clearance)',
  '& > *': {
    marginInline: 'auto',
  },
});

/**
 * Clock-face time field that can also be used as `TimePicker`'s clock mode.
 *
 * Selecting an hour advances to minutes and, when enabled, seconds; the 12-hour face also
 * exposes meridiem selection. Value changes respect the configured unit steps and are controlled
 * when `value` is supplied. `name` emits a normalized hidden time string, and required validation
 * focuses the first selectable clock action. Disabled/read-only state blocks pointer and keyboard
 * changes; uncontrolled form reset restores `defaultValue`.
 */
export const TimeClock = forwardRef<HTMLDivElement, TimeClockProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      format = '24h',
      locale: localeProp,
      messages,
      withSeconds = false,
      disabled,
      readOnly,
      required,
      error,
      hourStep = 1,
      minuteStep = 5,
      secondStep = 5,
      name,
      form,
      hourLabel: hourLabelProp,
      minuteLabel: minuteLabelProp,
      secondLabel: secondLabelProp,
      meridiemLabel: meridiemLabelProp,
      className,
      id: idProp,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
    useWarnInvalidControllableState({
      componentName: 'TimeClock',
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
    const mergedRef = useMergeRefs(rootRef, ref);
    const formControl = useFormControl();
    const explicitDisabled = disabled ?? formControl.isDisabled ?? false;
    const formBridge = useFormControlBridge({ disabled: explicitDisabled, form });
    const isDisabled = formBridge.effectivelyDisabled;
    const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
    const isRequired = required ?? formControl.isRequired ?? false;
    const isInvalid = error ?? formControl.isInvalid ?? false;
    const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
    const { describedBy, errorMessage } = resolveFormControlAria({
      ariaDescribedBy,
      ariaErrorMessage,
      errorMessageIds: formControl.errorMessageIds,
      helperTextIds: formControl.helperTextIds,
      isInvalid: [isInvalid, hasExplicitInvalid].some(Boolean),
    });
    const accessibleLabel = resolveAccessibleLabel({
      ariaLabel,
      ariaLabelledBy,
      autoLabelledBy: formControl.labelId,
    });
    const providerLocale = useOptionalLocale()?.locale;
    const locale = localeProp ?? providerLocale ?? 'en-US';
    const resolvedMessages = getTimePickerMessages(locale, messages);
    const hourLabel = hourLabelProp ?? resolvedMessages.hours;
    const minuteLabel = minuteLabelProp ?? resolvedMessages.minutes;
    const secondLabel = secondLabelProp ?? resolvedMessages.seconds;
    const meridiemLabel = meridiemLabelProp ?? resolvedMessages.meridiem;
    const dialViewportRef = useRef<HTMLDivElement>(null);
    const {
      activeUnit,
      displayHour,
      hasValue,
      isControlled,
      meridiem,
      options,
      parts,
      previewValue,
      reset,
      selectMeridiem,
      selectValue: selectModelValue,
      selectedAngle,
      selectedValue,
      setActiveUnit,
      setPreviewValue,
    } = useTimeClockModel({
      defaultValue,
      disabled: isDisabled,
      format,
      hourStep,
      minuteStep,
      onChange: resolvedOnChange,
      readOnly: isReadOnly,
      secondStep,
      value: valueProp,
      withSeconds,
    });
    const { dialRef, requestFocusRestore, requestTrackedFocusRestore, trackFocusSource } =
      useTimeClockDialFocus(activeUnit, rootRef);
    useEffect(() => {
      if (!withSeconds && activeUnit === 'second') requestTrackedFocusRestore();
    }, [activeUnit, requestTrackedFocusRestore, withSeconds]);
    const defaultValueRef = useRef(defaultValue);
    useLayoutEffect(() => {
      defaultValueRef.current = defaultValue;
    }, [defaultValue]);

    const classes = timeClock({ size });

    const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
      if (isControlled) return;
      if (activeUnit !== 'hour') requestFocusRestore();
      reset(defaultValueRef.current);
    });
    const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

    const selectValue = (nextValue: number, advanceUnit = true) => {
      if (isDisabled || isReadOnly) return;
      if (advanceUnit && (activeUnit === 'hour' || (activeUnit === 'minute' && withSeconds))) {
        requestFocusRestore();
      }
      selectModelValue(nextValue, advanceUnit);
    };

    const isInteractionBlockedNow = () =>
      [isReadOnly, formBridge.isEffectivelyDisabledNow()].some(Boolean);
    const { cancelActivePointer, dialPointerProps, shouldSuppressOptionClick } =
      useTimeClockPointer({
        activeUnit,
        format,
        interactionBlocked: [isDisabled, isReadOnly].some(Boolean),
        isInteractionBlockedNow,
        onCancel: () => setPreviewValue(null),
        onCommit: (nextValue) => {
          setPreviewValue(null);
          selectValue(nextValue, activeUnit === 'hour');
        },
        onPreview: setPreviewValue,
      });
    useLayoutEffect(() => {
      if (isDisabled || isReadOnly) cancelActivePointer();
    }, [cancelActivePointer, isDisabled, isReadOnly]);

    return (
      <div
        {...safeProps}
        ref={mergedRef}
        role="group"
        id={idProp ?? formControl.id}
        aria-label={accessibleLabel.ariaLabel}
        aria-labelledby={accessibleLabel.ariaLabelledBy}
        aria-describedby={describedBy}
        aria-disabled={isDisabled ? true : undefined}
        className={cx(classes.root, className)}
        data-disabled={isDisabled ? '' : undefined}
        data-readonly={isReadOnly ? '' : undefined}
      >
        <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
        {isRequired ? (
          <input
            aria-hidden="true"
            className={css({ srOnly: true })}
            data-time-clock-validation-proxy=""
            disabled={[isDisabled, isReadOnly].some(Boolean)}
            form={form}
            onChange={() => undefined}
            onInvalid={() =>
              queueMicrotask(() => {
                const focusTarget =
                  rootRef.current?.querySelector<HTMLElement>(
                    '[role="radio"][tabindex="0"]:not(:disabled):not([aria-disabled="true"])',
                  ) ??
                  rootRef.current?.querySelector<HTMLElement>(
                    'button:not(:disabled):not([aria-disabled="true"])',
                  );
                focusTarget?.focus();
              })
            }
            required
            tabIndex={-1}
            type="text"
            value={hasValue ? formatTimeParts(parts, withSeconds) : ''}
          />
        ) : null}
        {name && (
          <input
            type="hidden"
            name={name}
            value={hasValue ? formatTimeParts(parts, withSeconds) : ''}
            form={form}
            disabled={isDisabled}
            readOnly
          />
        )}

        <TimeClockHeader
          activeUnit={activeUnit}
          amLabel={resolvedMessages.am}
          classes={classes}
          disabled={isDisabled}
          displayHour={displayHour}
          format={format}
          hourLabel={hourLabel}
          meridiem={meridiem}
          meridiemLabel={meridiemLabel}
          minuteLabel={minuteLabel}
          onMeridiemSelect={selectMeridiem}
          onSecondFocus={(event) => trackFocusSource(event.currentTarget)}
          parts={parts}
          pmLabel={resolvedMessages.pm}
          readOnly={isReadOnly}
          secondLabel={secondLabel}
          setActiveUnit={setActiveUnit}
          withSeconds={withSeconds}
        />

        <div
          ref={dialViewportRef}
          className={dialViewportClass}
          data-time-clock-dial-viewport=""
          onFocusCapture={(event) => {
            const ownerWindow = event.currentTarget.ownerDocument.defaultView;
            const HTMLElement = ownerWindow?.HTMLElement;
            if (
              dialViewportRef.current &&
              ownerWindow &&
              HTMLElement &&
              event.target instanceof HTMLElement
            ) {
              const scrollPadding = Number.parseFloat(
                ownerWindow.getComputedStyle(dialViewportRef.current).scrollPaddingInlineStart,
              );
              scrollIntoInlineView(
                dialViewportRef.current,
                event.target,
                Number.isFinite(scrollPadding) ? scrollPadding : 0,
              );
            }
          }}
        >
          <TimeClockDial
            activeUnit={activeUnit}
            classes={classes}
            describedBy={describedBy}
            dialRef={dialRef}
            disabled={isDisabled}
            errorMessage={errorMessage}
            format={format}
            hourLabel={hourLabel}
            minuteLabel={minuteLabel}
            onSelect={selectValue}
            options={options}
            invalid={isInvalid ? true : ariaInvalid}
            pointerProps={dialPointerProps}
            previewValue={previewValue}
            readOnly={isReadOnly}
            required={isRequired}
            secondLabel={secondLabel}
            selectedAngle={selectedAngle}
            selectedValue={selectedValue}
            shouldSuppressOptionClick={shouldSuppressOptionClick}
          />
        </div>
      </div>
    );
  },
);

TimeClock.displayName = 'TimeClock';
