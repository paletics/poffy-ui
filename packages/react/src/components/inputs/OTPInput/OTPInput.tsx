'use client';

import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { cx } from '@/styled-system/css';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { otpInput } from '@/styled-system/recipes';
import { ChangeEvent, ClipboardEvent, forwardRef, useId, useEffect, useRef } from 'react';
import { OTPInputProps } from './OTPInput.types';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { scrollIntoInlineView } from '@/components/inputs/shared/scrollIntoInlineView';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { useOptionalDirection } from '@/providers/DirectionProvider';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getOTPInputMessages } from './OTPInput.locales';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';
import { useOtpInputState } from '@poffy-ui/behavior/otp-input/react';

/**
 * Fixed-length OTP or verification-code field composed from one-character inputs.
 *
 * Typing, paste, composition, Backspace, and directional keys update the fixed segment array and
 * move focus as appropriate for text direction. `onComplete` fires only on a transition to a
 * fully populated value. Disabled/read-only fields reject edits, and a form reset restores the
 * uncontrolled initial value without change callbacks. An optional `name` emits the joined value
 * through a hidden form field.
 */
export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>((props, ref) => {
  const legacyProps = props as OTPInputProps & { asChild?: unknown };
  const {
    length = 6,
    value,
    defaultValue,
    onChange,
    onComplete,
    disabled,
    readOnly,
    required,
    error,
    size = 'md',
    appearance = 'outline',
    className,
    asChild: _legacyAsChild,
    name,
    form,
    locale: localeProp,
    messages,
    dir: dirProp,
    id: idProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...rest
  } = legacyProps;
  void _legacyAsChild;
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  const resolvedOnComplete = typeof onComplete === 'function' ? onComplete : undefined;
  useWarnInvalidControllableState({
    componentName: 'OTPInput',
    value,
    defaultValue,
    handler: onChange,
  });

  const formControl = useFormControl();
  const directionContext = useOptionalDirection();
  const localeContext = useOptionalLocale();
  const direction = dirProp === 'ltr' || dirProp === 'rtl' ? dirProp : directionContext?.dir;
  const isRtl = direction === 'rtl';
  const resolvedMessages = getOTPInputMessages(localeProp ?? localeContext?.locale, messages);
  const generatedId = useId();
  const isDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: isDisabled, form });
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const isInvalid = error ?? formControl.isInvalid ?? false;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = [isInvalid, hasExplicitInvalid].some(Boolean);
  const resolvedId = idProp ?? formControl.id ?? generatedId;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const accessibleLabel = resolveAccessibleLabel({
    ariaLabel,
    ariaLabelledBy,
    autoLabelledBy: formControl.labelId,
  });
  const classes = otpInput({ size, appearance });
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(rootRef, ref);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const previousLengthRef = useRef<number | undefined>(undefined);
  const focusedIndexRef = useRef<number | undefined>(undefined);
  const {
    applyInput,
    applyPaste,
    beginComposition,
    endComposition,
    handleKeyDown,
    joinedValue,
    reset,
    resolvedLength,
    segments,
  } = useOtpInputState({
    defaultValue,
    disabled: isDisabled,
    isRtl,
    length,
    onChange: resolvedOnChange,
    onComplete: resolvedOnComplete,
    readOnly: isReadOnly,
    value,
  });

  useEffect(() => {
    const previousLength = previousLengthRef.current;
    previousLengthRef.current = resolvedLength;
    if (previousLength === undefined || resolvedLength >= previousLength) return;

    if (focusedIndexRef.current === undefined || focusedIndexRef.current < resolvedLength) return;

    queueMicrotask(() => {
      const fallbackInput = inputsRef.current[resolvedLength - 1];
      fallbackInput?.focus();
      fallbackInput?.select();
      focusedIndexRef.current = resolvedLength - 1;
    });
  }, [resolvedLength]);

  const formResetRef = useFormReset<HTMLFieldSetElement>(reset);
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const applySegmentInput = (rawValue: string, index: number) => {
    const nextFocusIndex = applyInput(rawValue, index);
    if (nextFocusIndex !== null) focusInput(nextFocusIndex);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    applySegmentInput(e.target.value, index);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    if (isDisabled || isReadOnly) return;
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain').trim();
    if (!text) return;

    const nextFocusIndex = applyPaste(text, index);
    if (nextFocusIndex !== null) focusInput(nextFocusIndex);
  };

  return (
    <div
      ref={mergedRef}
      id={resolvedId}
      className={cx(classes.root, className)}
      {...rest}
      dir={direction}
      role="group"
      data-otp-overflow-viewport=""
      aria-label={accessibleLabel.ariaLabel}
      aria-labelledby={accessibleLabel.ariaLabelledBy}
      aria-describedby={describedBy}
      aria-disabled={isDisabled ? true : undefined}
    >
      <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
      {segments.map((digit, index) => (
        <input
          key={`otp-${index}`}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className={classes.input}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onCompositionStart={() => {
            beginComposition();
          }}
          onCompositionEnd={(event) => {
            const nextFocusIndex = endComposition(event.currentTarget.value, index);
            if (nextFocusIndex !== null) focusInput(nextFocusIndex);
          }}
          onKeyDown={(event) => {
            const result = handleKeyDown({
              index,
              isComposing: event.nativeEvent.isComposing,
              key: event.key,
              keyCode: event.nativeEvent.keyCode,
            });
            if (!result.handled) return;
            event.preventDefault();
            if (result.nextFocusIndex !== null) focusInput(result.nextFocusIndex);
          }}
          onPaste={(event) => handlePaste(event, index)}
          onFocus={(event) => {
            focusedIndexRef.current = index;
            if (rootRef.current) {
              scrollIntoInlineView(rootRef.current, event.currentTarget, 4);
            }
          }}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget;
            if (!nextTarget || !rootRef.current?.contains(nextTarget)) {
              focusedIndexRef.current = undefined;
            }
          }}
          maxLength={1}
          inputMode="numeric"
          disabled={isDisabled}
          readOnly={isReadOnly}
          required={isRequired}
          form={form}
          autoComplete="one-time-code"
          aria-label={resolvedMessages.digit(index + 1, resolvedLength)}
          aria-describedby={describedBy}
          aria-errormessage={errorMessage}
          aria-invalid={isInvalid ? true : ariaInvalid}
          onInvalid={() => {
            if (index !== segments.findIndex((segment) => !segment)) return;
            queueMicrotask(() => focusInput(index));
          }}
        />
      ))}
      {name ? (
        <input type="hidden" name={name} form={form} value={joinedValue} disabled={isDisabled} />
      ) : null}
    </div>
  );
});

OTPInput.displayName = 'OTPInput';
