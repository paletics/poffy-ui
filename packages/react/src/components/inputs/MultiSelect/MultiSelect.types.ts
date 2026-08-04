import { MultiSelectVariantProps } from '@/styled-system/recipes';
import { NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type {
  NeoInputAppearanceProp,
  NeoInputAppearanceValue,
} from '@/components/inputs/inputVariant';

/**
 * Public visual props for the MultiSelect component.
 */
export type MultiSelectVariants = MultiSelectVariantSubset;

/** Public surface treatment for MultiSelect. */
export type MultiSelectAppearance = NeoInputAppearanceValue;

/** Public MultiSelect variant props with shared input appearance names. */
export interface MultiSelectVariantSubset extends Omit<
  MultiSelectVariantProps,
  'error' | 'variant'
> {
  /** Surface treatment. @defaultValue `'outline'` */
  appearance?: NeoInputAppearanceProp;
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
   * Unique value for the option. Duplicate definitions are ignored so option
   * selection and ARIA IDs remain unambiguous.
   */
  value: string;
  /**
   * Whether the option is selectable.
   */
  disabled?: boolean;
}

/** Facade-local text overrides for the input, disclosure button, and tag removal actions. */
export interface MultiSelectMessages {
  /** Placeholder shown by the managed input. */
  placeholder: string;
  /** Accessible label for the non-tabbable disclosure control. */
  toggleOptions: string;
  /** Accessible label factory for one selected-value removal action. */
  removeOption: (label: string) => string;
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

/** Shared props for a controlled or uncontrolled searchable multi-value field. */
export interface MultiSelectOwnProps extends MultiSelectVariantSubset {
  /** BCP 47 locale overriding the nearest LocaleProvider for default text. */
  locale?: string;
  /** Partial localized default text overrides. */
  messages?: Partial<MultiSelectMessages>;
  /**
 * Placeholder text shown when no options are selected. When omitted, uses the
 * resolved LocaleProvider multi-select message.
   */
  placeholder?: string;

  /**
   * The list of available options to select from.
   */
  options?: MultiSelectOption[];

  /** Custom option matcher used instead of the locale-aware default label matching. */
  filterOption?: (option: MultiSelectOption, inputValue: string) => boolean;

  /**
   * Controlled selected values. Reflect `onChange` to update them.
   */
  value?: string[];

  /**
   * Initial uncontrolled values, restored by native form reset.
   */
  defaultValue?: string[];

  /**
   * Called after an accepted add, remove, or custom-value operation with canonical unique values.
   * @param values The updated list of selected values.
   */
  onChange?: (values: string[]) => void;

  /**
   * Custom renderer for selected value tags.
   * Use `onRemove` and `removeLabel` when rendering a dismissible custom tag.
   */
  renderTag?: (props: MultiSelectRenderTagProps) => ReactNode;

  /**
   * Allows normalized unmatched text to be added as a selected value. Text colliding with an
   * ambiguous duplicate option is ignored.
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
   * Whether the selection is required. A hidden validation proxy enforces at
   * least one value during form validation, unless the field is read-only.
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

/** Native root props shared by controlled and uncontrolled MultiSelect branches. */
type MultiSelectBaseProps = NativeProps<
  'div',
  Omit<MultiSelectOwnProps, 'defaultValue' | 'onChange' | 'value'>
>;

/**
 * Props for a controlled or uncontrolled searchable multi-value field.
 *
 * Controlled usage requires both `value` and `onChange`. Otherwise omit `value`, optionally seed
 * local state with `defaultValue`, and use `onChange` only as a notification callback. Values and
 * defaults are canonicalized to unique strings; a controlled caller must reflect callbacks.
 */
export type MultiSelectProps = MultiSelectBaseProps &
  (
    | {
        value: readonly string[];
        defaultValue?: never;
        onChange: (values: string[]) => void;
      }
    | {
        value?: never;
        defaultValue?: readonly string[];
        onChange?: (values: string[]) => void;
      }
  );
