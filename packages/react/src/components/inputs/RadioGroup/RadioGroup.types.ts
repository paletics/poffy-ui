import { RadioVariantProps } from '@/styled-system/recipes';
import { type ControlIntent } from '@poffy-ui/types';
import { ComponentProps, ReactNode } from 'react';

/**
 * Variants for the Radio component based on Panda CSS recipe.
 */
export type RadioVariants = RadioVariantProps;

/**
 * Shared visual intent names supported by Radio controls.
 */
export type RadioIntent = ControlIntent;

/**
 * Properties for an individual Radio component.
 * Must be used within a RadioGroup.
 *
 * ### Notes
 * Radio receives `name`, selected state, orientation, and disabled defaults from
 * RadioGroup. Always provide a string `value`; use children for the visible
 * label or pass an accessible name through input props.
 */
export interface RadioProps extends Omit<ComponentProps<'input'>, 'size' | 'disabled' | 'type'> {
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
   * Enables motion-based dot selection. CSS dot transition is used by default for dense forms.
   * Inherits from RadioGroup if not specified.
   * @defaultValue `false`
   */
  animated?: boolean;
}

/**
 * Properties for the RadioGroup container.
 * Manages the shared state and accessibility for a set of radio buttons.
 *
 * ### Notes
 * `value` is controlled and must be paired with `onChange`; use `defaultValue`
 * for uncontrolled initial selection. Provide an accessible group label with
 * `aria-label` or `aria-labelledby` unless an enclosing form field labels it.
 *
 * Do: render only Radio children with unique values.
 * Don't: control individual Radio `checked` props inside a RadioGroup.
 *
 * @example
 * ```tsx
 * import { Radio, RadioGroup } from '@poffy-ui/react/inputs';
 *
 * <RadioGroup aria-label="Billing cycle" value={cycle} onChange={setCycle}>
 *   <Radio value="monthly">Monthly</Radio>
 *   <Radio value="yearly">Yearly</Radio>
 * </RadioGroup>
 * ```
 */
export interface RadioGroupProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /**
   * A collection of Radio components.
   */
  children: ReactNode;

  /**
   * The name attribute for the group, applied to all child radio inputs.
   */
  name?: string;

  /**
   * The current selected value (controlled).
   */
  value?: string;

  /**
   * The initial selected value (uncontrolled).
   */
  defaultValue?: string;

  /**
   * Callback fired when the selection changes.
   */
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
   * Enables motion-based dots for child radios.
   * @defaultValue `false`
   */
  animated?: boolean;
}
