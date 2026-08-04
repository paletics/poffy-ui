import type {
  RangeSliderThumb as RangeSliderThumbName,
  RangeSliderValue,
} from '@poffy-ui/behavior';
import type {
  FocusEventHandler,
  KeyboardEventHandler,
  PointerEventHandler,
  RefObject,
} from 'react';
import { RangeSliderThumb } from './RangeSliderThumb';

interface RangeSliderTrackProps {
  trackRef: RefObject<HTMLDivElement | null>;
  lowerThumbRef: RefObject<HTMLButtonElement | null>;
  upperThumbRef: RefObject<HTMLButtonElement | null>;
  classes: {
    track: string;
    range: string;
    thumb: string;
  };
  value: RangeSliderValue;
  lowerPercent: number;
  upperPercent: number;
  lowerAriaBounds: { min: number; max: number };
  upperAriaBounds: { min: number; max: number };
  disabled?: boolean;
  readOnly?: boolean;
  lowerAriaLabel: string;
  upperAriaLabel: string;
  lowerAriaLabelledBy?: string;
  upperAriaLabelledBy?: string;
  getAriaValueText?: (value: number, thumb: RangeSliderThumbName) => string;
  describedBy?: string;
  errorMessage?: string;
  invalid?: boolean;
  direction?: 'ltr' | 'rtl';
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
  onPointerCancel: PointerEventHandler<HTMLDivElement>;
  onLostPointerCapture: PointerEventHandler<HTMLDivElement>;
  onThumbKeyDown: (thumb: RangeSliderThumbName) => KeyboardEventHandler<HTMLButtonElement>;
  onThumbKeyUp: (thumb: RangeSliderThumbName) => KeyboardEventHandler<HTMLButtonElement>;
  onThumbBlur: (thumb: RangeSliderThumbName) => FocusEventHandler<HTMLButtonElement>;
}

export const RangeSliderTrack = ({
  trackRef,
  lowerThumbRef,
  upperThumbRef,
  classes,
  value,
  lowerPercent,
  upperPercent,
  lowerAriaBounds,
  upperAriaBounds,
  disabled,
  readOnly,
  lowerAriaLabel,
  upperAriaLabel,
  lowerAriaLabelledBy,
  upperAriaLabelledBy,
  getAriaValueText,
  describedBy,
  errorMessage,
  invalid,
  direction,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onThumbKeyDown,
  onThumbKeyUp,
  onThumbBlur,
}: RangeSliderTrackProps) => (
  <div
    ref={trackRef}
    className={classes.track}
    data-range-slider-track
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
    onPointerCancel={onPointerCancel}
    onLostPointerCapture={onLostPointerCapture}
  >
    <span
      className={classes.range}
      // Runtime geometry is derived from the normalized thumb values.
      style={{
        insetInlineStart: `${lowerPercent}%`,
        insetInlineEnd: `${100 - upperPercent}%`,
      }}
    />
    <RangeSliderThumb
      ref={lowerThumbRef}
      thumb="lower"
      value={value[0]}
      percent={lowerPercent}
      ariaValueMin={lowerAriaBounds.min}
      ariaValueMax={lowerAriaBounds.max}
      className={classes.thumb}
      disabled={disabled}
      readOnly={readOnly}
      lowerAriaLabel={lowerAriaLabel}
      upperAriaLabel={upperAriaLabel}
      ariaLabelledBy={lowerAriaLabelledBy}
      getAriaValueText={getAriaValueText}
      describedBy={describedBy}
      errorMessage={errorMessage}
      invalid={invalid}
      direction={direction}
      onKeyDown={onThumbKeyDown('lower')}
      onKeyUp={onThumbKeyUp('lower')}
      onBlur={onThumbBlur('lower')}
    />
    <RangeSliderThumb
      ref={upperThumbRef}
      thumb="upper"
      value={value[1]}
      percent={upperPercent}
      ariaValueMin={upperAriaBounds.min}
      ariaValueMax={upperAriaBounds.max}
      className={classes.thumb}
      disabled={disabled}
      readOnly={readOnly}
      lowerAriaLabel={lowerAriaLabel}
      upperAriaLabel={upperAriaLabel}
      ariaLabelledBy={upperAriaLabelledBy}
      getAriaValueText={getAriaValueText}
      describedBy={describedBy}
      errorMessage={errorMessage}
      invalid={invalid}
      direction={direction}
      onKeyDown={onThumbKeyDown('upper')}
      onKeyUp={onThumbKeyUp('upper')}
      onBlur={onThumbBlur('upper')}
    />
  </div>
);
