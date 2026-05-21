'use client';

import { cx } from '@/styled-system/css';
import { image } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { ImageProps } from './Image.types';
import { ImageFallback } from './ImageFallback';
import { useImage } from '@poffy-ui/behavior/hooks';

/**
 * A resilient `<img>` primitive with load-state awareness and graceful fallback rendering.
 * Tracks image load/error status via the `useImage` hook and automatically replaces a failed
 * image with a URL placeholder or a custom React node fallback.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: image — variants: `fit`, `aspectRatio`, `radius`).
 * `useImage` hook manages `status: 'pending' | 'loading' | 'loaded' | 'failed'`. Image renders
 * `<img>` in all states; on `failed` with `fallback`, delegates to `<ImageFallback>` instead.
 * ### Design Tokens
 * - aspectRatio: Silver Ratio token (`square` | `video` | `wide` | `portrait`).
 * radius: Silver Ratio border-radius token (`none` → `full`).
 * ### Variant Logic
 * - `fit="contain"`: Full image visible — product photos where no cropping is acceptable.
 * - `fit="cover"` (default): Fill container — hero banners, avatar thumbnails.
 * - `aspectRatio="video"`: 16:9 — video thumbnails, media cards.
 * - `aspectRatio="square"`: 1:1 — avatars, product grid tiles.
 * @example Basic image with URL fallback
 * ```tsx
 * import { Image } from '@poffy-ui/react/media';
 *
 * <Image src="photo.jpg" alt="User profile" fallback="avatar-placeholder.svg" fit="cover" />
 * ```
 * @example Component fallback (e.g., skeleton loader)
 * ```tsx
 * import { Image } from '@poffy-ui/react/media';
 * import { Skeleton } from '@poffy-ui/react/feedback';
 *
 * <Image
 *   src={user.avatarUrl}
 *   alt={user.name}
 *   fallback={<Skeleton aspectRatio="square" radius="full" />}
 *   aspectRatio="square"
 *   radius="full"
 * />
 * ```
 * @example Lazy-loaded hero image
 * ```tsx
 * import { Image } from '@poffy-ui/react/media';
 *
 * <Image src="hero-2400w.jpg" alt="Mountain landscape" fit="cover" loading="lazy" aspectRatio="wide" />
 * ```
 * ### Notes
 * The `ref` is forwarded to the underlying `<img>` element. When status is `failed`
 * and `fallback` is provided, the `ref` is forwarded to `<ImageFallback>` instead.
 * If no `fallback` is given, the broken image icon is shown natively by the browser.
 * ### Accessibility
 * - `alt` is required for all meaningful images. Pass `alt=""` only for purely decorative
 * images (e.g., background textures). Never omit `alt` — missing `alt` fails WCAG 1.1.1.
 * ### AI Usage
 * - Use as the standard image primitive throughout the design system.
 * - Always provide `fallback` for user-generated or remotely hosted images that may fail to load.
 * - Use `loading="lazy"` for images that are below the fold to optimize LCP scores.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    fallback,
    src,
    srcSet,
    fit,
    loading,
    crossOrigin,
    onLoad,
    onError,
    className,
    aspectRatio,
    radius,
    alt,
    ...rest
  } = props;

  // onLoad/onError are delegated to useImage so they fire in all cases,
  // including when `fallback` is provided and the <img> element is not rendered.
  const { status } = useImage({ src, crossOrigin, onLoad, onError });

  const styles = image({ fit, aspectRatio, radius });

  if (status === 'failed' && fallback) {
    return (
      <ImageFallback
        ref={ref}
        fallback={fallback}
        alt={alt}
        className={className}
        styles={styles}
      />
    );
  }

  return (
    <img
      ref={ref}
      className={cx(styles, className)}
      src={src}
      srcSet={srcSet}
      crossOrigin={crossOrigin}
      loading={loading}
      alt={alt}
      {...rest}
    />
  );
});

Image.displayName = 'Image';
