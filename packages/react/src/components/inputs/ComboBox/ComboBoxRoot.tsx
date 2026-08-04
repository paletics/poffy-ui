'use client';

import { css, cx } from '@/styled-system/css';
import { ListboxPopover } from '@/components/overlay/ListboxPopover';
import { comboBox } from '@/styled-system/recipes';
import {
  getDuplicateComboBoxValues,
  getUnambiguousComboBoxOptions,
  useComboBoxState,
} from '@poffy-ui/behavior/combobox';
import type { UseComboBoxStateOptions } from '@poffy-ui/behavior/combobox';
import { getTreeElementById } from '@poffy-ui/behavior/hooks';
import { useMergeRefs } from '@floating-ui/react';
import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef } from 'react';
import { resolveNeoInputVariant } from '@/components/inputs/inputVariant';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import type { ComboBoxOption, ComboBoxRootProps } from './ComboBox.types';
import { ComboBoxContext, ComboBoxContextValue } from './ComboBoxContext';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

/**
 * State and form root for composable ComboBox parts.
 *
 * Selection and filter text are independently controlled or uncontrolled. Duplicate option values
 * are ignored so keyboard and pointer selection remain unambiguous. The selected value is emitted
 * through an optional hidden form field; native reset restores uncontrolled defaults. While
 * loading, an unresolved selected value is retained rather than cleared. Disabled/read-only state
 * blocks opening and selection requests.
 */
export const ComboBoxRoot = forwardRef<HTMLDivElement, ComboBoxRootProps>((props, ref) => {
  const {
    options: providedOptions = [],
    locale,
    filterOption,
    value,
    defaultValue = null,
    onChange,
    inputValue: controlledInputValue,
    defaultInputValue,
    onInputValueChange,
    isLoading = false,
    disabled,
    readOnly,
    size = 'md',
    appearance = 'outline',
    variant: _unsupportedVariant,
    error,
    id: idProp,
    name,
    form,
    required,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    className,
    style,
    children,
    ...rest
  } = props as ComboBoxRootProps & { variant?: unknown };
  useWarnInvalidControllableState({
    componentName: 'ComboBox selection',
    value,
    defaultValue: props.defaultValue,
    handler: onChange,
  });
  useWarnInvalidControllableState({
    componentName: 'ComboBox input value',
    value: controlledInputValue,
    defaultValue: props.defaultInputValue,
    handler: onInputValueChange,
  });
  const options = useMemo(() => getUnambiguousComboBoxOptions(providedOptions), [providedOptions]);
  const duplicateValues = useMemo(
    () => getDuplicateComboBoxValues(providedOptions),
    [providedOptions],
  );
  useEffect(() => {
    const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
    if (duplicateValues.length === 0 || nodeEnv === 'production') return;
    console.warn(
      `[ComboBox] option values must be unique. Ambiguous values were ignored: ${duplicateValues.join(', ')}`,
    );
  }, [duplicateValues]);
  const providerLocale = useOptionalLocale()?.locale;
  const resolvedLocale = locale ?? providerLocale;
  const formControl = useFormControl();
  const isDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: isDisabled, form });
  const effectiveDisabled = formBridge.effectivelyDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const isInvalid = [error === true, error === undefined && formControl.isInvalid === true].some(
    Boolean,
  );
  const resolvedAriaInvalid =
    ariaInvalid === true || ariaInvalid === false || typeof ariaInvalid === 'string'
      ? ariaInvalid
      : undefined;
  const hasExplicitInvalid = hasAriaInvalid(resolvedAriaInvalid);
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: [isInvalid, hasExplicitInvalid].some(Boolean),
  });

  const classes = comboBox({
    size,
    variant: resolveNeoInputVariant(appearance),
    error: error ?? formControl.isInvalid ?? false,
  });
  const interactionBlocked = [effectiveDisabled, isReadOnly].some(Boolean);
  const isInteractionBlockedNow = () =>
    [isReadOnly, formBridge.isEffectivelyDisabledNow()].some(Boolean);
  const {
    filteredOptions,
    filterOptions,
    highlightedIndex,
    inputValue,
    isInputValueControlled,
    isOpen,
    reset,
    selectedValue,
    setHighlightedIndex,
    setInputValue,
    setIsOpen,
    setSelectedValue,
  } = useComboBoxState({
    defaultInputValue,
    value,
    defaultValue,
    filterOption,
    inputValue: controlledInputValue,
    interactionBlocked,
    locale: resolvedLocale,
    onInputValueChange,
    onValueChange: onChange,
    options,
    reconcileSelection: !isLoading,
  } as UseComboBoxStateOptions<ComboBoxOption>);
  const defaultValueRef = useRef(defaultValue);
  const defaultInputValueRef = useRef(defaultInputValue);
  useLayoutEffect(() => {
    defaultValueRef.current = defaultValue;
    defaultInputValueRef.current = defaultInputValue;
  }, [defaultInputValue, defaultValue]);
  const generatedInputId = useId();
  const inputId = idProp ?? formControl.id ?? generatedInputId;
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCompletedInitialInputSyncRef = useRef(false);
  const pendingResetInputValueRef = useRef<string | undefined>(undefined);
  const mergedRef = useMergeRefs([containerRef, ref]);
  useEffect(() => {
    const ownerWindow = containerRef.current?.ownerDocument.defaultView;
    const frame = ownerWindow?.requestAnimationFrame(() => {
      if (!hasCompletedInitialInputSyncRef.current) {
        hasCompletedInitialInputSyncRef.current = true;
        if (defaultInputValueRef.current !== undefined) return;
      }
      const pendingResetInputValue = pendingResetInputValueRef.current;
      pendingResetInputValueRef.current = undefined;
      if (pendingResetInputValue !== undefined && inputValue === pendingResetInputValue) {
        return;
      }
      const selectedOption = options.find((opt) => opt.value === selectedValue);
      if (isLoading && selectedValue != null && !selectedOption) return;
      if (!isOpen && !isInputValueControlled) {
        setInputValue(selectedOption?.label ?? '');
      }
    });
    return () => {
      if (frame !== undefined) ownerWindow?.cancelAnimationFrame(frame);
    };
  }, [
    inputValue,
    isLoading,
    selectedValue,
    options,
    isInputValueControlled,
    isOpen,
    setInputValue,
  ]);

  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    const resetSelectionValue = value !== undefined ? selectedValue : defaultValueRef.current;
    const resetInputValue =
      defaultInputValueRef.current ??
      options.find((option) => option.value === resetSelectionValue)?.label ??
      '';
    pendingResetInputValueRef.current = resetInputValue;
    (reset as (nextValue: string | null, nextInputValue?: string) => void)(
      defaultValueRef.current,
      defaultInputValueRef.current,
    );
  });
  const formAnchorRef = useMergeRefs([formBridge.anchorRef, formResetRef]);

  const contextValue: ComboBoxContextValue = {
    isOpen,
    setIsOpen,
    isInteractionBlockedNow,
    inputValue,
    setInputValue,
    isLoading,
    highlightedIndex,
    setHighlightedIndex,
    filteredOptions,
    filterOptions,
    options,
    value: selectedValue,
    onChange: (nextValue) => {
      if (isInteractionBlockedNow()) return;
      setSelectedValue(nextValue);
    },
    disabled: effectiveDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    error: isInvalid,
    tabIndex,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy: describedBy,
    ariaErrorMessage: errorMessage,
    ariaInvalid: resolvedAriaInvalid,
    locale: resolvedLocale,
    size: size as ComboBoxContextValue['size'],
    inputId,
    listId,
    classes,
  };

  return (
    <ComboBoxContext.Provider value={contextValue}>
      <ListboxPopover
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen && isInteractionBlockedNow()) return;
          setIsOpen(nextOpen);
        }}
      >
        <div ref={mergedRef} className={cx(classes.root, className)} style={style} {...rest}>
          <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
          {name && (
            <input
              type="hidden"
              name={name}
              value={selectedValue ?? ''}
              form={form}
              disabled={effectiveDisabled}
              readOnly
            />
          )}
          {isRequired && (
            <input
              aria-hidden="true"
              className={css({ srOnly: true })}
              disabled={interactionBlocked}
              form={form}
              onChange={() => undefined}
              onInvalid={(event) =>
                getTreeElementById<HTMLElement>(event.currentTarget, inputId)?.focus()
              }
              required
              tabIndex={-1}
              type="text"
              value={selectedValue ?? ''}
            />
          )}
          {children}
        </div>
      </ListboxPopover>
    </ComboBoxContext.Provider>
  );
});

ComboBoxRoot.displayName = 'ComboBoxRoot';
