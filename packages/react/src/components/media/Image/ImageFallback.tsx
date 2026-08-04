'use client';

import { cx } from '@/styled-system/css';
import {
  cloneElement,
  Fragment,
  forwardRef,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type ReactElement,
} from 'react';
import type { ImageProps } from './Image.types';

/**
 * Props for rendering Image fallback content when the source cannot be loaded.
 */
type ImageFallbackProps = Pick<ImageProps, 'fallback' | 'alt' | 'className'> & {
  styles: string;
  imageProps: Omit<ComponentPropsWithoutRef<'img'>, 'alt' | 'src' | 'srcSet' | 'sizes'>;
};

interface FallbackElementProps {
  alt?: string;
  'aria-hidden'?: boolean | 'false' | 'true';
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  role?: string;
}

const getFallbackAccessibilityProps = (fallback: ReactNode, alt: string | undefined) => {
  if (!alt || !isValidElement<FallbackElementProps>(fallback)) return {};
  // A custom component's eventual host semantics are unknowable here. Injecting
  // role="img" could turn a props-forwarding button or link into the wrong role.
  if (typeof fallback.type !== 'string') return {};

  const interactiveHost = ['a', 'button', 'input', 'select', 'textarea'].includes(fallback.type);
  const interactiveRole = ['button', 'link', 'checkbox', 'menuitem', 'option', 'switch'].includes(
    fallback.props.role ?? '',
  );
  if (interactiveHost || interactiveRole) return {};

  const hasAccessibleName = [
    fallback.props.alt,
    fallback.props['aria-label'],
    fallback.props['aria-labelledby'],
  ].some((value) => typeof value === 'string' && value.trim().length > 0);
  const isHidden =
    fallback.props['aria-hidden'] === true ? true : fallback.props['aria-hidden'] === 'true';

  return hasAccessibleName || isHidden
    ? {}
    : {
        role:
          fallback.props.role === 'presentation' || fallback.props.role === 'none'
            ? 'img'
            : (fallback.props.role ?? 'img'),
        'aria-label': alt,
      };
};

/**
 * ### Notes
 * `ref` is forwarded only when `fallback` is a URL string (renders an `<img>`).
 * When `fallback` is a ReactNode, `cloneElement` is used to merge className, and
 * the `ref` is intentionally not forwarded — the consumer is responsible for
 * managing refs on custom fallback elements.
 */
export const ImageFallback = forwardRef<HTMLImageElement, ImageFallbackProps>(
  ({ fallback, alt, className, styles, imageProps }, ref) => {
    if (fallback === null || fallback === undefined || fallback === false || fallback === '')
      return null;

    if (typeof fallback === 'string') {
      return (
        <img
          ref={ref}
          {...imageProps}
          className={cx(styles, className)}
          src={fallback}
          alt={alt ?? ''}
        />
      );
    }

    if (isValidElement(fallback) && fallback.type !== Fragment) {
      const el = fallback as ReactElement<FallbackElementProps>;
      return cloneElement(el, {
        className: cx(styles, className, el.props.className),
        ...getFallbackAccessibilityProps(el, alt),
      });
    }

    if (Array.isArray(fallback) || (isValidElement(fallback) && fallback.type === Fragment)) {
      return (
        <span
          className={cx(styles, className)}
          {...(alt ? { role: 'group', 'aria-label': alt } : {})}
        >
          {fallback}
        </span>
      );
    }

    return (
      <span
        className={cx(styles, className)}
        {...(alt ? { role: 'img', 'aria-label': alt } : { 'aria-hidden': 'true' })}
      >
        {fallback}
      </span>
    );
  },
);

ImageFallback.displayName = 'Image.Fallback';
