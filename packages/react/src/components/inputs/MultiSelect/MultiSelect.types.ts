import { MultiSelectVariantProps } from '@/styled-system/recipes';
import { type InputAppearance, NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';

/**
 * Variants for the MultiSelect component based on Panda CSS recipe.
 */
export type MultiSelectVariants = Omit<MultiSelectVariantProps, 'error'>;

/** Public surface treatment for MultiSelect. */
export type MultiSelectAppearance = InputAppearance | 'neo';

/** Public MultiSelect variant props with shared input appearance names. */
export interface MultiSelectVariantSubset extends Omit<
  MultiSelectVariantProps,
  'error' | 'variant'
> {
  /** Surface treatment. */
  appearance?: MultiSelectAppearance;
  /** Legacy recipe variant alias. */
  variant?: MultiSelectVariantProps['variant'];
}

/**
 * Represents a single selectable option within the MultiSelect.
 */
export interface MultiSelectOption {
  /**
   * Display text for the option.
   */
  label: string;
  /**
   * Unique value for the option.
   */
  value: string;
  /**
   * Whether the option is selectable.
   */
  disabled?: boolean;
}

/** Slot class names produced for MultiSelect internals. */
export interface MultiSelectClasses {
  /**
   * Root wrapper class.
   */
  root: string;
  /**
   * Combobox control shell class.
   */
  control: string;
  /**
   * Search input class.
   */
  input: string;
  /**
   * Disclosure trigger class.
   */
  trigger: string;
  /**
   * Popover content class.
   */
  content: string;
  /**
   * Option row class.
   */
  item: string;
  /**
   * Option label text class.
   */
  itemText: string;
  /**
   * Selected option indicator class.
   */
  itemIndicator: string;
}

/** Props passed to a custom MultiSelect tag renderer. */
export interface MultiSelectRenderTagProps {
  /**
   * Selected option value represented by the tag.
   */
  value: string;
  /**
   * Human-readable label rendered by default.
   */
  label: string;
  /**
   * Original option record when the value came from `options`.
   */
  option?: MultiSelectOption;
  /**
   * Whether the tag remove action should be disabled.
   */
  disabled: boolean;
  /**
   * Accessible label for the remove action.
   */
  removeLabel: string;
  /**
   * Removes this selected value.
   */
  onRemove: () => void;
}

/**
 * Props for a searchable multi-value combobox.
 *
 * ### Notes
 * `value` is controlled and must be updated from `onChange`; use `defaultValue`
 * for uncontrolled initial selections. Provide `aria-label` or `aria-labelledby`
 * when the visible label is composed outside the component. Selected values are
 * submitted as repeated hidden inputs when `name` is set.
 *
 * Do: use `renderTag` only for selected-value chips and wire `onRemove`.
 * Don't: rely on `required` alone for native validation; validate multi-select
 * requirements in your form logic.
 *
 * @example
 * ```tsx
 * import { MultiSelect } from '@poffy-ui/react/inputs';
 *
 * <MultiSelect
 *   aria-label="Skills"
 *   options={[{ label: 'TypeScript', value: 'ts' }]}
 *   value={skills}
 *   onChange={setSkills}
 * />
 * ```
 *
 * Related: ComboBoxProps for single-value searchable selection.
 */
export interface MultiSelectOwnProps extends MultiSelectVariantSubset {
  /**
   * Placeholder text shown when no options are selected.
   * @defaultValue `'Select options...'`
   */
  placeholder?: string;

  /**
   * The list of available options to select from.
   */
  options?: MultiSelectOption[];

  /**
   * The currently selected values.
   */
  value?: string[];

  /**
   * Initial selected values for uncontrolled usage.
   */
  defaultValue?: string[];

  /**
   * Callback fired when the selection changes.
   * @param values The updated list of selected values.
   */
  onChange?: (values: string[]) => void;

  /**
   * Custom renderer for selected value tags.
   * Use `onRemove` and `removeLabel` when rendering a dismissible custom tag.
   */
  renderTag?: (props: MultiSelectRenderTagProps) => ReactNode;

  /**
   * Allows the typed input text to be added as a selected value when no option matches.
   * @defaultValue `false`
   */
  allowCustomValues?: boolean;

  /**
   * Normalizes a typed custom value before it is added.
   * Return an empty string to ignore the input.
   */
  getCustomValue?: (inputValue: string) => string;

  /**
   * Form field name used for selected values.
   * Each selected value renders as a hidden input with this name.
   */
  name?: string;

  /**
   * Whether the selection is required.
   * Native hidden inputs do not enforce this; pair it with custom validation.
   * @defaultValue `false`
   */
  required?: boolean;

  /**
   * Whether the entire component is disabled.
   * @defaultValue `false`
   */
  disabled?: boolean;

  /**
   * Whether the selection is read-only.
   * @defaultValue `false`
   */
  readOnly?: boolean;

  /**
   * Associated form id for generated hidden value inputs.
   */
  form?: string;

  /**
   * Tab index forwarded to the internal input.
   */
  tabIndex?: number;

  /**
   * Whether the control is in an error state.
   * @defaultValue `false`
   */
  error?: boolean;

  /**
   * Accessible name for the internal combobox.
   */
  'aria-label'?: string;

  /**
   * Accessible label id reference for the internal combobox.
   */
  'aria-labelledby'?: string;

  /**
   * Accessible description id reference for the internal combobox.
   */
  'aria-describedby'?: string;

  /**
   * Accessible error message id reference for the internal combobox.
   */
  'aria-errormessage'?: string;
}

/**
 * Properties for the MultiSelect component.
 * Mirrors other input primitives: the component owns the control shell only and
 * expects labels to be composed externally via FormControl or native labeling.
 */
export type MultiSelectProps = NativeProps<'div', MultiSelectOwnProps>;
