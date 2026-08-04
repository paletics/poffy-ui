'use client';

import { cx } from '@/styled-system/css';
import { alert as alertStyle } from '@/styled-system/recipes';
import { cloneElement, forwardRef, isValidElement, type ElementType, type ReactNode } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { CloseButton } from '@/components/inputs/CloseButton';
import type { AlertComponent, AlertProps } from '@/components/feedback/Alert/Alert.types';
import { AlertContext } from '@/components/feedback/Alert/AlertContext';
import { getCommonMessages } from '@/components/shared/common.locales';
import { resolveLiveRegionProps } from '@/components/shared/resolveLiveRegionProps';
import { useOptionalLocale } from '@/providers/LocaleProvider';

const alertAsChildElements = new Set(['article', 'div', 'section']);

const isSafeAlertAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  alertAsChildElements.has(children.type);

const AlertImpl = forwardRef<Element, AlertProps>((props, ref) => {
  const {
    asChild,
    status = 'info',
    variant = 'subtle',
    className,
    children,
    onClose,
    closeLabel,
    live,
    role,
    'aria-live': ariaLive,
    closable: _closable,
    ...rest
  } = props as AlertProps & { closable?: boolean };
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const classes = alertStyle({ status, variant, closable: !!onClose });
  const canUseAsChild = asChild && isSafeAlertAsChildHost(children);
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const statusLive = status === 'error' ? 'assertive' : 'polite';
  const requestedLive = live === 'auto' ? statusLive : live;
  const { role: resolvedRole, ariaLive: resolvedAriaLive } = resolveLiveRegionProps({
    live: requestedLive,
    defaultLive: statusLive,
    role,
    ariaLive,
    announceDefaultWithExplicitRole: true,
  });
  const normalizedCloseLabel = closeLabel?.trim();
  const resolvedCloseLabel = normalizedCloseLabel ? normalizedCloseLabel : messages.dismissAlert;
  const renderedChildren =
    canUseAsChild &&
    isValidElement<{ role?: string; 'aria-live'?: 'assertive' | 'polite' | 'off' }>(children)
      ? cloneElement(children, {
          role: resolvedRole,
          'aria-live': resolvedAriaLive,
        })
      : children;

  return (
    <AlertContext.Provider value={{ classes, status }}>
      <Component
        ref={ref}
        role={resolvedRole}
        aria-live={resolvedAriaLive}
        className={cx(classes.root, className)}
        {...rest}
      >
        <Slottable>{renderedChildren}</Slottable>
        {onClose && (
          <CloseButton
            size="md"
            aria-label={resolvedCloseLabel}
            onClick={onClose}
            className={classes.closeButton}
            data-alert-close=""
          />
        )}
      </Component>
    </AlertContext.Provider>
  );
});

AlertImpl.displayName = 'Alert';
/**
 * Announces contextual feedback with status-derived live-region semantics.
 *
 * Errors announce assertively by default; other statuses announce politely. Override `live` for
 * static or specially coordinated feedback. `onClose` adds a localized dismiss action but does
 * not remove the alert itself. `asChild` is limited to `article`, `div`, and `section` hosts and
 * receives the resolved role/live attributes.
 */
export const Alert = AlertImpl as AlertComponent;
