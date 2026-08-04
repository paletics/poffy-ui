import { sanitizeNavigationUrl } from '../url';

/** JSON-compatible values permitted in persisted screen documents and node props. */
export type ScreenJsonValue =
  | null
  | boolean
  | number
  | string
  | readonly ScreenJsonValue[]
  | { readonly [key: string]: ScreenJsonValue };

/** A versioned, identified screen element with optional JSON props and child nodes permitted by validation. */
export interface ScreenNode {
  /** Unique document-wide node id, checked by `validateScreenDocument`. */
  id: string;
  /** Namespaced registered node type, such as `core.stack`. */
  type: string;
  /** Positive schema version that must match the registered definition. */
  version: number;
  /** Bounded JSON-only props validated by the registered definition. */
  props?: Readonly<Record<string, ScreenJsonValue>>;
  /** Child nodes, allowed only when the registered definition opts in. */
  children?: readonly ScreenNode[];
}

/** Versioned portable screen render body; host persistence metadata belongs outside this document. */
export interface ScreenDocument {
  /** Currently the only accepted persisted document version. */
  version: 1;
  /** Root node to validate and render. */
  root: ScreenNode;
}

/** Trusted schema metadata and optional rejection-message validator for one namespaced node type. */
export interface ScreenNodeDefinition {
  /** Registered namespaced node type owned by the containing extension namespace. */
  type: string;
  /** Positive version accepted for this node type. */
  version: number;
  /** Child nodes are rejected unless the trusted definition explicitly opts in. */
  allowsChildren?: boolean;
  validateProps?: (
    props: Readonly<Record<string, ScreenJsonValue>> | undefined,
  ) => readonly string[];
}

/** Explicit trusted code contribution. Persisted screen documents contain data only. */
export interface ScreenExtension {
  /** Unique trusted extension id; the Core namespace requires the Core package id. */
  id: string;
  /** Lowercase namespace that must prefix every declared node type. */
  namespace: string;
  /** Trusted schema definitions; persisted documents never supply executable definitions. */
  nodes: readonly ScreenNodeDefinition[];
}

/** Query-only lookup interface for registered screen-node schema definitions. */
export interface ScreenRegistry {
  getDefinition: (type: string) => ScreenNodeDefinition | undefined;
  getExtensionId: (namespace: string) => string | undefined;
  definitions: () => readonly ScreenNodeDefinition[];
}

/** Supported spacing tokens for the built-in stack and grid node types. */
export const screenLayoutGaps = [
  'none',
  '2xs',
  'xs',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
] as const;
/** A supported spacing token for the built-in stack and grid node types. */
export type ScreenLayoutGap = (typeof screenLayoutGaps)[number];

const stackDirections = ['column', 'row'] as const;
const stackAlignments = ['flex-start', 'center', 'flex-end', 'stretch'] as const;
/** Supported layout modes for the built-in grid node type. */
export const screenGridModes = ['responsive', 'fixed'] as const;
/** A supported layout mode for the built-in grid node type. */
export type ScreenGridMode = (typeof screenGridModes)[number];
/** Supported minimum child-width tokens for responsive built-in grids. */
export const screenGridMinimumWidths = ['sm', 'md', 'lg'] as const;
/** A supported minimum child-width token for responsive built-in grids. */
export type ScreenGridMinimumWidth = (typeof screenGridMinimumWidths)[number];

/** A path-addressed reason that a screen registry or document was rejected. */
export interface ScreenSchemaIssue {
  /** JSONPath-like location of the rejected value. */
  path: string;
  /** Stable category for programmatic handling. */
  code:
    | 'duplicate-extension'
    | 'duplicate-node-type'
    | 'invalid-extension'
    | 'duplicate-node-id'
    | 'invalid-document'
    | 'invalid-node'
    | 'invalid-props'
    | 'unknown-node'
    | 'unsupported-version'
    | 'resource-limit';
  /** Human-readable failure detail; do not use it as a stable programmatic identifier. */
  message: string;
}

/** The success or failure result returned while creating a screen schema registry. */
export type ScreenRegistryResult =
  | { ok: true; registry: ScreenRegistry }
  | { ok: false; issues: readonly ScreenSchemaIssue[] };

const MAX_NODES = 200;
const MAX_CHILDREN = 50;
const MAX_STRING_LENGTH = 4_000;
const MAX_JSON_DEPTH = 12;
const MAX_JSON_ENTRIES = 500;
const MAX_JSON_CHARACTERS = 100_000;
const forbiddenKeys = new Set(['__proto__', 'constructor', 'prototype']);
const screenDocumentKeys = new Set<PropertyKey>(['version', 'root']);
const screenNodeKeys = new Set<PropertyKey>(['id', 'type', 'version', 'props', 'children']);
const reservedNamespaces: Readonly<Record<string, string>> = {
  core: '@poffy-ui/core',
};

const isValidIdentifier = (value: string): boolean =>
  /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/.test(value);
const isNonEmptyString = (value: ScreenJsonValue | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const isOneOf = <T extends string>(
  value: ScreenJsonValue | undefined,
  values: readonly T[],
): value is T => typeof value === 'string' && values.includes(value as T);
const isPlainJsonRecord = (value: unknown): value is Readonly<Record<string, ScreenJsonValue>> =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;
const hasOnlyProps = (
  props: Readonly<Record<string, ScreenJsonValue>> | undefined,
  keys: readonly string[],
): boolean => (props === undefined ? true : Object.keys(props).every((key) => keys.includes(key)));
const unknownPropsIssue = (
  props: Readonly<Record<string, ScreenJsonValue>> | undefined,
  keys: string[],
) => (hasOnlyProps(props, keys) ? [] : ['Props contain unsupported keys.']);

/** Built-in Core node definitions for stacks, grids, sections, text, actions, and links. */
export const coreScreenExtension: ScreenExtension = {
  id: '@poffy-ui/core',
  namespace: 'core',
  nodes: [
    {
      type: 'core.stack',
      version: 1,
      allowsChildren: true,
      validateProps: (props) => {
        const { direction, gap, align } = props ?? {};
        const issues = unknownPropsIssue(props, ['direction', 'gap', 'align']);
        if (direction !== undefined && !isOneOf(direction, stackDirections))
          issues.push('direction must be column or row.');
        if (gap !== undefined && !isOneOf(gap, screenLayoutGaps))
          issues.push('gap must be a supported spacing token.');
        if (align !== undefined && !isOneOf(align, stackAlignments))
          issues.push('align must be a supported alignment.');
        return issues;
      },
    },
    {
      type: 'core.grid',
      version: 1,
      allowsChildren: true,
      validateProps: (props) => {
        const { columns, gap, mode, minChildWidth } = props ?? {};
        const issues = unknownPropsIssue(props, ['columns', 'gap', 'mode', 'minChildWidth']);
        if (
          columns !== undefined &&
          (typeof columns !== 'number' ||
            !Number.isSafeInteger(columns) ||
            columns < 1 ||
            columns > 12)
        )
          issues.push('columns must be a safe integer from 1 through 12.');
        if (mode !== undefined && !isOneOf(mode, screenGridModes))
          issues.push('mode must be responsive or fixed.');
        if (minChildWidth !== undefined && !isOneOf(minChildWidth, screenGridMinimumWidths))
          issues.push('minChildWidth must be a supported responsive width token.');
        if (mode === 'fixed' && columns === undefined)
          issues.push('columns is required when mode is fixed.');
        if (columns !== undefined && mode === 'responsive')
          issues.push('columns is supported only by fixed and legacy grids.');
        if (mode === 'fixed' && minChildWidth !== undefined)
          issues.push('minChildWidth is supported only for responsive grids.');
        if (gap !== undefined && !isOneOf(gap, screenLayoutGaps))
          issues.push('gap must be a supported spacing token.');
        return issues;
      },
    },
    {
      type: 'core.section',
      version: 1,
      allowsChildren: true,
      validateProps: (props) => {
        const { title } = props ?? {};
        return unknownPropsIssue(props, ['title']).concat(
          title === undefined || typeof title === 'string' ? [] : ['title must be a string.'],
        );
      },
    },
    {
      type: 'core.text',
      version: 1,
      validateProps: (props) => {
        const { text } = props ?? {};
        return unknownPropsIssue(props, ['text']).concat(
          typeof text === 'string' ? [] : ['text must be a string.'],
        );
      },
    },
    {
      type: 'core.action',
      version: 1,
      validateProps: (props) => {
        const { actionId, label } = props ?? {};
        return unknownPropsIssue(props, ['actionId', 'label']).concat(
          isNonEmptyString(actionId) && isNonEmptyString(label)
            ? []
            : ['actionId and label must be non-empty strings.'],
        );
      },
    },
    {
      type: 'core.link',
      version: 1,
      validateProps: (props) => {
        const { external, href, label } = props ?? {};
        return unknownPropsIssue(props, ['href', 'label', 'external']).concat(
          isNonEmptyString(label) ? [] : ['label must be a non-empty string.'],
          typeof href === 'string' && sanitizeNavigationUrl(href)
            ? []
            : ['href must be a safe navigation destination.'],
          external === undefined || typeof external === 'boolean'
            ? []
            : ['external must be a boolean.'],
        );
      },
    },
  ],
};

/**
 * Creates a query-only registry from trusted extension definitions.
 *
 * Omit `extensions` to register the built-in Core definitions. Supplying an array replaces that
 * default, including an intentional empty registry. Invalid namespaces, duplicate extension/node
 * ownership, or malformed definitions fail closed: the result contains issues and no registry for
 * document validation or rendering.
 */
export const createScreenRegistry = (
  extensions: readonly ScreenExtension[] = [coreScreenExtension],
): ScreenRegistryResult => {
  const definitions = new Map<string, ScreenNodeDefinition>();
  const extensionIds = new Set<string>();
  const namespaceOwners = new Map<string, string>();
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
      !/^[a-z][a-z0-9-]*$/.test(extension.namespace) ||
      !Array.isArray(extension.nodes) ||
      (reservedNamespaces[extension.namespace] !== undefined &&
        reservedNamespaces[extension.namespace] !== extension.id)
    ) {
      issues.push({
        path: '$.extensions',
        code: 'invalid-extension',
        message: 'Extension id and namespace are required.',
      });
      continue;
    }
    if (extensionIds.has(extension.id))
      issues.push({
        path: extension.id,
        code: 'duplicate-extension',
        message: 'Extension id is duplicated.',
      });
    extensionIds.add(extension.id);
    const namespaceOwner = namespaceOwners.get(extension.namespace);
    if (namespaceOwner && namespaceOwner !== extension.id) {
      issues.push({
        path: extension.namespace,
        code: 'invalid-extension',
        message: 'Each namespace must have exactly one extension owner.',
      });
    }
    namespaceOwners.set(extension.namespace, extension.id);
    for (const definition of extension.nodes) {
      if (
        !definition ||
        !isValidIdentifier(definition.type) ||
        !definition.type.startsWith(`${extension.namespace}.`) ||
        !Number.isSafeInteger(definition.version) ||
        definition.version < 1 ||
        (definition.allowsChildren !== undefined &&
          typeof definition.allowsChildren !== 'boolean') ||
        (definition.validateProps !== undefined && typeof definition.validateProps !== 'function')
      ) {
        issues.push({
          path: extension.id,
          code: 'invalid-extension',
          message: 'Node definition is invalid or outside its namespace.',
        });
      } else if (definitions.has(definition.type)) {
        issues.push({
          path: definition.type,
          code: 'duplicate-node-type',
          message: 'Node type is duplicated.',
        });
      } else definitions.set(definition.type, Object.freeze({ ...definition }));
    }
  }
  if (issues.length) return { ok: false, issues: Object.freeze(issues) };
  const values = Object.freeze([...definitions.values()]);
  return {
    ok: true,
    registry: Object.freeze({
      getDefinition: (type: string) => definitions.get(type),
      getExtensionId: (namespace: string) => namespaceOwners.get(namespace),
      definitions: () => values,
    }),
  };
};

const validateJson = (
  value: unknown,
  path: string,
  depth: number,
  issues: ScreenSchemaIssue[],
  budget: { entries: number; characters: number },
): value is ScreenJsonValue => {
  if (++budget.entries > MAX_JSON_ENTRIES) {
    issues.push({ path, code: 'resource-limit', message: 'JSON value has too many entries.' });
    return false;
  }
  if (depth > MAX_JSON_DEPTH) {
    issues.push({ path, code: 'resource-limit', message: 'JSON value is too deep.' });
    return false;
  }
  if (value === null || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string') {
    budget.characters += value.length;
    return value.length <= MAX_STRING_LENGTH && budget.characters <= MAX_JSON_CHARACTERS;
  }
  if (Array.isArray(value))
    return (
      value.length <= MAX_CHILDREN &&
      value.every((item, index) =>
        validateJson(item, `${path}[${index}]`, depth + 1, issues, budget),
      )
    );
  if (!value || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype)
    return false;
  const entries = Object.entries(value);
  if (entries.length > MAX_CHILDREN || entries.some(([key]) => forbiddenKeys.has(key)))
    return false;
  budget.characters += entries.reduce((total, [key]) => total + key.length, 0);
  if (budget.characters > MAX_JSON_CHARACTERS) return false;
  return entries.every(([key, item]) =>
    validateJson(item, `${path}.${key}`, depth + 1, issues, budget),
  );
};

/**
 * Validates untrusted screen data before rendering against a trusted registry.
 * Rejects non-JSON values, unsafe object shapes, unknown document or node fields, and resource-limit violations.
 * Returns an empty issue list only when the document is accepted. It does not coerce, repair, or
 * sanitize the source value; consumers must render only after checking the returned list.
 */
export const validateScreenDocument = (
  document: unknown,
  registry: ScreenRegistry,
): readonly ScreenSchemaIssue[] => {
  const issues: ScreenSchemaIssue[] = [];
  const ids = new Set<string>();
  const propsBudget = { entries: 0, characters: 0 };
  let nodeCount = 0;
  const visit = (node: unknown, path: string, depth: number): void => {
    if (++nodeCount > MAX_NODES || depth > 32) {
      issues.push({ path, code: 'resource-limit', message: 'Screen document exceeds limits.' });
      return;
    }
    if (
      !node ||
      typeof node !== 'object' ||
      Array.isArray(node) ||
      Object.getPrototypeOf(node) !== Object.prototype
    ) {
      issues.push({ path, code: 'invalid-node', message: 'Node must be a plain object.' });
      return;
    }
    if (Reflect.ownKeys(node).some((key) => !screenNodeKeys.has(key))) {
      issues.push({ path, code: 'invalid-node', message: 'Node contains unsupported fields.' });
      return;
    }
    const value = node as Partial<ScreenNode>;
    const version = value.version;
    if (
      typeof value.id !== 'string' ||
      !value.id ||
      value.id.length > 256 ||
      typeof value.type !== 'string' ||
      !isValidIdentifier(value.type) ||
      !Number.isSafeInteger(version) ||
      version === undefined ||
      version < 1
    ) {
      issues.push({
        path,
        code: 'invalid-node',
        message: 'Node requires bounded id, type, and positive version.',
      });
      return;
    }
    if (ids.has(value.id))
      issues.push({ path, code: 'duplicate-node-id', message: 'Node id is duplicated.' });
    ids.add(value.id);
    const definition = registry.getDefinition(value.type);
    if (!definition)
      issues.push({ path, code: 'unknown-node', message: 'Node type is not registered.' });
    else if (definition.version !== value.version)
      issues.push({ path, code: 'unsupported-version', message: 'Node version is unsupported.' });
    if (
      value.props !== undefined &&
      (!isPlainJsonRecord(value.props) ||
        !validateJson(value.props, `${path}.props`, 0, issues, propsBudget))
    )
      issues.push({
        path: `${path}.props`,
        code: 'invalid-props',
        message: 'Props must be bounded JSON data.',
      });
    else if (definition?.validateProps) {
      try {
        const validationIssues = definition.validateProps(value.props);
        if (
          !Array.isArray(validationIssues) ||
          validationIssues.some((message) => typeof message !== 'string')
        )
          issues.push({
            path: `${path}.props`,
            code: 'invalid-props',
            message: 'Node validator returned an invalid result.',
          });
        else
          for (const message of validationIssues)
            issues.push({ path: `${path}.props`, code: 'invalid-props', message });
      } catch {
        issues.push({
          path: `${path}.props`,
          code: 'invalid-props',
          message: 'Node validator rejected the props.',
        });
      }
    }
    if (value.children !== undefined) {
      if (!Array.isArray(value.children) || value.children.length > MAX_CHILDREN)
        issues.push({ path, code: 'resource-limit', message: 'Children exceed limits.' });
      else if (definition && !definition.allowsChildren)
        issues.push({ path, code: 'invalid-node', message: 'This node does not allow children.' });
      else
        value.children.forEach((child, index) =>
          visit(child, `${path}.children[${index}]`, depth + 1),
        );
    }
  };
  if (
    !document ||
    typeof document !== 'object' ||
    Object.getPrototypeOf(document) !== Object.prototype
  )
    return [
      { path: '$', code: 'unsupported-version', message: 'Screen document version must be 1.' },
    ];
  if (Reflect.ownKeys(document).some((key) => !screenDocumentKeys.has(key)))
    return [
      {
        path: '$',
        code: 'invalid-document',
        message: 'Screen document contains unsupported fields.',
      },
    ];
  if ((document as { version?: unknown }).version !== 1)
    return [
      { path: '$', code: 'unsupported-version', message: 'Screen document version must be 1.' },
    ];
  visit((document as { root?: unknown }).root, '$.root', 0);
  return Object.freeze(issues);
};

/**
 * Preserves a statically typed screen document without performing runtime validation or cloning.
 *
 * Use `validateScreenDocument` for any persisted, network, or otherwise untrusted value.
 */
export const defineScreen = <T extends ScreenDocument>(document: T): T => document;
