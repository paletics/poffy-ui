'use client';

import { useEffect, useState } from 'react';

/**
 * Renders an object URL preview for an uploaded image file.
 */
export const FilePreview = ({ file, className }: { file: File; className: string }) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const nextObjectUrl = URL.createObjectURL(file);
    const frameId = requestAnimationFrame(() => setObjectUrl(nextObjectUrl));

    return () => {
      cancelAnimationFrame(frameId);
      URL.revokeObjectURL(nextObjectUrl);
    };
  }, [file]);

  return objectUrl ? <img src={objectUrl} alt="preview" className={className} /> : null;
};
