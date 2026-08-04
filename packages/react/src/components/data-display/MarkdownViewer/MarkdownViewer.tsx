'use client';

import { Code } from '@/components/typography/Code';
import type { SupportedLanguage } from '@/components/typography/Code';
import { Heading } from '@/components/typography/Heading';
import { Link } from '@/components/typography/Link';
import { cx } from '@/styled-system/css';
import { markdownViewer } from '@/styled-system/recipes';
import { parseMarkdown } from '@poffy-ui/behavior/markdown';
import type {
  MarkdownBlockNode,
  MarkdownCodeNode,
  MarkdownInlineNode,
  MarkdownListItemNode,
} from '@poffy-ui/behavior/markdown';
import { forwardRef, Fragment, useMemo } from 'react';
import { CodeViewer } from '../CodeViewer';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getMarkdownViewerMessages } from './MarkdownViewer.locales';
import type { MarkdownViewerMessages } from './MarkdownViewer.locales';
import type { MarkdownHeadingLevel, MarkdownViewerProps } from './MarkdownViewer.types';

interface MarkdownRenderContext {
  codeBlockCount: number;
  renderImages: boolean;
  messages: MarkdownViewerMessages;
}

const supportedLanguages = new Set<string>([
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'css',
  'html',
  'json',
  'markdown',
  'bash',
]);

function clampHeading(depth: number, baseHeadingLevel: MarkdownHeadingLevel): MarkdownHeadingLevel {
  const base = Number.isFinite(baseHeadingLevel)
    ? Math.min(6, Math.max(1, Math.floor(baseHeadingLevel)))
    : 1;
  return Math.min(6, base + depth - 1) as MarkdownHeadingLevel;
}

function toSupportedLanguage(language: string | undefined): SupportedLanguage | undefined {
  const normalized = language?.trim().toLowerCase();
  return normalized && supportedLanguages.has(normalized)
    ? (normalized as SupportedLanguage)
    : undefined;
}

function hasAccessibleInlineContent(nodes: MarkdownInlineNode[]): boolean {
  return nodes.some((node) => {
    if (node.type === 'text' || node.type === 'inlineCode') return node.value.trim().length > 0;
    if (node.type === 'image') return node.alt.trim().length > 0;
    return hasAccessibleInlineContent(node.children);
  });
}

function renderInline(
  nodes: MarkdownInlineNode[],
  keyPrefix: string,
  classes: ReturnType<typeof markdownViewer>,
  renderImages: boolean,
): React.ReactNode {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    if (node.type === 'text') return <Fragment key={key}>{node.value}</Fragment>;
    if (node.type === 'inlineCode') {
      return (
        <Code key={key} variant="inline">
          {node.value}
        </Code>
      );
    }
    if (node.type === 'image') {
      return node.safe && renderImages ? (
        <img
          key={key}
          className={classes.image}
          src={node.href}
          alt={node.alt}
          title={node.title}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Fragment key={key}>{node.alt}</Fragment>
      );
    }
    if (node.safe && hasAccessibleInlineContent(node.children)) {
      return (
        <Link key={key} href={node.href} title={node.title} variant="underline">
          {renderInline(node.children, key, classes, renderImages)}
        </Link>
      );
    }

    return <Fragment key={key}>{renderInline(node.children, key, classes, renderImages)}</Fragment>;
  });
}

function renderListItem(
  item: MarkdownListItemNode,
  key: string,
  classes: ReturnType<typeof markdownViewer>,
  baseHeadingLevel: MarkdownHeadingLevel,
  context: MarkdownRenderContext,
): React.ReactNode {
  return (
    <li className={classes.listItem} key={key}>
      {item.children.map((child, index) =>
        renderBlock(child, `${key}-block-${index}`, classes, baseHeadingLevel, context),
      )}
    </li>
  );
}

function renderCodeBlock(
  block: MarkdownCodeNode,
  key: string,
  classes: ReturnType<typeof markdownViewer>,
  label: string,
): React.ReactNode {
  return (
    <div key={key} className={classes.codeBlock}>
      <CodeViewer aria-label={label} language={toSupportedLanguage(block.language)} size="sm" wrap>
        {block.value}
      </CodeViewer>
    </div>
  );
}

function renderBlock(
  block: MarkdownBlockNode,
  key: string,
  classes: ReturnType<typeof markdownViewer>,
  baseHeadingLevel: MarkdownHeadingLevel,
  context: MarkdownRenderContext,
): React.ReactNode {
  if (block.type === 'heading') {
    const level = String(clampHeading(block.depth, baseHeadingLevel)) as `${MarkdownHeadingLevel}`;
    return (
      <Heading key={key} level={level}>
        {renderInline(block.children, key, classes, context.renderImages)}
      </Heading>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p key={key} className={classes.paragraph}>
        {renderInline(block.children, key, classes, context.renderImages)}
      </p>
    );
  }

  if (block.type === 'blockquote') {
    return (
      <blockquote key={key} className={classes.blockquote}>
        {block.children.map((child, index) =>
          renderBlock(child, `${key}-block-${index}`, classes, baseHeadingLevel, context),
        )}
      </blockquote>
    );
  }

  if (block.type === 'list') {
    const Component = block.ordered ? 'ol' : 'ul';
    return (
      <Component key={key} className={classes.list}>
        {block.items.map((item, itemIndex) =>
          renderListItem(item, `${key}-item-${itemIndex}`, classes, baseHeadingLevel, context),
        )}
      </Component>
    );
  }

  if (block.type === 'code') {
    context.codeBlockCount += 1;
    const language = block.language?.trim().toUpperCase();
    return renderCodeBlock(
      block,
      key,
      classes,
      context.messages.codeBlock(language, context.codeBlockCount),
    );
  }

  return <hr key={key} className={classes.rule} />;
}

/**
 * Safely renders the supported Markdown subset as read-only content.
 *
 * Parsing is bounded by `maxSourceCharacters`; oversized or invalid source is
 * replaced with localized (or supplied) plain text. Links are rendered only
 * when their parsed destination and label are safe. Images do not render by
 * default; when enabled, only safe parsed image URLs are loaded lazily with a
 * no-referrer policy. Heading levels start at `baseHeadingLevel` and stop at h6.
 */
export const MarkdownViewer = forwardRef<HTMLDivElement, MarkdownViewerProps>(
  (
    {
      source,
      baseHeadingLevel = 2,
      maxSourceCharacters = 100_000,
      oversizedSourceText,
      parseErrorText,
      locale: localeProp,
      messages: messageOverrides,
      renderImages = false,
      size,
      className,
      ...rest
    },
    ref,
  ) => {
    const providerLocale = useOptionalLocale()?.locale;
    const messages = getMarkdownViewerMessages(localeProp ?? providerLocale, messageOverrides);
    const classes = markdownViewer({ size });
    const normalizedSourceLimit =
      maxSourceCharacters === Infinity
        ? Infinity
        : Number.isFinite(maxSourceCharacters)
          ? Math.max(0, Math.trunc(maxSourceCharacters))
          : 100_000;
    const result = useMemo(() => {
      if (source.length > normalizedSourceLimit) return { status: 'oversized' as const };

      try {
        return { status: 'success' as const, document: parseMarkdown(source) };
      } catch {
        return { status: 'parseError' as const };
      }
    }, [normalizedSourceLimit, source]);
    const context: MarkdownRenderContext = { codeBlockCount: 0, renderImages, messages };
    const fallbackText =
      result.status === 'oversized'
        ? (oversizedSourceText ?? messages.oversizedSource)
        : (parseErrorText ?? messages.parseError);

    return (
      <div ref={ref} className={cx(classes.root, className)} {...rest}>
        {result.status === 'success'
          ? result.document.children.map((block, index) =>
              renderBlock(block, `markdown-block-${index}`, classes, baseHeadingLevel, context),
            )
          : fallbackText}
      </div>
    );
  },
);

MarkdownViewer.displayName = 'MarkdownViewer';
