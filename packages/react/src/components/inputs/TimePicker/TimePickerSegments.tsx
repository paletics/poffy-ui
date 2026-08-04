import { applyDisplayHour, applyMeridiem, type TimeParts } from '@poffy-ui/behavior/time';
import type { AriaAttributes } from 'react';
import { useReducer } from 'react';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';
import { NumberInput } from '../NumberInput';
import { Select } from '../Select';
import { TimePickerSeparator } from './TimePickerSeparator';
import type { TimePickerFormat, TimePickerSize } from './TimePicker.types';

interface TimePickerSegmentClasses {
  meridiem: string;
  segment: string;
  separator: string;
}

interface TimePickerSegmentsProps {
  amLabel: string;
  ariaRequired?: boolean;
  appearance: InputAppearanceProp;
  classes: TimePickerSegmentClasses;
  disabled: boolean;
  describedBy?: string;
  displayHour: number;
  emitChange: (nextParts: TimeParts) => boolean;
  error: boolean;
  errorMessage?: string;
  format: TimePickerFormat;
  hourLabel: string;
  hourMax: number;
  hourMin: number;
  hourStep: number;
  inputId: string;
  invalid?: AriaAttributes['aria-invalid'];
  meridiem: 'am' | 'pm';
  meridiemLabel: string;
  minuteLabel: string;
  minuteStep?: number;
  parts: TimeParts;
  pmLabel: string;
  readOnly: boolean;
  required: boolean;
  secondLabel: string;
  secondStep?: number;
  separator: string;
  size: TimePickerSize;
  withSeconds: boolean;
  onRejectedChange: () => void;
}

/**
 * Renders the segment-mode hour, minute, optional second, and meridiem controls.
 *
 * All segments propose one complete `TimeParts` value through `emitChange`; a rejected constraint
 * change resets their keyed controls and delegates focus recovery to the parent mode renderer.
 * The visible separators are hidden from assistive technology because each input has its own label.
 */
export const TimePickerSegments = ({
  amLabel,
  ariaRequired,
  appearance,
  classes,
  disabled,
  describedBy,
  displayHour,
  emitChange,
  error,
  errorMessage,
  format,
  hourLabel,
  hourMax,
  hourMin,
  hourStep,
  inputId,
  invalid,
  meridiem,
  meridiemLabel,
  minuteLabel,
  minuteStep,
  parts,
  pmLabel,
  readOnly,
  required,
  secondLabel,
  secondStep,
  separator,
  size,
  withSeconds,
  onRejectedChange,
}: TimePickerSegmentsProps) => {
  const [rejectedChangeVersion, resetRejectedChange] = useReducer((value: number) => value + 1, 0);
  const commitChange = (nextParts: TimeParts) => {
    if (!emitChange(nextParts)) {
      onRejectedChange();
      resetRejectedChange();
    }
  };

  return (
    <>
      <div className={classes.segment}>
        <NumberInput
          key={`hour-${rejectedChangeVersion}`}
          id={`${inputId}-hour`}
          min={hourMin}
          max={hourMax}
          step={hourStep}
          value={displayHour}
          onChange={(nextDisplayHour) =>
            commitChange({
              ...parts,
              hour: applyDisplayHour(nextDisplayHour, parts.hour, format),
            })
          }
          size={size}
          appearance={appearance}
          error={error}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-required={ariaRequired || undefined}
          aria-label={hourLabel}
          aria-describedby={describedBy}
          aria-errormessage={errorMessage}
          aria-invalid={invalid}
        />
      </div>

      <TimePickerSeparator className={classes.separator}>{separator}</TimePickerSeparator>

      <div className={classes.segment}>
        <NumberInput
          key={`minute-${rejectedChangeVersion}`}
          id={`${inputId}-minute`}
          min={0}
          max={59}
          step={minuteStep ?? 1}
          value={parts.minute}
          onChange={(minute) => commitChange({ ...parts, minute })}
          size={size}
          appearance={appearance}
          error={error}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-required={ariaRequired || undefined}
          aria-label={minuteLabel}
          aria-describedby={describedBy}
          aria-errormessage={errorMessage}
          aria-invalid={invalid}
        />
      </div>

      {withSeconds && (
        <>
          <TimePickerSeparator className={classes.separator}>{separator}</TimePickerSeparator>
          <div className={classes.segment}>
            <NumberInput
              key={`second-${rejectedChangeVersion}`}
              id={`${inputId}-second`}
              min={0}
              max={59}
              step={secondStep ?? 1}
              value={parts.second}
              onChange={(second) => commitChange({ ...parts, second })}
              size={size}
              appearance={appearance}
              error={error}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              aria-required={ariaRequired || undefined}
              aria-label={secondLabel}
              aria-describedby={describedBy}
              aria-errormessage={errorMessage}
              aria-invalid={invalid}
            />
          </div>
        </>
      )}

      {format === '12h' && (
        <div className={classes.meridiem}>
          <Select
            key={`meridiem-${rejectedChangeVersion}`}
            id={`${inputId}-meridiem`}
            value={meridiem}
            onChange={(event) =>
              commitChange({
                ...parts,
                hour: applyMeridiem(parts.hour, event.target.value as 'am' | 'pm'),
              })
            }
            size={size}
            appearance={appearance}
            error={error}
            disabled={[disabled, readOnly].includes(true)}
            required={required}
            aria-required={ariaRequired || undefined}
            aria-label={meridiemLabel}
            aria-describedby={describedBy}
            aria-errormessage={errorMessage}
            aria-invalid={invalid}
          >
            <option value="am">{amLabel}</option>
            <option value="pm">{pmLabel}</option>
          </Select>
        </div>
      )}
    </>
  );
};
