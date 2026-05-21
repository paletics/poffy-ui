'use client';

import { getNextToggleButtonPressed } from '@poffy-ui/behavior/toggle-button';
import { cx } from '@/styled-system/css';
import { toggleButton } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useState } from 'react';
import type { ToggleButtonProps } from './ToggleButton.types';

/**
 * A dual-state button that indicates whether a feature is active.
 * Supports controlled (`pressed`) and uncontrolled (`defaultPressed`) modes via `useState`.
 * Polymorphic via Radix `asChild` — press state is CSS-only for performance.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`toggleButton` recipe), Radix Slot
 * - **Props**: `ToggleButtonProps`
 *
 * ### Design Tokens
 * - **spacing**: padding / gap → Silver Ratio tokens per `size` variant
 * - **color**: pressed state → `brand.main`; unpressed → `neutral.surface`
 *
 * ### Variant Logic
 * - **appearance="ghost"**: Default. Blends into toolbar, becomes visible when pressed.
 * - **appearance="soft"**: Low-contrast framed surface for chip-like toggles.
 * - **appearance="outline"**: Bordered. Use when the toggle must be visible in both states.
 * - **appearance="minimal"**: Dense flat presentation for compact filters.
 * - **shape="rounded"** vs **shape="square"**: Icon-only toggles typically use `square`.
 *
 * ### Accessibility
 * - **Role**: `button` (implicit)
 * - **`aria-pressed`**: Set automatically from `pressed` state.
 * - **Required**: Consumer MUST provide a visible label or `aria-label` for icon-only usage.
 * - **Keyboard**: Tab: focus | Enter / Space: toggle
 *
 * @example Uncontrolled
 * ```tsx
 * <ToggleButton defaultPressed={false} aria-label="Bold">B</ToggleButton>
 * ```
 *
 * @example Controlled
 * ```tsx
 * <ToggleButton pressed={isBold} onPressedChange={setIsBold}>Bold</ToggleButton>
 * ```
 */
export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      children,
      size = 'md',
      intent = 'primary',
      appearance = 'ghost',
      shape = 'rounded',
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      leftIcon,
      rightIcon,
      className,
      disabled = false,
      onClick,
      asChild,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed);
    const isControlled = controlledPressed !== undefined;
    const pressed = isControlled ? controlledPressed : uncontrolledPressed;

    const recipeClass = toggleButton({ size, intent, variant: appearance, shape, pressed });
    const Component = asChild ? Slot : 'button';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = getNextToggleButtonPressed(pressed);

      if (!isControlled) {
        setUncontrolledPressed(newPressed);
      }

      onPressedChange?.(newPressed);
      onClick?.(e);
    };

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : 'button'}
        className={cx(recipeClass, className)}
        disabled={asChild ? undefined : disabled}
        aria-pressed={pressed}
        aria-disabled={disabled ? true : undefined}
        onClick={handleClick}
        {...props}
      >
        {leftIcon && <span data-slot="icon">{leftIcon}</span>}
        {children}
        {rightIcon && <span data-slot="icon">{rightIcon}</span>}
      </Component>
    );
  },
);

ToggleButton.displayName = 'ToggleButton';
