'use client';

import { useCallback, useEffect, useState } from 'react';

interface FilePreviewWindow extends Window {
  URL: typeof URL;
  requestAnimationFrame: typeof requestAnimationFrame;
  cancelAnimationFrame: typeof cancelAnimationFrame;
}

interface ObjectUrlState {
  file: File;
  ownerWindow: FilePreviewWindow;
  value: string;
}

/**
 * Renders an object URL preview for an uploaded image file.
 */
export const FilePreview = ({ file, className }: { file: File; className: string }) => {
  const [ownerWindow, setOwnerWindow] = useState<FilePreviewWindow | null>(null);
  const [objectUrl, setObjectUrl] = useState<ObjectUrlState | null>(null);
  const captureOwnerWindow = useCallback(
    (node: HTMLElement | null) => {
      const nextOwnerWindow = node?.ownerDocument.defaultView as FilePreviewWindow | null;
      if (nextOwnerWindow) {
        setOwnerWindow((previous) => (previous === nextOwnerWindow ? previous : nextOwnerWindow));
        setObjectUrl((previous) =>
          previous && (previous.file !== file || previous.ownerWindow !== nextOwnerWindow)
            ? null
            : previous,
        );
      }
    },
    [file],
  );

  useEffect(() => {
    if (!ownerWindow) return;

    const ownerUrl = ownerWindow.URL;
    if (
      typeof ownerUrl?.createObjectURL !== 'function' ||
      typeof ownerUrl.revokeObjectURL !== 'function' ||
      typeof ownerWindow.requestAnimationFrame !== 'function' ||
      typeof ownerWindow.cancelAnimationFrame !== 'function'
    ) {
      return;
    }

    let nextObjectUrl: string;
    try {
      nextObjectUrl = ownerUrl.createObjectURL(file);
    } catch {
      return;
    }

    let active = true;
    let frameId: number;
    try {
      frameId = ownerWindow.requestAnimationFrame(() => {
        if (active) setObjectUrl({ file, ownerWindow, value: nextObjectUrl });
      });
    } catch {
      ownerUrl.revokeObjectURL(nextObjectUrl);
      return;
    }

    return () => {
      active = false;
      ownerWindow.cancelAnimationFrame(frameId);
      ownerUrl.revokeObjectURL(nextObjectUrl);
    };
  }, [file, ownerWindow]);

  const currentObjectUrl =
    objectUrl?.file === file && objectUrl.ownerWindow === ownerWindow ? objectUrl.value : null;

  return currentObjectUrl ? (
    <img ref={captureOwnerWindow} src={currentObjectUrl} alt="" className={className} />
  ) : (
    <span ref={captureOwnerWindow} hidden aria-hidden="true" />
  );
};
