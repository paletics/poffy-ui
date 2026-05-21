'use client';

import { forwardRef } from 'react';
import { CheckIcon } from '@/components/media/Icon/icons';
import { useComboBoxContext } from './ComboBoxContext';

/**
 * Props for an option row rendered inside ComboBox.List.
 */
export interface ComboBoxItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Selectable option item for ComboBox listboxes.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`comboBox` slot recipe), ComboBox context
 * - **Props**: native `li` attributes plus `value`, `label`, and `disabled`
 *
 * ### Design Tokens
 * - **spacing**: option padding and text alignment come from the `comboBox` recipe
 * - **color**: highlighted, selected, disabled, and indicator colors use semantic tokens
 *
 * ### Variant Logic
 * - **selected**: Derived from `ComboBoxRoot` value and displayed with an indicator.
 * - **disabled**: Prevents selection and applies disabled styling.
 *
 * ### Accessibility
 * - **Role**: `option`.
 * - **Pattern**: WAI-ARIA listbox option.
 * - **Keyboard**: Selection is triggered by Enter/Space when active.
 * - **Required**: Provide a stable string `value` and human-readable `label`.
 *
 * ### AI Usage
 * - **DO**: Render inside `ComboBox.List`.
 * - **DON'T**: Do not render nested interactive elements inside an option.
 *
 * @example Standard usage
 * ```tsx
 * <ComboBox.Item value="react" label="React" />
 * ```
 *
 * @example Disabled option
 * ```tsx
 * <ComboBox.Item value="legacy" label="Legacy system" disabled />
 * ```
 */
export const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>((props, ref) => {
  const { value: itemValue, label, disabled: itemDisabled, onClick, onKeyDown, ...rest } = props;
  const {
    value,
    onChange,
    setIsOpen,
    setInputValue,
    highlightedIndex,
    filteredOptions,
    listId,
    classes,
  } = useComboBoxContext();

  const isHighlighted = filteredOptions[highlightedIndex]?.value === itemValue;

  // Filter visibility is handled per-item to support both the Façade pattern
  // (ComboBox.tsx renders all options; each Item self-filters) and the Composable
  // pattern (ComboBox.Root + manual ComboBox.Item; Items still auto-hide on typing).
  // filteredOptions in context is used solely for keyboard-navigation index tracking.
  const isVisible = filteredOptions.some((option) => option.value === itemValue);
  if (!isVisible) {
    return null;
  }

  const handleSelect = () => {
    if (itemDisabled) return;
    onChange?.(itemValue);
    setInputValue(label);
    setIsOpen(false);
  };

  return (
    <li
      ref={ref}
      id={`${listId}-option-${itemValue}`}
      role="option"
      aria-selected={itemValue === value}
      className={classes.item}
      data-disabled={itemDisabled ? '' : undefined}
      data-highlighted={isHighlighted ? '' : undefined}
      aria-disabled={itemDisabled ? true : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        handleSelect();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
      {...rest}
    >
      <span className={classes.itemText}>{label}</span>
      {itemValue === value && (
        <span className={classes.itemIndicator}>
          <CheckIcon />
        </span>
      )}
    </li>
  );
});

ComboBoxItem.displayName = 'ComboBoxItem';
