import type { WheelPickerColumn, WheelPickerValue } from './wheel-picker.types';

/** Keyboard data used to move a focused wheel column without handling an already-prevented event. */
export interface WheelPickerKeyboardInput {
  /** Whether an earlier handler has already claimed the event. */
  defaultPrevented?: boolean;
  /** DOM key value; ArrowUp, ArrowDown, Home, and End are recognized. */
  key: string;
}

/** Controlled or uncontrolled values and interaction policy for a multi-column wheel picker. */
export interface UseWheelPickerStateOptions {
  /** Columns whose current selections are normalized independently. */
  columns: WheelPickerColumn[];
  /** Initial uncontrolled map; unknown, missing, and disabled values are normalized silently. */
  defaultValue?: WheelPickerValue;
  /** Blocks commits and keyboard-driven changes. */
  disabled?: boolean;
  /** Optional dynamic interaction gate, checked before keyboard handling and commits. */
  isInteractionDisabled?: () => boolean;
  /** Whether Arrow navigation wraps between enabled edge options. @defaultValue true */
  loop?: boolean;
  /** Receives a requested next normalized map and the changed column id. */
  onChange?: (value: WheelPickerValue, columnId: string) => void;
  /** Blocks commits while leaving current selection and navigation recognition intact. */
  readOnly?: boolean;
  /** Controlled map; callers must reflect requested values through `onChange`. */
  value?: WheelPickerValue;
}

/** Selected values and operations that commit a column option or process its keyboard navigation. */
export interface UseWheelPickerStateReturn {
  /** Requests an option value for one known column, subject to interaction gates. */
  commitValue: (columnId: string, nextOptionValue: string) => void;
  /**
   * Processes ArrowUp/ArrowDown/Home/End for a column and returns whether the caller should
   * prevent browser scrolling. Recognized keys return `true` even when a commit is blocked.
   */
  handleKeyDown: (input: WheelPickerKeyboardInput, columnId: string) => boolean;
  /** Whether `value` currently owns the selection map. */
  isControlled: boolean;
  /** Replaces hook-owned state only; controlled callers must update `value` themselves. */
  resetValue: (nextValue: WheelPickerValue) => void;
  /** Current map after per-column normalization. Empty columns have no map entry. */
  selectedValue: WheelPickerValue;
}
