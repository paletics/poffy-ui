import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { text } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { TextProps } from './Text.types';

/**
 * A flexible typography component for rendering various text styles.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: text), Radix Slot
 * ### Design Tokens
 * - font-size/line-height: silver-ratio scale tokens via text recipe
 * ### Variant Logic
 * - body1/body2: Standard paragraph reading text. caption: Smallest legibility scale for hints/metadata.
 * @example
 * ```tsx
 * import { Text } from '@poffy-ui/react/typography';
 *
 * <Text variant="body1">This is a paragraph.</Text>
 * ```
 *
 * @example Inline composition
 * ```tsx
 * import { Text } from '@poffy-ui/react/typography';
 *
 * <p>
 *   Status: <Text asChild variant="caption" weight="semibold"><span>Draft</span></Text>
 * </p>
 * ```
 * ### Notes
 * By default this renders a `<p>` tag. Do not nest `<p>` elements. Use `asChild`
 * with `span`, `label`, `figcaption`, or another valid text element when the
 * text appears inside an existing paragraph, list item label, form control, or button.
 * ### Accessibility
 * - Use appropriate semantic elements via `asChild` to maintain valid DOM nesting when inside restricted parents like `<p>` or `<button>`.
 * - Use `Heading` instead of visual weight when the text introduces a new page or section.
 * ### AI Usage
 * - Use `body1` for primary descriptions.
 * - Use `body2` for secondary or less prominent paragraphs.
 * - Use `caption` for helper text, timestamps, or sub-labels.
 * - Do not use `Text` to create fake headings; preserve the document outline with `Heading`.
 */
export const Text = forwardRef<HTMLParagraphElement, TextProps>((props, ref) => {
  const { asChild, className, children, variant, weight, align, transform, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = text({ variant, weight, align, transform });
  const styleClass = css(cssProps);
  const Component = asChild ? Slot : 'p';

  return (
    <Component ref={ref} className={cx(recipeClass, styleClass, className)} {...elementProps}>
      {children}
    </Component>
  );
});

Text.displayName = 'Text';
