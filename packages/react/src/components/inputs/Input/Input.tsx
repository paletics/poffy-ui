'use client';

import { css, cx } from '@/styled-system/css';
import { input, inputGroup } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { InputProps } from './Input.types';
import { ActionMotion } from '@/components/animations';
import { useFormControl } from '../FormControl/useFormControl';

/**
 * Standard text input for form data entry. Supports multiple visual variants, sizing,
 * error states, and optional start/end adornments (icons, prefixes, etc.).
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`input` + `inputGroup` recipes), Radix Slot, `ActionMotion`
 * - **Props**: `PrimitiveProps<'input'>`
 *
 * ### Design Tokens
 * - **spacing**: padding → `silver.md` / `silver.lg` per size
 * - **color**: focus ring → `brand.main`; error state → `danger.main`
 * - **duration**: focus transition → `subtle` preset; error → `shake` preset
 *
 * ### Variant Logic
 * - **variant="outline"**: Default. Bordered input — standard form usage.
 * - **variant="filled"**: Filled background, no visible border — use on light neutral surfaces.
 * - **variant="flushed"**: Bottom border only — compact or minimal form layouts.
 *
 * ### Accessibility
 * - **Role**: `textbox` (implicit via `<input>`)
 * - **Keyboard**: Tab: focus | Escape: blur (via blur on parent)
 * - **States**: `aria-invalid` set automatically when `error` is `true`
 * - **Required**: Provide an associated `<label>` or `aria-label` — the component does not render one
 *
 * @example Standard usage
 * ```tsx
 * <Input placeholder="Enter your name" />
 * ```
 *
 * @example With start adornment (search)
 * ```tsx
 * <Input startElement={<SearchIcon />} placeholder="Search..." />
 * ```
 *
 * @example Error state
 * ```tsx
 * <Input error placeholder="Invalid value" aria-label="Email" />
 * ```
 *
 * @example Polymorphic — masked input library
 * ```tsx
 * <Input asChild>
 *   <InputMask mask="99/99/9999" placeholder="MM/DD/YYYY" />
 * </Input>
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    appearance = 'outline',
    variant,
    size,
    error,
    disabled,
    readOnly,
    required,
    id,
    className,
    asChild,
    startElement,
    endElement,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;
  const formControl = useFormControl();

  const isInvalid = error ?? formControl.isInvalid;
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isRequired = required ?? formControl.isRequired;
  const inputId = id ?? formControl.id;
  const formControlDescribedBy = [
    formControl.helperTextId,
    isInvalid ? formControl.errorMessageId : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const describedBy =
    ariaDescribedBy ?? (formControlDescribedBy.length > 0 ? formControlDescribedBy : undefined);
  const errorMessage = ariaErrorMessage ?? (isInvalid ? formControl.errorMessageId : undefined);

  const resolvedSize = size ?? 'md';
  const hasStart = !!startElement;
  const hasEnd = !!endElement;
  const hasAdornment = [hasStart, hasEnd].some(Boolean);

  const resolvedVariant = variant ?? (appearance === 'soft' ? 'filled' : 'outline');
  const recipeClass = input({ variant: resolvedVariant, size, error: isInvalid });
  const groupStyles = inputGroup({ size: resolvedSize });
  const adornmentPaddingClass =
    hasAdornment &&
    css({
      pl: hasStart
        ? resolvedSize === 'lg'
          ? '3xl'
          : resolvedSize === 'md'
            ? '2xl'
            : 'xl'
        : undefined,
      pr: hasEnd
        ? resolvedSize === 'lg'
          ? '3xl'
          : resolvedSize === 'md'
            ? '2xl'
            : 'xl'
        : undefined,
    });
  const Comp = asChild ? Slot : 'input';

  const motionCustomData = {
    glowColor: isInvalid
      ? 'var(--poffy-colors-variants-danger-main)'
      : 'var(--poffy-colors-brand-main)',
    shadowColor: isInvalid
      ? 'var(--poffy-colors-variants-danger-main)'
      : 'var(--poffy-colors-brand-main)',
    tapScale: 1,
  };

  const inputEl = (
    <ActionMotion
      asChild
      disabled={isDisabled}
      animationType={isInvalid ? 'shake' : 'subtle'}
      customData={motionCustomData}
    >
      <Comp
        ref={ref}
        // Native disabled on Slot would become an invalid HTML attribute on non-input children.
        id={inputId}
        disabled={asChild ? undefined : isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        aria-disabled={isDisabled ? true : undefined}
        className={cx(
          recipeClass,
          hasAdornment && groupStyles.input,
          adornmentPaddingClass,
          className,
        )}
        aria-invalid={isInvalid ? true : ariaInvalid}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        data-has-left-element={hasStart ? '' : undefined}
        data-has-right-element={hasEnd ? '' : undefined}
        {...rest}
      />
    </ActionMotion>
  );

  if (!hasAdornment) return inputEl;

  return (
    <div
      className={groupStyles.root}
      data-has-left-element={hasStart ? '' : undefined}
      data-has-right-element={hasEnd ? '' : undefined}
    >
      {startElement && (
        <div className={groupStyles.element} data-placement="left" aria-hidden="true">
          {startElement}
        </div>
      )}
      {inputEl}
      {endElement && (
        <div className={groupStyles.element} data-placement="right" aria-hidden="true">
          {endElement}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
