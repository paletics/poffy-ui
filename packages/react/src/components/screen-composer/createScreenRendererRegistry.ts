import type {
  ScreenNode,
  ScreenRegistry,
  ScreenSchemaIssue,
} from '@poffy-ui/behavior/screen-composer';
import type {
  ScreenRenderContext,
  ScreenRendererExtension,
  ScreenRendererRegistryResult,
} from './ScreenRenderer.types';

const validNamespace = (value: string) => /^[a-z][a-z0-9-]*$/.test(value);

/**
 * Creates a query-only registry from trusted, schema-owned renderer extensions.
 *
 * Every registered schema definition must have exactly one matching renderer
 * with the same namespace and version. Invalid extension metadata, duplicate
 * types, and missing renderers return structured issues instead of a partial
 * registry, so untrusted documents cannot reach an accidental renderer.
 */
export const createScreenRendererRegistry = (
  schemaRegistry: ScreenRegistry,
  extensions: readonly ScreenRendererExtension[],
): ScreenRendererRegistryResult => {
  const renderers = new Map<string, ScreenRendererExtension['renderers'][number]>();
  const extensionIds = new Set<string>();
  const issues: ScreenSchemaIssue[] = [];
  if (!Array.isArray(extensions)) {
    return {
      ok: false,
      issues: Object.freeze([
        {
          path: '$.extensions',
          code: 'invalid-extension',
          message: 'Extensions must be an array.',
        },
      ]),
    };
  }
  for (const extension of extensions) {
    if (
      !extension ||
      typeof extension !== 'object' ||
      typeof extension.id !== 'string' ||
      !extension.id ||
      typeof extension.namespace !== 'string' ||
      !validNamespace(extension.namespace) ||
      !Array.isArray(extension.renderers)
    ) {
      issues.push({
        path: '$.extensions',
        code: 'invalid-extension',
        message: 'Renderer extension namespace is invalid.',
      });
      continue;
    }
    if (schemaRegistry.getExtensionId(extension.namespace) !== extension.id) {
      issues.push({
        path: extension.id,
        code: 'invalid-extension',
        message: 'Renderer extension does not own the schema namespace.',
      });
      continue;
    }
    if (extensionIds.has(extension.id)) {
      issues.push({
        path: extension.id,
        code: 'duplicate-extension',
        message: 'Renderer extension id is duplicated.',
      });
    }
    extensionIds.add(extension.id);
    for (const renderer of extension.renderers) {
      const definition = renderer && schemaRegistry.getDefinition(renderer.type);
      if (
        !renderer ||
        typeof renderer.type !== 'string' ||
        !renderer.type.startsWith(`${extension.namespace}.`) ||
        !Number.isSafeInteger(renderer.version) ||
        renderer.version < 1 ||
        typeof renderer.render !== 'function' ||
        !definition ||
        definition.version !== renderer.version
      ) {
        issues.push({
          path: extension.id,
          code: 'invalid-extension',
          message: 'Renderer does not match a registered node definition.',
        });
      } else if (renderers.has(renderer.type)) {
        issues.push({
          path: renderer.type,
          code: 'duplicate-node-type',
          message: 'Node renderer is duplicated.',
        });
      } else renderers.set(renderer.type, renderer);
    }
  }
  for (const definition of schemaRegistry.definitions()) {
    if (!renderers.has(definition.type))
      issues.push({
        path: definition.type,
        code: 'unknown-node',
        message: 'Node renderer is missing.',
      });
  }
  if (issues.length) return { ok: false, issues: Object.freeze(issues) };
  return {
    ok: true,
    registry: Object.freeze({
      render: (node: ScreenNode, context: ScreenRenderContext) =>
        renderers.get(node.type)?.render(node, context),
    }),
  };
};
