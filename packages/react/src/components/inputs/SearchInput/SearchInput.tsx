'use client';

import { useMergeRefs } from '@poffy-ui/behavior';
import { useControllableState } from '@poffy-ui/behavior/hooks';
import { forwardRef, useLayoutEffect, useRef } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { SearchIcon } from '@/components/media/Icon/icons';
import { css } from '@/styled-system/css';
import { searchInput } from '@/styled-system/recipes';
import { CloseButton } from '@/components/inputs/CloseButton';
import { InputGroup } from '@/components/inputs/InputGroup';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import type { SearchInputProps } from '@/components/inputs/SearchInput/SearchInput.types';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { useFormReset } from '@/components/inputs/shared/useFormControlBridge';

const valueToString = (value: SearchInputProps['value'] | SearchInputProps['defaultValue']) => {
  if (Array.isArray(value)) return value.join(',');
  return value == null ? '' : String(value);
};

/**
 * Search-specific text field with a leading decorative icon and an optional clear action.
 *
 * It always renders `type="search"` and does not support `asChild` or caller-supplied input
 * adornments. The clear action appears only for a non-empty, enabled, writable value, restores
 * input focus, and clears internal state only when `value` is uncontrolled. Controlled callers
 * update `value` from `onClear`.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      asChild: _asChild,
      children: _children,
      clearable = true,
      clearLabel,
      defaultValue,
      disabled,
      readOnly,
      size,
      value,
      onChange,
      onClear,
      className,
      endElement: _endElement,
      endElementInteractive: _endElementInteractive,
      form,
      startElement: _startElement,
      startElementInteractive: _startElementInteractive,
      type: _type,
      ...props
    }: SearchInputProps & {
      asChild?: unknown;
      children?: unknown;
      endElement?: unknown;
      endElementInteractive?: unknown;
      startElement?: unknown;
      startElementInteractive?: unknown;
      type?: unknown;
    },
    ref,
  ) => {
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const normalizedClearLabel = clearLabel?.trim();
    const resolvedClearLabel = normalizedClearLabel ? normalizedClearLabel : messages.clearSearch;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const defaultValueString = valueToString(defaultValue);
    const defaultValueRef = useRef(defaultValueString);
    const formControl = useFormControl();
    const controlledValue = value == null ? undefined : valueToString(value);
    const {
      value: currentValue,
      isControlled,
      setValue: setCurrentValue,
    } = useControllableState({
      value: controlledValue,
      defaultValue: valueToString(defaultValue),
    });
    const resolvedDisabled = disabled ?? formControl.isDisabled;
    const resolvedReadOnly = readOnly ?? formControl.isReadOnly;
    const canClear = Boolean(clearable && currentValue && !resolvedDisabled && !resolvedReadOnly);

    useLayoutEffect(() => {
      defaultValueRef.current = defaultValueString;
    }, [defaultValueString]);

    const formResetRef = useFormReset<HTMLInputElement>(
      isControlled ? undefined : () => setCurrentValue(defaultValueRef.current),
    );
    const mergedRef = useMergeRefs(inputRef, formResetRef, ref);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setCurrentValue(event.currentTarget.value);
      }

      onChange?.(event);
    };

    const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (isControlled) {
        inputRef.current?.focus();
        onClear?.();
        return;
      }

      if (!isControlled) {
        setCurrentValue('');
      }

      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.focus();
      }

      onClear?.();
    };

    return (
      <InputGroup size={size} className={searchInput()} data-search-input="">
        <InputGroup.StartElement aria-hidden="true">
          <SearchIcon />
        </InputGroup.StartElement>
        <InputGroup.Input
          {...props}
          ref={mergedRef}
          type="search"
          disabled={resolvedDisabled}
          readOnly={resolvedReadOnly}
          value={currentValue}
          onChange={handleChange}
          className={className}
          form={form}
        />
        {canClear && (
          <InputGroup.EndElement interactive>
            <CloseButton
              size="sm"
              aria-label={resolvedClearLabel}
              className={css({ pointerEvents: 'auto' })}
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
            />
          </InputGroup.EndElement>
        )}
      </InputGroup>
    );
  },
);

SearchInput.displayName = 'SearchInput';
