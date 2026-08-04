/**
 * Loading lifecycle state for an image resource.
 */
export type ImageStatus = 'pending' | 'loading' | 'loaded' | 'failed';

/**
 * Options for loading and observing an image resource.
 */
export interface UseImageProps {
  /** Image source URL to load; omission yields `pending` and starts no preload. */
  src?: string;
  /** Callback fired when the image loads successfully. */
  onLoad?: () => void;
  /** Callback fired when the image fails to load. */
  onError?: () => void;
  /** Cross-origin request mode assigned to the created image. */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /**
   * Document whose `window.Image` constructor is used, for example an iframe realm. Omit it to
   * use the ambient `Image` constructor.
   */
  ownerDocument?: Document;
}

/**
 * Current image loading state returned by useImage.
 */
export interface UseImageReturn {
  /** Pending without a source, loading after source/CORS changes, then loaded or failed. */
  status: ImageStatus;
}
