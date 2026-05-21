import { cx } from '@/styled-system/css';
import { closeButton } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { CrossIcon } from '@/components/media/Icon/icons';
import type { CloseButtonProps } from './CloseButton.types';

/**
 * A specialized dismiss button rendering a static `×` SVG icon.
 * Used inside overlays (Modal, Drawer), notifications (Toast, Alert),
 * and tag/chip components to provide a consistent close affordance.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`closeButton` recipe), Radix Slot + Slottable
 * - **Props**: `PrimitiveProps<'button'>`
 *
 * ### Design Tokens
 * - **sizing**: width / height → Silver Ratio tokens per `size` variant
 * - **color**: `ghost` appearance — no background, inherits from surface context
 *
 * ### Variant Logic
 * - **size="sm"**: For compact contexts — Tags, inline alerts.
 * - **size="md"**: Default. Modal and Drawer headers.
 * - **size="lg"**: Large overlay headers or card dismissals.
 *
 * ### Accessibility
 * - **Role**: `button` (implicit)
 * - **Keyboard**: Tab: focus | Enter / Space: activate
 * - **Default**: `aria-label="Close"` is pre-applied — override per context (e.g., `"Close cart drawer"`)
 * - **Note**: Never passes native `disabled` to `asChild` children — `aria-disabled` is used instead
 *
 * @example Standard dismiss
 * ```tsx
 * <CloseButton onClick={onClose} aria-label="Close modal" />
 * ```
 *
 * @example In a modal header
 * ```tsx
 * <div style={{ display: 'flex', justifyContent: 'space-between' }}>
 *   <h2>Dialog Title</h2>
 *   <CloseButton onClick={onClose} aria-label="Close dialog" />
 * </div>
 * ```
 */
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  (
    {
      size = 'md',
      appearance = 'ghost',
      shape = 'rounded',
      className,
      disabled = false,
      'aria-label': ariaLabel = 'Close',
      asChild,
      children,
      ...props
    },
    ref,
  ) => {
    const recipeClass = closeButton({ size, appearance, shape });
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : 'button'}
        className={cx(recipeClass, className)}
        disabled={asChild ? undefined : disabled}
        aria-disabled={disabled ? true : undefined}
        aria-label={ariaLabel}
        {...props}
      >
        {asChild && <Slottable>{children}</Slottable>}
        <CrossIcon />
      </Component>
    );
  },
);

CloseButton.displayName = 'CloseButton';
