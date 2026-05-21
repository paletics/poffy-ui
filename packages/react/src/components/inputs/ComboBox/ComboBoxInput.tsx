'use client';

import {
  filterListboxOptions,
  getFirstEnabledListboxIndex,
  getLastEnabledListboxIndex,
  getNextEnabledListboxIndex,
  getPreviousEnabledListboxIndex,
} from '@poffy-ui/behavior/listbox';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useRef,
  type ChangeEventHandler,
  type KeyboardEventHandler,
  type PointerEventHandler,
  type ReactNode,
} from 'react';
import { useComboBoxContext } from './ComboBoxContext';
import { Slot } from '@radix-ui/react-slot';
import { useMergeRefs } from '@floating-ui/react';
import { DisclosureIconButton } from '@/components/inputs/DisclosureIconButton';
import { ListboxPopoverAnchor } from '@/components/overlay/ListboxPopover';

/**
 * Props for the editable input and disclosure control inside ComboBox.
 */
export interface ComboBoxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  asChild?: boolean;
  label?: ReactNode;
  placeholder?: string;
}

interface ComboBoxInputGuardProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onChangeCapture?: ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyDownCapture?: KeyboardEventHandler<HTMLInputElement>;
  onPointerDown?: PointerEventHandler<HTMLInputElement>;
  onPointerDownCapture?: PointerEventHandler<HTMLInputElement>;
}

const blockActivation = (event: React.SyntheticEvent<HTMLInputElement>) => {
  event.preventDefault();
  event.stopPropagation();
};

const blockKeyboardActivation = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Tab') return;
  blockActivation(event);
};

const guardInputActivationHandlers = (children: ReactNode, shouldGuard: boolean): ReactNode => {
  if (!shouldGuard || !isValidElement<ComboBoxInputGuardProps>(children)) {
    return children;
  }

  return cloneElement(children, {
    onChange: blockActivation,
    onChangeCapture: blockActivation,
    onKeyDown: blockKeyboardActivation,
    onKeyDownCapture: blockKeyboardActivation,
    onPointerDown: blockActivation,
    onPointerDownCapture: blockActivation,
  });
};

/**
 * Text input and disclosure control for a ComboBox listbox.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`comboBox` slot recipe), Radix Slot, `DisclosureIconButton`
 * - **Props**: native input props plus optional `asChild` and inline `label`
 *
 * ### Design Tokens
 * - **spacing**: field height, input padding, and trigger size inherit from `ComboBoxRoot`
 * - **color**: focus, disabled, invalid, and placeholder colors come from the recipe
 *
 * ### Variant Logic
 * - **size**: Inherited from `ComboBoxRoot`.
 * - **appearance/variant**: Inherited from `ComboBoxRoot`.
 *
 * ### Accessibility
 * - **Role**: `combobox` with `aria-autocomplete="list"`.
 * - **Pattern**: WAI-ARIA editable combobox with `aria-activedescendant`.
 * - **Keyboard**: Arrow Up/Down moves highlight, Enter selects, Escape closes.
 * - **Required**: Provide `label`, `aria-label`, or `aria-labelledby`.
 *
 * ### AI Usage
 * - **DO**: Use inside `ComboBox.Root` as the single text entry control.
 * - **DON'T**: Do not pair multiple inputs with one `ComboBox.List`.
 *
 * @example With visible label
 * ```tsx
 * <ComboBox.Root options={options}>
 *   <ComboBox.Input label="Country" />
 *   <ComboBox.List>{items}</ComboBox.List>
 * </ComboBox.Root>
 * ```
 *
 * @example With external label
 * ```tsx
 * <ComboBox.Root options={options} aria-labelledby="country-label">
 *   <ComboBox.Input />
 *   <ComboBox.List>{items}</ComboBox.List>
 * </ComboBox.Root>
 * ```
 */
export const ComboBoxInput = forwardRef<HTMLInputElement, ComboBoxInputProps>((props, ref) => {
  const {
    asChild,
    children,
    label,
    placeholder,
    onChange: onInputChange,
    onChangeCapture: onInputChangeCapture,
    onKeyDown: onInputKeyDown,
    onKeyDownCapture: onInputKeyDownCapture,
    onPointerDown: onInputPointerDown,
    onPointerDownCapture: onInputPointerDownCapture,
    disabled: _disabledProp,
    readOnly: _readOnlyProp,
    ...rest
  } = props;
  const {
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    highlightedIndex,
    setHighlightedIndex,
    options,
    filteredOptions,
    onChange,
    disabled,
    readOnly,
    required,
    tabIndex,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaErrorMessage,
    inputId,
    listId,
    classes,
  } = useComboBoxContext();

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs([inputRef, ref]);
  const openIfClosed = () => {
    if (disabled || readOnly) return;
    if (!isOpen) setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    const nextInputValue = e.target.value;
    const nextFilteredOptions = filterListboxOptions(options, nextInputValue);
    setInputValue(nextInputValue);
    openIfClosed();
    setHighlightedIndex(getFirstEnabledListboxIndex(nextFilteredOptions));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        openIfClosed();
        setHighlightedIndex((prev) =>
          prev < 0
            ? getFirstEnabledListboxIndex(filteredOptions)
            : getNextEnabledListboxIndex(filteredOptions, prev),
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        openIfClosed();
        setHighlightedIndex((prev) =>
          prev < 0
            ? getLastEnabledListboxIndex(filteredOptions)
            : getPreviousEnabledListboxIndex(filteredOptions, prev),
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          const option = filteredOptions[highlightedIndex];
          if (!option.disabled) {
            onChange?.(option.value);
            setInputValue(option.label);
            setIsOpen(false);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const Component = asChild ? Slot : 'input';
  const activeOption =
    isOpen && highlightedIndex >= 0 ? filteredOptions[highlightedIndex] : undefined;
  const activeOptionId = activeOption ? `${listId}-option-${activeOption.value}` : undefined;
  const blockAsChildActivation = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!asChild || (!disabled && !readOnly)) return false;
    e.preventDefault();
    e.stopPropagation();
    return true;
  };
  const blockAsChildKeyboardActivation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') return false;
    return blockAsChildActivation(e);
  };
  const guardedChildren = guardInputActivationHandlers(
    children,
    asChild === true && [disabled, readOnly].some(Boolean),
  );

  return (
    <>
      {label && (
        <label htmlFor={inputId} className={classes.label}>
          {label}
        </label>
      )}
      <ListboxPopoverAnchor asChild>
        <div className={classes.control}>
          {asChild ? (
            <Component
              ref={mergedRef}
              id={inputId}
              type="text"
              role="combobox"
              className={classes.input}
              value={inputValue}
              onChangeCapture={(e) => {
                if (blockAsChildActivation(e)) return;
                onInputChangeCapture?.(e);
              }}
              onChange={(e) => {
                if (disabled || readOnly) return;
                onInputChange?.(e);
                if (e.defaultPrevented) return;
                handleInputChange(e);
              }}
              onKeyDownCapture={(e) => {
                if (blockAsChildKeyboardActivation(e)) return;
                onInputKeyDownCapture?.(e);
              }}
              onKeyDown={(e) => {
                if (disabled) return;
                onInputKeyDown?.(e);
                if (e.defaultPrevented) return;
                handleKeyDown(e);
              }}
              onPointerDownCapture={(e) => {
                if (blockAsChildActivation(e)) return;
                onInputPointerDownCapture?.(e);
              }}
              onPointerDown={(e) => {
                if (disabled) return;
                onInputPointerDown?.(e);
                if (e.defaultPrevented) return;
                if (!readOnly && e.button === 0) openIfClosed();
              }}
              placeholder={placeholder}
              aria-autocomplete="list"
              aria-controls={listId}
              aria-expanded={isOpen}
              aria-activedescendant={activeOptionId}
              aria-label={rest['aria-label'] ?? ariaLabel}
              aria-labelledby={rest['aria-labelledby'] ?? ariaLabelledBy}
              aria-describedby={rest['aria-describedby'] ?? ariaDescribedBy}
              aria-errormessage={rest['aria-errormessage'] ?? ariaErrorMessage}
              aria-required={required ? true : undefined}
              aria-disabled={disabled ? true : undefined}
              tabIndex={tabIndex}
              {...rest}
            >
              {guardedChildren}
            </Component>
          ) : (
            <Component
              ref={mergedRef}
              id={inputId}
              type="text"
              role="combobox"
              className={classes.input}
              value={inputValue}
              onChangeCapture={onInputChangeCapture}
              onChange={(e) => {
                if (disabled || readOnly) return;
                onInputChange?.(e);
                if (e.defaultPrevented) return;
                handleInputChange(e);
              }}
              onKeyDownCapture={onInputKeyDownCapture}
              onKeyDown={(e) => {
                if (disabled) return;
                onInputKeyDown?.(e);
                if (e.defaultPrevented) return;
                handleKeyDown(e);
              }}
              onPointerDownCapture={onInputPointerDownCapture}
              onPointerDown={(e) => {
                if (disabled) return;
                onInputPointerDown?.(e);
                if (e.defaultPrevented) return;
                if (!readOnly && e.button === 0) openIfClosed();
              }}
              placeholder={placeholder}
              aria-autocomplete="list"
              aria-controls={listId}
              aria-expanded={isOpen}
              aria-activedescendant={activeOptionId}
              aria-label={rest['aria-label'] ?? ariaLabel}
              aria-labelledby={rest['aria-labelledby'] ?? ariaLabelledBy}
              aria-describedby={rest['aria-describedby'] ?? ariaDescribedBy}
              aria-errormessage={rest['aria-errormessage'] ?? ariaErrorMessage}
              aria-required={required ? true : undefined}
              disabled={disabled}
              readOnly={readOnly}
              aria-disabled={disabled ? true : undefined}
              tabIndex={tabIndex}
              {...rest}
            />
          )}

          <DisclosureIconButton
            className={classes.trigger}
            open={isOpen}
            onOpenChange={(nextOpen) => {
              if (nextOpen === isOpen || readOnly) return;
              setIsOpen(nextOpen);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={disabled}
            aria-label="Toggle options"
            aria-haspopup="listbox"
            aria-controls={listId}
            tabIndex={-1}
          />
        </div>
      </ListboxPopoverAnchor>
    </>
  );
});

ComboBoxInput.displayName = 'ComboBoxInput';
