import { forwardRef } from 'react';
import type { RangeSliderThumb as RangeSliderThumbName } from '@poffy-ui/behavior';
import type { CSSProperties, FocusEventHandler, KeyboardEventHandler } from 'react';

interface RangeSliderThumbProps {
  thumb: RangeSliderThumbName;
  value: number;
  percent: number;
  ariaValueMin: number;
  ariaValueMax: number;
  className: string;
  disabled?: boolean;
  readOnly?: boolean;
  lowerAriaLabel: string;
  upperAriaLabel: string;
  ariaLabelledBy?: string;
  getAriaValueText?: (value: number, thumb: RangeSliderThumbName) => string;
  describedBy?: string;
  errorMessage?: string;
  invalid?: boolean;
  direction?: 'ltr' | 'rtl';
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp: KeyboardEventHandler<HTMLButtonElement>;
  onBlur: FocusEventHandler<HTMLButtonElement>;
}

export const RangeSliderThumb = forwardRef<HTMLButtonElement, RangeSliderThumbProps>(
  (props, ref) => {
    const {
      thumb,
      value,
      percent,
      ariaValueMin,
      ariaValueMax,
      className,
      disabled,
      readOnly,
      lowerAriaLabel,
      upperAriaLabel,
      ariaLabelledBy,
      getAriaValueText,
      describedBy,
      errorMessage,
      invalid,
      direction,
      onKeyDown,
      onKeyUp,
      onBlur,
    } = props;
    const isLower = thumb === 'lower';

    return (
      <button
        ref={ref}
        type="button"
        role="slider"
        disabled={disabled}
        tabIndex={disabled ? undefined : 0}
        className={className}
        data-thumb={thumb}
        data-direction={direction}
        aria-label={ariaLabelledBy ? undefined : isLower ? lowerAriaLabel : upperAriaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-valuemin={ariaValueMin}
        aria-valuemax={ariaValueMax}
        aria-valuenow={value}
        aria-valuetext={getAriaValueText?.(value, thumb)}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        aria-invalid={invalid ? true : undefined}
        aria-readonly={readOnly ? true : undefined}
        aria-disabled={disabled ? true : undefined}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        // Runtime geometry is expressed as a percentage of the measured track.
        style={{ insetInlineStart: `${percent}%` } satisfies CSSProperties}
      />
    );
  },
);

RangeSliderThumb.displayName = 'RangeSliderThumb';
