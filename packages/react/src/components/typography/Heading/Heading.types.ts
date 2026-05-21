import { HeadingVariantProps } from '@/styled-system/recipes';
import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';
import { ForwardRefExoticComponent, ReactNode } from 'react';

/** Valid semantic heading levels (1-6). */
export type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';

/**
 * Specific properties for the Heading component.
 *
 * @example
 * ```tsx
 * import { Heading } from '@poffy-ui/react/typography';
 * ```
 *
 * ### Notes
 * Do: choose `level` from the document outline, then style with variants.
 * Do: use `asChild` when the visual size should not create a new heading in
 * the accessibility tree.
 * Don't: skip levels only to change visual size.
 * Don't: use Heading for emphasized prose or metadata; use `Text` instead.
 *
 * Extends variant props from the heading recipe and Panda CSS style props.
 */
export interface HeadingOwnProps extends Omit<HeadingVariantProps, 'level'>, JsxStyleProps {
  /**
   * The heading level (1-6) which determines the HTML element (h1-h6).
   *
   * ### Notes
   * Match the page outline. Use `level="1"` for the primary page title, `level="2"`
   * for top-level sections, and continue sequentially instead of skipping levels
   * for visual size.
   *
   * @defaultValue `'1'`
   */
  level?: HeadingLevel;

  /** The content of the heading. */
  children?: ReactNode;

  /** Additional CSS class names. */
  className?: string;
}

/**
 * Props for the Heading component.
 * Extends base props and standard HTML heading attributes via PrimitiveProps.
 */
export type HeadingProps = PrimitiveProps<'h1', HeadingOwnProps>;

/**
 * Component type for Heading, preserving ref forwarding compatibility.
 */
export type HeadingComponent = ForwardRefExoticComponent<HeadingProps>;
