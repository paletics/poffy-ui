'use client';

import {
  applyDisplayHour,
  applyMeridiem,
  buildTimeClockHourOptions,
  buildTimeUnitRange,
  fallbackTimeParts,
  formatTimeParts,
  getTimeClockUnitValue,
  getTimeClockValueAngle,
  parseTimeValue,
  toDisplayHour,
  toMeridiem,
  type TimeMeridiem,
  type TimeParts,
} from '@poffy-ui/behavior/time';
import { cx } from '@/styled-system/css';
import { timeClock } from '@/styled-system/recipes';
import { forwardRef, useMemo, useState } from 'react';
import { TimeClockDial } from './TimeClockDial';
import { TimeClockHeader } from './TimeClockHeader';
import type { TimeClockProps, TimeClockUnit } from './TimeClock.types';
import { useTimeClockPointer } from './useTimeClockPointer';

const minuteLabelDefault = 'Minutes';
const secondLabelDefault = 'Seconds';

/**
 * Clock-face time input used directly or as a TimePicker input mode.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS slot recipe, `@poffy-ui/behavior/time`
 * - **Accessibility**: Uses grouped buttons with explicit labels and keyboard-native activation.
 *
 * @example
 * ```tsx
 * <TimeClock value="09:30" onChange={setTime} />
 * ```
 */
export const TimeClock = forwardRef<HTMLDivElement, TimeClockProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      size = 'md',
      format: _format = '24h',
      withSeconds = false,
      disabled = false,
      readOnly = false,
      hourStep = 1,
      minuteStep = 5,
      secondStep = 5,
      name,
      hourLabel = 'Hours',
      minuteLabel = minuteLabelDefault,
      secondLabel = secondLabelDefault,
      meridiemLabel = 'AM/PM',
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [activeUnit, setActiveUnit] = useState<TimeClockUnit>('hour');
    const [internalParts, setInternalParts] = useState<TimeParts>(
      () => parseTimeValue(defaultValue) ?? fallbackTimeParts,
    );

    const parts = useMemo(
      () => (isControlled ? (parseTimeValue(valueProp) ?? fallbackTimeParts) : internalParts),
      [internalParts, isControlled, valueProp],
    );

    const classes = timeClock({ size });
    const hourOptions = useMemo(() => buildTimeClockHourOptions(hourStep), [hourStep]);
    const minuteOptions = useMemo(() => buildTimeUnitRange(0, 59, minuteStep), [minuteStep]);
    const secondOptions = useMemo(() => buildTimeUnitRange(0, 59, secondStep), [secondStep]);
    const options =
      activeUnit === 'hour' ? hourOptions : activeUnit === 'minute' ? minuteOptions : secondOptions;
    const selectedValue = getTimeClockUnitValue(parts, activeUnit, '12h');
    const selectedAngle = `${getTimeClockValueAngle(selectedValue, activeUnit)}deg`;

    const emitChange = (nextParts: TimeParts) => {
      if (!isControlled) {
        setInternalParts(nextParts);
      }
      onChange?.(formatTimeParts(nextParts, withSeconds));
    };

    const selectValue = (nextValue: number, advanceUnit = true) => {
      if (disabled || readOnly) return;

      if (activeUnit === 'hour') {
        emitChange({
          ...parts,
          hour: applyDisplayHour(nextValue, parts.hour, '12h'),
        });
        setActiveUnit('minute');
        return;
      }

      if (activeUnit === 'minute') {
        emitChange({ ...parts, minute: nextValue });
        if (advanceUnit && withSeconds) setActiveUnit('second');
        return;
      }

      emitChange({ ...parts, second: nextValue });
    };

    const selectMeridiem = (nextMeridiem: TimeMeridiem) => {
      if (disabled || readOnly) return;
      emitChange({ ...parts, hour: applyMeridiem(parts.hour, nextMeridiem) });
    };

    const { dialPointerProps, shouldSuppressOptionClick } = useTimeClockPointer({
      activeUnit,
      disabled,
      onSelect: (value) => selectValue(value, activeUnit === 'hour'),
      readOnly,
    });
    const displayHour = toDisplayHour(parts.hour, '12h');
    const meridiem = toMeridiem(parts.hour);

    return (
      <div
        ref={ref}
        role="group"
        aria-disabled={disabled ? true : undefined}
        className={cx(classes.root, className)}
        data-disabled={disabled ? '' : undefined}
        {...props}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={formatTimeParts(parts, withSeconds)}
            disabled={disabled}
            readOnly
          />
        )}

        <TimeClockHeader
          activeUnit={activeUnit}
          classes={classes}
          disabled={disabled}
          displayHour={displayHour}
          meridiem={meridiem}
          meridiemLabel={meridiemLabel}
          onMeridiemSelect={selectMeridiem}
          parts={parts}
          setActiveUnit={setActiveUnit}
          withSeconds={withSeconds}
        />

        <TimeClockDial
          activeUnit={activeUnit}
          classes={classes}
          disabled={disabled}
          hourLabel={hourLabel}
          minuteLabel={minuteLabel}
          onSelect={selectValue}
          options={options}
          pointerProps={dialPointerProps}
          secondLabel={secondLabel}
          selectedAngle={selectedAngle}
          selectedValue={selectedValue}
          shouldSuppressOptionClick={shouldSuppressOptionClick}
        />
      </div>
    );
  },
);

TimeClock.displayName = 'TimeClock';
