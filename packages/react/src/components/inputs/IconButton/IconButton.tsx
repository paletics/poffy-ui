'use client';

import { ActionMotion } from '@/components/animations';
import { cx } from '@/styled-system/css';
import { iconButton } from '@/styled-system/recipes';
import { guardActivationHandlers } from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cloneElement, forwardRef, type ReactElement } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { IconButtonProps } from './IconButton.types';

interface IconA11yProps {
  'aria-hidden'?: true;
  focusable?: 'false';
}

/**
 * An icon-only button for toolbars, menus, and compact action surfaces.
 * Clones the `icon` element to inject `aria-hidden="true"` and `focusable="false"`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`iconButton` recipe), Radix Slot, `ActionMotion`
 * - **Props**: `PrimitiveProps<'button'>`
 *
 * ### Design Tokens
 * - **sizing**: width / height follow the Silver Ratio size scale for icon actions.
 * - **color**: semantic tokens are selected from the shared `intent` x `appearance` matrix.
 * - **duration**: `bouncy` preset via `ActionMotion`
 *
 * ### Variant Logic
 * - **appearance="ghost"**: Default. No background and low visual weight.
 * - **appearance="outline"**: Bordered transparent fill for secondary icon actions.
 * - **appearance="solid"**: Filled background for higher emphasis.
 * - **shape="pill"**: Default full-radius silhouette for icon-only buttons.
 * - **shape="square"**: Square shape for grid or tile contexts.
 *
 * ### Accessibility
 * - **Role**: `button` (implicit)
 * - **Keyboard**: Tab: focus | Enter / Space: activate
 * - **Required**: `aria-label` is mandatory. Do not rely on tooltip text as an accessible label.
 *
 * @example Ghost icon button
 * ```tsx
 * <IconButton icon={<EditIcon />} aria-label="Edit item" />
 * ```
 *
 * @example Solid icon button with loading state
 * ```tsx
 * <IconButton icon={<SaveIcon />} aria-label="Save" appearance="solid" loading />
 * ```
 *
 * @example Polymorphic anchor
 * ```tsx
 * <IconButton asChild icon={<LinkIcon />} aria-label="Open link">
 *   <a href="/profile" />
 * </IconButton>
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      intent = 'primary',
      appearance = 'ghost',
      shape = 'pill',
      className,
      disabled = false,
      loading = false,
      'aria-label': ariaLabel,
      animationType = 'bouncy',
      asChild,
      children,
      onClick,
      onClickCapture,
      onKeyDown,
      onKeyDownCapture,
      ...props
    },
    ref,
  ) => {
    const recipeClass = iconButton({ size, intent, appearance, shape });
    const Component = asChild ? Slot : 'button';
    const isDisabled = [disabled, loading].includes(true);
    const shouldGuardAsChildActivation = Boolean(asChild && isDisabled);

    const iconWithProps = cloneElement(icon as ReactElement<IconA11yProps>, {
      'aria-hidden': true,
      focusable: 'false',
    });

    const blockAsChildActivation = (event: MouseEvent<HTMLElement>) => {
      if (asChild !== true || !isDisabled) {
        return false;
      }

      event.preventDefault();
      event.stopPropagation();
      return true;
    };

    const blockAsChildKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
      if (asChild !== true || !isDisabled || !['Enter', ' '].includes(event.key)) {
        return false;
      }

      event.preventDefault();
      event.stopPropagation();
      return true;
    };

    const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
      if (blockAsChildActivation(event)) {
        return;
      }

      onClickCapture?.(event as MouseEvent<HTMLButtonElement>);
    };

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      if (blockAsChildActivation(event)) {
        return;
      }

      onClick?.(event as MouseEvent<HTMLButtonElement>);
    };

    const handleKeyDownCapture = (event: KeyboardEvent<HTMLElement>) => {
      if (blockAsChildKeyboardActivation(event)) {
        return;
      }

      onKeyDownCapture?.(event as KeyboardEvent<HTMLButtonElement>);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (blockAsChildKeyboardActivation(event)) {
        return;
      }

      onKeyDown?.(event as KeyboardEvent<HTMLButtonElement>);
    };

    const guardedChildren = guardActivationHandlers(children, shouldGuardAsChildActivation, {
      onClickCapture: handleClickCapture,
      onClick: handleClick,
      onKeyDownCapture: handleKeyDownCapture,
      onKeyDown: handleKeyDown,
    });

    return (
      <ActionMotion
        asChild
        disabled={isDisabled}
        animationType={animationType}
        aria-label={ariaLabel}
        aria-busy={loading}
      >
        <Component
          ref={ref}
          type={asChild ? undefined : 'button'}
          className={cx(recipeClass, className)}
          disabled={asChild ? undefined : isDisabled}
          aria-disabled={isDisabled ? true : undefined}
          data-disabled={isDisabled && !loading ? '' : undefined}
          {...props}
          onClickCapture={handleClickCapture}
          onClick={handleClick}
          onKeyDownCapture={handleKeyDownCapture}
          onKeyDown={handleKeyDown}
        >
          {asChild && <Slottable>{guardedChildren}</Slottable>}
          {loading ? (
            <span className="ti ti-loader animate-spin" aria-hidden="true" />
          ) : (
            iconWithProps
          )}
          {!asChild && children}
        </Component>
      </ActionMotion>
    );
  },
);

IconButton.displayName = 'IconButton';
