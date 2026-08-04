'use client';

/* eslint-disable @typescript-eslint/dot-notation -- Screen JSON props require indexed access. */
import { Fragment, type ReactNode } from 'react';
import { Button } from '@/components/inputs';
import { SimpleGrid, Stack } from '@/components/layout';
import { Link } from '@/components/typography';
import { css } from '@/styled-system/css';
import { sanitizeNavigationUrl } from '@poffy-ui/behavior';
import {
  screenGridMinimumWidths,
  screenGridModes,
  screenLayoutGaps,
  validateScreenDocument,
} from '@poffy-ui/behavior/screen-composer';
import type { ScreenNode, ScreenSchemaIssue } from '@poffy-ui/behavior/screen-composer';
import type { ScreenRenderContext, ScreenRendererProps } from './ScreenRenderer.types';

const sectionClass = css({ display: 'grid', gap: 'md' });
const textClass = css({ color: 'text.primary' });
const fallbackClass = css({ color: 'variants.danger.main' });

const getStringProp = (node: ScreenNode, name: string): string => {
  const value = node.props?.[name];
  return typeof value === 'string' ? value : '';
};

const getLayoutProp = <T extends string>(
  node: ScreenNode,
  name: string,
  values: readonly T[],
): T | undefined => {
  const value = node.props?.[name];
  return typeof value === 'string' && values.includes(value as T) ? (value as T) : undefined;
};

const stackDirections = ['column', 'row'] as const;
const stackAlignments = ['flex-start', 'center', 'flex-end', 'stretch'] as const;
const gridMinimumWidthValues = {
  sm: '10rem',
  md: '14rem',
  lg: '18rem',
} as const;

/**
 * Trusted renderers paired with the built-in Core screen schema extension.
 *
 * Core action IDs are opaque host requests, and Core links are passed through
 * navigation-URL sanitization. Layout prop values are accepted only from the
 * schema's fixed token sets. Compose this extension with its matching schema
 * extension before creating the renderer registry.
 */
export const coreScreenRendererExtension = {
  id: '@poffy-ui/core',
  namespace: 'core',
  renderers: [
    {
      type: 'core.stack',
      version: 1,
      render: (node: ScreenNode, context: ScreenRenderContext) => (
        <Stack
          direction={getLayoutProp(node, 'direction', stackDirections)}
          gap={getLayoutProp(node, 'gap', screenLayoutGaps)}
          align={getLayoutProp(node, 'align', stackAlignments)}
        >
          {context.renderChildren(node)}
        </Stack>
      ),
    },
    {
      type: 'core.grid',
      version: 1,
      render: (node: ScreenNode, context: ScreenRenderContext) => {
        const mode =
          getLayoutProp(node, 'mode', screenGridModes) ??
          (node.props?.['columns'] === undefined ? 'responsive' : 'fixed');
        const minimumWidth = getLayoutProp(node, 'minChildWidth', screenGridMinimumWidths) ?? 'md';
        return (
          <SimpleGrid
            columns={mode === 'fixed' ? (node.props?.['columns'] as number) : undefined}
            minChildWidth={mode === 'responsive' ? gridMinimumWidthValues[minimumWidth] : undefined}
            gap={getLayoutProp(node, 'gap', screenLayoutGaps)}
          >
            {context.renderChildren(node)}
          </SimpleGrid>
        );
      },
    },
    {
      type: 'core.section',
      version: 1,
      render: (node: ScreenNode, context: ScreenRenderContext) => {
        const title = getStringProp(node, 'title');
        return (
          <section
            className={sectionClass}
            aria-labelledby={title ? `${node.id}-title` : undefined}
          >
            {title ? <h2 id={`${node.id}-title`}>{title}</h2> : null}
            {context.renderChildren(node)}
          </section>
        );
      },
    },
    {
      type: 'core.text',
      version: 1,
      render: (node: ScreenNode) => <p className={textClass}>{getStringProp(node, 'text')}</p>,
    },
    {
      type: 'core.action',
      version: 1,
      render: (node: ScreenNode, context: ScreenRenderContext) => (
        <Button onClick={() => context.dispatchAction(getStringProp(node, 'actionId'), node)}>
          {getStringProp(node, 'label')}
        </Button>
      ),
    },
    {
      type: 'core.link',
      version: 1,
      render: (node: ScreenNode) => {
        const href = getStringProp(node, 'href');
        const safeHref = sanitizeNavigationUrl(href);
        return safeHref ? (
          <Link external={node.props?.['external'] === true} href={safeHref}>
            {getStringProp(node, 'label')}
          </Link>
        ) : null;
      },
    },
  ],
} as const;

const defaultFallback = (issues: readonly ScreenSchemaIssue[]): ReactNode => (
  <p className={fallbackClass} role="alert">
    Unable to render screen: {issues[0]?.message ?? 'Unknown schema error.'}
  </p>
);

/**
 * Renders a validated screen document with explicitly composed trusted registries.
 * Invalid documents never reach node renderers; validation failures use an alert fallback instead.
 *
 * Compose matching schema and renderer extensions before rendering. Individual renderers own their
 * semantics and keyboard behavior. Action identifiers are opaque requests to the host and do not
 * confer authorization.
 *
 * @example
 * ```tsx
 * <ScreenRenderer document={document} schemaRegistry={schema} rendererRegistry={renderers} />
 * ```
 *
 * @example
 * ```tsx
 * <ScreenRenderer
 *   document={document}
 *   schemaRegistry={schema}
 *   rendererRegistry={renderers}
 *   onAction={(actionId) => authorizeAndDispatch(actionId)}
 * />
 * ```
 */
export const ScreenRenderer = ({
  document,
  schemaRegistry,
  rendererRegistry,
  onAction,
  renderFallback,
}: ScreenRendererProps) => {
  const issues = validateScreenDocument(document, schemaRegistry);
  if (issues.length) return <>{(renderFallback ?? defaultFallback)(issues)}</>;
  const renderNode = (node: ScreenNode): ReactNode => {
    const context: ScreenRenderContext = {
      renderChildren: (parent) =>
        parent.children?.map((child) => <Fragment key={child.id}>{renderNode(child)}</Fragment>) ??
        null,
      dispatchAction: (actionId, actionNode) => onAction?.(actionId, actionNode),
    };
    return (
      rendererRegistry.render(node, context) ??
      defaultFallback([
        { path: node.id, code: 'unknown-node', message: 'Renderer is unavailable.' },
      ])
    );
  };
  return <>{renderNode(document.root)}</>;
};
