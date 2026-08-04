'use client';

import { cx } from '@/styled-system/css';
import { checkbox } from '@/styled-system/recipes';
import { useControllableState } from '@poffy-ui/behavior/hooks';
import {
  Fragment,
  forwardRef,
  isValidElement,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { CheckboxRootProps } from './Checkbox.types';
import { CheckboxContext } from './CheckboxContext';
import { useCheckboxGroup } from './CheckboxGroupContext';
import { useFormControl } from '../FormControl/useFormControl';
import { useWarnInvalidControllableState } from '@/components/inputs/shared/useWarnInvalidControllableState';
import { CHECKBOX_GROUP_ITEM_MARKER } from './CheckboxGroupTopology';

const isCheckboxLabelAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  children.type !== Fragment &&
  (typeof children.type !== 'string' ? true : children.type === 'label');

/**
 * State-owning label container for composable Checkbox parts.
 *
 * Use `checked` with `onChange` for controlled state or `defaultChecked` for local state. In a
 * Checkbox.Group, `value` selects group membership and duplicate values are disabled. `asChild`
 * accepts a native `label` or a custom component that forwards its ref and label props; other
 * native hosts fall back to the owned label.
 */
export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxRootProps>((props, ref) => {
  const group = useCheckboxGroup();
  const formControl = useFormControl();
  const {
    size: localSize,
    intent: localIntent,
    error,
    className,
    children,
    indeterminate,
    checked: controlledChecked,
    defaultChecked,
    disabled: localDisabled,
    animated = false,
    value,
    onChange,
    asChild,
    ...rest
  } = props;
  const resolvedOnChange = typeof onChange === 'function' ? onChange : undefined;
  const isAmbiguous = Boolean(
    group &&
    value !== undefined &&
    [group.failClosedAll, group.ambiguousValues.has(value)].some(Boolean),
  );
  useWarnInvalidControllableState({
    componentName: 'Checkbox.Root',
    value: controlledChecked,
    defaultValue: defaultChecked,
    handler: onChange,
  });
  const normalizedControlledChecked =
    controlledChecked === undefined
      ? undefined
      : typeof controlledChecked === 'boolean'
        ? controlledChecked
        : false;
  const normalizedDefaultChecked = typeof defaultChecked === 'boolean' ? defaultChecked : false;

  const size = group?.size ?? localSize;
  const intent = group?.intent ?? localIntent;
  const disabled = Boolean(
    group?.disabled || localDisabled || formControl.isDisabled || isAmbiguous,
  );
  const isInvalid = error ?? group?.isInvalid ?? formControl.isInvalid;

  const isGrouped = group !== null && value !== undefined;
  const {
    value: standaloneChecked,
    isControlled,
    setValue: setStandaloneChecked,
  } = useControllableState({
    value: normalizedControlledChecked,
    defaultValue: normalizedDefaultChecked,
  });
  const defaultCheckedRef = useRef(normalizedDefaultChecked);
  useLayoutEffect(() => {
    defaultCheckedRef.current = normalizedDefaultChecked;
  }, [normalizedDefaultChecked]);

  const resetStandaloneChecked = useCallback(() => {
    if (!isGrouped && !isControlled) {
      setStandaloneChecked(defaultCheckedRef.current);
    }
  }, [isControlled, isGrouped, setStandaloneChecked]);

  const isChecked = isGrouped
    ? !isAmbiguous && (group.value?.includes(value) ?? false)
    : standaloneChecked;

  const contextValue = useMemo(
    () => ({
      size,
      intent,
      value,
      error: isInvalid,
      checked: isChecked,
      indeterminate,
      disabled,
      animated,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isGrouped) {
          group.onItemChange(value, e.target.checked);
        } else if (!isControlled) {
          setStandaloneChecked(e.target.checked);
        }
        resolvedOnChange?.(e);
      },
      onFormReset: resetStandaloneChecked,
    }),
    [
      size,
      intent,
      isInvalid,
      isChecked,
      indeterminate,
      disabled,
      animated,
      isGrouped,
      isControlled,
      value,
      group,
      setStandaloneChecked,
      resolvedOnChange,
      resetStandaloneChecked,
    ],
  );

  const classes = checkbox({ size, intent, error: isInvalid });
  const canUseAsChild = Boolean(asChild && isCheckboxLabelAsChildHost(children));
  const Component = canUseAsChild ? Slot : 'label';

  return (
    <CheckboxContext.Provider value={contextValue}>
      <Component
        ref={ref}
        className={cx('group', classes.root, className)}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      >
        {children}
      </Component>
    </CheckboxContext.Provider>
  );
});

CheckboxRoot.displayName = 'Checkbox.Root';
(CheckboxRoot as typeof CheckboxRoot & { [CHECKBOX_GROUP_ITEM_MARKER]?: boolean })[
  CHECKBOX_GROUP_ITEM_MARKER
] = true;
