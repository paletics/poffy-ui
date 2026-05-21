'use client';

import { cx } from '@/styled-system/css';
import { directionalButton } from '@/styled-system/recipes';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { DirectionalIcon } from './DirectionalIcon';
import type { DirectionalButtonProps } from './DirectionalButton.types';

/**
 * Icon-only directional button for previous/next and increment/decrement controls.
 * Supports grouped usage and optional `asChild` rendering while keeping button semantics by default.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`directionalButton` slot recipe), Radix Slot
 * - **Props**: `PrimitiveProps<'button'>`
 *
 * ### Design Tokens
 * - **sizing**: Silver Ratio width / height tokens per `size`
 * - **color**: semantic action tokens driven by `intent` x `appearance`
 *
 * ### Variant Logic
 * - **appearance="soft"**: Default navigational affordance with visible surface separation.
 * - **appearance="ghost"**: Reduced emphasis for dense headers and embedded controls.
 * - **appearance="neo"**: Expressive treatment for LP and statement navigation moments.
 * - **size="sm|md|lg"**: Scale target size based on surrounding component density.
 *
 * ### Accessibility
 * - **Role**: `button` (implicit unless `asChild`)
 * - **Keyboard**: Tab: focus | Enter / Space: activate
 * - **Required**: Provide `aria-label` because the control has no visible text label.
 *
 * @example Standard previous button
 * ```tsx
 * <DirectionalButton direction="left" aria-label="Previous month" />
 * ```
 *
 * @example Polymorphic link button
 * ```tsx
 * <DirectionalButton asChild direction="right" aria-label="Go to next page">
 *   <a href="/next" />
 * </DirectionalButton>
 * ```
 */
export const DirectionalButton = forwardRef<HTMLButtonElement, DirectionalButtonProps>(
  (
    {
      direction = 'right',
      icon,
      size = 'md',
      appearance = 'soft',
      intent = 'primary',
      shape = 'rounded',
      className,
      children,
      disabled = false,
      asChild,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const classes = directionalButton({ size, appearance, intent, shape, direction });
    const Component = asChild ? Slot : 'button';
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    };
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onKeyDown?.(event);
    };

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : 'button'}
        data-directional-button=""
        className={cx(classes.button, className)}
        disabled={asChild ? undefined : disabled}
        aria-disabled={disabled ? true : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <DirectionalIcon className={classes.icon} icon={icon} />
        <Slottable>{children}</Slottable>
      </Component>
    );
  },
);

DirectionalButton.displayName = 'DirectionalButton';
