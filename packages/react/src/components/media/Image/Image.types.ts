import type { RecipeVariantProps } from '@/styled-system/css';
import { image } from '@/styled-system/recipes';
import type { NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { ImageStatus } from '@poffy-ui/behavior/hooks';

/** Variants for Image based on the Panda CSS recipe. */
export type ImageRecipeVariants = RecipeVariantProps<typeof image>;

/**
 * Own props for Image.
 *
 * ### Notes
 * Do: always provide meaningful `alt` text, or `alt=""` for decorative images.
 * Don't: put important text only inside the bitmap.
 * Use `sizing="fill"` inside `AspectRatio` when the image and a React-node
 * fallback must share one stable layout frame.
 *
 * Related: `ImageRecipeVariants`
 */
export type ImageAccessibilityProps =
  | {
      /** Alternative text for a meaningful image. Use an empty string for a decorative image. */
      alt: string;
      decorative?: false;
    }
  | {
      /** Explicitly marks an image with omitted alternative text as decorative. */
      decorative: true;
      alt?: never;
    };

/** Component-specific props for Image. */
export type ImageOwnProps = ImageRecipeVariants &
  ImageAccessibilityProps & {
    /**
     * Fallback content to show if image fails to load.
     * Can be a URL string or a React node.
     */
    fallback?: string | ReactNode;
    /**
     * Reports the component resource lifecycle, including preload failures.
     * Use this for fallback decisions; native `onLoad` and `onError` only report
     * events emitted by the rendered `<img>`.
     */
    onStatusChange?: (status: ImageStatus) => void;
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
 * viewport, density, or image format. The forwarded ref points to the rendered
 * `<img>` (including URL fallbacks); custom React fallback content does not
 * receive the Image ref.
 * `sizing` is additive: `intrinsic` preserves the historical behavior, `fluid`
 * follows the available width, and `fill` consumes dimensions owned by a parent frame.
 *
 * Related: `ImageOwnProps`
 */
export type ImageProps = NativeProps<'img', ImageOwnProps>;
