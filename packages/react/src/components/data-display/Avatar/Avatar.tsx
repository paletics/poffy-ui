'use client';

import { cloneElement, forwardRef, isValidElement } from 'react';
import { AvatarProps } from './Avatar.types';
import { AvatarRoot } from './AvatarRoot';
import { AvatarImage } from './AvatarImage';
import { AvatarFallback } from './AvatarFallback';

/**
 * Shorthand version that combines AvatarRoot, AvatarImage, and AvatarFallback.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS (Recipe: avatar), Radix Slot
 * ### Design Tokens
 * - size: silver-ratio tokens
 * ### Variant Logic
 * - size: Dictates visual hierarchy (sm, md, lg).
 * ### Notes
 * Do not nest interactive elements inside the avatar. Guarantee exactly one child element when using asChild.
 * ### Accessibility
 * - Relies on alt text for images. Fallback ensures meaning is preserved when images fail or load slowly.
 * ### AI Usage
 * - Use for standard user profile pictures.
 * - Supports fallback initials.
 * @example Basic usage with image and initials fallback
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 *
 * <Avatar src="/photo.jpg" alt="Jane Doe" name="Jane Doe" size="md" />
 * ```
 *
 * @example Composition pattern for custom layouts
 * ```tsx
 * import { Avatar } from '@poffy-ui/react/data-display';
 *
 * <Avatar.Root size="lg">
 *   <Avatar.Image src="/photo.jpg" alt="Jane Doe" />
 *   <Avatar.Fallback name="Jane Doe" />
 * </Avatar.Root>
 * ```
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
  const { asChild, src, alt, name, children, size, shape, onStatusChange, ...rest } = props;
  const imageAlt = alt ?? name;

  if (asChild && isValidElement<{ children?: React.ReactNode }>(children)) {
    return (
      <AvatarRoot
        ref={ref}
        size={size}
        shape={shape}
        asChild
        onStatusChange={onStatusChange}
        {...rest}
      >
        {cloneElement(children, {
          children: (
            <>
              {children.props.children}
              <AvatarImage src={src} alt={imageAlt} />
              <AvatarFallback name={name} />
            </>
          ),
        })}
      </AvatarRoot>
    );
  }

  return (
    <AvatarRoot ref={ref} size={size} shape={shape} onStatusChange={onStatusChange} {...rest}>
      {src && <AvatarImage src={src} alt={imageAlt} />}
      <AvatarFallback name={name}>{children}</AvatarFallback>
    </AvatarRoot>
  );
}) as React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLSpanElement>> & {
  Root: typeof AvatarRoot;
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
};

Avatar.Root = AvatarRoot;
Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;

Avatar.displayName = 'Avatar';
