import { getTimeClockValueAngle, padTimeUnit } from '@poffy-ui/behavior/time';
import type { CSSProperties, HTMLAttributes } from 'react';
import type { TimeClockUnit } from './TimeClock.types';

interface TimeClockDialClasses {
  center: string;
  dial: string;
  hand: string;
  option: string;
}

interface TimeClockDialProps {
  activeUnit: TimeClockUnit;
  classes: TimeClockDialClasses;
  disabled: boolean;
  hourLabel: string;
  minuteLabel: string;
  onSelect: (value: number) => void;
  options: number[];
  pointerProps: HTMLAttributes<HTMLDivElement>;
  secondLabel: string;
  selectedAngle: string;
  selectedValue: number;
  shouldSuppressOptionClick: () => boolean;
}

/**
 * Renders the selectable TimeClock dial options for the active time unit.
 */
export const TimeClockDial = ({
  activeUnit,
  classes,
  disabled,
  hourLabel,
  minuteLabel,
  onSelect,
  options,
  pointerProps,
  secondLabel,
  selectedAngle,
  selectedValue,
  shouldSuppressOptionClick,
}: TimeClockDialProps) => (
  <div
    className={classes.dial}
    role="group"
    aria-label={
      activeUnit === 'hour' ? hourLabel : activeUnit === 'minute' ? minuteLabel : secondLabel
    }
    style={
      {
        '--time-clock-selected-angle': selectedAngle,
      } as CSSProperties
    }
    {...pointerProps}
  >
    <div className={classes.hand} aria-hidden="true" />
    {options.map((option) => {
      const isSelected = option === selectedValue;
      const angle = `${getTimeClockValueAngle(option, activeUnit)}deg`;
      const label =
        activeUnit === 'hour'
          ? `${hourLabel} ${option}`
          : `${activeUnit === 'minute' ? minuteLabel : secondLabel} ${padTimeUnit(option)}`;

      return (
        <button
          key={`${activeUnit}-${option}`}
          type="button"
          className={classes.option}
          data-selected={isSelected ? '' : undefined}
          aria-label={label}
          aria-pressed={isSelected}
          disabled={disabled}
          onClick={(event) => {
            if (shouldSuppressOptionClick()) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }

            onSelect(option);
          }}
          style={
            {
              '--time-clock-angle': angle,
            } as CSSProperties
          }
        >
          {option}
        </button>
      );
    })}
    <div className={classes.center} aria-hidden="true" />
  </div>
);
