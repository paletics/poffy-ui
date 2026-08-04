'use client';

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
import { isInputAsChildHost } from '@/components/shared/asChild';
import { getCommonMessages } from '@/components/shared/common.locales';
import { resolveComboBoxInputAria } from './comboBoxInputAria';
import { useComboBoxInputInteractions } from './useComboBoxInputInteractions';
import { cx } from '@/styled-system/css';

/**
 * Props for the editable input and disclosure control inside ComboBox.
 */
export interface ComboBoxInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'aria-activedescendant'
  | 'aria-autocomplete'
  | 'aria-controls'
  | 'aria-disabled'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-readonly'
  | 'aria-required'
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'onChange'
  | 'readOnly'
  | 'role'
  | 'type'
  | 'value'
> {
  /**
   * Delegates the managed input to one native input or a custom component that
   * forwards input props and an HTMLInputElement ref.
   */
  asChild?: boolean;
  /** Visible native label for this input; use root ARIA naming when composing another label. */
  label?: ReactNode;
  /** Placeholder for the managed text input. It is not an accessible name. */
  placeholder?: string;
  /** Accessible label for the disclosure control, which deliberately has `tabIndex={-1}`. */
  toggleLabel?: string;
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
 * Editable combobox input and disclosure affordance for a `ComboBox.Root`.
 *
 * It owns combobox ARIA state, filters on unprevented input changes, and delegates keyboard
 * navigation to the root model. Consumer change, key, and pointer handlers run first and may
 * prevent the default model action. `asChild` requires an input-compatible host; disabled or
 * read-only delegated hosts block edits while preserving Tab navigation.
 */
export const ComboBoxInput = forwardRef<HTMLInputElement, ComboBoxInputProps>((props, ref) => {
  const {
    asChild,
    children,
    label,
    placeholder,
    toggleLabel,
    className,
    onChange: onInputChange,
    onChangeCapture: onInputChangeCapture,
    onKeyDown: onInputKeyDown,
    onKeyDownCapture: onInputKeyDownCapture,
    onPointerDown: onInputPointerDown,
    onPointerDownCapture: onInputPointerDownCapture,
    tabIndex: inputTabIndex,
    id: _idProp,
    value: _valueProp,
    defaultValue: _defaultValueProp,
    type: _typeProp,
    role: _roleProp,
    required: _requiredProp,
    disabled: _disabledProp,
    readOnly: _readOnlyProp,
    'aria-activedescendant': _ariaActiveDescendant,
    'aria-autocomplete': _ariaAutoComplete,
    'aria-controls': _ariaControls,
    'aria-disabled': _ariaDisabled,
    'aria-expanded': _ariaExpanded,
    'aria-haspopup': _ariaHasPopup,
    'aria-readonly': _ariaReadOnly,
    'aria-required': _ariaRequired,
    ...rest
  } = props as ComboBoxInputProps & React.InputHTMLAttributes<HTMLInputElement>;
  const {
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    highlightedIndex,
    setHighlightedIndex,
    options,
    filteredOptions,
    filterOptions,
    onChange,
    disabled,
    error,
    readOnly,
    required,
    tabIndex: rootTabIndex,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaErrorMessage,
    ariaInvalid,
    locale,
    size,
    inputId,
    listId,
    classes,
  } = useComboBoxContext();
  const resolvedTabIndex = inputTabIndex ?? rootTabIndex;
  const messages = getCommonMessages(locale);

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs([inputRef, ref]);
  const { activeOptionId, handleModelInputChange, handleModelKeyDown, openIfClosed } =
    useComboBoxInputInteractions({
      disabled,
      filteredOptions,
      filterOptions,
      highlightedIndex,
      isOpen,
      listId,
      onChange,
      options,
      readOnly,
      setHighlightedIndex,
      setInputValue,
      setIsOpen,
    });

  const asChildElement = asChild && isInputAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChildElement);
  const childProps = (asChildElement?.props ?? {}) as React.InputHTMLAttributes<HTMLInputElement>;
  const {
    ariaDescribedBy: resolvedAriaDescribedBy,
    ariaErrorMessage: resolvedAriaErrorMessage,
    ariaInvalid: resolvedAriaInvalid,
    ariaLabel: resolvedAriaLabel,
    ariaLabelledBy: resolvedAriaLabelledBy,
  } = resolveComboBoxInputAria({
    childProps,
    context: {
      ariaDescribedBy,
      ariaErrorMessage,
      ariaInvalid,
      ariaLabel,
      ariaLabelledBy,
      error,
    },
    wrapperProps: rest,
  });
  const blockAsChildActivation = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!canUseAsChild || (!disabled && !readOnly)) return false;
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
    canUseAsChild && [disabled, readOnly].some(Boolean),
  );
  const ownedChildren =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          id: inputId,
          type: 'text',
          role: 'combobox',
          value: inputValue,
          defaultValue: undefined,
          'aria-autocomplete': 'list',
          'aria-controls': isOpen ? listId : undefined,
          'aria-expanded': isOpen,
          'aria-haspopup': undefined,
          'aria-activedescendant': activeOptionId,
          'aria-label': resolvedAriaLabel,
          'aria-labelledby': resolvedAriaLabelledBy,
          'aria-describedby': resolvedAriaDescribedBy,
          'aria-errormessage': resolvedAriaErrorMessage,
          'aria-invalid': resolvedAriaInvalid,
          'aria-required': required ? true : undefined,
          'aria-disabled': disabled ? true : undefined,
          'aria-readonly': readOnly ? true : undefined,
          disabled,
          readOnly,
          tabIndex: resolvedTabIndex ?? 0,
        })
      : guardedChildren;
  const handleChangeCapture: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (blockAsChildActivation(event)) return;
    onInputChangeCapture?.(event);
  };
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (disabled || readOnly) return;
    onInputChange?.(event);
    if (!event.defaultPrevented) handleModelInputChange(event);
  };
  const handleInputKeyDownCapture: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (blockAsChildKeyboardActivation(event)) return;
    onInputKeyDownCapture?.(event);
  };
  const handleInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (disabled) return;
    onInputKeyDown?.(event);
    if (!event.defaultPrevented) handleModelKeyDown(event);
  };
  const handlePointerDownCapture: PointerEventHandler<HTMLInputElement> = (event) => {
    if (blockAsChildActivation(event)) return;
    onInputPointerDownCapture?.(event);
  };
  const handlePointerDown: PointerEventHandler<HTMLInputElement> = (event) => {
    if (disabled) return;
    onInputPointerDown?.(event);
    if (!event.defaultPrevented && !readOnly && event.button === 0) openIfClosed();
  };
  const inputControlProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...rest,
    id: inputId,
    type: 'text',
    role: 'combobox',
    className: cx(classes.input, className),
    value: inputValue,
    onChangeCapture: handleChangeCapture,
    onChange: handleChange,
    onKeyDownCapture: handleInputKeyDownCapture,
    onKeyDown: handleInputKeyDown,
    onPointerDownCapture: handlePointerDownCapture,
    onPointerDown: handlePointerDown,
    placeholder,
    'aria-autocomplete': 'list',
    'aria-controls': isOpen ? listId : undefined,
    'aria-expanded': isOpen,
    'aria-activedescendant': activeOptionId,
    'aria-label': resolvedAriaLabel,
    'aria-labelledby': resolvedAriaLabelledBy,
    'aria-describedby': resolvedAriaDescribedBy,
    'aria-errormessage': resolvedAriaErrorMessage,
    'aria-invalid': resolvedAriaInvalid,
    'aria-required': required ? true : undefined,
    disabled,
    readOnly,
    'aria-disabled': disabled ? true : undefined,
    'aria-readonly': readOnly ? true : undefined,
    tabIndex: resolvedTabIndex,
  };

  return (
    <>
      {label && (
        <label htmlFor={inputId} className={classes.label}>
          {label}
        </label>
      )}
      <ListboxPopoverAnchor asChild>
        <div className={classes.control}>
          {canUseAsChild ? (
            <Slot ref={mergedRef} {...inputControlProps}>
              {ownedChildren}
            </Slot>
          ) : (
            <input ref={mergedRef} {...inputControlProps} />
          )}

          <DisclosureIconButton
            className={classes.trigger}
            data-combobox-trigger=""
            size={size}
            open={isOpen}
            onOpenChange={(nextOpen) => {
              if (nextOpen === isOpen || readOnly) return;
              setIsOpen(nextOpen);
            }}
            onPointerDown={(e) => {
              // The disclosure is a pointer affordance for the input, not a
              // separate tab stop. Keep focus on the input so its ring owns
              // the field boundary instead of the circular icon button.
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            disabled={disabled}
            aria-label={toggleLabel?.trim() || messages.toggleOptions}
            aria-haspopup="listbox"
            aria-controls={isOpen ? listId : undefined}
            tabIndex={-1}
          />
        </div>
      </ListboxPopoverAnchor>
    </>
  );
});

ComboBoxInput.displayName = 'ComboBoxInput';
