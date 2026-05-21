import { padTimeUnit, type TimeMeridiem, type TimeParts } from '@poffy-ui/behavior/time';
import type { Dispatch, SetStateAction } from 'react';
import type { TimeClockUnit } from './TimeClock.types';

interface TimeClockHeaderClasses {
  fieldButton: string;
  header: string;
  meridiemButton: string;
  meridiemGroup: string;
  separator: string;
}

interface TimeClockHeaderProps {
  activeUnit: TimeClockUnit;
  classes: TimeClockHeaderClasses;
  disabled: boolean;
  displayHour: number;
  meridiem: TimeMeridiem;
  meridiemLabel: string;
  onMeridiemSelect: (meridiem: TimeMeridiem) => void;
  parts: TimeParts;
  setActiveUnit: Dispatch<SetStateAction<TimeClockUnit>>;
  withSeconds: boolean;
}

/**
 * Renders the TimeClock value header and meridiem controls.
 */
export const TimeClockHeader = ({
  activeUnit,
  classes,
  disabled,
  displayHour,
  meridiem,
  meridiemLabel,
  onMeridiemSelect,
  parts,
  setActiveUnit,
  withSeconds,
}: TimeClockHeaderProps) => (
  <div className={classes.header}>
    <button
      type="button"
      className={classes.fieldButton}
      data-active={activeUnit === 'hour' ? '' : undefined}
      aria-pressed={activeUnit === 'hour'}
      disabled={disabled}
      onClick={() => setActiveUnit('hour')}
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
      aria-pressed={activeUnit === 'minute'}
      disabled={disabled}
      onClick={() => setActiveUnit('minute')}
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
          aria-pressed={activeUnit === 'second'}
          disabled={disabled}
          onClick={() => setActiveUnit('second')}
        >
          {padTimeUnit(parts.second)}
        </button>
      </>
    )}
    <div className={classes.meridiemGroup} aria-label={meridiemLabel}>
      <button
        type="button"
        className={classes.meridiemButton}
        data-selected={meridiem === 'am' ? '' : undefined}
        disabled={disabled}
        onClick={() => onMeridiemSelect('am')}
      >
        AM
      </button>
      <button
        type="button"
        className={classes.meridiemButton}
        data-selected={meridiem === 'pm' ? '' : undefined}
        disabled={disabled}
        onClick={() => onMeridiemSelect('pm')}
      >
        PM
      </button>
    </div>
  </div>
);
