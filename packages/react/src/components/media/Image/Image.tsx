'use client';

import { cx } from '@/styled-system/css';
import { image } from '@/styled-system/recipes';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { ImageProps } from './Image.types';
import { ImageFallback } from './ImageFallback';
import { useImage } from '@poffy-ui/behavior/hooks';

/**
 * Renders one image with load-state-aware fallback content.
 *
 * A non-empty fallback replaces the image only after its active resource fails.
 * Lazy and responsive images track browser events because preload selection may
 * differ from the rendered candidate; ordinary `src` images use preload state.
 * `onStatusChange` reports that lifecycle, while `onLoad` and `onError` report
 * only events raised by the rendered image. URL fallbacks retain the forwarded
 * image ref; React-node fallbacks cannot.
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    fallback,
    src,
    srcSet,
    sizes,
    fit,
    loading,
    crossOrigin,
    onLoad,
    onError,
    onStatusChange,
    className,
    aspectRatio,
    radius,
    sizing,
    alt,
    decorative: _decorative,
    ...rest
  } = props;

  const imageRef = useRef<HTMLImageElement | null>(null);
  const [ownerDocument, setOwnerDocument] = useState<Document>();
  const setImageRef = useCallback((node: HTMLImageElement | null) => {
    imageRef.current = node;
    setOwnerDocument((current) =>
      current === node?.ownerDocument ? current : node?.ownerDocument,
    );
  }, []);
  const mergedRef = useMergeRefs(setImageRef, ref);

  const usesRenderedResourceEvents = loading === 'lazy' ? true : srcSet !== undefined;
  const [renderedImageState, setRenderedImageState] = useState({
    src,
    srcSet,
    sizes,
    crossOrigin,
    status: (src ? 'loading' : srcSet ? 'loading' : 'pending') as
      | 'pending'
      | 'loading'
      | 'loaded'
      | 'failed',
  });
  const renderedResourceChanged = [
    renderedImageState.src !== src,
    renderedImageState.srcSet !== srcSet,
    renderedImageState.sizes !== sizes,
    renderedImageState.crossOrigin !== crossOrigin,
  ].some(Boolean);
  const renderedStatus = renderedResourceChanged
    ? src
      ? 'loading'
      : srcSet
        ? 'loading'
        : 'pending'
    : renderedImageState.status;

  // Preloading a responsive candidate can disagree with the resource selected by the browser.
  // It would also defeat native lazy loading, so those paths use events from the rendered image.
  const { status: preloadStatus } = useImage({
    src: usesRenderedResourceEvents ? undefined : src,
    crossOrigin,
    ownerDocument,
  });
  const status = usesRenderedResourceEvents ? renderedStatus : preloadStatus;
  const renderedResourceKey = JSON.stringify([src, srcSet, sizes, crossOrigin]);
  const onStatusChangeRef = useRef(onStatusChange);

  const styles = image({ fit, aspectRatio, radius, sizing });

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    onStatusChangeRef.current?.(status);
  }, [status]);

  if (
    status === 'failed' &&
    fallback !== null &&
    fallback !== undefined &&
    fallback !== false &&
    fallback !== ''
  ) {
    return (
      <ImageFallback
        ref={ref}
        fallback={fallback}
        alt={alt}
        className={className}
        styles={styles}
        imageProps={{ ...rest, crossOrigin, loading, onLoad, onError }}
      />
    );
  }

  return (
    <img
      key={renderedResourceKey}
      ref={mergedRef}
      className={cx(styles, className)}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      crossOrigin={crossOrigin}
      loading={loading}
      alt={alt ?? ''}
      onLoad={
        usesRenderedResourceEvents
          ? (event) => {
              setRenderedImageState({ src, srcSet, sizes, crossOrigin, status: 'loaded' });
              onLoad?.(event);
            }
          : onLoad
      }
      onError={
        usesRenderedResourceEvents
          ? (event) => {
              setRenderedImageState({ src, srcSet, sizes, crossOrigin, status: 'failed' });
              onError?.(event);
            }
          : onError
      }
      {...rest}
    />
  );
});

Image.displayName = 'Image';
