/**
 * Parses Markdown into a renderer-neutral, URL-sanitized document model.
 *
 * The returned text nodes are data, not HTML; escape them when rendering to an HTML string.
 */
export { parseMarkdown } from './markdown';

/**
 * Applies the Markdown link policy, including trimmed `mailto:` destinations.
 *
 * @deprecated Prefer `sanitizeNavigationUrl` for non-Markdown navigation.
 */
export { sanitizeMarkdownUrl } from './sanitizeMarkdownUrl';
export type {
  MarkdownBlockNode,
  MarkdownBlockquoteNode,
  MarkdownCodeNode,
  MarkdownDocument,
  MarkdownHeadingNode,
  MarkdownImageNode,
  MarkdownInlineCodeNode,
  MarkdownInlineNode,
  MarkdownLinkNode,
  MarkdownListItemNode,
  MarkdownListNode,
  MarkdownParagraphNode,
  MarkdownTextNode,
  MarkdownThematicBreakNode,
  ParseMarkdownOptions,
} from './markdown.types';
