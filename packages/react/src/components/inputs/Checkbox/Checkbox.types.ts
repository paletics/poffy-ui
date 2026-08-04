import { CheckboxVariantProps } from '@/styled-system/recipes';
import type { ControlIntent, NativeProps, PrimitiveProps } from '@poffy-ui/types';
import type { AriaAttributes, ReactNode } from 'react';

/** Visual recipe options for `Checkbox`. */
export type CheckboxVariants = CheckboxVariantProps;

/** Checkbox recipe options using shared intent names. */
export interface CheckboxVariantSubset extends Omit<CheckboxVariantProps, 'intent'> {
  /** Visual intent mapped to the shared control intent token set. */
  intent?: ControlIntent;
}

/** Shared layout, form, and state options for `CheckboxGroup`. */
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
  /** Whether group values cannot be changed. */
  readOnly?: boolean;
  /** Whether at least one checkbox must be selected. */
  required?: boolean;
  /** ID of an associated form outside the group's DOM subtree. */
  form?: string;
}

type CheckboxGroupNativeProps = Omit<
  NativeProps<'div', Omit<CheckboxGroupBaseProps, 'defaultValue' | 'onChange' | 'value'>>,
  'role'
>;

/**
 * Props for a controlled or uncontrolled multi-value checkbox field.
 *
 * Controlled usage requires both `value` and `onChange`. Otherwise omit `value`, optionally seed
 * local state with `defaultValue`, and use `onChange` only as a notification callback. Values are
 * canonicalized without duplicates; each rendered Checkbox item must still use a unique `value`.
 */
export type CheckboxGroupProps = CheckboxGroupNativeProps &
  (
    | {
        value: readonly string[];
        defaultValue?: never;
        onChange: (value: string[]) => void;
      }
    | {
        value?: never;
        defaultValue?: readonly string[];
        onChange?: (value: string[]) => void;
      }
  );

/**
 * Values shared via CheckboxGroupContext.
 */
export interface CheckboxGroupContextValue extends CheckboxVariantSubset {
  /** Selected values in the current group. */
  value?: string[];
  /** Whether all checkboxes in the group are disabled. */
  disabled?: boolean;
  /** Whether group values cannot be changed. */
  readOnly?: boolean;
  /** ID of the form shared by every checkbox input in the group. */
  form?: string;
  /** Whether the group is in an invalid state. */
  isInvalid?: boolean;
  /** The group-level ARIA invalid state forwarded to each native checkbox. */
  ariaInvalid?: AriaAttributes['aria-invalid'];
  /** Updates a single item value inside the group. */
  onItemChange: (itemValue: string, checked: boolean) => void;
  /** Values shared by more than one group item. */
  ambiguousValues: ReadonlySet<string>;
  /** Whether opaque SSR topology must remain non-interactive until registration. */
  failClosedAll: boolean;
  /** Registers one native checkbox occurrence and its form participation state. */
  registerCheckbox: (instanceId: string, entry: CheckboxGroupRegistration) => () => void;
}

/** Native input metadata used to keep group validation aligned with form participation. */
export interface CheckboxGroupRegistration {
  value: string;
  input: HTMLInputElement;
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
  /** Whether group values cannot be changed. */
  readOnly?: boolean;
  /** Whether the checkbox should render error styling. */
  error?: boolean;
  /** Whether selection indicators should use motion primitives. */
  animated?: boolean;
  /** Change handler forwarded to the underlying checkbox input. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Restores the uncontrolled state when the owning form resets. */
  onFormReset?: () => void;
}

/**
 * Props for the Checkbox Root container.
 */
type CheckboxRootBaseProps = PrimitiveProps<
  'label',
  CheckboxVariantSubset & {
    /** Value submitted by the underlying checkbox input. */
    value?: string;
    /** Whether the checkbox should render error styling. */
    error?: boolean;
    /** Whether the checkbox is in a mixed state. */
    indeterminate?: boolean;
    /** Whether the checkbox is disabled. */
    disabled?: boolean;
    /** Whether selection indicators should use motion primitives. */
    animated?: boolean;
  }
>;

/**
 * Props for Checkbox.Root's owned or delegated label container.
 *
 * Controlled usage requires both `checked` and `onChange`; otherwise `defaultChecked` initializes
 * local state. `indeterminate` controls presentation only and does not change the submitted value.
 */
export type CheckboxRootProps = Omit<
  CheckboxRootBaseProps,
  'checked' | 'defaultChecked' | 'onChange'
> &
  (
    | {
        checked: boolean;
        defaultChecked?: never;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }
    | {
        checked?: never;
        defaultChecked?: boolean;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }
  );

/**
 * Props for the Checkbox Input element.
 */
export type CheckboxInputProps = Omit<
  NativeProps<'input'>,
  | 'aria-checked'
  | 'aria-disabled'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'onChange'
  | 'role'
  | 'type'
  | 'value'
>;

/**
 * Props for the Checkbox Control element (the stylized box).
 */
export type CheckboxControlProps = Omit<PrimitiveProps<'span'>, 'asChild'>;

/**
 * Props for the Checkbox Label text.
 */
export type CheckboxLabelProps = Omit<PrimitiveProps<'span'>, 'asChild'>;

/**
 * Base properties for the Checkbox molecule.
 */
export interface CheckboxBaseProps extends CheckboxVariantSubset {
  /** The visible label content rendered by the shorthand Checkbox. */
  children?: ReactNode;
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

type CheckboxNativeProps = Omit<
  NativeProps<'input', CheckboxBaseProps>,
  'checked' | 'defaultChecked' | 'onChange' | 'type'
>;

/**
 * Props for the Checkbox shorthand in controlled or uncontrolled mode.
 *
 * Controlled usage requires both `checked` and `onChange`; otherwise `defaultChecked` initializes
 * local state. Use visible children or an accessible name for icon-only checkboxes.
 */
export type CheckboxProps = CheckboxNativeProps &
  (
    | {
        checked: boolean;
        defaultChecked?: never;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }
    | {
        checked?: never;
        defaultChecked?: boolean;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
      }
  );
