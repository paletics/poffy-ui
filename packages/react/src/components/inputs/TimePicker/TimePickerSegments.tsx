import { applyDisplayHour, applyMeridiem, type TimeParts } from '@poffy-ui/behavior/time';
import type { InputAppearance } from '@poffy-ui/types';
import { NumberInput } from '../NumberInput';
import { Select } from '../Select';
import { TimePickerSeparator } from './TimePickerSeparator';
import type { TimePickerFormat, TimePickerSize, TimePickerVariant } from './TimePicker.types';

interface TimePickerSegmentClasses {
  meridiem: string;
  segment: string;
  separator: string;
}

interface TimePickerSegmentsProps {
  appearance: InputAppearance;
  classes: TimePickerSegmentClasses;
  disabled: boolean;
  displayHour: number;
  emitChange: (nextParts: TimeParts) => void;
  error: boolean;
  format: TimePickerFormat;
  hourLabel: string;
  hourMax: number;
  hourMin: number;
  hourStep: number;
  inputId: string;
  meridiem: 'am' | 'pm';
  meridiemLabel: string;
  minuteLabel: string;
  minuteStep?: number;
  parts: TimeParts;
  readOnly: boolean;
  secondLabel: string;
  secondStep?: number;
  separator: string;
  size: TimePickerSize;
  variant: TimePickerVariant;
  withSeconds: boolean;
}

/**
 * Segment-based TimePicker input renderer.
 */
export const TimePickerSegments = ({
  appearance,
  classes,
  disabled,
  displayHour,
  emitChange,
  error,
  format,
  hourLabel,
  hourMax,
  hourMin,
  hourStep,
  inputId,
  meridiem,
  meridiemLabel,
  minuteLabel,
  minuteStep,
  parts,
  readOnly,
  secondLabel,
  secondStep,
  separator,
  size,
  variant,
  withSeconds,
}: TimePickerSegmentsProps) => (
  <>
    <div className={classes.segment}>
      <NumberInput
        id={`${inputId}-hour`}
        min={hourMin}
        max={hourMax}
        step={hourStep}
        value={displayHour}
        onChange={(nextDisplayHour) =>
          emitChange({
            ...parts,
            hour: applyDisplayHour(nextDisplayHour, parts.hour, format),
          })
        }
        size={size}
        appearance={appearance}
        variant={variant}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={hourLabel}
      />
    </div>

    <TimePickerSeparator className={classes.separator}>{separator}</TimePickerSeparator>

    <div className={classes.segment}>
      <NumberInput
        id={`${inputId}-minute`}
        min={0}
        max={59}
        step={minuteStep ?? 1}
        value={parts.minute}
        onChange={(minute) => emitChange({ ...parts, minute })}
        size={size}
        appearance={appearance}
        variant={variant}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={minuteLabel}
      />
    </div>

    {withSeconds && (
      <>
        <TimePickerSeparator className={classes.separator}>{separator}</TimePickerSeparator>
        <div className={classes.segment}>
          <NumberInput
            id={`${inputId}-second`}
            min={0}
            max={59}
            step={secondStep ?? 1}
            value={parts.second}
            onChange={(second) => emitChange({ ...parts, second })}
            size={size}
            appearance={appearance}
            variant={variant}
            error={error}
            disabled={disabled}
            readOnly={readOnly}
            aria-label={secondLabel}
          />
        </div>
      </>
    )}

    {format === '12h' && (
      <div className={classes.meridiem}>
        <Select
          id={`${inputId}-meridiem`}
          value={meridiem}
          onChange={(event) =>
            emitChange({
              ...parts,
              hour: applyMeridiem(parts.hour, event.target.value as 'am' | 'pm'),
            })
          }
          size={size}
          appearance={appearance}
          variant={variant}
          error={error}
          disabled={[disabled, readOnly].includes(true)}
          aria-label={meridiemLabel}
        >
          <option value="am">AM</option>
          <option value="pm">PM</option>
        </Select>
      </div>
    )}
  </>
);
