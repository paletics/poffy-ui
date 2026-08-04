'use client';

import { cloneElement, forwardRef, isValidElement, type ReactNode } from 'react';
import type { AvatarComponent, AvatarProps } from './Avatar.types';
import { AvatarRoot } from './AvatarRoot';
import { AvatarImage } from './AvatarImage';
import { AvatarFallback } from './AvatarFallback';
import { isAvatarRootAsChildHost, isPotentiallyInteractiveAvatarRootHost } from './Avatar.utils';

const getAvatarFallbackContent = (content: ReactNode): ReactNode => {
  if (Array.isArray(content)) return content.map(getAvatarFallbackContent);
  if (!isValidElement<{ children?: ReactNode }>(content)) return content;
  return getAvatarFallbackContent(content.props.children);
};

const AvatarImpl = forwardRef<HTMLElement, AvatarProps>((props, ref) => {
  const {
    asChild,
    src,
    alt,
    name,
    decorative = false,
    children,
    size,
    shape,
    onStatusChange,
    ...rest
  } = props;
  const imageAlt = decorative ? '' : (alt ?? name);
  const fallbackName = name ?? (alt === '' ? undefined : alt);

  const candidateAsChildElement = asChild && isAvatarRootAsChildHost(children) ? children : null;
  const asChildElement =
    candidateAsChildElement &&
    !(decorative && isPotentiallyInteractiveAvatarRootHost(candidateAsChildElement))
      ? candidateAsChildElement
      : null;

  if (asChildElement) {
    return (
      <AvatarRoot
        ref={ref}
        size={size}
        shape={shape}
        decorative={decorative}
        asChild
        onStatusChange={onStatusChange}
        {...rest}
      >
        {cloneElement(asChildElement, {
          children: (
            <>
              {asChildElement.props.children}
              {src ? <AvatarImage src={src} alt={imageAlt} decorative={decorative} /> : null}
              <AvatarFallback name={fallbackName} />
            </>
          ),
        })}
      </AvatarRoot>
    );
  }

  return (
    <AvatarRoot
      ref={ref}
      size={size}
      shape={shape}
      decorative={decorative}
      onStatusChange={onStatusChange}
      {...rest}
    >
      {src && <AvatarImage src={src} alt={imageAlt} decorative={decorative} />}
      <AvatarFallback name={fallbackName}>
        {asChild ? getAvatarFallbackContent(children) : children}
      </AvatarFallback>
    </AvatarRoot>
  );
});

AvatarImpl.displayName = 'Avatar';

/**
 * Renders an avatar image and its fallback as one unit.
 *
 * The shorthand creates `Avatar.Root`, adds an image when `src` is supplied,
 * and uses `name`, `alt`, or custom children for the fallback. The fallback is
 * hidden after a successful load and remains available after an image error.
 * Set `decorative` to remove the whole avatar from the accessibility tree.
 * `asChild` delegates only to a supported, non-interactive root host.
 */

export const Avatar = AvatarImpl as unknown as AvatarComponent & {
  Root: typeof AvatarRoot;
  Image: typeof AvatarImage;
  Fallback: typeof AvatarFallback;
};

Avatar.Root = AvatarRoot;
Avatar.Image = AvatarImage;
Avatar.Fallback = AvatarFallback;
