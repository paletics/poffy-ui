/** Root node returned by the Markdown parser. */
export interface MarkdownDocument {
  type: 'document';
  children: MarkdownBlockNode[];
}

/** Union of block-level nodes that may occur in a parsed Markdown document. */
export type MarkdownBlockNode =
  | MarkdownHeadingNode
  | MarkdownParagraphNode
  | MarkdownListNode
  | MarkdownBlockquoteNode
  | MarkdownCodeNode
  | MarkdownThematicBreakNode;

/** Block heading with its source depth and parsed inline content. */
export interface MarkdownHeadingNode {
  type: 'heading';
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  children: MarkdownInlineNode[];
}

/** Paragraph containing parsed inline content. */
export interface MarkdownParagraphNode {
  type: 'paragraph';
  children: MarkdownInlineNode[];
}

/** Ordered or unordered list with block-capable item content. */
export interface MarkdownListNode {
  type: 'list';
  ordered: boolean;
  items: MarkdownListItemNode[];
}

/** One list item whose children preserve their block structure. */
export interface MarkdownListItemNode {
  type: 'listItem';
  children: MarkdownBlockNode[];
}

/** Blockquote containing parsed block children. */
export interface MarkdownBlockquoteNode {
  type: 'blockquote';
  children: MarkdownBlockNode[];
}

/** Fenced or indented code block, including optional language and metadata. */
export interface MarkdownCodeNode {
  type: 'code';
  value: string;
  language?: string;
  meta?: string;
}

/** Thematic-break block node. */
export interface MarkdownThematicBreakNode {
  type: 'thematicBreak';
}

/** Union of inline nodes used by headings, paragraphs, and links. */
export type MarkdownInlineNode =
  | MarkdownTextNode
  | MarkdownInlineCodeNode
  | MarkdownImageNode
  | MarkdownLinkNode;

/** Plain text inline node. */
export interface MarkdownTextNode {
  type: 'text';
  value: string;
}

/** Inline code span whose value excludes Markdown delimiters. */
export interface MarkdownInlineCodeNode {
  type: 'inlineCode';
  value: string;
}

/** Image inline node with a Markdown URL-policy result. */
export interface MarkdownImageNode {
  type: 'image';
  /**
   * URL retained by the Markdown policy, or empty when it was rejected. This does not imply that
   * the network resource is trusted.
   */
  href: string;
  alt: string;
  title?: string;
  /**
   * Whether the URL is safe to render as an image source. `mailto:` is retained by the shared
   * Markdown URL policy but is not safe for image rendering.
   */
  safe: boolean;
}

/** Link inline node whose empty `href` represents a rejected URL. */
export interface MarkdownLinkNode {
  type: 'link';
  /** URL that passed the Markdown URL scheme allowlist; empty when `safe` is false. */
  href: string;
  title?: string;
  safe: boolean;
  children: MarkdownInlineNode[];
}

/** Parser options controlling how unsupported raw HTML is represented. */
export interface ParseMarkdownOptions {
  /**
   * Preserve raw HTML as text nodes rather than dropping it.
   *
   * The stored text is not pre-escaped; an HTML renderer must escape text-node values when it
   * inserts them into markup.
   *
   * @defaultValue true
   */
  preserveHtmlAsText?: boolean;
}
