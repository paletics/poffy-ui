'use client';

import { ActionMotion } from '@/components/animations';
import { Spinner } from '@/components/feedback';
import { cx } from '@/styled-system/css';
import { button } from '@/styled-system/recipes';
import { guardActivationHandlers } from '@poffy-ui/behavior/activation';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { useButtonGroup } from '../ButtonGroup/ButtonGroupContext';
import { ButtonProps } from './Button.types';

/**
 * The primary action element for Poffy UI. Supports an `intent` × `appearance` two-axis variant
 * system and polymorphic rendering via `asChild` for seamless framework router integration
 * (e.g., Next.js `Link`). Physics-based press feedback is delegated to `ActionMotion`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`button` recipe), Radix Slot, `ActionMotion`
 * - **Props**: `PrimitiveProps<'button'>`
 *
 * ### Design Tokens
 * - **spacing**: padding / gap → Silver Ratio tokens (`silver.sm`, `silver.md`, `silver.lg`)
 * - **color**: semantic tokens only — `variants.{intent}.main`, `variants.{intent}.contrast`
 * - **duration**: animation timing → `snappy` preset via `ActionMotion`
 *
 * ### Variant Logic
 * - **intent="primary"**: Default CTA. Highest psychological weight for the primary action on a surface.
 * - **intent="danger"**: Destructive actions (delete, remove). Always pair with a confirmation dialog.
 * - **intent="secondary" | "info" | "success" | "warning"**: Contextual feedback intents.
 * - **intent="light" | "dark"**: Neutral surface intents for low-emphasis actions.
 * - **appearance="solid"**: Standard physical depth. Use for primary CTAs.
 * - **appearance="neo"**: Neo-Brutalism style with thick shadow. High visual impact, decorative contexts.
 * - **appearance="glass"**: Translucent frosted glass. Use on image/gradient backgrounds.
 * - **appearance="outline"**: Transparent with border. Secondary actions alongside `solid`.
 * - **appearance="soft"**: Surface-tinted background. Lightweight alternative to `solid`.
 * - **appearance="ghost"**: No background. Toolbar and list-row actions that blend into context.
 * - **appearance="minimal"**: Flat fill, no border. Highest information density, use in dense UIs.
 *
 * ### Accessibility
 * - **Role**: `button` (implicit via `<button>` element)
 * - **Pattern**: WAI-ARIA Button
 * - **Keyboard**: Tab: focus | Enter / Space: activate
 * - **States**: `aria-disabled` set for both `disabled` and `loading`; `aria-busy` set during `loading`
 * - **Required**: Provide `aria-label` when the button contains only an icon (no visible text)
 *
 * @example Standard usage
 * ```tsx
 * <Button intent="primary" appearance="solid" size="md">Save</Button>
 * ```
 *
 * @example Polymorphic — Next.js Link
 * ```tsx
 * <Button asChild intent="secondary" appearance="outline">
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 * ```
 *
 * @example Loading state
 * ```tsx
 * <Button intent="primary" loading>Saving…</Button>
 * ```
 *
 * @example Icon-only (requires aria-label)
 * ```tsx
 * <Button intent="danger" appearance="ghost" aria-label="Delete item">
 *   <TrashIcon />
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      intent = 'primary',
      appearance = 'solid',
      size = 'md',
      shape = 'rounded',
      glow = false,
      loading = false,
      loadingIcon,
      isGrow = false,
      leftIcon,
      rightIcon,
      animationType,
      children,
      className,
      disabled,
      asChild,
      onClick,
      onClickCapture,
      onKeyDown,
      onKeyDownCapture,
      ...rest
    },
    ref,
  ) => {
    const recipeClass = button({
      intent,
      appearance,
      size,
      shape,
      glow,
      isGrow,
    });

    const isDisabled = [disabled, loading].some(Boolean);

    const groupContext = useButtonGroup();
    const isConnected = groupContext?.connected;

    const finalAnimation = isDisabled
      ? undefined
      : (animationType ??
        (isConnected
          ? 'subtle'
          : appearance === 'neo' || appearance === 'solid'
            ? 'physical'
            : 'bouncy'));

    const shadowSize = isConnected ? 0 : appearance === 'neo' ? 8 : appearance === 'solid' ? 4 : 0;
    const shadowColor =
      appearance === 'neo'
        ? 'var(--neo-shadow-color, #000000)'
        : 'var(--btn-shadow-color, rgba(0,0,0,0.2))';

    const Component = asChild ? Slot : 'button';

    const shouldGuardAsChildActivation = Boolean(asChild && isDisabled);

    const blockAsChildActivation = (event: MouseEvent<HTMLElement>) => {
      if (!asChild || !isDisabled) {
        return false;
      }

      event.preventDefault();
      event.stopPropagation();
      return true;
    };

    const blockAsChildKeyboardActivation = (event: KeyboardEvent<HTMLElement>) => {
      if (!asChild || !isDisabled || (event.key !== 'Enter' && event.key !== ' ')) {
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
        animationType={finalAnimation}
        customData={{ shadowSize, shadowColor }}
      >
        <Component
          ref={ref}
          type={asChild ? undefined : 'button'}
          className={cx(recipeClass, className)}
          // Native disabled on Slot would become an invalid HTML attribute on non-button children.
          disabled={asChild ? undefined : isDisabled}
          aria-disabled={isDisabled ? true : undefined}
          aria-busy={loading ? true : undefined}
          data-disabled={isDisabled && !loading ? '' : undefined}
          data-loading={loading ? '' : undefined}
          {...rest}
          onClickCapture={handleClickCapture}
          onClick={handleClick}
          onKeyDownCapture={handleKeyDownCapture}
          onKeyDown={handleKeyDown}
        >
          {loading && (
            <span data-part="icon" aria-hidden="true">
              {loadingIcon ?? <Spinner size={20} thickness={2} />}
            </span>
          )}
          {!loading && leftIcon && <span data-part="icon">{leftIcon}</span>}
          <Slottable>{guardedChildren}</Slottable>
          {!loading && rightIcon && <span data-part="icon">{rightIcon}</span>}
        </Component>
      </ActionMotion>
    );
  },
);

Button.displayName = 'Button';
