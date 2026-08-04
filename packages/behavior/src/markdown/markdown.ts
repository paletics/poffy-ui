import type {
  Blockquote,
  Code,
  Content,
  Heading,
  Html,
  Image,
  InlineCode,
  Link,
  List,
  ListItem,
  Paragraph,
  Root,
  RootContent,
  Text,
} from 'mdast';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { sanitizeMarkdownUrl } from './sanitizeMarkdownUrl';
import type {
  MarkdownBlockNode,
  MarkdownDocument,
  MarkdownImageNode,
  MarkdownInlineNode,
  MarkdownListItemNode,
  ParseMarkdownOptions,
} from './markdown.types';

function clampHeadingDepth(depth: number): 1 | 2 | 3 | 4 | 5 | 6 {
  if (depth <= 1) return 1;
  if (depth >= 6) return 6;
  return depth as 1 | 2 | 3 | 4 | 5 | 6;
}

function isParentNode(node: Content | Root): node is (Content | Root) & { children: Content[] } {
  return 'children' in node && Array.isArray(node.children);
}

function normalizeInlineNodes(
  nodes: readonly Content[],
  options: ParseMarkdownOptions,
): MarkdownInlineNode[] {
  return nodes.flatMap((node) => normalizeInlineNode(node, options));
}

function normalizeInlineNode(node: Content, options: ParseMarkdownOptions): MarkdownInlineNode[] {
  if (node.type === 'text') {
    return [{ type: 'text', value: (node as Text).value }];
  }

  if (node.type === 'inlineCode') {
    return [{ type: 'inlineCode', value: (node as InlineCode).value }];
  }

  if (node.type === 'html') {
    return options.preserveHtmlAsText === false
      ? []
      : [{ type: 'text', value: (node as Html).value }];
  }

  if (node.type === 'image') {
    const image = node as Image;
    const href = image.url ?? '';
    const sanitized = sanitizeMarkdownUrl(href);
    const normalized: MarkdownImageNode = {
      type: 'image',
      href: sanitized ?? '',
      alt: image.alt ?? '',
      safe: sanitized !== undefined && !sanitized.startsWith('mailto:'),
    };

    if (image.title !== null && image.title !== undefined) {
      normalized.title = image.title;
    }

    return [normalized];
  }

  if (node.type === 'link') {
    const link = node as Link;
    const sanitized = sanitizeMarkdownUrl(link.url);
    const normalized: MarkdownInlineNode = {
      type: 'link',
      href: sanitized ?? '',
      safe: sanitized !== undefined,
      children: normalizeInlineNodes(link.children, options),
    };

    if (link.title !== null && link.title !== undefined) {
      normalized.title = link.title;
    }

    return [normalized];
  }

  if (isParentNode(node)) {
    return normalizeInlineNodes(node.children, options);
  }

  return [];
}

function normalizeListItem(item: ListItem, options: ParseMarkdownOptions): MarkdownListItemNode {
  return {
    type: 'listItem',
    children: item.children.flatMap((child) => normalizeBlockNode(child, options)),
  };
}

function normalizeBlockNode(node: RootContent, options: ParseMarkdownOptions): MarkdownBlockNode[] {
  if (node.type === 'heading') {
    const heading = node as Heading;
    return [
      {
        type: 'heading',
        depth: clampHeadingDepth(heading.depth),
        children: normalizeInlineNodes(heading.children, options),
      },
    ];
  }

  if (node.type === 'paragraph') {
    const paragraph = node as Paragraph;
    return [
      {
        type: 'paragraph',
        children: normalizeInlineNodes(paragraph.children, options),
      },
    ];
  }

  if (node.type === 'blockquote') {
    const blockquote = node as Blockquote;
    return [
      {
        type: 'blockquote',
        children: blockquote.children.flatMap((child) => normalizeBlockNode(child, options)),
      },
    ];
  }

  if (node.type === 'list') {
    const list = node as List;
    return [
      {
        type: 'list',
        ordered: list.ordered === true,
        items: list.children.map((item) => normalizeListItem(item, options)),
      },
    ];
  }

  if (node.type === 'code') {
    const code = node as Code;
    const normalized: MarkdownBlockNode = {
      type: 'code',
      value: code.value,
    };

    if (code.lang !== null && code.lang !== undefined) {
      normalized.language = code.lang;
    }
    if (code.meta !== null && code.meta !== undefined) {
      normalized.meta = code.meta;
    }

    return [normalized];
  }

  if (node.type === 'thematicBreak') {
    return [{ type: 'thematicBreak' }];
  }

  if (node.type === 'html') {
    return options.preserveHtmlAsText === false
      ? []
      : [{ type: 'paragraph', children: [{ type: 'text', value: (node as Html).value }] }];
  }

  if (isParentNode(node)) {
    return node.children.flatMap((child) => normalizeBlockNode(child as RootContent, options));
  }

  return [];
}

/**
 * Parses Markdown into the package's renderer-neutral document model. Unsafe link and image URLs
 * are marked and stripped of navigable hrefs; raw HTML is preserved as text by default.
 * Formatting not represented by this model is unwrapped into its supported child content. A
 * renderer must continue to escape text nodes before inserting them as HTML.
 *
 * @param source Markdown source; this parser supports CommonMark structure rather than rendering.
 * @param options Controls treatment of raw HTML nodes.
 */
export function parseMarkdown(
  source: string,
  options: ParseMarkdownOptions = {},
): MarkdownDocument {
  const tree = unified().use(remarkParse).parse(source) as Root;

  return {
    type: 'document',
    children: tree.children.flatMap((node) => normalizeBlockNode(node, options)),
  };
}
