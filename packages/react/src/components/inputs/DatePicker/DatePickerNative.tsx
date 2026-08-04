'use client';

import { Input } from '@/components/inputs/Input';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { formatDateISO, parseDateISO } from '@poffy-ui/behavior/date';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { useEffect, useRef, type ComponentPropsWithoutRef, type Ref } from 'react';
import type { DatePickerModel } from './useDatePickerModel';

interface DatePickerNativeProps {
  hostProps: ComponentPropsWithoutRef<'input'>;
  forwardedRef: Ref<HTMLInputElement | HTMLButtonElement>;
  model: DatePickerModel;
  id: string | undefined;
  name: string | undefined;
  form: string | undefined;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  describedBy: string | undefined;
  errorMessage: string | undefined;
  ariaInvalid: ComponentPropsWithoutRef<'input'>['aria-invalid'];
  onInvalid: ComponentPropsWithoutRef<'input'>['onInvalid'];
  onKeyDown: ComponentPropsWithoutRef<'input'>['onKeyDown'];
  size: ComponentPropsWithoutRef<typeof Input>['size'];
  appearance: ComponentPropsWithoutRef<typeof Input>['appearance'];
  className: string | undefined;
  min: string | number | undefined;
  max: string | number | undefined;
  valueFormatIsNative: boolean;
  unavailableMessage: string;
}

/**
 * Renders DatePicker through the platform `input[type="date"]` control.
 *
 * The browser-facing value and effective min/max are always ISO local dates. When the requested
 * form format is not ISO, this component omits the native input name and emits one hidden field
 * with the model's formatted form value instead. Unavailable selections set native custom validity
 * and form reset delegates to the model's uncontrolled reset.
 */
export function DatePickerNative({
  hostProps,
  forwardedRef,
  model,
  id,
  name,
  form,
  required,
  disabled,
  readOnly,
  invalid,
  describedBy,
  errorMessage,
  ariaInvalid,
  onInvalid,
  onKeyDown,
  size,
  appearance,
  className,
  min,
  max,
  valueFormatIsNative,
  unavailableMessage,
}: DatePickerNativeProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formBridge = useFormControlBridge<HTMLInputElement>({ disabled, form });
  const formResetRef = useFormReset<HTMLInputElement>(model.reset);
  const mergedRef = useMergeRefs(inputRef, formBridge.anchorRef, formResetRef, forwardedRef);

  useEffect(() => {
    inputRef.current?.setCustomValidity(model.hasUnavailableSelection ? unavailableMessage : '');
  }, [model.hasUnavailableSelection, unavailableMessage]);

  return (
    <>
      {!valueFormatIsNative && name ? (
        <input
          type="hidden"
          name={name}
          value={model.formValue}
          form={form}
          disabled={disabled}
          readOnly
        />
      ) : null}
      <Input
        {...hostProps}
        ref={mergedRef as Ref<HTMLInputElement>}
        id={id}
        type="date"
        name={valueFormatIsNative ? name : undefined}
        form={form}
        required={required}
        min={model.minDate ? formatDateISO(model.minDate) : min}
        max={model.maxDate ? formatDateISO(model.maxDate) : max}
        disabled={disabled}
        readOnly={readOnly}
        value={model.nativeValue}
        error={invalid}
        aria-describedby={describedBy}
        aria-errormessage={errorMessage}
        aria-invalid={ariaInvalid}
        onInvalid={onInvalid}
        size={size}
        appearance={appearance}
        className={className}
        onKeyDown={onKeyDown}
        onChange={(event) => model.commitValue(parseDateISO(event.currentTarget.value))}
      />
    </>
  );
}
