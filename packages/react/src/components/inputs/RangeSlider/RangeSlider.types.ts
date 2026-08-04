import type { NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { SliderIntent, SliderVariantSubset } from '../Slider';
import type { RangeSliderValue, RangeSliderThumb } from '@poffy-ui/behavior';

/** Identifies the lower or upper thumb in a two-value range slider. */
export type { RangeSliderThumb };
/** Tuple value used by a two-thumb range slider. */
export type { RangeSliderValue };

/** Localized accessible labels for the two slider thumbs. */
export interface RangeSliderLabels {
  lower: string;
  upper: string;
}

/** Component-specific props for RangeSlider. */
export interface RangeSliderOwnProps extends SliderVariantSubset {
  /** Controlled interval. Reflect `onValueChange` to update either thumb. */
  value?: RangeSliderValue;
  /** Initial interval used only while `value` is omitted. */
  defaultValue?: RangeSliderValue;
  /** Called for each accepted pointer or keyboard movement. */
  onValueChange?: (value: RangeSliderValue, thumb: RangeSliderThumb) => void;
  /** Called when a thumb interaction commits on release, key-up, or blur. */
  onValueCommit?: (value: RangeSliderValue, thumb: RangeSliderThumb) => void;
  /**
   * Lower bound; non-finite values fall back to `0`, and reversed bounds are reordered.
   *
   * @defaultValue `0`
   */
  min?: number;
  /**
   * Upper bound; non-finite values fall back to `100`, and reversed bounds are reordered.
   *
   * @defaultValue `100`
   */
  max?: number;
  /**
   * Movement granularity used for pointer and arrow-key actions.
   *
   * @defaultValue `1`
   */
  step?: number;
  /** Page-key movement granularity; omitted or non-positive values use ten `step` increments. */
  pageStep?: number;
  /**
   * Minimum whole number of `step` intervals that must remain between thumbs. Invalid values use
   * zero and the resolved gap cannot exceed the range width.
   */
  minStepsBetweenThumbs?: number;
  /**
   * Base name used to derive `${name}Min` and `${name}Max` hidden form fields. Explicit thumb
   * names override those derived names.
   */
  name?: string;
  /** ID of an associated form outside the slider DOM subtree. */
  form?: string;
  /** Explicit lower-thumb hidden form-field name. */
  lowerName?: string;
  /** Explicit upper-thumb hidden form-field name. */
  upperName?: string;
  /** BCP 47 locale used for default thumb labels; exact locale, base language, then English match. */
  locale?: string;
  /** Overrides localized thumb labels. */
  labels?: Partial<RangeSliderLabels>;
  /** Accessible lower-thumb descriptor, localized when omitted. */
  lowerAriaLabel?: string;
  /** Accessible upper-thumb descriptor, localized when omitted. */
  upperAriaLabel?: string;
  /** Formats one thumb's accessible numeric value. */
  getAriaValueText?: (value: number, thumb: RangeSliderThumb) => string;
  /**
   * Blocks interaction and disables generated hidden fields. The nearest `FormControl` disabled
   * state also applies when this prop is omitted.
   */
  disabled?: boolean;
  /**
   * Blocks pointer and keyboard movement but leaves generated hidden fields enabled for form
   * submission. The nearest `FormControl` read-only state also applies when omitted.
   */
  readOnly?: boolean;
  error?: boolean;
  intent?: SliderIntent;
  /** Visible group label; string children also contribute to the two thumb labels. */
  children?: ReactNode;
}

/**
 * Props for a controlled or uncontrolled two-thumb slider.
 *
 * A controlled slider requires `onValueChange`; runtime values are normalized to ordered bounded
 * endpoints before rendering and callbacks receive only accepted movements.
 */
export type RangeSliderProps = Omit<
  NativeProps<
    'div',
    Omit<RangeSliderOwnProps, 'defaultValue' | 'onChange' | 'onValueChange' | 'value'> & {
      onChange?: never;
    }
  >,
  'aria-disabled' | 'aria-readonly' | 'defaultValue' | 'onValueChange' | 'role' | 'value'
> & {
  role?: never;
  'aria-disabled'?: never;
  'aria-readonly'?: never;
} & (
    | {
        value: RangeSliderValue;
        defaultValue?: never;
        onValueChange: (value: RangeSliderValue, thumb: RangeSliderThumb) => void;
      }
    | {
        value?: never;
        defaultValue?: RangeSliderValue;
        onValueChange?: (value: RangeSliderValue, thumb: RangeSliderThumb) => void;
      }
  );
