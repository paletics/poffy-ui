'use client';

import {
  applyOtpBackspace,
  applyOtpInputChange,
  applyOtpPaste,
  toOtpSegments,
} from '@poffy-ui/behavior/otp-input';
import { cx } from '@/styled-system/css';
import { otpInput } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { ChangeEvent, ClipboardEvent, forwardRef, KeyboardEvent, useRef, useState } from 'react';
import { OTPInputProps } from './OTPInput.types';

/**
 * A multi-segment OTP / verification-code input.
 * Automatically advances focus between segments on entry, supports Backspace navigation,
 * and handles paste of complete codes. Segments are synchronized with the `value` prop
 * via derived state (render-time sync without `useEffect`).
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`otpInput` SlotRecipe: `root` + `input`), Radix Slot
 * - **Props**: `OTPInputProps`
 *
 * ### Design Tokens
 * - **sizing**: segment width / height → Silver Ratio tokens per `size` variant
 * - **color**: focus ring → `brand.main`; separator → `neutral.border`
 *
 * ### Variant Logic
 * - **size**: sm / md / lg — scales segment box proportionally.
 * - **length**: Number of segments (default 6). Dynamic — renders `length` `<input>` elements.
 *
 * ### Accessibility
 * - **Role**: Each segment is a standard `<input>` with `inputMode="numeric"` and `autoComplete="one-time-code"`.
 * - **Keyboard**: Arrow Left/Right: navigate segments | Backspace: clear & move back | Type: auto-advance
 * - **Paste**: Full or partial codes pasted at any segment are distributed across all segments.
 *
 * @example Basic
 * ```tsx
 * <OTPInput length={6} onComplete={(code) => verify(code)} />
 * ```
 *
 * @example Controlled, 4-digit PIN
 * ```tsx
 * <OTPInput length={4} value={pin} onChange={setPin} size="lg" />
 * ```
 */
export const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>((props, ref) => {
  const {
    length = 6,
    value = '',
    onChange,
    onComplete,
    disabled = false,
    size = 'md',
    appearance = 'outline',
    className,
    asChild,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;

  const classes = otpInput({ size, appearance });
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [otp, setOtp] = useState<string[]>(() => toOtpSegments(value, length));
  const [prevValue, setPrevValue] = useState(value);
  const [prevLength, setPrevLength] = useState(length);

  if (value !== prevValue || length !== prevLength) {
    setOtp(toOtpSegments(value, length));
    setPrevValue(value);
    setPrevLength(length);
  }

  const Comp = asChild ? Slot : 'div';
  const groupProps =
    ariaLabel || ariaLabelledBy
      ? {
          role: 'group' as const,
          'aria-label': ariaLabel,
          'aria-labelledby': ariaLabelledBy,
        }
      : undefined;

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) focusInput(index - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < length - 1) focusInput(index + 1);
        break;
      case 'Backspace':
        e.preventDefault();
        {
          const result = applyOtpBackspace(otp, index);
          setOtp(result.otp);
          onChange?.(result.value);
          if (result.nextFocusIndex !== null) {
            focusInput(result.nextFocusIndex);
          }
        }
        break;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    if (disabled) return;
    const val = e.target.value;
    const result = applyOtpInputChange(otp, index, val);

    if (!val.slice(-1) && val.length > 0) return;

    setOtp(result.otp);
    onChange?.(result.value);
    if (result.isComplete) {
      onComplete?.(result.value);
    }

    if (result.nextFocusIndex !== null) {
      focusInput(result.nextFocusIndex);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain').trim();
    if (!text) return;

    const result = applyOtpPaste(otp, length, text);
    setOtp(result.otp);
    onChange?.(result.value);
    if (result.isComplete) {
      onComplete?.(result.value);
    }
    if (result.nextFocusIndex !== null) {
      focusInput(result.nextFocusIndex);
    }
  };

  return (
    <Comp ref={ref} className={cx(classes.root, className)} {...groupProps} {...rest}>
      {otp.map((digit, index) => (
        <input
          key={`otp-${index}`}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className={classes.input}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode="numeric"
          disabled={disabled}
          autoComplete="one-time-code"
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </Comp>
  );
});

OTPInput.displayName = 'OTPInput';
