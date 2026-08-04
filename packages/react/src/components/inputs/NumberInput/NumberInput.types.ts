import type { NativeProps } from '@poffy-ui/types';
import type { InputAppearanceProp } from '@/components/inputs/inputVariant';

/** Field size for `NumberInput`. */
export type NumberInputSize = 'sm' | 'md' | 'lg';

/** Localized accessibility labels for the NumberInput stepper controls. */
export interface NumberInputLabels {
  increment: string;
  decrement: string;
}

/**
 * Shared props for controlled and uncontrolled numeric spinbuttons. Supply a native or ARIA label.
 *
 * Bounds are finite inclusive numbers: non-finite limits are ignored and reversed limits are
 * reordered. The component renders a native `type="number"` input with `role="spinbutton"`.
 */
type NumberInputBaseProps = Omit<
  NativeProps<
    'input',
    {
      /** Minimum inclusive value; a reversed finite min/max pair is reordered. */
      min?: number;
      /** Maximum inclusive value; non-finite values are ignored. */
      max?: number;
      /**
       * Increment/decrement interval. Invalid values normalize to the supported step.
       *
       * @defaultValue `1`
       */
      step?: number;
      /** Controlled value after clamping. Reflect `onChange` to update the rendered value. */
      value?: number;
      /**
       * Initial uncontrolled value, also used by native form reset after clamping.
       *
       * @defaultValue `0`
       */
      defaultValue?: number;
      /** Called only after an accepted, changed numeric value is clamped to bounds. */
      onChange?: (value: number) => void;
      /** Disables typed entry and both stepper controls. */
      disabled?: boolean;
      /** Keeps the input focusable while preventing typed changes and both stepper controls. */
      readOnly?: boolean;
      /** If true, applies error-specific styles. */
      error?: boolean;
      /** Visual field size. @defaultValue `'md'` */
      size?: NumberInputSize;
      /** Surface treatment. @defaultValue `'outline'` */
      appearance?: InputAppearanceProp;
      /** BCP 47 locale for default stepper labels; exact locale, base language, then English. */
      locale?: string;
      /** Overrides localized stepper labels. */
      labels?: Partial<NumberInputLabels>;
      /** HTML name attribute for form submission. */
      name?: string;
      placeholder?: string;
      className?: string;
      'aria-label'?: string;
      'aria-labelledby'?: string;
      'aria-describedby'?: string;
      id?: string;
    }
  >,
  'role' | 'type'
>;

/**
 * Props for a controlled or uncontrolled numeric spinbutton.
 *
 * Controlled usage requires both `value` and `onChange`. Otherwise omit `value`, optionally seed
 * local state with `defaultValue`, and use `onChange` only as a notification callback. In either
 * mode rendered values, reset values, and accepted changes are clamped to normalized bounds.
 */
export type NumberInputProps = Omit<NumberInputBaseProps, 'defaultValue' | 'onChange' | 'value'> &
  (
    | {
        value: number;
        defaultValue?: never;
        onChange: (value: number) => void;
      }
    | {
        value?: never;
        defaultValue?: number;
        onChange?: (value: number) => void;
      }
  );
