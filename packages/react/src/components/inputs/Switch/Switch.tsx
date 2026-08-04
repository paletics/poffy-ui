'use client';

import { cx } from '@/styled-system/css';
import { switchControl } from '@/styled-system/recipes';
import { forwardRef, useReducer, useRef } from 'react';
import type { SwitchProps } from '@/components/inputs/Switch/Switch.types';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { useOptionalDirection } from '@/providers/DirectionProvider';

/**
 * Native checkbox presented as a binary settings switch.
 *
 * Direct `disabled`, `readOnly`, `required`, and `id` values take precedence over the nearest
 * `FormControl`; its invalid/help/error associations are preserved. Read-only switches remain
 * focusable but restore their previous checked state for pointer and Space-key interactions.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const {
    size,
    intent,
    disabled,
    readOnly,
    required,
    id,
    dir,
    children,
    className,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    role: _role,
    'aria-checked': _ariaChecked,
    'aria-disabled': _ariaDisabled,
    'aria-readonly': _ariaReadOnly,
    'aria-required': _ariaRequired,
    onChange,
    onClickCapture,
    onPointerDownCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    ...rest
  } = props as SwitchProps & {
    role?: unknown;
    'aria-checked'?: unknown;
    'aria-disabled'?: unknown;
    'aria-readonly'?: unknown;
    'aria-required'?: unknown;
  };
  const providerDirection = useOptionalDirection()?.dir;
  const resolvedDirection = dir ?? providerDirection;
  const formControl = useFormControl();
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isRequired = required ?? formControl.isRequired;
  const isInvalid = formControl.isInvalid;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = Boolean(isInvalid || hasExplicitInvalid);
  const checkedBeforeReadOnlyInteractionRef = useRef<boolean | null>(null);
  const [, forceReadOnlyRestore] = useReducer((version: number) => version + 1, 0);
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const classes = switchControl({ size, intent });

  return (
    <label
      className={cx(classes.root, className)}
      data-disabled={isDisabled ? '' : undefined}
      dir={resolvedDirection}
    >
      <input
        className={cx('peer', classes.input)}
        ref={ref}
        {...rest}
        dir={dir}
        id={id ?? formControl.id}
        disabled={isDisabled}
        required={isRequired && !isReadOnly}
        readOnly={isReadOnly}
        type="checkbox"
        role="switch"
        aria-disabled={isDisabled ? true : undefined}
        aria-readonly={isReadOnly || undefined}
        aria-required={isRequired ? true : undefined}
        aria-invalid={isInvalid ? true : ariaInvalid}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        onChange={(event) => {
          if (isReadOnly) {
            event.currentTarget.checked =
              checkedBeforeReadOnlyInteractionRef.current ?? !event.currentTarget.checked;
            checkedBeforeReadOnlyInteractionRef.current = null;
            forceReadOnlyRestore();
            return;
          }
          onChange?.(event);
        }}
        onClickCapture={(event) => {
          onClickCapture?.(event);
          if (!event.defaultPrevented && isReadOnly) {
            const checkedBeforeInteraction =
              checkedBeforeReadOnlyInteractionRef.current ??
              props.checked ??
              event.currentTarget.checked;
            const input = event.currentTarget;
            checkedBeforeReadOnlyInteractionRef.current = checkedBeforeInteraction;
            event.preventDefault();
            queueMicrotask(() => {
              if (input.isConnected) {
                input.checked = checkedBeforeInteraction;
                forceReadOnlyRestore();
              }
              checkedBeforeReadOnlyInteractionRef.current = null;
            });
          }
        }}
        onPointerDownCapture={(event) => {
          onPointerDownCapture?.(event);
          if (!event.defaultPrevented && isReadOnly) {
            checkedBeforeReadOnlyInteractionRef.current = event.currentTarget.checked;
            event.preventDefault();
          }
        }}
        onKeyDownCapture={(event) => {
          onKeyDownCapture?.(event);
          if (!event.defaultPrevented && isReadOnly && event.key === ' ') {
            checkedBeforeReadOnlyInteractionRef.current = event.currentTarget.checked;
            event.preventDefault();
          }
        }}
        onKeyUpCapture={(event) => {
          onKeyUpCapture?.(event);
          if (!event.defaultPrevented && isReadOnly && event.key === ' ') event.preventDefault();
        }}
      />
      <span className={classes.control}>
        <span className={classes.thumb} />
      </span>
      {children && <span className={classes.label}>{children}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';
