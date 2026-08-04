import { ComboBoxVariantProps } from '@/styled-system/recipes';
import { ReactNode, type CSSProperties } from 'react';
import type {
  NeoInputAppearanceProp,
  NeoInputAppearanceValue,
} from '@/components/inputs/inputVariant';

/**
 * Public visual props for the ComboBox component.
 */
export type ComboBoxVariants = ComboBoxVariantSubset;

/**
 * Public surface treatment for ComboBox.
 */
export type ComboBoxAppearance = NeoInputAppearanceValue;

/**
 * Public ComboBox variant props with shared input appearance names.
 */
export interface ComboBoxVariantSubset extends Omit<ComboBoxVariantProps, 'variant'> {
  /** Surface treatment. @defaultValue `'outline'` */
  appearance?: NeoInputAppearanceProp;
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
   * The underlying value for the option. Values must be unique within a ComboBox;
   * duplicate values are ignored so selection and ARIA option IDs stay unambiguous.
   */
  value: string;
  /**
   * Whether the option is selectable.
   */
  disabled?: boolean;
}

/** Facade-local text overrides for the input placeholder and disclosure control. */
export interface ComboBoxMessages {
  /** Placeholder shown when neither `placeholder` nor an input value is present. */
  placeholder: string;
  /** Accessible label for the input's non-tabbable disclosure control. */
  toggleOptions: string;
}

/**
 * Props for a searchable single-value combobox.
 *
 * ### Notes
 * Use ComboBox when the user may type to filter a list and then choose one option.
 * Provide either `label`, `aria-label`, or `aria-labelledby`; placeholder text is
 * not an accessible name. Use `value` with `onChange` for controlled state, or
 * `defaultValue` for an uncontrolled initial selection.
 * When `name` is provided, the selected option value is submitted through a hidden
 * input.
 *
 * Do: pass stable `options` with unique string `value` fields.
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
type ComboBoxLooseProps = ComboBoxVariantSubset & {
  /** BCP 47 locale overriding the nearest LocaleProvider for default text. */
  locale?: string;
  /** Partial localized default text overrides. */
  messages?: Partial<ComboBoxMessages>;
  /**
   * Descriptive label for the ComboBox.
   */
  label?: ReactNode;

  /**
   * Placeholder text shown when the input is empty.
   * When omitted, uses the resolved LocaleProvider select-option message.
   */
  placeholder?: string;

  /**
   * The list of available options to filter and select from.
   * @defaultValue `[]`
   */
  options?: ComboBoxOption[];

  /** Custom option matcher used instead of the locale-aware default label matching. */
  filterOption?: (option: ComboBoxOption, inputValue: string) => boolean;

  /** Text currently used to filter the option collection. */
  inputValue?: string;

  /** Initial filtering text for uncontrolled use. */
  defaultInputValue?: string;

  /**
   * Notifies the consumer whenever the filtering text changes.
   * Use this to request remote options; data fetching remains application-owned.
   */
  onInputValueChange?: (inputValue: string) => void;

  /** Whether the current option collection is still being loaded. */
  isLoading?: boolean;

  /** Content shown by the default list while options are loading. */
  loadingContent?: ReactNode;

  /** Content shown by the default list when filtering produces no options. */
  emptyContent?: ReactNode;

  /**
   * The currently selected option's value.
   */
  value?: string | null;

  /**
   * The initially selected option value for uncontrolled use.
   * @defaultValue `null`
   */
  defaultValue?: string | null;

  /**
   * Callback fired when a new value is selected or a selected value disappears
   * from non-loading options and is reconciled to null.
   * @param value The selected option value or null after reconciliation.
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
   * Requires one selected value for form validation and sets the input's ARIA
   * required state. A hidden validation proxy focuses the visible input when
   * browser validation fails.
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

  /** Marks the internal combobox as invalid. */
  'aria-invalid'?: boolean | 'true' | 'false';

  /**
   * Additional class name for the root container.
   */
  className?: string;

  /**
   * Inline styles for the root container.
   */
  style?: CSSProperties;
};

type ComboBoxSelectionProps =
  | {
      /** The externally owned selected option value. */
      value: string | null;
      /** Commits a selected option value or clear request. */
      onChange: (value: string | null) => void;
      defaultValue?: never;
    }
  | {
      value?: never;
      /** The initially selected option value for uncontrolled use. */
      defaultValue?: string | null;
      /** Notifies when the internally owned selection changes. */
      onChange?: (value: string | null) => void;
    };

type ComboBoxInputValueProps =
  | {
      /** The externally owned filter text. */
      inputValue: string;
      /** Commits a filter-text change request. */
      onInputValueChange: (inputValue: string) => void;
      defaultInputValue?: never;
    }
  | {
      inputValue?: never;
      /** The initial filter text for uncontrolled use. */
      defaultInputValue?: string;
      /** Notifies when the internally owned filter text changes. */
      onInputValueChange?: (inputValue: string) => void;
    };

/**
 * Searchable single-value ComboBox with independent controlled selection and text axes.
 *
 * `value` requires `onChange`; independently, `inputValue` requires `onInputValueChange`.
 * Omit either controlled prop to use its matching `default*` value instead. Controlled callers
 * must reflect callbacks. While `isLoading` is true, a selected value absent from `options` stays
 * unresolved rather than being reconciled to null.
 */
export type ComboBoxProps = Omit<
  ComboBoxLooseProps,
  'defaultInputValue' | 'defaultValue' | 'inputValue' | 'onChange' | 'onInputValueChange' | 'value'
> &
  ComboBoxSelectionProps &
  ComboBoxInputValueProps;

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/**
 * Props for the composable ComboBox root.
 *
 * Facade-only text props stay on `ComboBoxProps`; compound parts own their
 * visible label, placeholder, and list status content.
 */
export type ComboBoxRootProps = DistributiveOmit<
  ComboBoxProps,
  'emptyContent' | 'label' | 'loadingContent' | 'messages' | 'placeholder'
> & {
  children: ReactNode;
};
