'use client';

import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { Calendar } from '@/components/inputs/Calendar';
import { resolveInputVariant } from '@/components/inputs/inputVariant';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { CalendarIcon } from '@/components/media/Icon/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/overlay/Popover';
import { css, cx } from '@/styled-system/css';
import { input, inputGroup } from '@/styled-system/recipes';
import { focusAdjacentTabStop, useMergeRefs } from '@poffy-ui/behavior/hooks';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type Ref,
} from 'react';
import type { DatePickerVariants } from './DatePicker.types';
import type { DatePickerModel } from './useDatePickerModel';

const CALENDAR_AUTO_FOCUS_PROPS = { autoFocus: true } as const;

interface DatePickerCustomProps {
  hostProps: ComponentPropsWithoutRef<'button'>;
  forwardedRef: Ref<HTMLInputElement | HTMLButtonElement>;
  model: DatePickerModel;
  id: string | undefined;
  formControlId: string | undefined;
  name: string | undefined;
  form: string | undefined;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  hasExplicitInvalid: boolean;
  describedBy: string | undefined;
  errorMessage: string | undefined;
  onInvalid: ComponentPropsWithoutRef<'input'>['onInvalid'];
  onKeyDown: ComponentPropsWithoutRef<'button'>['onKeyDown'];
  size: DatePickerVariants['size'];
  appearance: DatePickerVariants['appearance'];
  className: string | undefined;
  locale: string;
  placeholder: string;
  calendarLabel: string;
  unavailableMessage: string;
  requiredMessage: string;
  isDateDisabled: ((date: Date) => boolean) | undefined;
}

/**
 * Renders DatePicker's input-styled button and non-modal Calendar popover.
 *
 * Selection is serialized through a hidden field and required/unavailable validity through an
 * offscreen proxy. ArrowDown, Enter, and Space open the dialog; Escape restores trigger focus;
 * Tab moves from the trigger's logical tab sequence while excluding the portalled calendar.
 * Read-only stays focusable but cannot open or commit a date, and effective form disabling closes
 * the popover and removes focus when necessary.
 */
export function DatePickerCustom({
  hostProps,
  forwardedRef,
  model,
  id,
  formControlId,
  name,
  form,
  required,
  disabled,
  readOnly,
  invalid,
  hasExplicitInvalid,
  describedBy,
  errorMessage,
  onInvalid,
  onKeyDown,
  size,
  appearance,
  className,
  locale,
  placeholder,
  calendarLabel,
  unavailableMessage,
  requiredMessage,
  isDateDisabled,
}: DatePickerCustomProps) {
  const [requestedOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const calendarDialogRef = useRef<HTMLDivElement | null>(null);
  const validationProxyRef = useRef<HTMLInputElement | null>(null);
  const shouldRestoreTriggerFocusRef = useRef(false);
  const requiredDescriptionId = useId();
  const calendarDialogId = useId();
  const mergedRef = useMergeRefs(triggerRef, forwardedRef);
  const formBridge = useFormControlBridge({ disabled, form });
  const effectiveDisabled = formBridge.effectivelyDisabled;
  const isEffectivelyDisabledNow = formBridge.isEffectivelyDisabledNow;
  const interactionBlocked = [effectiveDisabled, readOnly].some(Boolean);
  const isInteractionBlockedNow = () => [readOnly, isEffectivelyDisabledNow()].some(Boolean);
  const isOpen = requestedOpen && !interactionBlocked;
  const needsValidationProxy = [required, model.hasUnavailableSelection].some(Boolean);
  const customTriggerDescription = [
    ...new Set(
      [describedBy, errorMessage, required ? requiredDescriptionId : undefined]
        .flatMap((description) => description?.split(/\s+/) ?? [])
        .filter(Boolean),
    ),
  ].join(' ');

  useEffect(() => {
    if (!interactionBlocked) return;
    const trigger = triggerRef.current;
    if (effectiveDisabled && trigger?.ownerDocument.activeElement === trigger) {
      trigger?.blur();
    }
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setIsOpen(false);
      const currentTrigger = triggerRef.current;
      if (effectiveDisabled && currentTrigger?.ownerDocument.activeElement === currentTrigger) {
        currentTrigger?.blur();
      }
    });
    return () => {
      active = false;
    };
  }, [effectiveDisabled, interactionBlocked]);

  useEffect(() => {
    if (!isOpen && shouldRestoreTriggerFocusRef.current) {
      if (!isEffectivelyDisabledNow()) triggerRef.current?.focus();
      shouldRestoreTriggerFocusRef.current = false;
    }
  }, [isEffectivelyDisabledNow, isOpen]);

  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    if (model.isControlled) return;
    model.reset();
    setIsOpen(false);
  });
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

  useEffect(() => {
    validationProxyRef.current?.setCustomValidity(
      model.hasUnavailableSelection ? unavailableMessage : '',
    );
  }, [model.hasUnavailableSelection, unavailableMessage]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || interactionBlocked) return;
    if (!['ArrowDown', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    setIsOpen(true);
  };

  return (
    <>
      <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
      {required ? (
        <VisuallyHidden id={requiredDescriptionId}>{requiredMessage}</VisuallyHidden>
      ) : null}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={model.formValue}
          form={form}
          disabled={effectiveDisabled}
          readOnly
        />
      ) : null}
      {needsValidationProxy ? (
        <input
          aria-hidden="true"
          className={css({ srOnly: true })}
          data-form-control-validation-proxy=""
          ref={validationProxyRef}
          disabled={interactionBlocked}
          form={form}
          onChange={() => undefined}
          onInvalid={(event) => {
            onInvalid?.(event);
            triggerRef.current?.focus();
          }}
          required
          tabIndex={-1}
          type="text"
          value={model.formValue}
        />
      ) : null}
      <Popover
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen && isInteractionBlockedNow()) return;
          if (interactionBlocked) {
            if (!nextOpen) setIsOpen(false);
            return;
          }
          setIsOpen(nextOpen);
        }}
        placement="bottom-start"
        showArrow={false}
      >
        <div
          className={inputGroup({ size: size ?? 'md' }).root}
          data-has-end-element=""
          data-has-right-element=""
        >
          <PopoverTrigger asChild disabled={effectiveDisabled}>
            <button
              {...hostProps}
              ref={mergedRef as Ref<HTMLButtonElement>}
              id={id ?? formControlId}
              type="button"
              disabled={effectiveDisabled}
              aria-expanded={isOpen}
              aria-controls={isOpen ? calendarDialogId : undefined}
              aria-haspopup="dialog"
              aria-describedby={
                customTriggerDescription.length > 0 ? customTriggerDescription : undefined
              }
              className={cx(
                input({
                  variant: resolveInputVariant(appearance),
                  size,
                  error: invalid,
                }),
                inputGroup({ size: size ?? 'md' }).input,
                css({
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'start',
                  cursor: 'pointer',
                  paddingInlineEnd: size === 'lg' ? '3xl' : size === 'sm' ? 'xl' : '2xl',
                  '&[data-placeholder]': { color: 'text.secondary' },
                  '&[data-readonly]': {
                    cursor: 'default',
                    color: 'text.secondary',
                  },
                }),
                className,
              )}
              data-datepicker-trigger=""
              data-invalid={invalid || hasExplicitInvalid ? '' : undefined}
              data-placeholder={model.formattedValue ? undefined : ''}
              data-readonly={readOnly ? '' : undefined}
              onKeyDown={handleTriggerKeyDown}
            >
              <span
                className={css({
                  minW: '[0px]',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                })}
              >
                {model.formattedValue === '' ? placeholder : model.formattedValue}
              </span>
            </button>
          </PopoverTrigger>
          <span
            aria-hidden="true"
            className={inputGroup({ size: size ?? 'md' }).element}
            data-input-group-element=""
            data-placement="end"
            inert
          >
            <CalendarIcon />
          </span>
        </div>
        <PopoverContent
          ref={calendarDialogRef}
          className={css({
            width: '[max-content]',
            maxWidth: '[calc(100vw - 2 * var(--poffy-spacing-md))]',
          })}
          surface="none"
          focusManagement={false}
          id={calendarDialogId}
          aria-label={calendarLabel}
          onKeyDownCapture={(event) => {
            if (event.key === 'Escape') {
              shouldRestoreTriggerFocusRef.current = true;
              return;
            }
            if (event.key !== 'Tab' || event.defaultPrevented || !triggerRef.current) return;
            const moved = focusAdjacentTabStop({
              origin: triggerRef.current,
              reverse: event.shiftKey,
              excludeRoot: calendarDialogRef.current,
            });
            if (moved) event.preventDefault();
            else triggerRef.current.focus();
            setIsOpen(false);
          }}
        >
          <Calendar
            {...CALENDAR_AUTO_FOCUS_PROPS}
            selected={model.value ?? undefined}
            onSelect={(date) => {
              if (!date || isInteractionBlockedNow()) return;
              model.commitValue(date);
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
            locale={locale}
            defaultMonth={model.value ?? undefined}
            minDate={model.minDate}
            maxDate={model.maxDate}
            isDateDisabled={isDateDisabled}
            disabled={effectiveDisabled}
            readOnly={readOnly}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
