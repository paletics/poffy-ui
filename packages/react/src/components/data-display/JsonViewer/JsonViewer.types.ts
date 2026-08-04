import type { CodeViewerBaseProps } from '../CodeViewer';
import type { NativeProps } from '@poffy-ui/types';

/** JSON scalar accepted by `JsonViewer`. */
export type JsonPrimitive = string | number | boolean | null;
/** Recursively JSON-compatible value accepted by `JsonViewer`. */
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
/** A JSON-compatible value or a string interpreted according to `stringMode`. */
export type JsonViewerValue = JsonValue | string;
/** Whether a string is parsed as raw JSON or serialized as a JSON string value. */
export type JsonViewerStringMode = 'raw' | 'value';

/** Shared base props for JsonViewer. */
export interface JsonViewerBaseProps extends Omit<CodeViewerBaseProps, 'children' | 'language'> {
  /** JSON-compatible value or raw JSON text to display. */
  value: JsonViewerValue;

  /** Defaults to `raw`: parse string input, but preserve it verbatim when parsing fails. */
  stringMode?: JsonViewerStringMode;
  /**
   * Number of spaces used when pretty-printing JSON values.
   * Finite values are truncated to integers and clamped to the inclusive range 0 through 10.
   * Non-finite values use the default of 2.
   */
  indent?: number;
  /** Fallback text shown when a value cannot be serialized. */
  invalidValueText?: string;
  /**
   * Maximum JSON characters and enumerable property/array-slot inspections before rendering.
   * Prevents large values from blocking the render path. Use `Infinity` only when the caller
   * has already bounded the input.
   *
   * @defaultValue `100000`
   */
  maxSerializedCharacters?: number;
  /** Text shown when `maxSerializedCharacters` is exceeded. */
  oversizedValueText?: string;
}

/** Public props for JsonViewer. */
export type JsonViewerProps = NativeProps<'figure', JsonViewerBaseProps>;
