import type { InputAppearance, NativeProps } from '@poffy-ui/types';

/**
 * ### AI Context & Architecture
 * - Tier: Molecules
 */
export type NumberInputSize = 'sm' | 'md' | 'lg';

/**
 * Legacy visual variant for NumberInput.
 */
export type NumberInputVariant = 'outline' | 'filled' | 'flushed';

/**
 * Props for typed numeric entry with increment/decrement controls.
 *
 * ### Notes
 * `value` is controlled and must be updated from `onChange`; use `defaultValue`
 * for uncontrolled initial state. Values are numbers, not strings. Provide a
 * visible label, `aria-label`, or `aria-labelledby`. `min`, `max`, and `step`
 * are also used by the stepper behavior.
 *
 * Do: use NumberInput when exact keyboard entry matters.
 * Don't: use it for approximate preference selection; use Slider instead.
 *
 * @example
 * ```tsx
 * import { NumberInput } from '@poffy-ui/react/inputs';
 *
 * <NumberInput aria-label="Quantity" min={1} value={quantity} onChange={setQuantity} />
 * ```
 *
 * Related: SliderProps for range-based numeric selection.
 */
export type NumberInputProps = NativeProps<
  'input',
  {
    /** Minimum allowed value. */
    min?: number;
    /** Maximum allowed value. */
    max?: number;
    /** Increment/decrement step. @defaultValue `1` */
    step?: number;
    /** Controlled value. */
    value?: number;
    /** Uncontrolled default value. @defaultValue `0` */
    defaultValue?: number;
    /** Called when the value changes. */
    onChange?: (value: number) => void;
    disabled?: boolean;
    readOnly?: boolean;
    /** If true, applies error-specific styles. */
    error?: boolean;
    size?: NumberInputSize;
    appearance?: InputAppearance;
    variant?: NumberInputVariant;
    /** HTML name attribute for form submission. */
    name?: string;
    placeholder?: string;
    className?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    id?: string;
  }
>;
