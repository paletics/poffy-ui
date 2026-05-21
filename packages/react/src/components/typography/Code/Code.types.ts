import { CodeVariantProps } from '@/styled-system/recipes';
import { JsxStyleProps } from '@/styled-system/types';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Supported programming languages for syntax highlighting using Prism.js.
 *
 * ### Notes
 * Only languages imported by `Code.tsx` are listed here. Adding a language to
 * this type should be paired with importing the matching Prism component.
 */
export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'css'
  | 'html'
  | 'json'
  | 'markdown'
  | 'bash';

/**
 * Specific properties for the Code component.
 *
 * @example
 * ```tsx
 * import { Code } from '@poffy-ui/react/typography';
 * ```
 *
 * ### Notes
 * Inline code renders a `code` element. Block code renders `pre > code` unless
 * `asChild` is used; with `asChild`, the child must preserve a code-like element
 * so Prism can highlight it.
 *
 * ### AI Usage
 * - Do: pass a plain string for highlighted block snippets.
 * - Don't: put paragraphs, buttons, or other rich content inside `variant="inline"`.
 */
export interface CodeOwnProps extends CodeVariantProps, Omit<JsxStyleProps, 'colorScheme'> {
  /**
   * The code content to display.
   * ### Notes
   * Must be a `string` when using `variant="block"` with `language` prop.
   * Non-string children are accepted for inline use, but Prism.js syntax highlighting
   * only triggers on string content; ReactNode refs are stable-compared by object
   * identity, so highlighting will not re-run when non-string children change.
   */
  children?: string;

  /**
   * Programming language for syntax highlighting.
   * If provided in 'block' variant, Prism.js will be used for highlighting.
   *
   * @defaultValue undefined
   */
  language?: SupportedLanguage;

  /** Additional CSS class names. */
  className?: string;
}

/**
 * Props for the Code component.
 * Extends base props and standard HTML attributes via PrimitiveProps.
 * Defaults to 'code' element.
 *
 * ### Notes
 * Use this type for wrappers that forward all Code props.
 */
export type CodeProps = PrimitiveProps<'code', CodeOwnProps>;
