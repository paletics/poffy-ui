import type { InputProps } from '@/components/inputs/Input';
import type { InputGroupProps } from '@/components/inputs/InputGroup';

/**
 * Props for a grouped search field with an optional clear action.
 *
 * SearchInput fixes the native type to `search`, owns its leading icon and optional trailing clear
 * action, and therefore does not accept `asChild`, children, or custom input adornments. Use
 * `value` with `onChange` for controlled input or `defaultValue` for local state.
 */
export interface SearchInputProps extends Omit<
  InputProps,
  | 'asChild'
  | 'children'
  | 'type'
  | 'size'
  | 'startElement'
  | 'endElement'
  | 'startElementInteractive'
  | 'endElementInteractive'
> {
  /**
   * Field size inherited by the grouped input and inline elements.
   *
   * @defaultValue `'md'`
   */
  size?: InputGroupProps['size'];
  /**
   * Whether to render a clear button when the field has a value.
   *
   * @defaultValue `true`
   */
  clearable?: boolean;
  /**
   * Accessible label for the clear button.
   *
   * Blank values fall back to the LocaleProvider message (exact locale, base
   * language, then English).
   */
  clearLabel?: string;
  /**
   * Called after an accepted clear action. Controlled consumers must update `value` here;
   * uncontrolled fields are cleared before the callback runs. The action is unavailable while the
   * field is empty, disabled, or read-only.
   */
  onClear?: () => void;
}
