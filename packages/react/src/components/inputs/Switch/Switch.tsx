'use client';

import { cx } from '@/styled-system/css';
import { switchControl } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { SwitchProps } from './Switch.types';

/**
 * A toggle switch for binary on/off settings, built on a hidden `<input type="checkbox">`
 * with `role="switch"`. Visual thumb state is CSS peer-selector driven — no JS toggle.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`switchControl` recipe), CSS peer selectors
 * - **Props**: `SwitchProps` (extends `<input type="checkbox">`)
 *
 * ### Design Tokens
 * - **sizing**: thumb width/height and track width → Silver Ratio tokens per `size` variant
 * - **color**: `checked` state → `brand.main`; track → `neutral.muted`
 * - **duration**: thumb slide transition → `subtle` preset (CSS `transition`)
 *
 * ### Variant Logic
 * - **size="sm"**: Compact settings menus or inline toggles.
 * - **size="md"**: Default. Standard settings pages.
 * - **size="lg"**: High-emphasis toggles with large click targets.
 *
 * ### Accessibility
 * - **Role**: `switch` (explicit via `role="switch"` on `<input>`)
 * - **Keyboard**: Tab: focus | Space: toggle
 * - **States**: `aria-checked` reflects checkbox state. Must be paired with a visible label or `aria-label`.
 * - **Note**: Using `<label>` as the root element provides native label association for free.
 *
 * @example Settings toggle
 * ```tsx
 * <Switch size="md">Enable notifications</Switch>
 * ```
 *
 * @example Controlled
 * ```tsx
 * <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)}>
 *   Dark mode
 * </Switch>
 * ```
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const { size, intent, disabled, children, className, ...rest } = props;
  const classes = switchControl({ size, intent });

  return (
    <label className={cx(classes.root, className)} data-disabled={disabled ? '' : undefined}>
      <input
        type="checkbox"
        className={cx('peer', classes.input)}
        ref={ref}
        role="switch"
        disabled={disabled}
        {...rest}
      />
      <span className={classes.control}>
        <span className={classes.thumb} />
      </span>
      {children && <span className={classes.label}>{children}</span>}
    </label>
  );
});

Switch.displayName = 'Switch';
