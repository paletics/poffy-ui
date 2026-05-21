'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { avatar } from '@/styled-system/recipes';
import { ElementType, forwardRef, useCallback, useMemo, useState } from 'react';
import { AvatarRootProps } from './Avatar.types';
import { AvatarContext } from './AvatarContext';

/**
 * The root container for the Avatar component.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: avatar), Radix Slot
 * ### Design Tokens
 * - size: silver-ratio tokens
 * ### Variant Logic
 * - size: Dictates visual hierarchy (sm, md, lg).
 * ### Notes
 * Do not nest interactive elements inside the avatar. Guarantee exactly one child element when using asChild.
 * ### Accessibility
 * - Relies on alt text for images. Fallback ensures meaning is preserved when images fail or load slowly.
 * ### AI Usage
 * - Use as a wrapper for AvatarImage and AvatarFallback.
 * @example
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 *
 * <Avatar.Root size="md" onStatusChange={(s) => console.log(s)}>
 *   <Avatar.Image src="/photo.jpg" alt="User" />
 *   <Avatar.Fallback name="User Name" />
 * </Avatar.Root>
 * ```
 */
export const AvatarRoot = forwardRef<HTMLSpanElement, AvatarRootProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    size = 'md',
    shape = 'rounded',
    onStatusChange,
    ...rest
  } = props;
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const classes = avatar({ size, shape });
  const Component = asChild ? Slot : ('span' as ElementType);

  const handleStatusChange = useCallback(
    (next: 'loading' | 'loaded' | 'error') => {
      setStatus(next);
      onStatusChange?.(next);
    },
    [onStatusChange],
  );

  const contextValue = useMemo(
    () => ({
      size,
      shape,
      status,
      setStatus: handleStatusChange,
    }),
    [size, shape, status, handleStatusChange],
  );

  return (
    <AvatarContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} data-status={status} {...rest}>
        {children}
      </Component>
    </AvatarContext.Provider>
  );
});

AvatarRoot.displayName = 'Avatar.Root';
