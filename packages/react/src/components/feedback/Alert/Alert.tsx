'use client';

import { cx } from '@/styled-system/css';
import { alert as alertStyle } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { CloseButton } from '../../inputs/CloseButton';
import { AlertProps } from './Alert.types';
import { AlertContext } from './AlertContext';

/**
 * Provides contextual feedback for user actions with status-driven visual variants.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: alert), Radix Slot, AlertContext
 * ### Design Tokens
 * - padding/gap: silver-ratio tokens; border-radius/iconSize applied from recipe.
 * ### Variant Logic
 * - status: info=informational, success=positive outcome, warning=caution, error=critical problem.
 * ### Variant Logic
 * - variant: subtle=low contrast bg, solid=high contrast, left-accent=border accent.
 * ### Notes
 * Injects CloseButton automatically when `onClose` is provided. Uses `role="alert"` for live region.
 * ### Accessibility
 * - role="alert" triggers screen reader announcement on render. Use sparingly to avoid noise.
 * ### AI Usage
 * - Use for non-blocking feedback messages (success, warnings, errors).
 * - Compose with AlertIcon, AlertTitle, AlertDescription for rich layouts.
 *
 * @example Status message
 * ```tsx
 * import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@poffy-ui/react/feedback';
 *
 * <Alert status="success">
 *   <AlertIcon />
 *   <div>
 *     <AlertTitle>Saved</AlertTitle>
 *     <AlertDescription>Your changes were saved.</AlertDescription>
 *   </div>
 * </Alert>
 * ```
 *
 * @example Closable warning
 * ```tsx
 * import { Alert, AlertTitle } from '@poffy-ui/react/feedback';
 *
 * <Alert status="warning" variant="left-accent" onClose={() => setVisible(false)}>
 *   <AlertTitle>Payment method expires soon</AlertTitle>
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  const {
    asChild,
    status = 'info',
    variant = 'subtle',
    className,
    children,
    onClose,
    ...rest
  } = props;
  const classes = alertStyle({ status, variant, closable: !!onClose });
  const Component = asChild ? Slot : 'div';

  return (
    <AlertContext.Provider value={{ classes, status }}>
      <Component ref={ref} role="alert" className={cx(classes.root, className)} {...rest}>
        <Slottable>{children}</Slottable>
        {onClose && <CloseButton size="md" onClick={onClose} className={classes.closeButton} />}
      </Component>
    </AlertContext.Provider>
  );
});

Alert.displayName = 'Alert';
