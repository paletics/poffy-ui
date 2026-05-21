'use client';

import { SelectionTransition } from '@/components/animations';
import { css, cx } from '@/styled-system/css';
import { radio } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useRadioGroupContext } from './RadioGroup';
import { RadioProps } from './RadioGroup.types';

const animatedDotWrapClass = css({
  display: 'block',
  w: '1/2',
  h: '1/2',
  borderRadius: 'full',
  bg: 'var(--poffy-radio-main)',
});

/**
 * An individual radio button component used within a RadioGroup.
 *
 * ### AI Context & Architecture
 * Consumer of `RadioGroupContext`. Synchronizes selection and shared properties (name, size, disabled)
 * with the parent group. Uses a visually hidden input with a custom stylized control.
 *
 * ### Accessibility
 * - **Role**: native radio input.
 * - **Keyboard**: Browser radio keyboard behavior through the parent radio group.
 * - **Required**: Render only inside `RadioGroup` so name, value, and change handling are wired.
 *
 * ### AI Usage
 * - **DO**: Use for one option inside `RadioGroup`.
 * - **DON'T**: Render standalone radios without the group context.
 *
 * @example Radio option
 * ```tsx
 * import { Radio } from '@poffy-ui/react/inputs';
 *
 * <Radio value="option1">Option 1</Radio>
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>((props, ref) => {
  const {
    children,
    value,
    size: sizeProp,
    intent: intentProp,
    disabled: disabledProp,
    animated: animatedProp,
    className,
    ...rest
  } = props;
  const group = useRadioGroupContext();

  const isChecked = group.value === value;
  const isDisabled = disabledProp ?? group.disabled;
  const size = sizeProp ?? group.size;
  const intent = intentProp ?? group.intent;
  const animated = animatedProp ?? group.animated ?? false;

  const classes = radio({ size, intent });

  const handleChange = () => {
    if (!isDisabled) {
      group.onChange(value);
    }
  };

  return (
    <label className={cx(classes.root, className)}>
      <input
        type="radio"
        className={cx('peer', classes.input)}
        name={group.name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        ref={ref}
        {...rest}
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
