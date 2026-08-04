'use client';

import { css, cx } from '@/styled-system/css';
import { input, inputGroup } from '@/styled-system/recipes';
import { isInputAsChildHost } from '@/components/shared/asChild';
import { guardActivationHandlers } from '@poffy-ui/behavior/activation';
import { Slot } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, isValidElement } from 'react';
import type { ChangeEventHandler } from 'react';
import type { InputProps } from '@/components/inputs/Input/Input.types';
import { ActionMotion } from '@/components/animations';
import { resolveInputVariant } from '@/components/inputs/inputVariant';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';

interface InputChangeGuardProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onChangeCapture?: ChangeEventHandler<HTMLInputElement>;
}

/**
 * Text-like native form field with optional inline adornments.
 *
 * Values supplied directly for `disabled`, `readOnly`, `required`, `id`, and `error` take
 * precedence over the nearest `FormControl`; the resolved state also manages invalid and helper
 * text ARIA associations. Decorative adornments are inert and hidden from assistive technology
 * unless their matching `*Interactive` prop is true. `asChild` accepts an input host or a custom
 * component that forwards input props and an `HTMLInputElement` ref.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    appearance = 'outline',
    variant: _unsupportedVariant,
    size,
    error,
    disabled,
    readOnly,
    required,
    id,
    className,
    asChild,
    children,
    startElement,
    startElementInteractive = false,
    endElement,
    endElementInteractive = false,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props as InputProps & { variant?: unknown };
  const formControl = useFormControl();

  const isInvalid = error ?? formControl.isInvalid;
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isRequired = required ?? formControl.isRequired;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = Boolean(isInvalid || hasExplicitInvalid);
  const inputId = id ?? formControl.id;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });

  const resolvedSize = size ?? 'md';
  const hasStart = !!startElement;
  const hasEnd = !!endElement;
  const hasAdornment = [hasStart, hasEnd].some(Boolean);

  const resolvedVariant = resolveInputVariant(appearance);
  const recipeClass = input({ variant: resolvedVariant, size, error: isInvalid });
  const groupStyles = inputGroup({ size: resolvedSize });
  const adornmentPaddingClass =
    hasAdornment &&
    css({
      paddingInlineStart: hasStart
        ? resolvedSize === 'lg'
          ? '3xl'
          : resolvedSize === 'md'
            ? '2xl'
            : 'xl'
        : undefined,
      paddingInlineEnd: hasEnd
        ? resolvedSize === 'lg'
          ? '3xl'
          : resolvedSize === 'md'
            ? '2xl'
            : 'xl'
        : undefined,
    });
  const asChildElement = asChild && isInputAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChildElement);
  const Comp = canUseAsChild ? Slot : 'input';
  const asChildTag = typeof asChildElement?.type === 'string' ? asChildElement.type : undefined;
  const isCustomAsChildComponent = canUseAsChild && asChildTag === undefined;
  const supportsNativeInputProps = [
    !canUseAsChild,
    isCustomAsChildComponent,
    asChildTag === 'input',
  ].some(Boolean);
  const supportsDisabled = supportsNativeInputProps;
  const supportsReadOnly = supportsNativeInputProps;
  const supportsRequired = supportsNativeInputProps;
  const preventDisabledInputInteraction = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const preventDisabledInputKey = (event: {
    key: string;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    if (event.key !== 'Tab') {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const changeGuardedChildren =
    canUseAsChild && isDisabled && isValidElement<InputChangeGuardProps>(children)
      ? cloneElement(children, {
          onChangeCapture: preventDisabledInputInteraction,
          onChange: preventDisabledInputInteraction,
        })
      : children;
  const guardedChildren = guardActivationHandlers(
    changeGuardedChildren,
    Boolean(canUseAsChild && isDisabled),
    {
      onClickCapture: preventDisabledInputInteraction,
      onClick: preventDisabledInputInteraction,
      onKeyDownCapture: preventDisabledInputKey,
      onKeyDown: preventDisabledInputKey,
      onKeyUpCapture: preventDisabledInputKey,
      onKeyUp: preventDisabledInputKey,
      onPointerDownCapture: preventDisabledInputInteraction,
      onPointerDown: preventDisabledInputInteraction,
      onPointerUpCapture: preventDisabledInputInteraction,
      onPointerUp: preventDisabledInputInteraction,
    },
  );
  const ownedChildren =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          id: inputId,
          disabled: supportsDisabled ? isDisabled : undefined,
          readOnly: supportsReadOnly ? isReadOnly : undefined,
          required: supportsRequired ? isRequired : undefined,
          'aria-disabled': isDisabled ? true : undefined,
          'aria-invalid': isInvalid ? true : ariaInvalid,
          'aria-describedby': describedBy,
          'aria-errormessage': errorMessage,
        })
      : guardedChildren;

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
        id={inputId}
        disabled={supportsDisabled ? isDisabled : undefined}
        readOnly={supportsReadOnly ? isReadOnly : undefined}
        required={supportsRequired ? isRequired : undefined}
        className={cx(
          recipeClass,
          hasAdornment && groupStyles.input,
          adornmentPaddingClass,
          className,
        )}
        {...rest}
        aria-disabled={isDisabled ? true : undefined}
        aria-invalid={isInvalid ? true : ariaInvalid}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        data-has-start-element={hasStart ? '' : undefined}
        data-has-end-element={hasEnd ? '' : undefined}
        data-has-left-element={hasStart ? '' : undefined}
        data-has-right-element={hasEnd ? '' : undefined}
        onClickCapture={canUseAsChild && isDisabled ? preventDisabledInputInteraction : undefined}
        onPointerDownCapture={
          canUseAsChild && isDisabled ? preventDisabledInputInteraction : undefined
        }
        onPointerUpCapture={
          canUseAsChild && isDisabled ? preventDisabledInputInteraction : undefined
        }
        onKeyDownCapture={canUseAsChild && isDisabled ? preventDisabledInputKey : undefined}
        onKeyUpCapture={canUseAsChild && isDisabled ? preventDisabledInputKey : undefined}
      >
        {canUseAsChild ? ownedChildren : undefined}
      </Comp>
    </ActionMotion>
  );

  if (!hasAdornment) return inputEl;

  return (
    <div
      className={groupStyles.root}
      data-has-start-element={hasStart ? '' : undefined}
      data-has-end-element={hasEnd ? '' : undefined}
      data-has-left-element={hasStart ? '' : undefined}
      data-has-right-element={hasEnd ? '' : undefined}
    >
      {startElement && (
        <div
          className={cx(
            groupStyles.element,
            startElementInteractive && css({ pointerEvents: 'auto' }),
          )}
          data-input-group-element=""
          data-placement="start"
          data-interactive={startElementInteractive ? '' : undefined}
          aria-hidden={startElementInteractive ? undefined : true}
          inert={startElementInteractive ? undefined : true}
        >
          {startElement}
        </div>
      )}
      {inputEl}
      {endElement && (
        <div
          className={cx(
            groupStyles.element,
            endElementInteractive && css({ pointerEvents: 'auto' }),
          )}
          data-input-group-element=""
          data-placement="end"
          data-interactive={endElementInteractive ? '' : undefined}
          aria-hidden={endElementInteractive ? undefined : true}
          inert={endElementInteractive ? undefined : true}
        >
          {endElement}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
