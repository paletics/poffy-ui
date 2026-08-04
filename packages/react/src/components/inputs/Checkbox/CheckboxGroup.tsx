'use client';

import { useControllableState } from '@poffy-ui/behavior/hooks';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { checkboxGroupRecipe } from './CheckboxGroup.recipe';
import type { CheckboxGroupProps, CheckboxGroupRegistration } from './Checkbox.types';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import { css, cx } from '@/styled-system/css';
import { useFormControl } from '../FormControl/useFormControl';
import { resolveFormControlAria } from '../FormControl/formControlAria';
import {
  useFormControlBridge,
  useFormParticipationInvalidation,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import {
  areStringArraysEqual,
  useCanonicalStringArray,
} from '@/components/inputs/shared/normalizeStringArray';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';
import { getCheckboxGroupStaticTopology } from './CheckboxGroupTopology';

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

const hasEligibleSelection = (
  registeredCheckboxes: Map<string, CheckboxGroupRegistration>,
  targetForm: HTMLFormElement | null,
  ambiguousValues: Set<string>,
  value: string[],
) =>
  [...registeredCheckboxes.values()].some(
    (entry) =>
      !entry.input.matches(':disabled') &&
      entry.input.form === targetForm &&
      !ambiguousValues.has(entry.value) &&
      value.includes(entry.value),
  );

/**
 * Controlled or uncontrolled multi-value checkbox group with native form participation.
 *
 * Supply a group label directly or through `FormControl`. Group state and disabled/read-only
 * defaults flow to child checkboxes; read-only items remain focusable but cannot change. Each
 * child `value` must be unique: duplicate or opaque server-rendered topology is fail-closed until
 * safe registration can determine the items. A controlled `value` changes only when the caller
 * reflects `onChange`.
 */
export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
  const {
    value: controlledValue,
    defaultValue,
    onChange,
    disabled,
    readOnly,
    required,
    form,
    size,
    intent,
    orientation = 'vertical',
    className,
    id,
    children,
    'aria-labelledby': ariaLabelledBy,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-required': _ariaRequired,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  useWarnInvalidControllableState({
    componentName: 'Checkbox.Group',
    value: controlledValue,
    defaultValue,
    handler: onChange,
  });
  const formControl = useFormControl();
  const isDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: isDisabled, form });
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const shouldAnnounceRequired = [
    isRequired,
    _ariaRequired === true,
    _ariaRequired === 'true',
  ].some(Boolean);
  const requiredDescriptionId = useId();
  const requiredMessage = getCommonMessages(useOptionalLocale()?.locale).required;
  const isInvalid =
    ariaInvalid === undefined
      ? formControl.isInvalid
      : ariaInvalid !== false && ariaInvalid !== 'false';
  const { describedBy } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid,
  });
  const accessibleLabel = resolveAccessibleLabel({
    ariaLabel,
    ariaLabelledBy,
    autoLabelledBy: formControl.labelId,
  });
  const joinedGroupDescribedBy = [
    describedBy,
    shouldAnnounceRequired ? requiredDescriptionId : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  const groupDescribedBy = joinedGroupDescribedBy.length > 0 ? joinedGroupDescribedBy : undefined;

  const canonicalControlledValue = useCanonicalStringArray(controlledValue);
  const normalizedControlledValue =
    controlledValue === undefined ? undefined : canonicalControlledValue;
  const normalizedDefaultValue = useCanonicalStringArray(defaultValue);
  const {
    value,
    isControlled,
    setValue: setUncontrolledValue,
  } = useControllableState({
    value: normalizedControlledValue,
    defaultValue: normalizedDefaultValue,
  });
  const defaultValueRef = useRef(normalizedDefaultValue);
  useLayoutEffect(() => {
    defaultValueRef.current = [...normalizedDefaultValue];
  }, [normalizedDefaultValue]);

  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    if (!isControlled) setUncontrolledValue([...defaultValueRef.current]);
  });
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef);

  const [registeredCheckboxes, setRegisteredCheckboxes] = useState(
    () => new Map<string, CheckboxGroupRegistration>(),
  );
  const registerCheckbox = useCallback((instanceId: string, entry: CheckboxGroupRegistration) => {
    setRegisteredCheckboxes((current) => {
      const previous = current.get(instanceId);
      if (previous?.value === entry.value && previous.input === entry.input) {
        return current;
      }
      const next = new Map(current);
      next.set(instanceId, entry);
      return next;
    });
    return () =>
      setRegisteredCheckboxes((current) => {
        if (!current.has(instanceId)) return current;
        const next = new Map(current);
        next.delete(instanceId);
        return next;
      });
  }, []);
  const staticTopology = useMemo(() => getCheckboxGroupStaticTopology(children), [children]);
  const ambiguousValues = useMemo(() => {
    const counts = new Map<string, number>();
    staticTopology.values.forEach((itemValue) =>
      counts.set(itemValue, (counts.get(itemValue) ?? 0) + 1),
    );
    registeredCheckboxes.forEach(({ value: itemValue }) =>
      counts.set(itemValue, Math.max(counts.get(itemValue) ?? 0, 1)),
    );
    const registeredCounts = new Map<string, number>();
    registeredCheckboxes.forEach(({ value: itemValue }) =>
      registeredCounts.set(itemValue, (registeredCounts.get(itemValue) ?? 0) + 1),
    );
    registeredCounts.forEach((count, itemValue) =>
      counts.set(itemValue, Math.max(counts.get(itemValue) ?? 0, count)),
    );
    return new Set([...counts].flatMap(([itemValue, count]) => (count > 1 ? [itemValue] : [])));
  }, [registeredCheckboxes, staticTopology.values]);
  const failClosedAll = staticTopology.hasOpaqueChildren && registeredCheckboxes.size === 0;
  const targetForm = formBridge.associatedForm;
  const readHasValidSelection = () =>
    !failClosedAll &&
    hasEligibleSelection(registeredCheckboxes, targetForm, ambiguousValues, value);
  const ambiguousValuesKey = [...ambiguousValues].sort().join('\u0000');
  const participationSelectionKey = useMemo(
    () => ({ ambiguousValuesKey, failClosedAll, registeredCheckboxes, targetForm, value }),
    [ambiguousValuesKey, failClosedAll, registeredCheckboxes, targetForm, value],
  );
  useFormParticipationInvalidation(
    formBridge.participationAnchor,
    readHasValidSelection,
    participationSelectionKey,
  );
  const hasValidSelection = readHasValidSelection();

  useEffect(() => {
    if (
      ambiguousValues.size === 0 ||
      (globalThis as RuntimeEnv).process?.env?.NODE_ENV === 'production'
    )
      return;
    console.warn(
      `[Checkbox.Group] item values must be unique. Ambiguous values were disabled: ${[
        ...ambiguousValues,
      ].join(', ')}`,
    );
  }, [ambiguousValues]);

  const contextValue = useMemo(
    () => ({
      value,
      form,
      disabled: isDisabled,
      readOnly: isReadOnly,
      isInvalid,
      ariaInvalid: ariaInvalid ?? (isInvalid ? true : undefined),
      ambiguousValues,
      failClosedAll,
      registerCheckbox,
      size,
      intent,
      onItemChange: (itemValue: string, checked: boolean) => {
        if (failClosedAll || ambiguousValues.has(itemValue)) return;
        const nextValue = checked
          ? Array.from(new Set([...value, itemValue]))
          : value.filter((v) => v !== itemValue);

        if (areStringArraysEqual(value, nextValue)) return;
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }
        resolvedOnChange?.([...nextValue]);
      },
    }),
    [
      value,
      form,
      isDisabled,
      isReadOnly,
      isInvalid,
      ariaInvalid,
      size,
      intent,
      isControlled,
      setUncontrolledValue,
      resolvedOnChange,
      ambiguousValues,
      failClosedAll,
      registerCheckbox,
    ],
  );

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cx(checkboxGroupRecipe({ orientation }), className)}
        {...rest}
        id={id ?? formControl.id}
        role="group"
        aria-label={accessibleLabel.ariaLabel}
        aria-labelledby={accessibleLabel.ariaLabelledBy}
        aria-describedby={groupDescribedBy}
      >
        <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
        {shouldAnnounceRequired ? (
          <VisuallyHidden id={requiredDescriptionId}>{requiredMessage}</VisuallyHidden>
        ) : null}
        {isRequired ? (
          <input
            aria-hidden="true"
            className={css({ srOnly: true })}
            data-checkbox-group-validation-proxy=""
            disabled={[isDisabled, isReadOnly].some(Boolean)}
            form={form}
            onChange={() => undefined}
            onInvalid={() =>
              queueMicrotask(() => {
                const eligibleInput = [...registeredCheckboxes.values()].find(
                  (entry) =>
                    entry.input.form === targetForm &&
                    !entry.input.matches(':disabled') &&
                    !ambiguousValues.has(entry.value),
                )?.input;
                eligibleInput?.focus();
              })
            }
            required
            tabIndex={-1}
            type="text"
            value={hasValidSelection ? 'selected' : ''}
          />
        ) : null}
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
});

CheckboxGroup.displayName = 'Checkbox.Group';
