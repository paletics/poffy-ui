'use client';

import { ChevronDownIcon } from '@/components/media/Icon/icons';
import { forwardRef, isValidElement } from 'react';
import type { MouseEventHandler } from 'react';
import { IconButton } from '@/components/inputs/IconButton';
import type { DisclosureIconButtonProps } from './DisclosureIconButton.types';

/**
 * Reusable disclosure trigger for toggling open/closed state.
 * Adds `aria-expanded` and optional chevron rotation behavior.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: `IconButton` plus controlled `open` / `onOpenChange` state
 * - **Props**: `DisclosureIconButtonProps`
 *
 * ### Design Tokens
 * - Delegates spacing, shape, and color tokens to `IconButton`.
 *
 * ### Accessibility
 * - **Role**: button.
 * - **Keyboard**: Tab: focus | Enter / Space: activate.
 * - **States**: `aria-expanded` mirrors the `open` prop.
 * - **Required**: Provide `aria-controls` when the disclosed panel has an id.
 *
 * ### AI Usage
 * - **DO**: Use as the trigger for collapsible panels, menus, and disclosure popovers.
 * - **DON'T**: Use for navigation; use a link or regular `IconButton`.
 *
 * @example Disclosure trigger
 * ```tsx
 * import { DisclosureIconButton } from '@poffy-ui/react/inputs';
 *
 * <DisclosureIconButton
 *   aria-label="Toggle filters"
 *   aria-controls="filters-panel"
 *   open={open}
 *   onOpenChange={setOpen}
 * />
 * ```
 */
export const DisclosureIconButton = forwardRef<HTMLButtonElement, DisclosureIconButtonProps>(
  (props, ref) => {
    const {
      open,
      onOpenChange,
      onClick,
      icon = <ChevronDownIcon />,
      rotateOnOpen = true,
      disabled = false,
      loading = false,
      ...rest
    } = props;

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      if (disabled || loading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onOpenChange?.(!open);
      onClick?.(e);
    };

    const iconNode = rotateOnOpen ? <span data-disclosure-icon>{icon}</span> : icon;

    const safeIcon = isValidElement(iconNode) ? iconNode : <ChevronDownIcon />;

    return (
      <IconButton
        ref={ref}
        icon={safeIcon}
        disabled={disabled}
        loading={loading}
        aria-expanded={open}
        data-state={open ? 'open' : 'closed'}
        onClick={handleClick}
        {...rest}
      />
    );
  },
);

DisclosureIconButton.displayName = 'DisclosureIconButton';
