import { RecipeVariantProps } from '@/styled-system/css';
import { image } from '@/styled-system/recipes';
import { NativeProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/** Variants for Image based on the Panda CSS recipe. */
export type ImageRecipeVariants = RecipeVariantProps<typeof image>;

/**
 * Own props for Image.
 *
 * ### Notes
 * Do: always provide meaningful `alt` text, or `alt=""` for decorative images.
 * Don't: put important text only inside the bitmap.
 *
 * Related: `ImageRecipeVariants`
 */
export type ImageOwnProps = ImageRecipeVariants & {
  /**
   * Fallback content to show if image fails to load.
   * Can be a URL string or a React node.
   */
  fallback?: string | ReactNode;
  /**
   * Called when the image loads successfully.
   * Fires from the internal preload detector (`useImage`), not the rendered `<img>` element.
   */
  onLoad?: () => void;
  /**
   * Called when the image fails to load.
   * Fires even when `fallback` is provided and the `<img>` element is not rendered.
   */
  onError?: () => void;
};

/**
 * The public props for the Image component.
 *
 * @example
 * ```tsx
 * import { Image } from '@poffy-ui/react/media';
 *
 * <Image src="photo.jpg" fallback="placeholder.svg" alt="profile" />
 * ```
 *
 * ### Notes
 * Use Picture from `@poffy-ui/react/media` when the source changes by
 * viewport, density, or image format.
 *
 * Related: `ImageOwnProps`
 */
export type ImageProps = NativeProps<'img', ImageOwnProps>;
