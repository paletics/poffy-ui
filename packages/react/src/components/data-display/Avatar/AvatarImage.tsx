'use client';

import { Slot } from '@radix-ui/react-slot';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { cx } from '@/styled-system/css';
import {
  cloneElement,
  ElementType,
  forwardRef,
  ImgHTMLAttributes,
  isValidElement,
  SyntheticEvent,
  useCallback,
  useId,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AvatarImageProps } from './Avatar.types';
import { useAvatarContext } from './AvatarContext';

/**
 * Loads the image for an owning `Avatar.Root`.
 *
 * It renders nothing without `src` or after that source errors, reports each
 * settled result to the root and `onStatusChange`, and marks an unsettled image
 * with `data-loading`. A decorative image always receives an empty `alt` and
 * cannot expose an accessible name. `asChild` delegates only to an `img`.
 */
export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>((props, ref) => {
  const {
    asChild,
    src,
    alt,
    decorative,
    children,
    className,
    crossOrigin,
    onLoad,
    onError,
    onStatusChange,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'data-loading': _dataLoading,
    ...rest
  } = props as AvatarImageProps & { 'data-loading'?: unknown };
  const {
    classes,
    decorative: rootDecorative,
    registerImage,
    setImageStatus,
    unregisterImage,
  } = useAvatarContext();
  const resolvedDecorative = decorative ?? rootDecorative;
  const imageId = useId();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const mergedRef = useMergeRefs(imageRef, ref);
  const onStatusChangeRef = useRef(onStatusChange);
  const [renderedImageState, setRenderedImageState] = useState<
    { src: string; status: 'loaded' | 'error' } | undefined
  >(undefined);
  const reportedImageStateRef = useRef<{ src: string; status: 'loaded' | 'error' } | undefined>(
    undefined,
  );

  useLayoutEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  const reportRenderedStatus = useCallback(
    (nextStatus: 'loaded' | 'error') => {
      const reportedState = reportedImageStateRef.current;
      if (reportedState?.src === src && reportedState?.status === nextStatus) return;
      const nextState = { src: src ?? '', status: nextStatus };
      reportedImageStateRef.current = nextState;
      setRenderedImageState(nextState);
      setImageStatus(imageId, nextStatus);
      onStatusChangeRef.current?.(nextStatus);
    },
    [imageId, setImageStatus, src],
  );

  useLayoutEffect(() => {
    if (!src) return undefined;
    registerImage(imageId);
    const image = imageRef.current;
    if (image?.complete) {
      // Cached resources must settle during layout so fallback content does not flash.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      reportRenderedStatus(image.naturalWidth > 0 ? 'loaded' : 'error');
    }
    return () => unregisterImage(imageId);
  }, [imageId, registerImage, reportRenderedStatus, src, unregisterImage]);

  useEffect(() => {
    if (globalThis.process?.env?.['NODE_ENV'] === 'production') return;
    if (!src || resolvedDecorative || alt !== undefined) return;
    console.warn(
      '[Avatar.Image] Provide alt text for an informative avatar, or set decorative to true.',
    );
  }, [alt, resolvedDecorative, src]);

  const handleRenderedLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      if (!src) return;
      reportRenderedStatus('loaded');
      onLoad?.(event);
    },
    [onLoad, reportRenderedStatus, src],
  );

  const handleRenderedError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      if (!src) return;
      reportRenderedStatus('error');
      onError?.(event);
    },
    [onError, reportRenderedStatus, src],
  );

  const renderedStatus = renderedImageState?.src === src ? renderedImageState?.status : undefined;
  const managedLoadingAttribute = renderedStatus === 'loaded' ? undefined : '';

  if (!src || renderedStatus === 'error') return null;

  const imageChild =
    asChild &&
    isValidElement<
      ImgHTMLAttributes<HTMLImageElement> & {
        'data-loading'?: string;
      }
    >(children) &&
    children.type === 'img'
      ? cloneElement(children, {
          key: src,
          src,
          alt: resolvedDecorative ? '' : (alt ?? ''),
          crossOrigin,
          'aria-label': resolvedDecorative ? undefined : ariaLabel,
          'aria-labelledby': resolvedDecorative ? undefined : ariaLabelledBy,
          'data-loading': managedLoadingAttribute,
        })
      : null;
  const Component = (imageChild ? Slot : 'img') as ElementType;

  return (
    <Component
      key={src}
      {...rest}
      ref={mergedRef}
      src={src}
      alt={resolvedDecorative ? '' : (alt ?? '')}
      crossOrigin={crossOrigin}
      aria-label={resolvedDecorative ? undefined : ariaLabel}
      aria-labelledby={resolvedDecorative ? undefined : ariaLabelledBy}
      className={cx(classes.image, className)}
      data-loading={managedLoadingAttribute}
      onLoad={handleRenderedLoad}
      onError={handleRenderedError}
    >
      {imageChild}
    </Component>
  );
});

AvatarImage.displayName = 'Avatar.Image';
