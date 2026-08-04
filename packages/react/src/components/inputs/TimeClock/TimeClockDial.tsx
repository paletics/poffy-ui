import { getTimeClockHourRing, getTimeClockValueAngle, padTimeUnit } from '@poffy-ui/behavior/time';
import type { AriaAttributes, CSSProperties, HTMLAttributes, KeyboardEvent, Ref } from 'react';
import type { TimeClockFormat, TimeClockUnit } from './TimeClock.types';

interface TimeClockDialClasses {
  center: string;
  dial: string;
  hand: string;
  option: string;
}

interface TimeClockDialProps {
  activeUnit: TimeClockUnit;
  describedBy?: string;
  errorMessage?: string;
  invalid?: AriaAttributes['aria-invalid'];
  required?: boolean;
  classes: TimeClockDialClasses;
  disabled: boolean;
  format: TimeClockFormat;
  dialRef: Ref<HTMLDivElement>;
  hourLabel: string;
  minuteLabel: string;
  onSelect: (value: number, advanceUnit: boolean) => void;
  options: number[];
  pointerProps: HTMLAttributes<HTMLDivElement>;
  readOnly: boolean;
  previewValue: number | null;
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
  describedBy,
  errorMessage,
  invalid,
  required,
  classes,
  disabled,
  format,
  dialRef,
  hourLabel,
  minuteLabel,
  onSelect,
  options,
  pointerProps,
  readOnly,
  previewValue,
  secondLabel,
  selectedAngle,
  selectedValue,
  shouldSuppressOptionClick,
}: TimeClockDialProps) => (
  <div
    ref={dialRef}
    className={classes.dial}
    role="radiogroup"
    aria-label={
      activeUnit === 'hour' ? hourLabel : activeUnit === 'minute' ? minuteLabel : secondLabel
    }
    aria-describedby={describedBy}
    aria-errormessage={errorMessage}
    aria-invalid={invalid}
    aria-readonly={readOnly ? true : undefined}
    aria-required={required ? true : undefined}
    style={
      {
        '--time-clock-selected-angle': selectedAngle,
      } as CSSProperties
    }
    data-selected-ring={getTimeClockHourRing(
      previewValue ?? selectedValue,
      activeUnit === 'hour' ? format : '12h',
    )}
    {...pointerProps}
  >
    <div className={classes.hand} aria-hidden="true" />
    {options.map((option, optionIndex) => {
      const isSelected = option === selectedValue;
      const isPreviewed = option === previewValue;
      const angle = `${getTimeClockValueAngle(option, activeUnit)}deg`;
      const label =
        activeUnit === 'hour'
          ? `${hourLabel} ${format === '24h' ? padTimeUnit(option) : option}`
          : `${activeUnit === 'minute' ? minuteLabel : secondLabel} ${padTimeUnit(option)}`;
      const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, nextIndex: number) => {
        const optionsInDial =
          event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
            '[data-time-clock-option]',
          );
        optionsInDial?.[nextIndex]?.focus();
        onSelect(options[nextIndex]!, false);
      };

      return (
        <button
          key={`${activeUnit}-${option}`}
          type="button"
          className={classes.option}
          data-selected={isSelected ? '' : undefined}
          data-preview={isPreviewed ? '' : undefined}
          data-ring={getTimeClockHourRing(option, activeUnit === 'hour' ? format : '12h')}
          data-time-clock-option={`${activeUnit}-${option}`}
          aria-label={activeUnit === 'hour' && format === '24h' ? undefined : label}
          aria-checked={isSelected}
          disabled={disabled}
          role="radio"
          tabIndex={isSelected ? 0 : -1}
          onKeyDown={(event) => {
            if (
              !['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home'].includes(
                event.key,
              )
            ) {
              return;
            }
            event.preventDefault();
            const lastIndex = options.length - 1;
            const nextIndex =
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? lastIndex
                  : ['ArrowDown', 'ArrowRight'].includes(event.key)
                    ? (optionIndex + 1) % options.length
                    : (optionIndex - 1 + options.length) % options.length;
            moveFocus(event, nextIndex);
          }}
          onClick={(event) => {
            if (shouldSuppressOptionClick()) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            onSelect(option, true);
          }}
          style={
            {
              '--time-clock-angle': angle,
            } as CSSProperties
          }
        >
          {activeUnit === 'hour' && format === '24h' ? padTimeUnit(option) : option}
        </button>
      );
    })}
    <div className={classes.center} aria-hidden="true" />
  </div>
);
