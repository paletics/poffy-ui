import { CheckboxVariantProps } from '@/styled-system/recipes';
import { type ControlIntent, PrimitiveProps } from '@poffy-ui/types';

/**
 * Variants for the Checkbox component based on Panda CSS recipe.
 * ### AI Usage
 * - Use this when extending checkbox styles.
 */
export type CheckboxVariants = CheckboxVariantProps;

/**
 * Public checkbox variant props with shared control intent names.
 */
export interface CheckboxVariantSubset extends Omit<CheckboxVariantProps, 'intent'> {
  /** Visual intent mapped to the shared control intent token set. */
  intent?: ControlIntent;
}

/**
 * Shared props for CheckboxGroup.
 *
 * ### Notes
 * `value` is controlled and must be updated from `onChange`; use `defaultValue`
 * for uncontrolled initial checked values. Group children should be Checkbox
 * controls with stable string `value` props.
 */
export interface CheckboxGroupBaseProps extends CheckboxVariantSubset {
  /** Orientation of the group layout. */
  orientation?: 'horizontal' | 'vertical';
  /** Current values of the group. */
  value?: string[];
  /** Default values for uncontrolled state. */
  defaultValue?: string[];
  /** Callback fired when values change. */
  onChange?: (value: string[]) => void;
  /** Whether the entire group is disabled. */
  disabled?: boolean;
}

/**
 * Props for the CheckboxGroup component.
 */
export type CheckboxGroupProps = PrimitiveProps<'div', CheckboxGroupBaseProps>;

/**
 * Values shared via CheckboxGroupContext.
 */
export interface CheckboxGroupContextValue extends CheckboxVariantSubset {
  /** Selected values in the current group. */
  value?: string[];
  /** Whether all checkboxes in the group are disabled. */
  disabled?: boolean;
  /** Updates a single item value inside the group. */
  onItemChange: (itemValue: string, checked: boolean) => void;
}

/**
 * Context value for the Checkbox internal state management.
 */
export interface CheckboxContextValue extends CheckboxVariantSubset {
  /** Value submitted by the underlying checkbox input. */
  value?: string;
  /** Whether the checkbox is checked. */
  checked?: boolean;
  /** Whether the checkbox is in a mixed state. */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled. */
  disabled?: boolean;
  /** Whether the checkbox should render error styling. */
  error?: boolean;
  /** Whether selection indicators should use motion primitives. */
  animated?: boolean;
  /** Change handler forwarded to the underlying checkbox input. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Props for the Checkbox Root container.
 */
export type CheckboxRootProps = PrimitiveProps<
  'label',
  CheckboxVariantSubset & {
    /** Value submitted by the underlying checkbox input. */
    value?: string;
    /** Whether the checkbox should render error styling. */
    error?: boolean;
    /** Controlled checked state. */
    checked?: boolean;
    /** Initial checked state for uncontrolled usage. */
    defaultChecked?: boolean;
    /** Whether the checkbox is in a mixed state. */
    indeterminate?: boolean;
    /** Whether the checkbox is disabled. */
    disabled?: boolean;
    /** Whether selection indicators should use motion primitives. */
    animated?: boolean;
    /** Change handler forwarded to the underlying checkbox input. */
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
>;

/**
 * Props for the Checkbox Input element.
 */
export type CheckboxInputProps = PrimitiveProps<'input'>;

/**
 * Props for the Checkbox Control element (the stylized box).
 */
export type CheckboxControlProps = PrimitiveProps<'span'>;

/**
 * Props for the Checkbox Label text.
 */
export type CheckboxLabelProps = PrimitiveProps<'span'>;

/**
 * Base properties for the Checkbox molecule.
 */
export interface CheckboxBaseProps extends CheckboxVariantSubset {
  /** Value submitted by the underlying checkbox input. */
  value?: string;
  /** Whether the checkbox is in a mixed state. */
  indeterminate?: boolean;
  /** Whether the checkbox should render error styling. */
  error?: boolean;
  /**
   * Enables motion-based checkmark drawing. Static SVG is used by default for dense forms.
   * @defaultValue `false`
   */
  animated?: boolean;
}

/**
 * Props for the Checkbox molecule.
 *
 * ### Notes
 * The shorthand Checkbox renders a labeled native checkbox input. Use `checked`
 * with `onChange` for controlled state, or `defaultChecked` for uncontrolled
 * initial state. The `indeterminate` state is visual and should be paired with
 * application state that explains the mixed selection.
 *
 * Do: provide children text or an accessible name when the visible label is not
 * rendered.
 * Don't: use `indeterminate` as a submitted form value; only `checked` submits.
 *
 * @example
 * ```tsx
 * import { Checkbox } from '@poffy-ui/react/inputs';
 *
 * <Checkbox checked={accepted} onChange={event => setAccepted(event.target.checked)}>
 *   Accept terms
 * </Checkbox>
 * ```
 *
 * Related: CheckboxGroupProps for grouped multi-select checkbox state.
 *
 * ### Formula
 * - Silver Ratio (1:1.414) is applied to all spacing variants inside the recipe.
 */
export type CheckboxProps = PrimitiveProps<'input', CheckboxBaseProps>;
