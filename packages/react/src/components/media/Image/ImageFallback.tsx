'use client';

import { cx } from '@/styled-system/css';
import { cloneElement, forwardRef, isValidElement, type ReactElement } from 'react';
import { ImageProps } from './Image.types';

/**
 * Props for rendering Image fallback content when the source cannot be loaded.
 */
type ImageFallbackProps = Pick<ImageProps, 'fallback' | 'alt' | 'className'> & {
  styles: string;
};

/**
 * ### Notes
 * `ref` is forwarded only when `fallback` is a URL string (renders an `<img>`).
 * When `fallback` is a ReactNode, `cloneElement` is used to merge className, and
 * the `ref` is intentionally not forwarded — the consumer is responsible for
 * managing refs on custom fallback elements.
 */
export const ImageFallback = forwardRef<HTMLImageElement, ImageFallbackProps>(
  ({ fallback, alt, className, styles }, ref) => {
    if (!fallback) return null;

    if (isValidElement(fallback)) {
      const el = fallback as ReactElement<{ className?: string }>;
      return cloneElement(el, {
        className: cx(styles, className, el.props.className),
      });
    }
    return <img ref={ref} className={cx(styles, className)} src={fallback as string} alt={alt} />;
  },
);

ImageFallback.displayName = 'Image.Fallback';
