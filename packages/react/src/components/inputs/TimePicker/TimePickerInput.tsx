import { getDeepActiveElement, getDOMTreeRoot, getTreeElementById } from '@poffy-ui/behavior/hooks';
import { fallbackTimeParts, parseTimeValue } from '@poffy-ui/behavior/time';
import type { AriaAttributes } from 'react';
import { useLayoutEffect, useReducer, useRef } from 'react';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';
import { TimeClock } from '../TimeClock';
import { WheelPicker } from '../WheelPicker';
import { TimePickerSegments } from './TimePickerSegments';
import type { TimePickerFormat, TimePickerInputMode, TimePickerSize } from './TimePicker.types';
import type { TimePickerMessages } from './TimePicker.types';
import type { useTimePickerModel } from './useTimePickerModel';

interface TimePickerClasses {
  meridiem: string;
  segment: string;
  separator: string;
}

interface TimePickerInputProps {
  amLabel: string;
  appearance: InputAppearanceProp;
  classes: TimePickerClasses;
  disabled: boolean;
  describedBy?: string;
  error: boolean;
  errorMessage?: string;
  format: TimePickerFormat;
  getRootElement: () => HTMLElement | null;
  hourLabel: string;
  hourStep: number;
  inputMode: TimePickerInputMode;
  invalid?: AriaAttributes['aria-invalid'];
  locale: string;
  meridiemLabel: string;
  minuteLabel: string;
  minuteStep?: number;
  model: ReturnType<typeof useTimePickerModel>;
  messages: TimePickerMessages;
  pmLabel: string;
  readOnly: boolean;
  required: boolean;
  secondLabel: string;
  secondStep?: number;
  separator: string;
  size: TimePickerSize;
  withSeconds: boolean;
}

/**
 * Selects the segment, clock, or wheel renderer for TimePicker's shared model.
 *
 * A rejected constraint change remounts the active mode from the last accepted value and restores
 * focus to the equivalent control when it can still be found in the owner DOM tree. Each mode must
 * call the model's boolean result so unavailable selections do not leave stale optimistic UI.
 */
export const TimePickerInput = ({
  amLabel,
  appearance,
  classes,
  disabled,
  describedBy,
  error,
  errorMessage,
  format,
  getRootElement,
  hourLabel,
  hourStep,
  inputMode,
  invalid,
  locale,
  meridiemLabel,
  minuteLabel,
  minuteStep,
  model,
  messages,
  pmLabel,
  readOnly,
  required,
  secondLabel,
  secondStep,
  separator,
  size,
  withSeconds,
}: TimePickerInputProps) => {
  const [rejectedChangeVersion, resetRejectedChange] = useReducer((value: number) => value + 1, 0);
  const rejectedFocusRef = useRef<
    | {
        ariaLabel?: string;
        id?: string;
        numberInputId?: string;
        rootId?: string;
        selector?: string;
        stepperDirection?: string;
      }
    | undefined
  >(undefined);

  useLayoutEffect(() => {
    const target = rejectedFocusRef.current;
    if (!target) return;
    const rootElement = getRootElement();
    if (!rootElement) {
      rejectedFocusRef.current = undefined;
      return;
    }
    const findOwnedElementById = (id: string) => {
      const element = getTreeElementById<HTMLElement>(rootElement, id);
      return element && rootElement.contains(element) ? element : undefined;
    };

    const numberInput = target.numberInputId
      ? findOwnedElementById(target.numberInputId)?.parentElement?.querySelector<HTMLElement>(
          `[data-direction="${target.stepperDirection}"]`,
        )
      : undefined;
    const replacement =
      numberInput ??
      (target.rootId && target.selector
        ? findOwnedElementById(target.rootId)?.querySelector<HTMLElement>(target.selector)
        : undefined) ??
      (target.id
        ? findOwnedElementById(target.id)
        : Array.from(rootElement.querySelectorAll<HTMLElement>('[aria-label]')).find(
            (element) => element.getAttribute('aria-label') === target.ariaLabel,
          ));
    replacement?.focus();
    rejectedFocusRef.current = undefined;
  }, [getRootElement, rejectedChangeVersion]);

  const resetRejectedChangeWithFocus = () => {
    const rootElement = getRootElement();
    const OwnerHTMLElement = rootElement?.ownerDocument.defaultView?.HTMLElement;
    const activeElement = rootElement ? getDeepActiveElement(getDOMTreeRoot(rootElement)) : null;
    if (
      !rootElement ||
      !OwnerHTMLElement ||
      !(activeElement instanceof OwnerHTMLElement) ||
      !rootElement.contains(activeElement)
    ) {
      rejectedFocusRef.current = undefined;
      resetRejectedChange();
      return;
    }

    const wheelColumn = activeElement.closest<HTMLElement>('[data-wheel-picker-column]');
    const clockControl = activeElement.closest<HTMLElement>('[data-time-clock-control]');
    const clockOption = activeElement.closest<HTMLElement>('[data-time-clock-option]');
    const numberInput = activeElement
      .closest('[data-direction]')
      ?.parentElement?.parentElement?.querySelector('input[id]');
    rejectedFocusRef.current = {
      ariaLabel: activeElement.getAttribute('aria-label') ?? undefined,
      id: activeElement.id,
      numberInputId: numberInput?.id,
      rootId: wheelColumn
        ? `${model.inputId}-wheel`
        : clockControl || clockOption
          ? `${model.inputId}-clock`
          : undefined,
      selector: wheelColumn
        ? `[data-wheel-picker-column="${wheelColumn.getAttribute('data-wheel-picker-column')}"]`
        : clockControl
          ? `[data-time-clock-control="${clockControl.getAttribute('data-time-clock-control')}"]`
          : clockOption
            ? `[data-time-clock-option="${clockOption.getAttribute('data-time-clock-option')}"]`
            : undefined,
      stepperDirection: activeElement.getAttribute('data-direction') ?? undefined,
    };
    resetRejectedChange();
  };

  if (inputMode === 'clock') {
    return (
      <TimeClock
        key={`clock-${rejectedChangeVersion}`}
        id={`${model.inputId}-clock`}
        value={model.formattedValue}
        onChange={(nextValue) => {
          const accepted = model.emitChange(parseTimeValue(nextValue) ?? fallbackTimeParts);
          if (!accepted) resetRejectedChangeWithFocus();
        }}
        size={size}
        format={format}
        locale={locale}
        messages={messages}
        withSeconds={withSeconds}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        aria-invalid={invalid}
        hourStep={hourStep}
        minuteStep={minuteStep ?? 5}
        secondStep={secondStep ?? 5}
        hourLabel={hourLabel}
        minuteLabel={minuteLabel}
        secondLabel={secondLabel}
        meridiemLabel={meridiemLabel}
      />
    );
  }

  if (inputMode === 'wheel') {
    return (
      <WheelPicker
        key={`wheel-${rejectedChangeVersion}`}
        id={`${model.inputId}-wheel`}
        columns={model.wheelColumns}
        value={model.wheelValue}
        onChange={(nextValue) => {
          const accepted = model.handleWheelChange(nextValue);
          if (!accepted) resetRejectedChangeWithFocus();
        }}
        size={size}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        aria-invalid={invalid}
        required={required}
      />
    );
  }

  return (
    <TimePickerSegments
      appearance={appearance}
      amLabel={amLabel}
      classes={classes}
      disabled={disabled}
      describedBy={describedBy}
      displayHour={model.displayHour}
      emitChange={model.emitChange}
      error={error}
      errorMessage={errorMessage}
      format={format}
      hourLabel={hourLabel}
      hourMax={model.hourMax}
      hourMin={model.hourMin}
      hourStep={hourStep}
      inputId={model.inputId}
      invalid={invalid}
      meridiem={model.meridiem}
      meridiemLabel={meridiemLabel}
      minuteLabel={minuteLabel}
      minuteStep={minuteStep}
      parts={model.parts}
      pmLabel={pmLabel}
      readOnly={readOnly}
      required={false}
      ariaRequired={required}
      secondLabel={secondLabel}
      secondStep={secondStep}
      separator={separator}
      size={size}
      withSeconds={withSeconds}
      onRejectedChange={resetRejectedChangeWithFocus}
    />
  );
};
