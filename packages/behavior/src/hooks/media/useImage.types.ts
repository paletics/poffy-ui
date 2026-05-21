/**
 * Loading lifecycle state for an image resource.
 */
export type ImageStatus = 'pending' | 'loading' | 'loaded' | 'failed';

/**
 * Options for loading and observing an image resource.
 */
export interface UseImageProps {
  /** Image source URL to load. */
  src?: string;
  /** Callback fired when the image loads successfully. */
  onLoad?: () => void;
  /** Callback fired when the image fails to load. */
  onError?: () => void;
  /** Cross-origin request mode assigned to the created image. */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
}

/**
 * Current image loading state returned by useImage.
 */
export interface UseImageReturn {
  status: ImageStatus;
}
