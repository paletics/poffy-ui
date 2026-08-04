'use client';

import { forwardRef, useMemo, type ComponentPropsWithoutRef } from 'react';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getDatePickerMessages } from './DatePicker.locales';
import { resolveDateTimeLocale } from '@/components/shared/resolveDateTimeLocale';
import { getCommonMessages } from '@/components/shared/common.locales';
import type { DatePickerComponent, DatePickerProps } from './DatePicker.types';
import { useDatePickerModel } from './useDatePickerModel';
import { DatePickerNative } from './DatePickerNative';
import { DatePickerCustom } from './DatePickerCustom';

const DatePickerImpl = forwardRef<HTMLInputElement | HTMLButtonElement, DatePickerProps>(
  (rawProps, ref) => {
    const {
      value: controlledValue,
      defaultValue,
      minDate,
      maxDate,
      isDateDisabled,
      onChange,
      locale: localeProp,
      messages,
      formatOptions,
      size,
      appearance = 'outline',
      variant: _unsupportedVariant,
      error,
      disabled,
      readOnly,
      className,
      placeholder: placeholderProp,
      name,
      form,
      required,
      id,
      valueFormat = 'iso-date',
      native = false,
      onInvalid,
      onKeyDown,
      min: nativeMinProp,
      max: nativeMaxProp,
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
      'aria-invalid': ariaInvalid,
      'aria-controls': _ariaControls,
      'aria-expanded': _ariaExpanded,
      'aria-haspopup': _ariaHasPopup,
      'aria-required': _ariaRequired,
      role: _role,
      ...props
    } = rawProps as DatePickerProps & {
      'aria-controls'?: unknown;
      'aria-expanded'?: unknown;
      'aria-haspopup'?: unknown;
      'aria-required'?: unknown;
      role?: unknown;
      variant?: unknown;
      min?: string | number;
      max?: string | number;
    };
    const formControl = useFormControl();
    const isInvalid = error ?? formControl.isInvalid ?? false;
    const isDisabled = disabled ?? formControl.isDisabled ?? false;
    const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
    const isRequired = required ?? formControl.isRequired ?? false;
    const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
    const { describedBy, errorMessage } = resolveFormControlAria({
      ariaDescribedBy,
      ariaErrorMessage,
      errorMessageIds: formControl.errorMessageIds,
      helperTextIds: formControl.helperTextIds,
      isInvalid: [isInvalid, hasExplicitInvalid].some(Boolean),
    });
    const providerLocale = useOptionalLocale()?.locale;
    const resolvedLocale = resolveDateTimeLocale(localeProp ?? providerLocale ?? 'en-US');
    const resolvedMessages = useMemo(
      () => getDatePickerMessages(resolvedLocale, messages),
      [messages, resolvedLocale],
    );
    const placeholder = placeholderProp ?? resolvedMessages.placeholder;
    const requiredMessage = getCommonMessages(resolvedLocale).required;
    const model = useDatePickerModel({
      value: controlledValue,
      defaultValue,
      onChange: typeof onChange === 'function' ? onChange : undefined,
      minDate,
      maxDate,
      isDateDisabled,
      disabled: isDisabled,
      readOnly: isReadOnly,
      locale: resolvedLocale,
      formatOptions,
      valueFormat,
    });

    if (native) {
      return (
        <DatePickerNative
          hostProps={props as ComponentPropsWithoutRef<'input'>}
          forwardedRef={ref}
          model={model}
          id={id}
          name={name}
          form={form}
          required={isRequired}
          disabled={isDisabled}
          readOnly={isReadOnly}
          invalid={isInvalid}
          describedBy={describedBy}
          errorMessage={errorMessage}
          ariaInvalid={ariaInvalid}
          onInvalid={onInvalid}
          onKeyDown={onKeyDown as ComponentPropsWithoutRef<'input'>['onKeyDown']}
          size={size}
          appearance={appearance}
          className={className}
          min={nativeMinProp}
          max={nativeMaxProp}
          valueFormatIsNative={valueFormat === 'iso-date'}
          unavailableMessage={resolvedMessages.unavailable}
        />
      );
    }

    return (
      <DatePickerCustom
        hostProps={props as ComponentPropsWithoutRef<'button'>}
        forwardedRef={ref}
        model={model}
        id={id}
        formControlId={formControl.id}
        name={name}
        form={form}
        required={isRequired}
        disabled={isDisabled}
        readOnly={isReadOnly}
        invalid={isInvalid}
        hasExplicitInvalid={hasExplicitInvalid}
        describedBy={describedBy}
        errorMessage={errorMessage}
        onInvalid={onInvalid}
        onKeyDown={onKeyDown as ComponentPropsWithoutRef<'button'>['onKeyDown']}
        size={size}
        appearance={appearance}
        className={className}
        locale={resolvedLocale}
        placeholder={placeholder}
        calendarLabel={resolvedMessages.calendar}
        unavailableMessage={resolvedMessages.unavailable}
        requiredMessage={requiredMessage}
        isDateDisabled={isDateDisabled}
      />
    );
  },
);

DatePickerImpl.displayName = 'DatePicker';

/**
 * Controlled or uncontrolled local-calendar-day field with custom or native rendering.
 *
 * The default branch is an input-styled button and calendar dialog; `native` instead renders a
 * platform date input. Values are `Date | null` but represent local days, not UTC instants.
 * Unavailable, disabled, or read-only selections are ignored. `name` serializes the selected day
 * through the configured format, and native form reset restores the uncontrolled default.
 */

export const DatePicker = DatePickerImpl as DatePickerComponent;
