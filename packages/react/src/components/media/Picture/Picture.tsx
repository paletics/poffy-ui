import { cx } from '@/styled-system/css';
import { picture } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { PictureProps } from './Picture.types';

/**
 * A styled native `<picture>` wrapper for responsive images and art direction.
 * Enables next-gen format delivery (WebP/AVIF with JPEG fallback) and breakpoint-aware
 * image swapping via `<source>` elements, all with consistent Poffy UI `objectFit` styling.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: picture — variant: `fit`).
 * The `fit` variant targets the nested `<img>` via a CSS child selector (`& img { object-fit: ... }`),
 * NOT the `<picture>` element itself. No Radix Slot — renders the native `<picture>` element.
 * ### Design Tokens
 * - fit: controls `object-fit` on the inner `<img>` via recipe child selector.
 * No Silver Ratio spacing tokens — sizing is entirely controlled by the consumer's wrapper dimensions.
 * ### Variant Logic
 * - `fit="cover"` (default): Crops to fill the container — hero images, background-style art.
 * - `fit="contain"`: Letterboxes inside the container — product photos needing full visibility.
 * - `fit="fill"`: Stretches to fill — use sparingly, only for abstract/decorative imagery.
 * @example WebP with JPEG fallback (format art direction)
 * ```tsx
 * import { Picture } from '@poffy-ui/react/media';
 *
 * <Picture fit="cover">
 *   <source srcSet="hero.avif" type="image/avif" />
 *   <source srcSet="hero.webp" type="image/webp" />
 *   <img src="hero.jpg" alt="Mountain landscape at sunrise" width={1200} height={675} />
 * </Picture>
 * ```
 * @example Responsive art direction (crop by viewport)
 * ```tsx
 * import { Picture } from '@poffy-ui/react/media';
 *
 * <Picture fit="cover">
 *   <source media="(max-width: 768px)" srcSet="hero-mobile.webp" type="image/webp" />
 *   <source media="(min-width: 769px)" srcSet="hero-desktop.webp" type="image/webp" />
 *   <img src="hero-desktop.jpg" alt="Team" />
 * </Picture>
 * ```
 * ### Notes
 * The `<img>` element MUST be the last child. Browsers fall back to `<img>` when
 * no `<source>` matches. The `fit` variant applies `object-fit` to the `<img>`, so the
 * wrapper must have explicit dimensions for the effect to be visible.
 * ### Accessibility
 * - Accessibility is the responsibility of the inner `<img>` element — always provide
 * a descriptive `alt` attribute. The `<picture>` element itself is transparent to screen readers.
 * ### AI Usage
 * - Use instead of `<Image>` when you need next-gen format delivery or viewport-based art direction.
 * - Use `<Image>` instead when you only need a single source with fallback-on-error behavior.
 * - Always include a plain `<img>` as the final child for maximum browser compatibility.
 */
export const Picture = forwardRef<HTMLPictureElement, PictureProps>((props, ref) => {
  const { className, children, fit, ...rest } = props;

  const styles = picture({ fit });

  return (
    <picture ref={ref} className={cx(styles, className)} {...rest}>
      {children}
    </picture>
  );
});

Picture.displayName = 'Picture';
