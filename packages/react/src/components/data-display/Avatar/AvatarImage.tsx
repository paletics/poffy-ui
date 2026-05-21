'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { avatar } from '@/styled-system/recipes';
import { ElementType, forwardRef, useCallback, useEffect } from 'react';
import { useImage } from '@poffy-ui/behavior/hooks';
import { AvatarImageProps } from './Avatar.types';
import { useAvatarContext } from './AvatarContext';

/**
 * The image element of the Avatar component.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: avatar), Radix Slot
 * ### Design Tokens
 * - size: silver-ratio tokens applied natively to img dimensions
 * ### Variant Logic
 * - N/A
 * ### Notes
 * Do not use without AvatarRoot wrapper. Provides an unstyled semantic img element.
 * ### Accessibility
 * - Must include an `alt` attribute for screen readers.
 * ### AI Usage
 * - Specifically for resolving image URLs and managing the loading context safely.
 * @example
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 *
 * <Avatar.Root size="md">
 *   <Avatar.Image src="/profile.jpg" alt="Profile photo of Jane" />
 *   <Avatar.Fallback name="Jane" />
 * </Avatar.Root>
 * ```
 */
export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>((props, ref) => {
  const { asChild, src, alt, className, onStatusChange, ...rest } = props;
  const { size, setStatus: setContextStatus } = useAvatarContext();
  const classes = avatar({ size });

  useEffect(() => {
    setContextStatus('loading');
  }, [src, setContextStatus]);

  const handleLoad = useCallback(() => {
    setContextStatus('loaded');
    onStatusChange?.('loaded');
  }, [setContextStatus, onStatusChange]);

  const handleError = useCallback(() => {
    setContextStatus('error');
    onStatusChange?.('error');
  }, [setContextStatus, onStatusChange]);

  const { status } = useImage({ src, onLoad: handleLoad, onError: handleError });

  if (status === 'failed') return null;

  const Component = asChild ? Slot : ('img' as ElementType);

  return (
    <Component
      ref={ref}
      src={src}
      alt={alt}
      className={cx(classes.image, className)}
      data-loading={status === 'loading' ? '' : undefined}
      {...rest}
    />
  );
});

AvatarImage.displayName = 'Avatar.Image';
