import { fallbackTimeParts, parseTimeValue } from '@poffy-ui/behavior/time';
import type { InputAppearance } from '@poffy-ui/types';
import { TimeClock } from '../TimeClock';
import { WheelPicker } from '../WheelPicker';
import { TimePickerSegments } from './TimePickerSegments';
import type {
  TimePickerFormat,
  TimePickerInputMode,
  TimePickerSize,
  TimePickerVariant,
} from './TimePicker.types';
import type { useTimePickerModel } from './useTimePickerModel';

interface TimePickerClasses {
  meridiem: string;
  segment: string;
  separator: string;
}

interface TimePickerInputProps {
  appearance: InputAppearance;
  classes: TimePickerClasses;
  disabled: boolean;
  error: boolean;
  format: TimePickerFormat;
  hourLabel: string;
  hourStep: number;
  inputMode: TimePickerInputMode;
  meridiemLabel: string;
  minuteLabel: string;
  minuteStep?: number;
  model: ReturnType<typeof useTimePickerModel>;
  readOnly: boolean;
  secondLabel: string;
  secondStep?: number;
  separator: string;
  size: TimePickerSize;
  variant: TimePickerVariant;
  withSeconds: boolean;
}

/**
 * Internal renderer that switches between TimePicker input modes.
 */
export const TimePickerInput = ({
  appearance,
  classes,
  disabled,
  error,
  format,
  hourLabel,
  hourStep,
  inputMode,
  meridiemLabel,
  minuteLabel,
  minuteStep,
  model,
  readOnly,
  secondLabel,
  secondStep,
  separator,
  size,
  variant,
  withSeconds,
}: TimePickerInputProps) => {
  if (inputMode === 'clock') {
    return (
      <TimeClock
        value={model.formattedValue}
        onChange={(nextValue) => model.emitChange(parseTimeValue(nextValue) ?? fallbackTimeParts)}
        size={size}
        format={format}
        withSeconds={withSeconds}
        disabled={disabled}
        readOnly={readOnly}
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
        columns={model.wheelColumns}
        value={model.wheelValue}
        onChange={model.handleWheelChange}
        size={size}
        error={error}
        disabled={disabled}
        readOnly={readOnly}
      />
    );
  }

  return (
    <TimePickerSegments
      appearance={appearance}
      classes={classes}
      disabled={disabled}
      displayHour={model.displayHour}
      emitChange={model.emitChange}
      error={error}
      format={format}
      hourLabel={hourLabel}
      hourMax={model.hourMax}
      hourMin={model.hourMin}
      hourStep={hourStep}
      inputId={model.inputId}
      meridiem={model.meridiem}
      meridiemLabel={meridiemLabel}
      minuteLabel={minuteLabel}
      minuteStep={minuteStep}
      parts={model.parts}
      readOnly={readOnly}
      secondLabel={secondLabel}
      secondStep={secondStep}
      separator={separator}
      size={size}
      variant={variant}
      withSeconds={withSeconds}
    />
  );
};
