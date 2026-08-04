import type { ReactNode } from 'react';
import type {
  ScreenDocument,
  ScreenNode,
  ScreenRegistry,
  ScreenSchemaIssue,
} from '@poffy-ui/behavior/screen-composer';

/** Rendering capabilities supplied to a trusted screen-node renderer. */
export interface ScreenRenderContext {
  /** Renders the validated children of the supplied parent node. */
  renderChildren: (node: ScreenNode) => ReactNode;
  /** Sends an opaque action identifier and its validated source node to the host callback. */
  dispatchAction: (actionId: string, node: ScreenNode) => void;
}

/** Trusted renderer metadata for one registered screen-node type and version. */
export interface ScreenNodeRendererDefinition {
  /** Namespaced node type handled by this renderer. */
  type: string;
  /** Node schema version handled by this renderer. */
  version: number;
  /** Renders a validated node using the host-provided rendering context. */
  render: (node: ScreenNode, context: ScreenRenderContext) => ReactNode;
}

/** Trusted executable renderer contribution from Core, a tier, or an application. */
export interface ScreenRendererExtension {
  /** Stable identifier of the trusted extension that owns these renderers. */
  id: string;
  /** Namespace that owns every renderer type in this extension. */
  namespace: string;
  /** Renderer definitions contributed by the extension. */
  renderers: readonly ScreenNodeRendererDefinition[];
}

/** Query interface that resolves a validated node to its trusted renderer output. */
export interface ScreenRendererRegistry {
  /** Renders the node or returns `undefined` when no matching renderer is registered. */
  render: (node: ScreenNode, context: ScreenRenderContext) => ReactNode | undefined;
}

/** The success or failure result returned while creating a screen renderer registry. */
export type ScreenRendererRegistryResult =
  | { ok: true; registry: ScreenRendererRegistry }
  | { ok: false; issues: readonly ScreenSchemaIssue[] };

/** Props for rendering a screen document through paired schema and renderer registries. */
export interface ScreenRendererProps {
  /** Screen document to validate before any node renderer is invoked. */
  document: ScreenDocument;
  /** Trusted schema registry used to validate the document. */
  schemaRegistry: ScreenRegistry;
  /** Trusted renderer registry used after schema validation succeeds. */
  rendererRegistry: ScreenRendererRegistry;
  /** Receives an opaque action identifier and validated node when an action node is activated. */
  onAction?: (actionId: string, node: ScreenNode) => void;
  /** Replaces the default alert rendered when validation or renderer lookup fails. */
  renderFallback?: (issues: readonly ScreenSchemaIssue[]) => ReactNode;
}
