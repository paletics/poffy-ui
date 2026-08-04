import type { WheelPickerColumn, WheelPickerValue } from '@poffy-ui/behavior/wheel-picker';
import type { ComponentPropsWithoutRef } from 'react';

/** Control size for `WheelPicker`. */
export type WheelPickerSize = 'sm' | 'md' | 'lg';

/**
 * Format used for WheelPicker hidden form values.
 *
 * `json` emits one `name` field, `entries` emits `name[columnId]` fields, and a callback emits
 * one `name` field from the returned string.
 */
export type WheelPickerValueFormat = 'json' | 'entries' | ((value: WheelPickerValue) => string);

/** Describes one selectable WheelPicker column. */
export type { WheelPickerColumn } from '@poffy-ui/behavior/wheel-picker';
/** Describes one selectable option in a WheelPicker column. */
export type { WheelPickerOption } from '@poffy-ui/behavior/wheel-picker';
/** Maps WheelPicker column IDs to their selected values. */
export type { WheelPickerValue } from '@poffy-ui/behavior/wheel-picker';

/** Shared props for a controlled or uncontrolled multi-column wheel field. */
export interface WheelPickerBaseProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'defaultValue' | 'onChange' | 'role' | 'aria-disabled' | 'aria-readonly'
> {
  /**
   * Ordered columns; each ID and each column's option value must be unique. Every occurrence of a
   * duplicate is omitted before selection, with a development warning.
   */
  columns: WheelPickerColumn[];
  /** Controlled value map. Reflect `onChange` to update it. */
  value?: WheelPickerValue;
  /** Initial uncontrolled value map, normalized and restored on native form reset. */
  defaultValue?: WheelPickerValue;
  /** Called after an accepted change with the normalized full map and changed column ID. */
  onChange?: (value: WheelPickerValue, columnId: string) => void;
  /** Visual control size. @defaultValue `'md'` */
  size?: WheelPickerSize;
  /**
   * Blocks interaction and disables hidden form fields. The nearest FormControl disabled state
   * applies when omitted.
   */
  disabled?: boolean;
  /**
   * Blocks selection changes while retaining listbox focus/navigation. The required validation
   * proxy is disabled while read-only, so native required validation is not reported.
   */
  readOnly?: boolean;
  /** Requires every column to select an enabled option not marked as a placeholder. */
  required?: boolean;
  /** Applies invalid styling and listbox `aria-invalid`; FormControl invalid state applies when omitted. */
  error?: boolean;
  /**
   * Enables wraparound keyboard and scroll selection within a column.
   *
   * @defaultValue `true`
   */
  loop?: boolean;
  /** Base hidden-field name. Omit it to keep the picker out of native form submission. */
  name?: string;
  /** Associates hidden fields and validation proxies with an external form. */
  form?: string;
  /** Hidden-field serialization policy. @defaultValue `'json'` */
  valueFormat?: WheelPickerValueFormat;
  role?: never;
  'aria-disabled'?: never;
  'aria-readonly'?: never;
}

/**
 * Props for a controlled or uncontrolled multi-column wheel field.
 *
 * Controlled use requires `onChange`; callback values are the normalized accepted map and changed
 * column id.
 */
export type WheelPickerProps = Omit<WheelPickerBaseProps, 'defaultValue' | 'onChange' | 'value'> &
  (
    | {
        value: WheelPickerValue;
        defaultValue?: never;
        onChange: (value: WheelPickerValue, columnId: string) => void;
      }
    | {
        value?: never;
        defaultValue?: WheelPickerValue;
        onChange?: (value: WheelPickerValue, columnId: string) => void;
      }
  );
