'use client';

import { forwardRef } from 'react';
import { CheckIcon } from '@/components/media/Icon/icons';
import { cx } from '@/styled-system/css';
import { useComboBoxContext } from './ComboBoxContext';

/**
 * Props for an option row rendered inside ComboBox.List.
 */
export interface ComboBoxItemProps extends Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  'aria-disabled' | 'aria-selected' | 'id' | 'role'
> {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Selectable option row for a `ComboBox.List`.
 *
 * The root's option collection controls visibility, disabled state, IDs, and highlighting. An
 * unprevented click or Enter/Space selection requests the value, copies its label into the input,
 * and closes the list. Disabled, read-only, and interaction-blocked roots ignore selection.
 */
export const ComboBoxItem = forwardRef<HTMLLIElement, ComboBoxItemProps>((props, ref) => {
  const {
    value: itemValue,
    label,
    disabled: itemDisabled,
    optionIndex: _legacyOptionIndex,
    className,
    id: _id,
    role: _role,
    'aria-selected': _ariaSelected,
    'aria-disabled': _ariaDisabled,
    'data-disabled': _dataDisabled,
    'data-highlighted': _dataHighlighted,
    onClick,
    onKeyDown,
    ...rest
  } = props as ComboBoxItemProps & {
    optionIndex?: unknown;
    id?: unknown;
    role?: unknown;
    'aria-selected'?: unknown;
    'aria-disabled'?: unknown;
    'data-disabled'?: unknown;
    'data-highlighted'?: unknown;
  };
  const {
    value,
    onChange,
    setIsOpen,
    setInputValue,
    isInteractionBlockedNow,
    highlightedIndex,
    filteredOptions,
    options,
    disabled,
    readOnly,
    listId,
    classes,
  } = useComboBoxContext();

  const resolvedOptionIndex = options.findIndex((option) => option.value === itemValue);
  // Root options are the keyboard-navigation model. Prefer their disabled
  // state so pointer selection and ARIA state cannot disagree with it.
  const configuredOption = options.find((option) => option.value === itemValue);
  const isItemDisabled = configuredOption?.disabled ?? itemDisabled ?? false;

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
    if (isItemDisabled || disabled || readOnly || isInteractionBlockedNow()) return;
    onChange?.(itemValue);
    setInputValue(label);
    setIsOpen(false);
  };

  return (
    <li
      {...rest}
      ref={ref}
      id={`${listId}-option-${resolvedOptionIndex}`}
      role="option"
      aria-selected={itemValue === value}
      className={cx(classes.item, className)}
      data-disabled={isItemDisabled ? '' : undefined}
      data-highlighted={isHighlighted ? '' : undefined}
      aria-disabled={isItemDisabled ? true : undefined}
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
