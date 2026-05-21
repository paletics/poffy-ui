'use client';

import { forwardRef } from 'react';
import { CheckboxRoot } from './CheckboxRoot';
import { CheckboxInput } from './CheckboxInput';
import { CheckboxControl } from './CheckboxControl';
import { CheckboxLabel } from './CheckboxLabel';
import { CheckboxIndicator } from './CheckboxIndicator';
import { CheckboxProps } from './Checkbox.types';
import { CheckboxGroup } from './CheckboxGroup';

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

  return (
    <CheckboxRoot
      size={size}
      intent={intent}
      error={error}
      indeterminate={indeterminate}
      className={className}
      value={value}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      animated={animated}
      onChange={onChange}
    >
      <CheckboxInput ref={ref} {...rest} />
      <CheckboxControl>
        <CheckboxIndicator />
      </CheckboxControl>
      {children && <CheckboxLabel>{children}</CheckboxLabel>}
    </CheckboxRoot>
  );
});

CheckboxInner.displayName = 'Checkbox';

/**
 * A binary selection control for forms. Renders as a styled checkbox with optional label text.
 * Uses CSS `_active` pseudo-variants instead of `ActionMotion` for performance optimization
 * when rendered in high-density contexts (e.g., data tables with hundreds of rows).
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`checkbox` recipe), `CheckboxContext`, `CheckboxGroup`
 * - **Props**: `CheckboxProps` (extends `<input type="checkbox">`)
 *
 * ### Design Tokens
 * - **spacing**: gap between control and label → `silver.sm`
 * - **sizing**: control size → Silver Ratio tokens per `size` variant
 * - **color**: semantic tokens — `intent.main` for checked state, `danger.main` for error
 *
 * ### Variant Logic
 * - **intent="primary"**: Default. Main brand interaction color for checked state.
 * - **intent="danger"**: Error context or destructive selections.
 * - **indeterminate**: Renders a dash indicator — use for "select all" parent controls.
 *
 * ### Accessibility
 * - **Role**: `checkbox` (implicit via `<input type="checkbox">`)
 * - **Pattern**: WAI-ARIA Checkbox
 * - **Keyboard**: Tab: focus | Space: toggle
 * - **States**: `aria-invalid` on error, `aria-disabled` on disabled
 *
 * ### AI Usage
 * - **DO**: Use for binary form choices. Wrap in `Checkbox.Group` for multiple selections.
 * - **DON'T**: Do not nest interactive elements inside `Checkbox`. Do not use for toggles — use `Switch` instead.
 *
 * @example Single checkbox
 * ```tsx
 * <Checkbox size="md">Accept terms and conditions</Checkbox>
 * ```
 *
 * @example Group with controlled value
 * ```tsx
 * <Checkbox.Group value={value} onChange={setValue} aria-label="Select options">
 *   <Checkbox value="a">Option A</Checkbox>
 *   <Checkbox value="b">Option B</Checkbox>
 * </Checkbox.Group>
 * ```
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
