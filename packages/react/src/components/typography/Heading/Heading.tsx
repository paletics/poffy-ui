import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { heading } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { HeadingLevel, HeadingProps } from './Heading.types';

/**
 * A semantic heading component with level-based typography.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: heading), Radix Slot
 * ### Design Tokens
 * - font-size/line-height: silver-ratio scale tokens via heading recipe
 * ### Variant Logic
 * - level 1-6: Corresponds to semantic h1-h6 tags with proportionally scaling typography.
 * @example Page heading
 * ```tsx
 * import { Heading } from '@poffy-ui/react/typography';
 *
 * <Heading level="1">Main Page Title</Heading>
 * ```
 *
 * @example Visual heading without changing document outline
 * ```tsx
 * import { Heading } from '@poffy-ui/react/typography';
 *
 * <Heading level="2" weight="bold" asChild>
 *   <p>Visually h2 but semantically paragraph text.</p>
 * </Heading>
 * ```
 * ### Notes
 * Choose `level` from the document outline, not from desired font size. Do not
 * skip heading levels (for example h1 followed by h3). Use `asChild` only when
 * the visual heading style must be applied to a different semantic element.
 * ### Accessibility
 * - Automatically renders the appropriate heading tag (h1-h6) based on the `level` prop to maintain document outline.
 * - Avoid multiple unrelated h1 elements in the same page or landmark unless the page structure intentionally requires them.
 * ### AI Usage
 * - Use for page titles, section headers, and semantic document structuring.
 * - Use `asChild` for card titles, eyebrow text, or SEO-sensitive copy that should look like a heading without becoming one.
 * - Do not use Heading merely for bold or large body text; use `Text` variants or weights instead.
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { level = '1', asChild, className, children, weight, ...rest } = props;

  const Component = asChild ? Slot : (`h${level}` as `h${HeadingLevel}`);

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = heading({
    level,
    weight,
  });
  const styleClass = css(cssProps);

  return (
    <Component ref={ref} className={cx(recipeClass, styleClass, className)} {...elementProps}>
      {children}
    </Component>
  );
});

Heading.displayName = 'Heading';
