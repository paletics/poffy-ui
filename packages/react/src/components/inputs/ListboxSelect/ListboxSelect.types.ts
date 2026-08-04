import type { ListboxSelectVariantProps } from '@/styled-system/recipes';
import type { SelectAppearance, SelectProps } from '@/components/inputs/Select/Select.types';
import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  PointerEventHandler,
} from 'react';
import type { NeoInputAppearanceProp } from '@/components/inputs/inputVariant';

/** Visual props for `ListboxSelect`. */
export type ListboxSelectVariants = ListboxSelectVariantSubset;

/** Surface treatment for `ListboxSelect`. */
export type ListboxSelectAppearance = SelectAppearance;

/** ListboxSelect recipe options with shared select appearance names. */
export interface ListboxSelectVariantSubset extends Omit<ListboxSelectVariantProps, 'variant'> {
  /** Surface treatment. @defaultValue `'outline'` */
  appearance?: NeoInputAppearanceProp;
}

/**
 * Props for a single-value custom listbox with native-select form participation.
 *
 * The visible combobox trigger and visually hidden native select stay synchronized. `value` is
 * controlled in the usual React way; omit it to initialize from `defaultValue`, or from the first
 * option when neither is supplied. A duplicate value resolves to its first matching option, while
 * uncontrolled state preserves a value-and-label occurrence through option reordering when it can.
 */
export type ListboxSelectProps = Omit<
  SelectProps,
  keyof ListboxSelectVariantSubset | 'defaultValue' | 'multiple' | 'onChange' | 'value'
> &
  ListboxSelectVariantSubset & {
    /** Controlled option value. Reflect an unprevented native `onChange` to update it. */
    value?: string | number;
    /** Initial uncontrolled option value, restored by native form reset. */
    defaultValue?: string | number;
    /**
     * Native and visible selection event. It runs before state is committed, so
     * `preventDefault()` cancels both paths and restores the previous choice.
     */
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    /** ListboxSelect is single-select only. */
    multiple?: never;
    /**
     * Prevents visible/native selection changes while retaining focus and form
     * submission. A read-only required field does not participate in native
     * required validation because it cannot be changed.
     */
    readOnly?: boolean;
    /**
     * Requires a selection through the synchronized native select when the
     * field is not read-only.
     */
    required?: boolean;
    /** Focus handler for the visible combobox trigger. */
    onTriggerFocus?: FocusEventHandler<HTMLDivElement>;
    /** Blur handler for the visible combobox trigger. */
    onTriggerBlur?: FocusEventHandler<HTMLDivElement>;
    /** Keyboard handler invoked before the visible combobox's built-in interaction. */
    onTriggerKeyDown?: KeyboardEventHandler<HTMLDivElement>;
    /** Pointer handler invoked before the visible combobox's built-in interaction. */
    onTriggerPointerDown?: PointerEventHandler<HTMLDivElement>;
  };
