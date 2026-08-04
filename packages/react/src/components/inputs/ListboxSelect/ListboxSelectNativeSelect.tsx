import { forwardRef } from 'react';
import type { ChangeEventHandler, FocusEventHandler, ReactNode, SelectHTMLAttributes } from 'react';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';

interface ListboxSelectNativeSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'children' | 'value'
> {
  children: ReactNode;
  controlId: string;
  selectedValue?: string;
  onNativeFocus?: FocusEventHandler<HTMLSelectElement>;
}

const noopSelectChange: ChangeEventHandler<HTMLSelectElement> = () => undefined;


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
