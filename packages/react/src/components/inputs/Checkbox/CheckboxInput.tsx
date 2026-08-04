'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { forwardRef, useEffect, useId, useReducer, useRef } from 'react';
import { useCheckbox } from './CheckboxContext';
import { CheckboxInputProps } from './Checkbox.types';
import { useFormControl } from '../FormControl/useFormControl';
import { hasAriaInvalid, resolveFormControlAria } from '../FormControl/formControlAria';
import { useCheckboxGroup } from './CheckboxGroupContext';
import { useFormReset } from '@/components/inputs/shared/useFormControlBridge';

type CheckboxInputRuntimeProps = CheckboxInputProps &
  Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'aria-checked'
    | 'aria-disabled'
    | 'checked'
    | 'defaultChecked'
    | 'disabled'
    | 'onChange'
    | 'role'
  >;

/**
 * Native checkbox input paired with Checkbox.Root state and FormControl ARIA references.
 *
 * It synchronizes the DOM-only `indeterminate` property, restores uncontrolled state on form
 * reset, and keeps read-only controls focusable while suppressing state changes. It should remain
 * inside Checkbox.Root so its label, control, and form context stay associated.
 */
export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>((props, ref) => {
  const {
    className,
    'aria-checked': _ariaChecked,
    'aria-disabled': _ariaDisabled,
    checked: _checked,
    defaultChecked: _defaultChecked,
    disabled: _disabled,
    onChange: _onChange,
    role: _role,
    id,
    required,
    readOnly,
    form: formProp,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    'aria-labelledby': ariaLabelledBy,
    'aria-required': ariaRequired,
    onClickCapture,
    onPointerDownCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    ...rest
  } = props as CheckboxInputRuntimeProps;
  const { size, intent, error, checked, indeterminate, disabled, onChange, onFormReset, value } =
    useCheckbox();
  const formControl = useFormControl();
  const group = useCheckboxGroup();
  const isReadOnly = Boolean(readOnly || group?.readOnly || formControl.isReadOnly);
  const resolvedRequired = required ?? (group ? undefined : formControl.isRequired);
  const isInvalid = error ?? (!group && formControl.isInvalid);
  const resolvedAriaInvalid = ariaInvalid ?? group?.ariaInvalid;
  const hasExplicitInvalid = hasAriaInvalid(resolvedAriaInvalid);
  const shouldAssociateErrorMessage = isInvalid || hasExplicitInvalid;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const classes = checkbox({ size, intent, error });

  const inputRef = useRef<HTMLInputElement>(null);
  const registrationId = useId();
  const [, restoreChecked] = useReducer((version: number) => version + 1, 0);
  const form = group?.form ?? formProp;
  const registerCheckbox = group?.registerCheckbox;

  useEffect(() => {
    const input = inputRef.current;
    if (!registerCheckbox || value === undefined || !input) return undefined;

    return registerCheckbox(registrationId, {
      value,
      input,
    });
  }, [disabled, form, registerCheckbox, registrationId, value]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate;
    }
  }, [checked, indeterminate]);

  const formResetRef = useFormReset<HTMLInputElement>(() => {
    onFormReset?.();
    restoreChecked();
  });
  const mergedRef = useMergeRefs(inputRef, formResetRef, ref);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.indeterminate = Boolean(indeterminate);
    if (isReadOnly) {
      event.target.checked = Boolean(checked);
      restoreChecked();
      return;
    }
    onChange?.(event);
  };

  const restoreReadOnlyChecked = (event: React.MouseEvent<HTMLInputElement>) => {
    onClickCapture?.(event);
    if (event.defaultPrevented) return;

    if (isReadOnly) {
      event.currentTarget.checked = Boolean(checked);
      restoreChecked();
      event.preventDefault();
    }
  };

  const preventReadOnlyPointerInteraction = (event: React.PointerEvent<HTMLInputElement>) => {
    onPointerDownCapture?.(event);
    if (!event.defaultPrevented && isReadOnly) event.preventDefault();
  };

  const preventReadOnlyKeyInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDownCapture?.(event);
    if (!event.defaultPrevented && isReadOnly && event.key === ' ') event.preventDefault();
  };

  const preventReadOnlyKeyUpInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyUpCapture?.(event);
    if (!event.defaultPrevented && isReadOnly && event.key === ' ') event.preventDefault();
  };

  return (
    <input
      ref={mergedRef}
      className={cx('peer', classes.input, className)}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      {...rest}
      type="checkbox"
      form={form}
      id={id ?? (group ? undefined : formControl.id)}
      value={value}
      required={resolvedRequired && !isReadOnly}
      readOnly={isReadOnly}
      aria-invalid={
        resolvedAriaInvalid === 'grammar' || resolvedAriaInvalid === 'spelling'
          ? resolvedAriaInvalid
          : isInvalid
            ? true
            : resolvedAriaInvalid
      }
      aria-errormessage={errorMessage}
      aria-labelledby={ariaLabelledBy ?? (group ? undefined : formControl.labelId)}
      aria-describedby={describedBy}
      aria-readonly={isReadOnly ? true : undefined}
      aria-required={ariaRequired ?? (resolvedRequired ? true : undefined)}
      onClickCapture={restoreReadOnlyChecked}
      onPointerDownCapture={preventReadOnlyPointerInteraction}
      onKeyDownCapture={preventReadOnlyKeyInteraction}
      onKeyUpCapture={preventReadOnlyKeyUpInteraction}
    />
  );
});

CheckboxInput.displayName = 'Checkbox.Input';
