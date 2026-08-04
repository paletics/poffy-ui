'use client';

import { ListboxPopover, ListboxPopoverAnchor } from '@/components/overlay/ListboxPopover';
import { css, cx } from '@/styled-system/css';
import { multiSelect } from '@/styled-system/recipes';
import { useControllableState, useMergeRefs } from '@poffy-ui/behavior/hooks';
import {
  getDuplicateListboxOptionValues,
  getUnambiguousListboxOptions,
} from '@poffy-ui/behavior/listbox';
import { forwardRef, useEffect, useId, useLayoutEffect, useMemo, useRef } from 'react';
import { resolveNeoInputVariant } from '@/components/inputs/inputVariant';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { MultiSelectControl } from './MultiSelectControl';
import { MultiSelectOptionList } from './MultiSelectOptionList';
import { MultiSelectProps } from './MultiSelect.types';
import { useMultiSelectInputInteractions } from './useMultiSelectInputInteractions';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import {
  areStringArraysEqual,
  normalizeStringArray,
  useCanonicalStringArray,
} from '@/components/inputs/shared/normalizeStringArray';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

/**
 * Searchable multi-value combobox with removable selected tags.
 *
 * Values are normalized to unique strings; duplicate option definitions are ignored to keep
 * selection unambiguous. Controlled callers reflect `onChange`; uncontrolled values and transient
 * filtering reset with the associated form. `allowCustomValues` adds normalized unmatched text,
 * except text colliding with an ambiguous option. Supplying `name` emits one hidden field per
 * selected value. Disabled or read-only state blocks opening, selection, custom values, and tag
 * removal.
 */
export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>((props, ref) => {
  const {
    placeholder: placeholderProp,
    locale,
    messages: messageOverrides,
    options: providedOptions = [],
    filterOption,
    value: valueProp,
    defaultValue,
    onChange,
    id: idProp,
    name,
    required,
    disabled,
    readOnly,
    form,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    size = 'md',
    appearance = 'outline',
    variant: _unsupportedVariant,
    error,
    renderTag,
    allowCustomValues = false,
    getCustomValue,
    className,
    ...rest
  } = props as MultiSelectProps & { variant?: unknown };
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  useWarnInvalidControllableState({
    componentName: 'MultiSelect',
    value: valueProp,
    defaultValue,
    handler: onChange,
  });
  const options = useMemo(() => getUnambiguousListboxOptions(providedOptions), [providedOptions]);
  const duplicateOptionValues = useMemo(
    () => getDuplicateListboxOptionValues(providedOptions),
    [providedOptions],
  );
  const duplicateOptionValueSet = useMemo(
    () => new Set(duplicateOptionValues),
    [duplicateOptionValues],
  );
  useEffect(() => {
    const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
    if (duplicateOptionValues.length === 0 || nodeEnv === 'production') return;
    console.warn(
      `[MultiSelect] option values must be unique. Ambiguous values were ignored: ${duplicateOptionValues.join(', ')}`,
    );
  }, [duplicateOptionValues]);

  const providerLocale = useOptionalLocale()?.locale;
  const commonMessages = getCommonMessages(locale ?? providerLocale);
  const resolvedLocale = locale ?? providerLocale;
  const placeholder =
    placeholderProp ?? messageOverrides?.placeholder ?? commonMessages.selectOptions;
  const toggleLabel = messageOverrides?.toggleOptions ?? commonMessages.toggleOptions;
  const getRemoveLabel = messageOverrides?.removeOption ?? commonMessages.removeOption;

  const formControl = useFormControl();
  const isDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: isDisabled, form });
  const effectiveDisabled = formBridge.effectivelyDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const interactionBlocked = [effectiveDisabled, isReadOnly].some(Boolean);
  const isInteractionBlockedNow = () =>
    isReadOnly || formBridge.isEffectivelyDisabledNow();
  const isRequired = required ?? formControl.isRequired ?? false;
  const isInvalid = error ?? formControl.isInvalid ?? false;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = [isInvalid, hasExplicitInvalid].some(Boolean);
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });

  const resolvedVariant = resolveNeoInputVariant(appearance);
  const classes = multiSelect({ size, variant: resolvedVariant, error: isInvalid });
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedInputId = useId();
  const inputId = idProp ?? formControl.id ?? generatedInputId;
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(rootRef, ref);
  const canonicalControlledValue = useCanonicalStringArray(valueProp);
  const normalizedControlledValue = valueProp === undefined ? undefined : canonicalControlledValue;
  const normalizedDefaultValue = useCanonicalStringArray(defaultValue);
  const {
    value,
    isControlled,
    setValue: setUncontrolledValue,
  } = useControllableState({
    value: normalizedControlledValue,
    defaultValue: normalizedDefaultValue,
  });
  const handleValueChange = (nextValue: string[]) => {
    if (isInteractionBlockedNow()) return;
    const normalizedNextValue = normalizeStringArray(nextValue);
    if (areStringArraysEqual(value, normalizedNextValue)) return;
    if (!isControlled) {
      setUncontrolledValue(normalizedNextValue);
    }
    resolvedOnChange?.([...normalizedNextValue]);
  };
  const defaultValueRef = useRef(normalizedDefaultValue);
  useLayoutEffect(() => {
    defaultValueRef.current = [...normalizedDefaultValue];
  }, [normalizedDefaultValue]);

  const {
    activeDescendant,
    filteredOptions,
    handleInputChange,
    handleKeyDown,
    handleSelectOption,
    highlightedIndex,
    inputValue,
    isOpen,
    listId,
    onPointerDownInput,
    onToggleOpen,
    optionIdPrefix,
    removeTag,
    resetTransientState,
    setIsOpen,
  } = useMultiSelectInputInteractions({
    allowCustomValues,
    disabled: effectiveDisabled,
    disallowedCustomValues: duplicateOptionValueSet,
    getCustomValue,
    inputRef,
    onChange: handleValueChange,
    options,
    locale: resolvedLocale,
    filterOption,
    readOnly: isReadOnly,
    value,
  });
  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    resetTransientState();
    if (!isControlled) setUncontrolledValue([...defaultValueRef.current]);
  });
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);
  const hasVisibleOptions = filteredOptions.length > 0;
  const isListboxOpen = isOpen && hasVisibleOptions;

  return (
    <ListboxPopover
      open={isListboxOpen}
      onOpenChange={(nextOpen) => {
        if (nextOpen && isInteractionBlockedNow()) return;
        setIsOpen(nextOpen);
      }}
    >
      <div ref={mergedRef} className={cx(classes.root, className)} {...rest}>
        <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
        {isRequired ? (
          <input
            aria-hidden="true"
            className={css({ srOnly: true })}
            data-multi-select-validation-proxy=""
            disabled={interactionBlocked}
            form={form}
            onChange={() => undefined}
            onInvalid={() => queueMicrotask(() => inputRef.current?.focus())}
            required
            tabIndex={-1}
            type="text"
            value={value.length > 0 ? 'selected' : ''}
          />
        ) : null}
        {name &&
          value.map((selectedValue) => (
            <input
              key={selectedValue}
              type="hidden"
              name={name}
              value={selectedValue}
              form={form}
              disabled={effectiveDisabled}
              readOnly
            />
          ))}
        <ListboxPopoverAnchor asChild>
          <MultiSelectControl
            activeDescendant={activeDescendant}
            ariaDescribedBy={describedBy}
            ariaErrorMessage={errorMessage}
            ariaLabel={ariaLabel}
            ariaLabelledBy={ariaLabelledBy}
            classes={classes}
            disabled={effectiveDisabled}
            error={shouldAssociateErrorMessage}
            inputId={inputId}
            inputRef={inputRef}
            inputValue={inputValue}
            isOpen={isListboxOpen}
            listId={isListboxOpen ? listId : undefined}
            onInputChange={handleInputChange}
            onInputKeyDown={handleKeyDown}
            onInputPointerDown={onPointerDownInput}
            onRemoveTag={removeTag}
            onToggleOpen={onToggleOpen}
            options={options}
            placeholder={placeholder}
            readOnly={isReadOnly}
            renderTag={renderTag}
            required={isRequired}
            tabIndex={tabIndex}
            value={value}
            toggleLabel={toggleLabel}
            getRemoveLabel={getRemoveLabel}
          />
        </ListboxPopoverAnchor>
        {hasVisibleOptions && (
          <MultiSelectOptionList
            listId={listId}
            labelledBy={inputId}
            optionIdPrefix={optionIdPrefix}
            options={filteredOptions}
            selectedValues={value}
            highlightedIndex={highlightedIndex}
            onSelect={(optionValue) => {
              if (isInteractionBlockedNow()) return;
              handleSelectOption(optionValue);
            }}
            classes={classes}
          />
        )}
      </div>
    </ListboxPopover>
  );
});

MultiSelect.displayName = 'MultiSelect';
