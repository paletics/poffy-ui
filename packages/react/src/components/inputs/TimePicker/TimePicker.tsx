'use client';

import { cx } from '@/styled-system/css';
import { timePicker } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { TimePickerInput } from './TimePickerInput';
import type { TimePickerProps } from './TimePicker.types';
import { useTimePickerModel } from './useTimePickerModel';

const minuteLabelDefault = 'Minutes';
const secondLabelDefault = 'Seconds';

/**
 * Time picker with segment, clock, or wheel input modes.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: `useTimePickerModel`, `TimePickerInput`, Panda CSS (`timePicker` recipe)
 * - **Props**: `TimePickerProps`
 *
 * ### Design Tokens
 * - **spacing**: segment and mode layout spacing comes from the `timePicker` recipe
 * - **color**: delegates field and error colors to the selected input mode
 *
 * ### Variant Logic
 * - **inputMode="segments"**: Best for dense forms and keyboard-first editing.
 * - **inputMode="clock"**: Best for guided visual time selection.
 * - **inputMode="wheel"**: Best for touch-first time picking.
 * - **format="12h"**: Adds meridiem selection; keep labels explicit for screen readers.
 *
 * ### Accessibility
 * - **Role**: group wrapping time segments or picker controls.
 * - **Keyboard**: Segment mode supports field navigation; clock and wheel modes own their controls.
 * - **Required**: Provide an external label via `FormControl`, `aria-label`, or `aria-labelledby`.
 *
 * ### AI Usage
 * - **DO**: Use for time-only form values serialized as `HH:mm` or `HH:mm:ss`.
 * - **DON'T**: Use for full date-time values; choose `DateTimePicker`.
 *
 * @example Segment input
 * ```tsx
 * import { TimePicker } from '@poffy-ui/react/inputs';
 *
 * <TimePicker name="startTime" onChange={setStartTime} />
 * ```
 *
 * @example Wheel input with seconds
 * ```tsx
 * import { TimePicker } from '@poffy-ui/react/inputs';
 *
 * <TimePicker inputMode="wheel" withSeconds format="24h" />
 * ```
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      appearance = 'outline',
      variant,
      inputMode = 'segments',
      format = '24h',
      withSeconds = false,
      error = false,
      disabled = false,
      readOnly = false,
      hourStep = 1,
      minuteStep,
      secondStep,
      name,
      form,
      separator = ':',
      hourLabel = 'Hours',
      minuteLabel = minuteLabelDefault,
      secondLabel = secondLabelDefault,
      meridiemLabel = 'AM/PM',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const classes = timePicker({ size });
    const resolvedVariant = variant ?? (appearance === 'soft' ? 'filled' : 'outline');
    const model = useTimePickerModel({
      defaultValue,
      format,
      hourLabel,
      hourStep,
      id,
      meridiemLabel,
      minuteLabel,
      minuteStep,
      onChange,
      secondLabel,
      secondStep,
      value: valueProp,
      withSeconds,
    });

    return (
      <div
        ref={ref}
        role="group"
        aria-disabled={disabled ? true : undefined}
        className={cx(classes.root, className)}
        {...props}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={model.formattedValue}
            form={form}
            disabled={disabled}
            readOnly
          />
        )}

        <TimePickerInput
          appearance={appearance}
          classes={classes}
          disabled={disabled}
          error={error}
          format={format}
          hourLabel={hourLabel}
          hourStep={hourStep}
          inputMode={inputMode}
          meridiemLabel={meridiemLabel}
          minuteLabel={minuteLabel}
          minuteStep={minuteStep}
          model={model}
          readOnly={readOnly}
          secondLabel={secondLabel}
          secondStep={secondStep}
          separator={separator}
          size={size}
          variant={resolvedVariant}
          withSeconds={withSeconds}
        />
      </div>
    );
  },
);

TimePicker.displayName = 'TimePicker';
