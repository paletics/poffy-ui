'use client';

import { useRadioGroupState } from '@poffy-ui/behavior/radio-group';
import { css, cx } from '@/styled-system/css';
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { RadioGroupProps } from './RadioGroup.types';
import { radioGroup } from '@/styled-system/recipes';
import { useFormControl } from '../FormControl/useFormControl';
import { resolveFormControlAria } from '../FormControl/formControlAria';
import {
  useFormAssociatedEventRef,
  useFormControlBridge,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';
import { getRadioGroupStaticTopology } from './RadioGroupTopology';

interface RadioGroupContextValue {
  name?: string;
  form?: string;
  value?: string;
  onChange: (value: string) => void;
  size?: RadioGroupProps['size'];
  intent?: RadioGroupProps['intent'];
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  isInvalid?: boolean;
  animated?: boolean;
  ambiguousValues: ReadonlySet<string>;
  failClosedAll: boolean;
  registerRadio: (instanceId: string, value: string) => () => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

/**
 * Hook to access RadioGroup context.
 * Must be used within a RadioGroup component.
 */
export const useRadioGroupContext = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be used within a RadioGroup');
  }
  return context;
};

/**
 * Controlled or uncontrolled `radiogroup` for mutually exclusive `Radio` options.
 *
 * Provide `name` directly when the selected value must be submitted. When it is omitted, a
 * client-only internal name preserves keyboard grouping without contributing a named form value.
 * Children need unique values—duplicates and opaque server-rendered topology are disabled until
 * registration makes the set safe. Controlled callers reflect `onChange` to update the selected
 * option.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const {
    children,
    name: nameProp,
    value: valueProp,
    defaultValue,
    onChange,
    orientation = 'vertical',
    size,
    intent,
    disabled = false,
    readOnly = false,
    required,
    animated = false,
    form,
    className,
    id,
    'aria-labelledby': ariaLabelledBy,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-required': ariaRequired,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  useWarnInvalidControllableState({
    componentName: 'RadioGroup',
    value: valueProp,
    defaultValue,
    handler: onChange,
  });
  const normalizedControlledValue =
    valueProp === undefined ? undefined : typeof valueProp === 'string' ? valueProp : '';
  const normalizedDefaultValue = typeof defaultValue === 'string' ? defaultValue : '';
  const formControl = useFormControl();
  const isDisabled = [disabled, formControl.isDisabled].some(Boolean);
  const formBridge = useFormControlBridge({ disabled: isDisabled, form });
  const isReadOnly = [readOnly, formControl.isReadOnly].some(Boolean);
  const isRequired = required ?? formControl.isRequired ?? false;
  const isInvalid =
    ariaInvalid === undefined
      ? formControl.isInvalid
      : ariaInvalid !== false && ariaInvalid !== 'false';
  const { describedBy, errorMessage } = resolveFormControlAria({
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

  const fallbackName = useId();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setHasMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const name = nameProp ?? (hasMounted ? fallbackName : undefined);

  const {
    value,
    onChange: handleChange,
    setValue,
  } = useRadioGroupState({
    value: normalizedControlledValue,
    defaultValue: normalizedDefaultValue,
    onChange: resolvedOnChange,
  });
  const groupRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(groupRef, ref);
  const [registeredRadios, setRegisteredRadios] = useState(() => new Map<string, string>());
  const registerRadio = useCallback((instanceId: string, radioValue: string) => {
    setRegisteredRadios((current) => {
      if (current.get(instanceId) === radioValue) return current;
      const next = new Map(current);
      next.set(instanceId, radioValue);
      return next;
    });
    return () => {
      setRegisteredRadios((current) => {
        if (!current.has(instanceId)) return current;
        const next = new Map(current);
        next.delete(instanceId);
        return next;
      });
    };
  }, []);
  const valueCounts = useMemo(() => {
    const counts = new Map<string, number>();
    registeredRadios.forEach((radioValue) => {
      counts.set(radioValue, (counts.get(radioValue) ?? 0) + 1);
    });
    return counts;
  }, [registeredRadios]);
  const staticTopology = useMemo(() => getRadioGroupStaticTopology(children), [children]);
  const staticValueCounts = useMemo(() => {
    const counts = new Map<string, number>();
    staticTopology.values.forEach((radioValue) => {
      counts.set(radioValue, (counts.get(radioValue) ?? 0) + 1);
    });
    return counts;
  }, [staticTopology.values]);
  const duplicateValues = useMemo(
    () => [...valueCounts].flatMap(([radioValue, count]) => (count > 1 ? [radioValue] : [])),
    [valueCounts],
  );
  const staticDuplicateValues = useMemo(
    () => [...staticValueCounts].flatMap(([radioValue, count]) => (count > 1 ? [radioValue] : [])),
    [staticValueCounts],
  );
  const ambiguousValues = useMemo(
    () => new Set([...staticDuplicateValues, ...duplicateValues]),
    [duplicateValues, staticDuplicateValues],
  );
  const failClosedAll = staticTopology.hasOpaqueChildren && registeredRadios.size === 0;
  const duplicateSignature = JSON.stringify(duplicateValues);
  useEffect(() => {
    const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
    const currentDuplicateValues = JSON.parse(duplicateSignature) as string[];
    if (currentDuplicateValues.length === 0 || nodeEnv === 'production') return;
    console.warn(
      `[RadioGroup] radio values must be unique. Ambiguous values were disabled: ${currentDuplicateValues.join(', ')}`,
    );
  }, [duplicateSignature]);
  const defaultValueRef = useRef(normalizedDefaultValue);
  useLayoutEffect(() => {
    defaultValueRef.current = normalizedDefaultValue;
  }, [normalizedDefaultValue]);

  const formResetRef = useFormReset<HTMLFieldSetElement>(() => {
    if (valueProp === undefined) setValue(defaultValueRef.current);
  });

  const formDataRef = useFormAssociatedEventRef<HTMLFieldSetElement>(
    'formdata',
    nameProp || !name
      ? undefined
      : (event) => {
          // Native radios need a shared name for browser arrow-key behavior. The generated name is an
          // internal grouping detail, however, so remove it from the form payload when callers omit a
          // public name.
          (event as Event & { formData: FormData }).formData.delete(name);
        },
  );
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formResetRef, formDataRef);

  const classes = radioGroup({ orientation });

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        form,
        value,
        onChange: handleChange,
        size,
        intent,
        disabled: isDisabled,
        readOnly: isReadOnly,
        required: isRequired,
        isInvalid,
        animated,
        ambiguousValues,
        failClosedAll,
        registerRadio,
      }}
    >
      <div
        ref={mergedRef}
        className={cx(classes.root, className)}
        {...rest}
        id={id ?? formControl.id}
        role="radiogroup"
        aria-orientation={orientation}
        aria-label={accessibleLabel.ariaLabel}
        aria-labelledby={accessibleLabel.ariaLabelledBy}
        aria-describedby={describedBy}
        aria-required={ariaRequired ?? isRequired}
        aria-invalid={ariaInvalid ?? (isInvalid ? true : undefined)}
        aria-errormessage={errorMessage}
        aria-readonly={isReadOnly ? true : undefined}
      >
        <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
        {children}
        {(ambiguousValues.size > 0 || failClosedAll) && isRequired ? (
          <input
            aria-hidden="true"
            className={css({ srOnly: true })}
            disabled={[isDisabled, isReadOnly].some(Boolean)}
            form={form}
            onChange={() => undefined}
            onInvalid={() =>
              groupRef.current
                ?.querySelector<HTMLInputElement>('input[type="radio"]:not(:disabled)')
                ?.focus()
            }
            required
            tabIndex={-1}
            type="text"
            value={
              value !== undefined && value !== '' && !failClosedAll && !ambiguousValues.has(value)
                ? 'selected'
                : ''
            }
          />
        ) : null}
      </div>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.displayName = 'RadioGroup';
