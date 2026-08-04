'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { cloneElement, ElementType, forwardRef, isValidElement, useEffect, useState } from 'react';
import type { AvatarFallbackComponent, AvatarFallbackProps } from './Avatar.types';
import { useAvatarContext } from './AvatarContext';
import { getFallbackChildrenPreservingVoidHost, isAsChildHost } from '@/components/shared/asChild';

const avatarFallbackAsChildHosts = new Set([
  'abbr',
  'b',
  'cite',
  'code',
  'em',
  'i',
  'mark',
  's',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
]);

const getInitials = (name?: string) => {
  if (!name?.trim()) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0] ?? '').substring(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
};

const AvatarFallbackImpl = forwardRef<HTMLElement, AvatarFallbackProps>((props, ref) => {
  const {
    asChild,
    children,
    name,
    className,
    delayMs,
    'aria-label': userAriaLabel,
    'aria-hidden': userAriaHidden,
    ...rest
  } = props;
  const { classes, status, hasImage, hasLoadingImage } = useAvatarContext();

  const [mountState, setMountState] = useState(() => ({
    delayMs,
    isMounted: delayMs === undefined,
  }));
  const isMounted = mountState.delayMs === delayMs ? mountState.isMounted : delayMs === undefined;

  useEffect(() => {
    if (delayMs === undefined) {
      queueMicrotask(() => setMountState({ delayMs, isMounted: true }));
      return undefined;
    }
    if (status !== 'loading') {
      queueMicrotask(() => setMountState({ delayMs, isMounted: true }));
      return undefined;
    }

    queueMicrotask(() => setMountState({ delayMs, isMounted: false }));
    const timer = setTimeout(() => setMountState({ delayMs, isMounted: true }), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, status]);

  if (status === 'loaded' || !isMounted) return null;

  const generatedInitials = children === undefined ? getInitials(name) : undefined;
  const fallbackContent = children ?? generatedInitials;
  const isLoadingFallback = hasImage && status === 'loading' ? true : hasLoadingImage;
  const ariaLabel = userAriaLabel ?? (generatedInitials && name ? name : undefined);
  const ariaHidden = isLoadingFallback ? true : userAriaHidden;
  const canUseAsChild = Boolean(
    asChild && isAsChildHost(fallbackContent, avatarFallbackAsChildHosts),
  );
  const fallbackChild =
    canUseAsChild &&
    isValidElement<{ 'aria-label'?: string; 'aria-hidden'?: boolean }>(fallbackContent)
      ? isLoadingFallback
        ? cloneElement(fallbackContent, { 'aria-hidden': true })
        : fallbackContent
      : null;
  const Component = (fallbackChild ? Slot : 'span') as ElementType;

  return (
    <Component
      ref={ref}
      className={cx(classes.fallback, className)}
      {...rest}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    >
      {fallbackChild ? (
        <Slottable>{fallbackChild}</Slottable>
      ) : asChild ? (
        getFallbackChildrenPreservingVoidHost(fallbackContent)
      ) : (
        fallbackContent
      )}
    </Component>
  );
});

AvatarFallbackImpl.displayName = 'Avatar.Fallback';

/**
 * Displays Avatar fallback content while no image has loaded.
 *
 * With no children it derives one or two uppercase initials from `name` and
 * labels those initials with the name. `delayMs` postpones the loading-state
 * fallback to avoid a flash; an errored image shows it immediately. Fallback
 * content is hidden while an image is still loading, and `asChild` supports
 * only inline text-level hosts.
 */

export const AvatarFallback = AvatarFallbackImpl as AvatarFallbackComponent;
