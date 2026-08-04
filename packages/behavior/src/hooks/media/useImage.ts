'use client';

import { useEffect, useRef, useState } from 'react';
import type { ImageStatus, UseImageProps, UseImageReturn } from './useImage.types';

/**
 * Shared image preload hook that reports load state before consumers render UI.
 *
 * The hook creates an off-DOM `Image` object for the current `src`. A missing
 * source reports `pending`; a changed source reports `loading` until the new
 * image settles. React image components should render `alt`, fallback UI, and
 * layout sizing outside this hook.
 */
export const useImage = ({
  src,
  onLoad,
  onError,
  crossOrigin,
  ownerDocument,
}: UseImageProps): UseImageReturn => {
  const [imageState, setImageState] = useState<{
    src?: string;
    crossOrigin?: UseImageProps['crossOrigin'];
    status: ImageStatus;
  }>({
    src,
    crossOrigin,
    status: src ? 'loading' : 'pending',
  });
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  const status =
    imageState.src === src && imageState.crossOrigin === crossOrigin
      ? imageState.status
      : src
        ? 'loading'
        : 'pending';

  useEffect(() => {
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!src) return undefined;

    let active = true;
    const ImageConstructor = ownerDocument?.defaultView?.Image ?? Image;
    const img = new ImageConstructor();
    if (crossOrigin !== undefined) img.crossOrigin = crossOrigin;
    img.onload = () => {
      if (!active) return;
      setImageState({ src, crossOrigin, status: 'loaded' });
      onLoadRef.current?.();
    };
    img.onerror = () => {
      if (!active) return;
      setImageState({ src, crossOrigin, status: 'failed' });
      onErrorRef.current?.();
    };
    img.src = src;

    return () => {
      active = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [crossOrigin, ownerDocument, src]);

  return { status };
};
