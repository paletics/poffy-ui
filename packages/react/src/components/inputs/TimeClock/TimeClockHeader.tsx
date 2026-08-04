import { padTimeUnit, type TimeMeridiem, type TimeParts } from '@poffy-ui/behavior/time';
import type { Dispatch, FocusEventHandler, SetStateAction } from 'react';
import type { TimeClockUnit } from './TimeClock.types';
import type { TimeClockFormat } from './TimeClock.types';

interface TimeClockHeaderClasses {
  fieldButton: string;
  header: string;
  meridiemButton: string;
  meridiemGroup: string;
  separator: string;
}

interface TimeClockHeaderProps {
  activeUnit: TimeClockUnit;
  amLabel: string;
  classes: TimeClockHeaderClasses;
  disabled: boolean;
  displayHour: number;
  format: TimeClockFormat;
  hourLabel: string;
  meridiem: TimeMeridiem;
  meridiemLabel: string;
  minuteLabel: string;
  onMeridiemSelect: (meridiem: TimeMeridiem) => void;
  onSecondFocus?: FocusEventHandler<HTMLButtonElement>;
  parts: TimeParts;
  pmLabel: string;
  readOnly: boolean;
  secondLabel: string;
  setActiveUnit: Dispatch<SetStateAction<TimeClockUnit>>;
  withSeconds: boolean;
}

/**
 * Renders the TimeClock value header and meridiem controls.
 */
export const TimeClockHeader = ({
  activeUnit,
  amLabel,
  classes,
  disabled,
  displayHour,
  format,
  hourLabel,
  meridiem,
  meridiemLabel,
  minuteLabel,
  onMeridiemSelect,
  onSecondFocus,
  parts,
  pmLabel,
  readOnly,
  secondLabel,
  setActiveUnit,
  withSeconds,
}: TimeClockHeaderProps) => (
  <div className={classes.header}>
    <button
      type="button"
      className={classes.fieldButton}
      data-active={activeUnit === 'hour' ? '' : undefined}
      data-time-clock-control="hour"
      aria-label={`${hourLabel} ${padTimeUnit(displayHour)}`}
      aria-pressed={activeUnit === 'hour'}
      aria-disabled={readOnly ? true : undefined}
      disabled={disabled}
      onClick={() => {
        if (!readOnly) setActiveUnit('hour');
      }}
    >
      {padTimeUnit(displayHour)}
    </button>
    <span aria-hidden="true" className={classes.separator}>
      :
    </span>
    <button
      type="button"
      className={classes.fieldButton}
      data-active={activeUnit === 'minute' ? '' : undefined}
      data-time-clock-control="minute"
      aria-label={`${minuteLabel} ${padTimeUnit(parts.minute)}`}
      aria-pressed={activeUnit === 'minute'}
      aria-disabled={readOnly ? true : undefined}
      disabled={disabled}
      onClick={() => {
        if (!readOnly) setActiveUnit('minute');
      }}
    >
      {padTimeUnit(parts.minute)}
    </button>
    {withSeconds && (
      <>
        <span aria-hidden="true" className={classes.separator}>
          :
        </span>
        <button
          type="button"
          className={classes.fieldButton}
          data-active={activeUnit === 'second' ? '' : undefined}
          data-time-clock-control="second"
          aria-label={`${secondLabel} ${padTimeUnit(parts.second)}`}
          aria-pressed={activeUnit === 'second'}
          aria-disabled={readOnly ? true : undefined}
          disabled={disabled}
          onFocus={onSecondFocus}
          onClick={() => {
            if (!readOnly) setActiveUnit('second');
          }}
        >
          {padTimeUnit(parts.second)}
        </button>
      </>
    )}
    {format === '12h' && (
      <div className={classes.meridiemGroup} role="group" aria-label={meridiemLabel}>
        <button
          type="button"
          className={classes.meridiemButton}
          data-selected={meridiem === 'am' ? '' : undefined}
          data-time-clock-control="meridiem-am"
          aria-pressed={meridiem === 'am'}
          aria-disabled={readOnly ? true : undefined}
          disabled={disabled}
          onClick={() => onMeridiemSelect('am')}
        >
          {amLabel}
        </button>
        <button
          type="button"
          className={classes.meridiemButton}
          data-selected={meridiem === 'pm' ? '' : undefined}
          data-time-clock-control="meridiem-pm"
          aria-pressed={meridiem === 'pm'}
          aria-disabled={readOnly ? true : undefined}
          disabled={disabled}
          onClick={() => onMeridiemSelect('pm')}
        >
          {pmLabel}
        </button>
      </div>
    )}
  </div>
);
