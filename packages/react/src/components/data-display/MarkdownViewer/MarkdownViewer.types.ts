import type { MarkdownViewerVariantProps } from '@/styled-system/recipes';
import type { NativeProps } from '@poffy-ui/types';
import type { MarkdownViewerMessages } from './MarkdownViewer.locales';

/** Valid first native heading level for Markdown `#` headings. */
export type MarkdownHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Shared base props for MarkdownViewer. */
export interface MarkdownViewerBaseProps extends MarkdownViewerVariantProps {
  /** Markdown source text. */
  source: string;
  /**
   * Maximum source characters to parse and render. This bounds parser and DOM work for untrusted
   * Markdown. Use `Infinity` only when the caller has already bounded the input.
   *
   * @defaultValue `100000`
   */
  maxSourceCharacters?: number;
  /** Text shown when the source exceeds `maxSourceCharacters`. */
  oversizedSourceText?: string;
  /** Text shown when parsing fails. */
  parseErrorText?: string;
  /** Locale used by built-in status text and code-block accessible names. */
  locale?: string;
  /** Overrides for built-in status text and code-block accessible names. */
  messages?: Partial<MarkdownViewerMessages>;
  /** First heading level used for `#`; deeper headings are clamped to `h6`. */
  baseHeadingLevel?: MarkdownHeadingLevel;

  /** Whether safe Markdown image URLs render as lazy images. Defaults to `false`. */
  renderImages?: boolean;
}

/** Public props for MarkdownViewer. */
export type MarkdownViewerProps = NativeProps<'div', MarkdownViewerBaseProps>;
