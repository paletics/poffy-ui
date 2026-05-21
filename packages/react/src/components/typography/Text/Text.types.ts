import { TextVariantProps } from '@/styled-system/recipes';
import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ForwardRefExoticComponent } from 'react';

/**
 * Specific properties for the Text component.
 * Extends variant props from the text recipe and Panda CSS style props.
 *
 * @example
 * ```tsx
 * import { Text } from '@poffy-ui/react/typography';
 * ```
 *
 * ### Notes
 * Text renders a paragraph by default. Use `asChild` with `span`, `label`,
 * `figcaption`, or another semantic element when paragraph markup would be invalid.
 * The child element supplied to `asChild` becomes the DOM element, so choose it
 * from HTML nesting rules first and visual style second.
 *
 * ### AI Usage
 * - Do: use for prose, captions, helper text, and short metadata.
 * - Do: use `asChild` when text appears inside another paragraph, inside a
 *   button, or as a form label.
 * - Don't: use Text for headings; use `Heading` to preserve document structure.
 * - Don't: wrap block-level elements in Text because the default `<p>` cannot
 *   contain them.
 *
 * ### AI Context & Architecture
 * `transform` is controlled by the text recipe (visual transformations like uppercase).
 * `JsxStyleProps.transform` (CSS transform property) is omitted to prevent collision.
 */
export interface TextOwnProps extends TextVariantProps, Omit<JsxStyleProps, 'transform'> {
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Props for the Text component.
 * Extends base props and standard HTML paragraph attributes via PrimitiveProps.
 */
export type TextProps = PrimitiveProps<'p', TextOwnProps>;

/**
 * Component type for Text, preserving ref forwarding compatibility.
 */
export type TextComponent = ForwardRefExoticComponent<TextProps>;
