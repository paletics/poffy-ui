import { forwardRef } from 'react';
import type { ChangeEventHandler, FocusEventHandler, ReactNode, SelectHTMLAttributes } from 'react';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';

interface ListboxSelectNativeSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'value'
> {
  children: ReactNode;
  controlId: string;
  selectedValue: string;
  onNativeFocus?: FocusEventHandler<HTMLSelectElement>;
}

const noopSelectChange: ChangeEventHandler<HTMLSelectElement> = () => undefined;

/**
 * Renders the hidden native select that preserves form submission, labels, and refs.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Native `<select>` wrapped by `VisuallyHidden`
 * - **Props**: Native select attributes plus resolved `controlId` and `selectedValue`
 *
 * ### Design Tokens
 * - **spacing**: none; visual styling belongs to the custom trigger.
 * - **color**: none; this element is hidden from visual presentation.
 *
 * ### Accessibility
 * - **Role**: native select, removed from the accessibility tree via `aria-hidden`
 * - **Keyboard**: Delegates focus to the visible combobox trigger.
 *
 * @example Internal hidden field
 * ```tsx
 * <ListboxSelectNativeSelect controlId="fruit" selectedValue="apple">
 *   <option value="apple">Apple</option>
 * </ListboxSelectNativeSelect>
 * ```
 */
export const ListboxSelectNativeSelect = forwardRef<
  HTMLSelectElement,
  ListboxSelectNativeSelectProps
>(
  (
    {
      children,
      controlId,
      selectedValue,
      onNativeFocus,
      onChange,
      tabIndex: _tabIndex,
      ...selectProps
    },
    ref,
  ) => (
    <VisuallyHidden asChild>
      <select
        {...selectProps}
        ref={ref}
        id={controlId}
        value={selectedValue}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={onNativeFocus}
        onChange={onChange ?? noopSelectChange}
      >
        {children}
      </select>
    </VisuallyHidden>
  ),
);

ListboxSelectNativeSelect.displayName = 'ListboxSelectNativeSelect';
