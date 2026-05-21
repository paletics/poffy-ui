'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { avatar } from '@/styled-system/recipes';
import { ElementType, forwardRef, useEffect, useState } from 'react';
import { AvatarFallbackProps } from './Avatar.types';
import { useAvatarContext } from './AvatarContext';

const getInitials = (name?: string) => {
  if (!name?.trim()) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0] ?? '').substring(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
};

/**
 * The fallback element rendered when the Avatar image is not available or loading.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: avatar), Radix Slot
 * ### Design Tokens
 * - size: silver-ratio tokens map to font size for initials
 * ### Variant Logic
 * - N/A
 * ### Notes
 * Delay can be configured via `delayMs` to avoid flash of fallback during fast loads.
 * ### Accessibility
 * - Relies on surrounding context if providing user identification.
 * ### AI Usage
 * - Used strictly within the AvatarRoot. Automatically handles initial generation from the `name` prop if `children` are not provided.
 * @example Auto-generated initials from name
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 *
 * <Avatar.Root size="md">
 *   <Avatar.Image src="/photo.jpg" alt="Jane Doe" />
 *   <Avatar.Fallback name="Jane Doe" delayMs={300} />
 * </Avatar.Root>
 * ```
 *
 * @example Custom fallback icon
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 * import { UserIcon } from '@poffy-ui/react/media';
 *
 * <Avatar.Root size="md">
 *   <Avatar.Fallback><UserIcon /></Avatar.Fallback>
 * </Avatar.Root>
 * ```
 */
export const AvatarFallback = forwardRef<HTMLSpanElement, AvatarFallbackProps>((props, ref) => {
  const { asChild, children, name, className, delayMs, ...rest } = props;
  const { size, status } = useAvatarContext();
  const classes = avatar({ size });

  const [isMounted, setIsMounted] = useState(delayMs === undefined);

  useEffect(() => {
    if (delayMs !== undefined) {
      const timer = setTimeout(() => setIsMounted(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  if (status === 'loaded' || !isMounted) return null;

  const Component = asChild ? Slot : ('span' as ElementType);

  return (
    <Component ref={ref} className={cx(classes.fallback, className)} {...rest}>
      {children ?? getInitials(name)}
    </Component>
  );
});

AvatarFallback.displayName = 'Avatar.Fallback';
