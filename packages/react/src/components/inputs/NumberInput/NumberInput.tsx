'use client';

import {
  clampNumberInputValue,
  getNextNumberInputStepValue,
  getPreviousNumberInputStepValue,
  normalizeNumberInputBounds,
  normalizeNumberInputStep,
} from '@poffy-ui/behavior/number-input';
import { useControllableState, useMergeRefs } from '@poffy-ui/behavior/hooks';
import { cx } from '@/styled-system/css';
import { ChevronRightIcon } from '@/components/media/Icon/icons';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { resolveInputVariant } from '@/components/inputs/inputVariant';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { numberInput } from '@/styled-system/recipes';
import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { NumberInputProps } from '@/components/inputs/NumberInput/NumberInput.types';
import { useFormReset } from '@/components/inputs/shared/useFormControlBridge';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getNumberInputLabels } from './NumberInput.locales';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Numeric `spinbutton` with typed entry and increment/decrement controls.
 *
 * Values and defaults are clamped to normalized bounds. An uncontrolled field may temporarily
 * show an empty draft while editing, then restores its committed value on blur; accepted numeric
 * changes call `onChange`, while unchanged or `NaN` input does not. Arrow Up/Down and stepper
 * buttons use the normalized step and respect disabled, read-only, and boundary states. A form
 * reset restores the current uncontrolled `defaultValue` after clamping.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((rawProps, ref) => {
  const {
    min,
    max,
    step = 1,
    value: valueProp,
    defaultValue = 0,
    onChange,
    disabled,
    readOnly,
    required,
    error,
    size = 'md',
    appearance = 'outline',
    variant: _unsupportedVariant,
    locale: localeProp,
    labels,
    type: _type,
    role: _role,
    stepperTarget: _stepperTarget,
    name,
    form,
    dir,
    placeholder,
    className,
    id: idProp,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    onBlur,
    onKeyDown,
    ...rest
  } = rawProps as NumberInputProps & {
    role?: unknown;
    stepperTarget?: unknown;
    type?: unknown;
    variant?: unknown;
  };
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  useWarnInvalidControllableState({
    componentName: 'NumberInput',
    value: valueProp,
    defaultValue: rawProps.defaultValue,
    handler: onChange,
  });
  const generatedId = useId();
  const localeContext = useOptionalLocale();
  const resolvedLabels = getNumberInputLabels(localeProp ?? localeContext?.locale, labels);
  const formControl = useFormControl();
  const isInvalid = error ?? formControl.isInvalid;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = isInvalid || hasExplicitInvalid;
  const isDisabled = disabled ?? formControl.isDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly;
  const isRequired = required ?? formControl.isRequired;
  const bounds = normalizeNumberInputBounds({ min, max });
  const resolvedStep = normalizeNumberInputStep(step);
  const id = idProp ?? formControl.id ?? generatedId;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });

  const normalizedDefaultValue = clampNumberInputValue(defaultValue, bounds);
  const normalizedControlledValue =
    valueProp === undefined ? undefined : clampNumberInputValue(valueProp, bounds);
  const {
    value: committedValue,
    isControlled,
    setValue: setCommittedValue,
  } = useControllableState<number>({
    value: normalizedControlledValue,
    defaultValue: normalizedDefaultValue,
  });
  const renderValue = clampNumberInputValue(committedValue, bounds);
  const [draft, setDraft] = useState<string | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const boundsRef = useRef(bounds);
  const inputRef = useRef<HTMLInputElement>(null);
  const presentationRef = useRef({
    isControlled,
    controlledValue: normalizedControlledValue,
    min: bounds.min,
    max: bounds.max,
    step: resolvedStep,
  });

  useIsomorphicLayoutEffect(() => {
    defaultValueRef.current = defaultValue;
    boundsRef.current = { min: bounds.min, max: bounds.max };
  }, [bounds.max, bounds.min, defaultValue]);

  useIsomorphicLayoutEffect(() => {
    const previous = presentationRef.current;
    presentationRef.current = {
      isControlled,
      controlledValue: normalizedControlledValue,
      min: bounds.min,
      max: bounds.max,
      step: resolvedStep,
    };

    if (!isControlled && !Object.is(committedValue, renderValue)) {
      setCommittedValue(renderValue);
    }

    const presentationChanged = [
      previous.isControlled !== isControlled,
      previous.controlledValue !== normalizedControlledValue,
      previous.min !== bounds.min,
      previous.max !== bounds.max,
      previous.step !== resolvedStep,
    ].some(Boolean);
    if (presentationChanged) setDraft(null);
  }, [
    bounds.max,
    bounds.min,
    committedValue,
    isControlled,
    normalizedControlledValue,
    renderValue,
    resolvedStep,
    setCommittedValue,
  ]);

  const formResetRef = useFormReset<HTMLInputElement>(() => {
    if (isControlled) return;
    const resetValue = clampNumberInputValue(defaultValueRef.current, boundsRef.current);
    setCommittedValue(resetValue);
    setDraft(null);
  });
  const mergedRef = useMergeRefs(inputRef, formResetRef, ref);
  const inputValue = isControlled ? String(renderValue) : (draft ?? String(renderValue));

  const resolvedVariant = resolveInputVariant(appearance);
  const styles = numberInput({
    size,
    variant: resolvedVariant,
    error: isInvalid,
  });

  const handleChange = (next: number, keepDraft = false) => {
    if (isNaN(next)) return;
    const clamped = clampNumberInputValue(next, bounds);
    if (clamped === renderValue) {
      if (!isControlled && draft !== null) setDraft(null);
      return;
    }
    if (!isControlled) {
      setCommittedValue(clamped);
      setDraft(keepDraft ? String(clamped) : null);
    }
    resolvedOnChange?.(clamped);
  };

  const stepBase = bounds.min ?? normalizedDefaultValue;
  const getNextStepValue = () =>
    getNextNumberInputStepValue({ value: renderValue, step: resolvedStep, stepBase, ...bounds });
  const getPreviousStepValue = () =>
    getPreviousNumberInputStepValue({
      value: renderValue,
      step: resolvedStep,
      stepBase,
      ...bounds,
    });
  const increment = () => {
    setDraft(null);
    handleChange(getNextStepValue());
  };
  const decrement = () => {
    setDraft(null);
    handleChange(getPreviousStepValue());
  };

  const canIncrement = !isDisabled && !isReadOnly && getNextStepValue() !== renderValue;
  const canDecrement = !isDisabled && !isReadOnly && getPreviousStepValue() !== renderValue;

  return (
    <div
      className={cx(styles.root, className)}
      data-disabled={isDisabled ? '' : undefined}
      dir={dir}
    >
      <input
        {...rest}
        ref={mergedRef}
        id={id}
        type="number"
        role="spinbutton"
        name={name}
        form={form}
        value={inputValue}
        min={bounds.min}
        max={bounds.max}
        step={resolvedStep}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        placeholder={placeholder}
        aria-disabled={isDisabled ? true : undefined}
        aria-invalid={isInvalid ? true : ariaInvalid}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        aria-readonly={isReadOnly || undefined}
        className={styles.field}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === '') {
            if (!isControlled) setDraft('');
            return;
          }
          handleChange(Number(raw), true);
        }}
        onBlur={(event) => {
          setDraft(null);
          onBlur?.(event);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || isDisabled || isReadOnly) return;

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            increment();
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            decrement();
          }
        }}
      />
      <div className={styles.stepperGroup}>
        <ButtonPrimitive
          className={styles.stepperButton}
          data-direction="up"
          onClick={increment}
          disabled={!canIncrement}
          aria-label={resolvedLabels.increment}
          tabIndex={-1}
        >
          <ChevronRightIcon />
        </ButtonPrimitive>
        <ButtonPrimitive
          className={styles.stepperButton}
          data-direction="down"
          onClick={decrement}
          disabled={!canDecrement}
          aria-label={resolvedLabels.decrement}
          tabIndex={-1}
        >
          <ChevronRightIcon />
        </ButtonPrimitive>
      </div>
    </div>
  );
});

NumberInput.displayName = 'NumberInput';
