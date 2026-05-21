import { ComboBoxVariantProps } from '@/styled-system/recipes';
import { type InputAppearance } from '@poffy-ui/types';
import { ReactNode, type CSSProperties } from 'react';

/**
 * Variants for the ComboBox component based on Panda CSS recipe.
 */
export type ComboBoxVariants = ComboBoxVariantProps;

/**
 * Public surface treatment for ComboBox.
 */
export type ComboBoxAppearance = InputAppearance | 'neo';

/**
 * Public ComboBox variant props with shared input appearance names.
 */
export interface ComboBoxVariantSubset extends Omit<ComboBoxVariantProps, 'variant'> {
  /** Surface treatment. */
  appearance?: ComboBoxAppearance;
  /** Legacy recipe variant alias. */
  variant?: ComboBoxVariantProps['variant'];
}

/**
 * Represents a single option within the ComboBox.
 */
export interface ComboBoxOption {
  /**
   * The display text for the option.
   */
  label: string;
  /**
   * The underlying value for the option.
   */
  value: string;
  /**
   * Whether the option is selectable.
   */
  disabled?: boolean;
}

/**
 * Props for a searchable single-value combobox.
 *
 * ### Notes
 * Use ComboBox when the user may type to filter a list and then choose one option.
 * Provide either `label`, `aria-label`, or `aria-labelledby`; placeholder text is
 * not an accessible name. `value` is controlled and must be paired with `onChange`.
 * When `name` is provided, the selected option value is submitted through a hidden
 * input.
 *
 * Do: pass stable `options` with string `value` fields.
 * Don't: pass free-form text as `value`; it must match an option value or be `null`.
 *
 * @example
 * ```tsx
 * import { ComboBox } from '@poffy-ui/react/inputs';
 *
 * <ComboBox
 *   label="Assignee"
 *   options={[{ label: 'Ada Lovelace', value: 'ada' }]}
 *   value={assignee}
 *   onChange={setAssignee}
 * />
 * ```
 *
 * Related: MultiSelectProps for multi-value searchable selection.
 * Related: ListboxSelectProps for a custom select without free text filtering.
 */
export type ComboBoxProps = ComboBoxVariantSubset & {
  /**
   * Descriptive label for the ComboBox.
   */
  label?: ReactNode;

  /**
   * Placeholder text shown when the input is empty.
   * @defaultValue `'Select option...'`
   */
  placeholder?: string;

  /**
   * The list of available options to filter and select from.
   * @defaultValue `[]`
   */
  options?: ComboBoxOption[];

  /**
   * The currently selected option's value.
   */
  value?: string | null;

  /**
   * Callback fired when a new value is selected or the input is cleared.
   * @param value The selected value or null if cleared.
   */
  onChange?: (value: string | null) => void;

  /**
   * Whether the entire ComboBox is interactive.
   * @defaultValue `false`
   */
  disabled?: boolean;

  /**
   * Whether the input text and selected value are read-only.
   * @defaultValue `false`
   */
  readOnly?: boolean;

  /**
   * Id assigned to the internal combobox input.
   */
  id?: string;

  /**
   * Form field name for the selected value. Renders a hidden input when provided.
   */
  name?: string;

  /**
   * Associated form id for the hidden selected-value input.
   */
  form?: string;

  /**
   * Marks the combobox as required for assistive technology.
   */
  required?: boolean;

  /**
   * Tab index forwarded to the internal combobox input.
   */
  tabIndex?: number;

  /**
   * Accessible name for the internal combobox input.
   */
  'aria-label'?: string;

  /**
   * Accessible label id reference for the internal combobox input.
   */
  'aria-labelledby'?: string;

  /**
   * Accessible description id reference for the internal combobox input.
   */
  'aria-describedby'?: string;

  /**
   * Accessible error message id reference for the internal combobox input.
   */
  'aria-errormessage'?: string;

  /**
   * Additional class name for the root container.
   */
  className?: string;

  /**
   * Inline styles for the root container.
   */
  style?: CSSProperties;
  /**
   * Sub-components for compound pattern.
   */
  children?: ReactNode;
};
