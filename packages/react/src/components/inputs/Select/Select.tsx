import { ChevronDownIcon } from '@/components/media/Icon/icons';
import { cx } from '@/styled-system/css';
import { select } from '@/styled-system/recipes';
import { mergeRefs } from '@poffy-ui/behavior/hooks';
import { forwardRef, useLayoutEffect, useMemo, useRef } from 'react';
import { resolveNeoInputVariant } from '@/components/inputs/inputVariant';
import { useFormControl } from '../FormControl/useFormControl';
import { hasAriaInvalid, resolveFormControlAria } from '../FormControl/formControlAria';
import { SelectProps } from './Select.types';
import { useFormReset } from '@/components/inputs/shared/useFormControlBridge';

/**
 * Styled native select for form-safe single or multiple choice.
 *
 * Direct `disabled`, `readOnly`, `required`, `id`, and `error` values override the nearest
 * `FormControl`, including its error/help associations. Read-only selects remain focusable and
 * submit their existing value, but pointer and non-Tab keyboard changes are prevented and the
 * prior option selection is restored.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const {
    size,
    appearance = 'outline',
    variant: _unsupportedVariant,
    error,
    className,
    children,
    disabled,
    readOnly,
    required,
    onChange,
    onFocus,
    onKeyDown,
    onPointerDown,
    multiple,
    id,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props as SelectProps & { variant?: unknown };

  const formControl = useFormControl();
  const isInvalid = error ?? formControl.isInvalid;
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isRequired = required ?? formControl.isRequired;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: isInvalid || hasExplicitInvalid,
  });

  const resolvedVariant = resolveNeoInputVariant(appearance);
  const classes = select({ size, variant: resolvedVariant, error: isInvalid });
  const selectedIndexesBeforeChange = useRef<number[]>([]);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const formResetRef = useFormReset<HTMLSelectElement>(() => {
    const selectElement = selectRef.current;
    if (!selectElement) return;
    selectedIndexesBeforeChange.current = Array.from(selectElement.options).flatMap(
      (option, index) => (option.selected ? [index] : []),
    );
  });
  const mergedRef = useMemo(
    () => mergeRefs<HTMLSelectElement>(selectRef, formResetRef, ref),
    [formResetRef, ref],
  );

  useLayoutEffect(() => {
    if (!selectRef.current) return;
    selectedIndexesBeforeChange.current = Array.from(selectRef.current.options).flatMap(
      (option, index) => (option.selected ? [index] : []),
    );
  }, [children, props.defaultValue, props.value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (isReadOnly) {
      Array.from(event.currentTarget.options).forEach((option, index) => {
        option.selected = selectedIndexesBeforeChange.current.includes(index);
      });
      event.preventDefault();
      return;
    }
    selectedIndexesBeforeChange.current = Array.from(event.currentTarget.options).flatMap(
      (option, index) => (option.selected ? [index] : []),
    );
    onChange?.(event);
  };
  const captureValue = (event: React.FocusEvent<HTMLSelectElement>) => {
    selectedIndexesBeforeChange.current = Array.from(event.currentTarget.options).flatMap(
      (option, index) => (option.selected ? [index] : []),
    );
    onFocus?.(event);
  };
  const preventReadOnlyKeyChange = (event: React.KeyboardEvent<HTMLSelectElement>) => {
    onKeyDown?.(event);
    if (!event.defaultPrevented && isReadOnly && event.key !== 'Tab') event.preventDefault();
  };
  const preventReadOnlyPointerChange = (event: React.PointerEvent<HTMLSelectElement>) => {
    onPointerDown?.(event);
    if (!event.defaultPrevented && isReadOnly) event.preventDefault();
  };

  return (
    <div className={cx(classes.root, className)} data-disabled={isDisabled ? '' : undefined}>
      <select
        {...rest}
        ref={mergedRef}
        id={id ?? formControl.id}
        className={classes.field}
        disabled={isDisabled}
        required={isRequired && !isReadOnly}
        multiple={multiple}
        aria-disabled={isDisabled ? true : undefined}
        aria-invalid={isInvalid ? true : ariaInvalid}
        aria-readonly={isReadOnly || undefined}
        aria-required={isRequired || undefined}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        onChange={handleChange}
        onFocus={captureValue}
        onKeyDown={preventReadOnlyKeyChange}
        onPointerDown={preventReadOnlyPointerChange}
      >
        {children}
      </select>
      {!multiple && (
        <span
          className={classes.icon}
          data-disabled={isDisabled ? '' : undefined}
          aria-hidden="true"
        >
          <ChevronDownIcon />
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
