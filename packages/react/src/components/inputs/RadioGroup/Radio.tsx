'use client';

import { SelectionTransition } from '@/components/animations';
import { css, cx } from '@/styled-system/css';
import { radio } from '@/styled-system/recipes';
import { forwardRef, useEffect, useId } from 'react';
import { useRadioGroupContext } from './RadioGroup';
import { RadioProps } from './RadioGroup.types';
import { RADIO_COMPONENT_MARKER } from './RadioGroupTopology';

type RadioRuntimeProps = RadioProps &
  Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    | 'aria-checked'
    | 'aria-disabled'
    | 'checked'
    | 'defaultChecked'
    | 'form'
    | 'name'
    | 'onChange'
    | 'role'
  >;

const animatedDotWrapClass = css({
  display: 'block',
  w: '1/2',
  h: '1/2',
  borderRadius: 'full',
  bg: 'var(--poffy-radio-main)',
});

/**
 * One mutually exclusive option owned by a `RadioGroup`.
 *
 * The group supplies name, selection, and form state; local visual and disabled/read-only props
 * can add to those defaults. `value` must be unique within the group. Read-only radios remain
 * focusable but suppress click, Space, and arrow-key selection changes.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    children,
    value,
    size: sizeProp,
    intent: intentProp,
    disabled: disabledProp,
    readOnly: readOnlyProp,
    animated: animatedProp,
    className,
    'aria-checked': _ariaChecked,
    'aria-disabled': _ariaDisabled,
    checked: _checked,
    defaultChecked: _defaultChecked,
    name: _name,
    form: _form,
    required: requiredProp,
    onChange: _onChange,
    role: _role,
    onClickCapture,
    onPointerDownCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    ...rest
  } = props as RadioRuntimeProps;
  const group = useRadioGroupContext();

  const instanceId = useId();
  const { registerRadio } = group;
  useEffect(() => registerRadio(instanceId, value), [instanceId, registerRadio, value]);
  const isAmbiguous = group.failClosedAll ? true : group.ambiguousValues.has(value);
  const isChecked = !isAmbiguous && group.value === value;
  const isDisabled = Boolean(group.disabled || disabledProp || isAmbiguous);
  const isReadOnly = Boolean(group.readOnly || readOnlyProp);
  const isRequired = Boolean(group.required || requiredProp);
  const size = sizeProp ?? group.size;
  const intent = intentProp ?? group.intent;
  const animated = animatedProp ?? group.animated ?? false;

  const classes = radio({ size, intent, error: group.isInvalid });

  const handleChange = () => {
    if (!isDisabled && !isReadOnly) {
      group.onChange(value);
    }
  };

  const preventReadOnlyClick = (event: React.MouseEvent<HTMLInputElement>) => {
    onClickCapture?.(event);
    if (!event.defaultPrevented && isReadOnly) event.preventDefault();
  };

  const preventReadOnlyPointerInteraction = (event: React.PointerEvent<HTMLInputElement>) => {
    onPointerDownCapture?.(event);
    if (!event.defaultPrevented && isReadOnly) event.preventDefault();
  };

  const preventReadOnlyKeyInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDownCapture?.(event);
    if (
      !event.defaultPrevented &&
      isReadOnly &&
      [' ', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  const preventReadOnlyKeyUpInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyUpCapture?.(event);
    if (!event.defaultPrevented && isReadOnly && event.key === ' ') event.preventDefault();
  };

  return (
    <label className={cx(classes.root, className)}>
      <input
        className={cx('peer', classes.input)}
        ref={ref}
        {...rest}
        type="radio"
        name={group.name}
        form={group.form}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired && !isReadOnly}
        onClickCapture={preventReadOnlyClick}
        onPointerDownCapture={preventReadOnlyPointerInteraction}
        onKeyDownCapture={preventReadOnlyKeyInteraction}
        onKeyUpCapture={preventReadOnlyKeyUpInteraction}
      />
      <span className={classes.control} data-animated={animated ? 'true' : undefined}>
        {animated && (
          <SelectionTransition
            isSelected={isChecked}
            animationType="pop"
            className={animatedDotWrapClass}
          >
            <span aria-hidden="true" />
          </SelectionTransition>
        )}
      </span>
      {children && <span className={classes.label}>{children}</span>}
    </label>
  );
});

Radio.displayName = 'Radio';
(Radio as unknown as Record<PropertyKey, unknown>)[RADIO_COMPONENT_MARKER] = true;
