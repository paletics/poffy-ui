'use client';

import { cx } from '@/styled-system/css';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { slider } from '@/styled-system/recipes';
import { forwardRef, useEffect, useRef } from 'react';
import { useFormReset } from '@/components/inputs/shared/useFormControlBridge';
import type { SliderProps } from './Slider.types';

/**
 * Native range field for selecting one numeric value by pointer or keyboard.
 *
 * It retains the native controlled/uncontrolled `value` contract and receives its disabled,
 * read-only, ID, invalid, and description state from direct props or `FormControl`. Read-only
 * sliders remain focusable but prevent supported range keys and pointer movement, restoring the
 * prior value if the browser emits a change. `children` are rendered inside the wrapping native
 * label; otherwise provide an accessible name through native input props or FormControl.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>((props, ref) => {
  const {
    size,
    intent,
    children,
    className,
    id,
    disabled,
    readOnly,
    required: _required,
    value,
    defaultValue,
    onChange,
    onPointerDownCapture,
    onKeyDownCapture,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    role: _role,
    'aria-orientation': _ariaOrientation,
    'aria-valuemin': _ariaValueMin,
    'aria-valuemax': _ariaValueMax,
    'aria-valuenow': _ariaValueNow,
    'aria-disabled': _ariaDisabled,
    'aria-readonly': _ariaReadOnly,
    'aria-required': _ariaRequired,
    ...rest
  } = props as SliderProps & {
    required?: unknown;
    role?: unknown;
    'aria-orientation'?: unknown;
    'aria-valuemin'?: unknown;
    'aria-valuemax'?: unknown;
    'aria-valuenow'?: unknown;
    'aria-disabled'?: unknown;
    'aria-readonly'?: unknown;
    'aria-required'?: unknown;
  };
  const formControl = useFormControl();
  const inputRef = useRef<HTMLInputElement>(null);
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isInvalid = formControl.isInvalid;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = isInvalid || hasExplicitInvalid;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const readOnlyValueRef = useRef<string | null>(
    value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : null,
  );
  useEffect(() => {
    if (value !== undefined) readOnlyValueRef.current = String(value);
  }, [value]);
  const classes = slider({ size, intent });

  const formResetRef = useFormReset<HTMLInputElement>(() => {
    readOnlyValueRef.current = inputRef.current?.value ?? null;
  });
  const mergedRef = useMergeRefs(inputRef, formResetRef, ref);

  const preventReadOnlyPointerInteraction = (event: React.PointerEvent<HTMLInputElement>) => {
    onPointerDownCapture?.(event);
    if (!event.defaultPrevented && isReadOnly) event.preventDefault();
  };

  const preventReadOnlyKeyInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDownCapture?.(event);
    if (
      !event.defaultPrevented &&
      isReadOnly &&
      [
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'End',
        'Home',
        'PageDown',
        'PageUp',
      ].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  return (
    <label className={cx(classes.root, className)}>
      <input
        {...rest}
        ref={mergedRef}
        id={id ?? formControl.id}
        type="range"
        className={classes.control}
        value={value}
        defaultValue={defaultValue}
        disabled={isDisabled}
        readOnly={isReadOnly}
        aria-disabled={isDisabled ? true : undefined}
        aria-readonly={isReadOnly || undefined}
        aria-invalid={isInvalid ? true : ariaInvalid}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        onPointerDownCapture={preventReadOnlyPointerInteraction}
        onKeyDownCapture={preventReadOnlyKeyInteraction}
        onChange={(event) => {
          if (isReadOnly) {
            if (readOnlyValueRef.current !== null) {
              event.currentTarget.value = readOnlyValueRef.current;
            }
            return;
          }
          readOnlyValueRef.current = event.currentTarget.value;
          onChange?.(event);
        }}
      />
      {children != null && <span className={classes.label}>{children}</span>}
    </label>
  );
});

Slider.displayName = 'Slider';
