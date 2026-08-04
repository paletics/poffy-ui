'use client';

import { forwardRef, useMemo, useEffect, useId, useRef, useCallback, useLayoutEffect } from 'react';
import type { FocusEvent } from 'react';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { css, cx } from '@/styled-system/css';
import { calendar } from '@/styled-system/recipes';
import { CalendarProps } from './Calendar.types';
import { useCalendarNavigation } from './useCalendarNavigation';
import { useCalendarGrid } from './useCalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHiddenInputs } from './CalendarHiddenInputs';
import { getCalendarLabels } from './Calendar.locales';
import { formatDateISO } from './Calendar.utils';
import { useCalendarControlledSelection } from './useCalendarControlledSelection';
import {
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { useOptionalDirection } from '@/providers/DirectionProvider';
import { resolveDateTimeLocale } from '@/components/shared/resolveDateTimeLocale';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { isValidDate } from '@poffy-ui/behavior/date';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { getCommonMessages } from '@/components/shared/common.locales';
import { normalizeCalendarSelection } from '@poffy-ui/behavior/calendar';

type CalendarSelectionValue = Date | Date[] | { from?: Date; to?: Date } | undefined;

const sanitizeCalendarSelection = (
  mode: NonNullable<CalendarProps['mode']>,
  value: CalendarSelectionValue,
): CalendarSelectionValue => normalizeCalendarSelection(mode, value);

const hasCompletedSelection = (mode: CalendarProps['mode'], selected: unknown) => {
  if (mode === 'multiple') return Array.isArray(selected) && selected.some(isValidDate);
  if (mode === 'range') {
    const range = selected as { from?: Date; to?: Date } | undefined;
    return isValidDate(range?.from) && isValidDate(range?.to);
  }
  return isValidDate(selected as Date | undefined);
};

const getSelectedDates = (mode: CalendarProps['mode'], selected: unknown): Date[] => {
  if (mode === 'multiple') return Array.isArray(selected) ? selected.filter(isValidDate) : [];
  if (mode === 'range') {
    const range = selected as { from?: Date; to?: Date } | undefined;
    return [range?.from, range?.to].filter(isValidDate);
  }
  return isValidDate(selected as Date | undefined) ? [selected as Date] : [];
};

/**
 * Localized keyboard-operable date grid with single, multiple, or range selection.
 *
 * Each mode has its own `selected` value shape; supplying the `selected` prop, including
 * `undefined`, makes selection controlled. Invalid dates, duplicate multiple values, and malformed
 * ranges are normalized before rendering. Disabled, read-only, and unavailable days cannot be
 * selected. `required` demands a complete mode-specific selection, and `name` emits normalized
 * hidden date fields for the associated form. Uncontrolled form reset restores `defaultValue`.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    minDate,
    maxDate,
    showOutsideDays = true,
    showYearMonthSelect = false,
    weekStartsOn = 0,
    locale: localeProp,
    disabled,
    readOnly,
    required,
    labels,
    className,
    isDateDisabled: _isDateDisabled,
    mode = 'single',
    selected: propsSelected,
    defaultValue,
    onSelect,
    onMonthChange: _onMonthChange,
    month: _month,
    defaultMonth: _defaultMonth,
    components,
    autoFocus,
    name,
    form,
    id: idProp,
    dir: dirProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    'aria-disabled': ariaDisabled,
    onFocusCapture,
    children,
    size,
    formatOptions,
    ...rest
  } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const validationProxyRef = useRef<HTMLInputElement | null>(null);
  const isSelectionControlled = Object.prototype.hasOwnProperty.call(props, 'selected');
  const formControl = useFormControl();
  const directionContext = useOptionalDirection();
  const direction = dirProp === 'rtl' || dirProp === 'ltr' ? dirProp : directionContext?.dir;
  const isDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: isDisabled, form });
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const isInvalid = formControl.isInvalid ?? false;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = [isInvalid, hasExplicitInvalid].some(Boolean);
  const { describedBy } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const providerLocale = useOptionalLocale()?.locale;
  const locale = resolveDateTimeLocale(localeProp ?? providerLocale ?? 'en-US');
  const requiredDescriptionId = useId();
  const requiredMessage = getCommonMessages(locale).required;
  const joinedCalendarDescribedBy = [describedBy, isRequired ? requiredDescriptionId : undefined]
    .filter(Boolean)
    .join(' ');
  const calendarDescribedBy =
    joinedCalendarDescribedBy.length > 0 ? joinedCalendarDescribedBy : undefined;
  const calendarLabels = useMemo(() => getCalendarLabels(locale, labels), [locale, labels]);
  const accessibleLabel = resolveAccessibleLabel({
    ariaLabel,
    ariaLabelledBy,
    autoLabelledBy: formControl.labelId,
    fallbackLabel: calendarLabels.calendar,
  });
  const classes = calendar({ size });
  const validMinDate = isValidDate(minDate) ? minDate : undefined;
  const validMaxDate = isValidDate(maxDate) ? maxDate : undefined;
  const validMonth = isValidDate(_month) ? _month : undefined;
  const validDefaultMonth = isValidDate(_defaultMonth) ? _defaultMonth : undefined;
  const sanitizedSelected = sanitizeCalendarSelection(mode, propsSelected);
  const sanitizedDefaultValue = sanitizeCalendarSelection(mode, defaultValue);

  const normalizedMinDate = useMemo(
    () =>
      validMinDate
        ? new Date(validMinDate.getFullYear(), validMinDate.getMonth(), validMinDate.getDate())
        : undefined,
    [validMinDate],
  );

  const normalizedMaxDate = useMemo(
    () =>
      validMaxDate
        ? new Date(validMaxDate.getFullYear(), validMaxDate.getMonth(), validMaxDate.getDate())
        : undefined,
    [validMaxDate],
  );

  const { handleSelect, resetSelection, selected } = useCalendarControlledSelection({
    defaultValue: sanitizedDefaultValue,
    isControlled: isSelectionControlled,
    mode,
    onSelect,
    selectedProp: sanitizedSelected,
  });

  const {
    currentMonthDate,
    focusedDate,
    isInitialDateReady,
    today,
    setHoveredDate,
    navMonth,
    goToToday,
    handleMonthChange,
    handleDateSelect,
    handleKeyDown,
    canNavPrev,
    canNavNext,
    canGoToToday,
    gridRef,
    isDateUnavailable,
    isSelected,
    isRangeStart,
    isRangeEnd,
    isRangeMiddle,
  } = useCalendarNavigation({
    ...props,
    disabled: isDisabled,
    readOnly: isReadOnly,
    minDate: normalizedMinDate,
    maxDate: normalizedMaxDate,
    month: validMonth,
    defaultMonth: validDefaultMonth,
    defaultValue: sanitizedDefaultValue,
    selected,
    onSelect: handleSelect,
  } as CalendarProps);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }),
    [locale],
  );

  const weekdayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: 'short' }),
    [locale],
  );

  const calendarGrid = useCalendarGrid(currentMonthDate, weekStartsOn, weekdayFormatter);

  const didAutoFocus = useRef(false);
  const defaultValueRef = useRef(sanitizedDefaultValue);
  const setRootRef = useMergeRefs(rootRef, ref);
  useLayoutEffect(() => {
    defaultValueRef.current = sanitizedDefaultValue;
  }, [sanitizedDefaultValue]);
  useEffect(() => {
    if (autoFocus && focusedDate && isInitialDateReady && !didAutoFocus.current) {
      const dateISO = formatDateISO(focusedDate);
      const button = gridRef.current?.querySelector(
        `button[data-date="${dateISO}"]`,
      ) as HTMLButtonElement | null;
      if (!button) return;
      button.focus();
      didAutoFocus.current = true;
    }
  }, [autoFocus, focusedDate, gridRef, isInitialDateReady]);

  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    if (isSelectionControlled) return;
    resetSelection(defaultValueRef.current);
  });
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

  const hasSelection = hasCompletedSelection(mode, selected);
  const hasUnavailableSelection = getSelectedDates(mode, selected).some(isDateUnavailable);
  const needsValidationProxy = [
    isRequired,
    shouldAssociateErrorMessage,
    hasUnavailableSelection,
  ].some(Boolean);
  useEffect(() => {
    validationProxyRef.current?.setCustomValidity(
      hasUnavailableSelection ? calendarLabels.unavailable : '',
    );
  }, [calendarLabels.unavailable, hasUnavailableSelection]);
  const focusCurrentDate = useCallback(() => {
    queueMicrotask(() => {
      gridRef.current
        ?.querySelector<HTMLButtonElement>('button[data-date][tabindex="0"]:not(:disabled)')
        ?.focus();
    });
  }, [gridRef]);
  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    onFocusCapture?.(event);
    if (event.defaultPrevented) return;

    const root = rootRef.current;
    const target = event.target;
    const OwnerHTMLElement = root?.ownerDocument.defaultView?.HTMLElement;
    if (!root || !OwnerHTMLElement || !(target instanceof OwnerHTMLElement) || target === root)
      return;
    if (root.scrollWidth <= root.clientWidth) return;
    if (typeof target.scrollIntoView !== 'function') return;

    // A narrow Calendar scrolls horizontally. Native focus navigation does not
    // always reveal a nested target, so keep the focused control in view.
    target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
  };

  return (
    <div
      ref={setRootRef}
      {...rest}
      id={idProp ?? formControl.id}
      className={cx(classes.root, className)}
      data-disabled={isDisabled ? '' : undefined}
      data-invalid={isInvalid || hasUnavailableSelection ? '' : undefined}
      dir={dirProp}
      role="group"
      aria-label={accessibleLabel.ariaLabel}
      aria-labelledby={accessibleLabel.ariaLabelledBy}
      aria-describedby={calendarDescribedBy}
      aria-disabled={isDisabled ? true : ariaDisabled}
      onFocusCapture={handleFocusCapture}
    >
      <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
      {children}
      {isRequired ? (
        <VisuallyHidden id={requiredDescriptionId}>{requiredMessage}</VisuallyHidden>
      ) : null}
      {needsValidationProxy ? (
        <input
          aria-hidden="true"
          className={css({ srOnly: true })}
          data-calendar-validation-proxy=""
          ref={validationProxyRef}
          disabled={[isDisabled, isReadOnly].some(Boolean)}
          form={form}
          onChange={() => undefined}
          onInvalid={focusCurrentDate}
          required={isRequired}
          tabIndex={-1}
          type="text"
          value={hasSelection ? 'selected' : ''}
        />
      ) : null}
      {name && (
        <CalendarHiddenInputs
          name={name}
          form={form}
          mode={mode}
          selected={selected}
          disabled={isDisabled}
        />
      )}
      <CalendarHeader
        currentMonthDate={currentMonthDate}
        navMonth={navMonth}
        goToToday={goToToday}
        handleMonthChange={handleMonthChange}
        canNavPrev={canNavPrev}
        canNavNext={canNavNext}
        canGoToToday={canGoToToday}
        showYearMonthSelect={showYearMonthSelect}
        locale={locale}
        minDate={normalizedMinDate}
        maxDate={normalizedMaxDate}
        classes={classes}
        monthFormatter={monthFormatter}
        labels={calendarLabels}
        disabled={isDisabled}
        isRtl={direction === 'rtl'}
      />
      <CalendarGrid
        weeks={calendarGrid.weeks}
        weekdayNames={calendarGrid.weekdayNames}
        focusedDate={focusedDate}
        setHoveredDate={setHoveredDate}
        handleDateSelect={handleDateSelect}
        handleKeyDown={handleKeyDown}
        isDateUnavailable={isDateUnavailable}
        showOutsideDays={showOutsideDays}
        locale={locale}
        dateFormatOptions={formatOptions}
        ariaDescribedBy={describedBy}
        gridRef={gridRef}
        classes={classes}
        month={currentMonthDate.getMonth()}
        monthName={monthFormatter.format(currentMonthDate)}
        readOnly={isReadOnly}
        today={today}
        isSelected={isSelected}
        isRangeStart={isRangeStart}
        isRangeEnd={isRangeEnd}
        isRangeMiddle={isRangeMiddle}
        isMultiselectable={mode === 'multiple'}
        components={components}
      />
    </div>
  );
});

Calendar.displayName = 'Calendar';
