import { RadioVariantProps } from '@/styled-system/recipes';
import { type ControlIntent } from '@poffy-ui/types';
import { ComponentProps, ReactNode } from 'react';

/** Visual recipe options for `Radio`. */
export type RadioVariants = RadioVariantProps;

/** Shared visual intent names supported by radio controls. */
export type RadioIntent = ControlIntent;

/** Props for one `RadioGroup` option. */
export interface RadioProps extends Omit<
  ComponentProps<'input'>,
  | 'aria-checked'
  | 'aria-disabled'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'form'
  | 'name'
  | 'onChange'
  | 'role'
  | 'size'
  | 'type'
> {
  /**
   * The label or content to display next to the radio button.
   */
  children?: ReactNode;

  /**
   * The value of the radio button, used for selection within the group.
   */
  value: string;

  /**
   * Selection between size variants.
   * Inherits from RadioGroup if not specified.
   */
  size?: RadioVariants['size'];

  /**
   * Visual intent for the radio control.
   * Inherits from RadioGroup if not specified.
   */
  intent?: RadioIntent;

  /**
   * Whether the radio button is disabled.
   * Inherits from RadioGroup if not specified.
   */
  disabled?: boolean;
  /**
   * Prevents selecting this option while keeping it focusable.
   *
   * Click, Space, and arrow-key selection are suppressed; unlike `disabled`,
   * read-only options remain in the keyboard focus order.
   */
  readOnly?: boolean;
  /**
   * Enables motion-based dot selection. CSS dot transition is used by default for dense forms.
   * Inherits from RadioGroup if not specified.
   * @defaultValue `false`
   */
  animated?: boolean;
}

/** Shared props for a labelled group of mutually exclusive radio options. */
export interface RadioGroupBaseProps extends Omit<
  ComponentProps<'div'>,
  'aria-orientation' | 'aria-readonly' | 'onChange' | 'role'
> {
  /**
   * A collection of Radio components.
   */
  children: ReactNode;

  /**
   * The name attribute for the group, applied to all child radio inputs.
   *
   * Provide a name when the group must preserve native grouping, constraint
   * validation, or form submission during SSR or without JavaScript. When
   * omitted, RadioGroup adds a client-only internal name for interaction but
   * intentionally emits no named form controls in server markup.
   */
  name?: string;

  /**
   * ID of an associated form outside the group's DOM subtree. Applied to child radio inputs.
   */
  form?: string;

  /** Current selected value; controlled usage requires the paired `onChange` callback. */
  value?: string;

  /** Initial selected value for uncontrolled usage; it does not update later state. */
  defaultValue?: string;

  /** Called after an enabled, non-read-only option changes the selection. */
  onChange?: (value: string) => void;

  /**
   * The layout orientation of the group.
   * @defaultValue `'vertical'`
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Default size for all radio buttons in the group.
   * @defaultValue `'md'`
   */
  size?: RadioVariants['size'];

  /**
   * Default visual intent for all radio buttons in the group.
   */
  intent?: RadioIntent;

  /**
   * Whether the entire group is disabled.
   * @defaultValue `false`
   */
  disabled?: boolean;
  /**
   * Whether the entire group is read-only.
   *
   * Radios remain focusable but cannot change selection through click, Space,
   * or arrow keys.
   * @defaultValue `false`
   */
  readOnly?: boolean;
  /**
   * Whether one radio option must be selected during native form validation.
   */
  required?: boolean;
  /**
   * Enables motion-based dots for child radios.
   * @defaultValue `false`
   */
  animated?: boolean;
}

/**
 * Props for a controlled or uncontrolled radio group.
 *
 * Supply both `value` and `onChange` for controlled selection. Otherwise omit
 * `value`, optionally seed with `defaultValue`, and use `onChange` only as a
 * notification callback.
 */
export type RadioGroupProps = Omit<RadioGroupBaseProps, 'defaultValue' | 'onChange' | 'value'> &
  (
    | {
        value: string;
        defaultValue?: never;
        onChange: (value: string) => void;
      }
    | {
        value?: never;
        defaultValue?: string;
        onChange?: (value: string) => void;
      }
  );
