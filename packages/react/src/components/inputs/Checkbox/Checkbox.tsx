'use client';

import { forwardRef } from 'react';
import { CheckboxRoot } from './CheckboxRoot';
import { CheckboxInput } from './CheckboxInput';
import { CheckboxControl } from './CheckboxControl';
import { CheckboxLabel } from './CheckboxLabel';
import { CheckboxIndicator } from './CheckboxIndicator';
import { CheckboxProps, CheckboxRootProps } from './Checkbox.types';
import { CheckboxGroup } from './CheckboxGroup';
import { CHECKBOX_GROUP_ITEM_MARKER } from './CheckboxGroupTopology';

const CheckboxInner = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  const {
    size,
    intent,
    error,
    indeterminate,
    children,
    className,
    value,
    checked,
    defaultChecked,
    disabled,
    animated,
    onChange,
    ...rest
  } = props;
  const rootStateProps =
    checked !== undefined
      ? ({ checked, onChange } as CheckboxRootProps)
      : ({ defaultChecked, onChange } as CheckboxRootProps);

  return (
    <CheckboxRoot
      size={size}
      intent={intent}
      error={error}
      indeterminate={indeterminate}
      className={className}
      value={value}
      disabled={disabled}
      animated={animated}
      {...rootStateProps}
    >
      <CheckboxInput ref={ref} {...rest} />
      <CheckboxControl>
        <CheckboxIndicator />
      </CheckboxControl>
      {children && <CheckboxLabel>{children}</CheckboxLabel>}
    </CheckboxRoot>
  );
});

(CheckboxInner as typeof CheckboxInner & { [CHECKBOX_GROUP_ITEM_MARKER]?: boolean })[
  CHECKBOX_GROUP_ITEM_MARKER
] = true;

CheckboxInner.displayName = 'Checkbox';

/**
 * Compound entry point for a native binary checkbox and its visual parts.
 *
 * Use `checked` with `onChange` for controlled state or `defaultChecked` for internal state.
 * `indeterminate` controls the native mixed presentation but is not a submitted value. Provide
 * visible children or an accessible name, and use `Checkbox.Group` for a coordinated multi-value
 * field.
 */
export const Checkbox = Object.assign(CheckboxInner, {
  Root: CheckboxRoot,
  Input: CheckboxInput,
  Control: CheckboxControl,
  Label: CheckboxLabel,
  Indicator: CheckboxIndicator,
  Group: CheckboxGroup,
});

Checkbox.displayName = 'Checkbox';
