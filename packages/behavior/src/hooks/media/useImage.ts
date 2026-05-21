'use client';

import { useEffect, useRef, useState } from 'react';
import type { ImageStatus, UseImageProps, UseImageReturn } from './useImage.types';

/**
 * Shared image preload hook that reports load state before consumers render UI.
 *
 * ### Notes
 * The hook creates an off-DOM `Image` object for the current `src`. A missing
 * source reports `pending`; a changed source reports `loading` until the new
 * image settles. React image components should render `alt`, fallback UI, and
 * layout sizing outside this hook.
 */
export const useImage = ({ src, onLoad, onError, crossOrigin }: UseImageProps): UseImageReturn => {
  const [imageState, setImageState] = useState<{ src?: string; status: ImageStatus }>({
    src,
    status: src ? 'loading' : 'pending',
  });
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  const status = imageState.src === src ? imageState.status : src ? 'loading' : 'pending';

  useEffect(() => {
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!src) return undefined;

    let active = true;
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => {
      if (!active) return;
      setImageState({ src, status: 'loaded' });
      onLoadRef.current?.();
    };
    img.onerror = () => {
      if (!active) return;
      setImageState({ src, status: 'failed' });
      onErrorRef.current?.();
    };
    img.src = src;

    return () => {
      active = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [crossOrigin, src]);

  return { status };
};
