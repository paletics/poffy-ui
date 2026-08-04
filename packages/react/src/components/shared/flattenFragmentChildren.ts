import { Fragment, cloneElement, isValidElement, type ReactNode } from 'react';

interface IterableCacheEntry {
  iterator: Iterator<ReactNode>;
  nodes: ReactNode[];
  singleUse: boolean;
}

const iterableCache = new WeakMap<object, IterableCacheEntry>();

export const isReactNodeIterable = (value: ReactNode): value is Iterable<ReactNode> =>
  typeof value !== 'string' &&
  typeof value === 'object' &&
  value !== null &&
  !isValidElement(value) &&
  typeof (value as { [Symbol.iterator]?: unknown })[Symbol.iterator] === 'function';

export const materializeReactNodeIterable = (
  collection: Iterable<ReactNode>,
): readonly ReactNode[] => {
  const collectionObject = collection as object;
  const iterator = collection[Symbol.iterator]();
  const cached = iterableCache.get(collectionObject);
  let firstResult: IteratorResult<ReactNode> | undefined;
  if (cached?.iterator === iterator) {
    firstResult = iterator.next();
    if (firstResult.done) {
      cached.singleUse = true;
      return cached.nodes;
    }
  }
  const isSingleUse = iterator === collectionObject;
  const nodes: ReactNode[] = firstResult?.done === false ? [firstResult.value] : [];
  let result = iterator.next();
  while (!result.done) {
    nodes.push(result.value);
    result = iterator.next();
  }

  iterableCache.set(collectionObject, { iterator, nodes, singleUse: isSingleUse });
  return nodes;
};

/**
 * Materializes every iterable children boundary while preserving element, key, and ref identity
 * whenever its descendants do not change.
 */
export const materializeReactNodeTree = (node: ReactNode): ReactNode => {
  if (Array.isArray(node)) {
    let changed = false;
    const materialized = node.map((child) => {
      const nextChild = materializeReactNodeTree(child);
      if (nextChild !== child) changed = true;
      return nextChild;
    });
    return changed ? materialized : node;
  }

  if (isReactNodeIterable(node)) {
    return materializeReactNodeIterable(node).map(materializeReactNodeTree);
  }

  if (!isValidElement<{ children?: ReactNode }>(node) || node.props.children === undefined) {
    return node;
  }

  const materializedChildren = materializeReactNodeTree(node.props.children);
  return materializedChildren === node.props.children
    ? node
    : cloneElement(node, undefined, materializedChildren);
};

const getFlattenedKey = (
  identity: string,
  ancestorScope: readonly string[],
  occurrence: number,
  collision: number,
) => `flattened:${JSON.stringify([identity, ancestorScope, occurrence, collision])}`;

/**
 * Flattens only transparent React Fragments while retaining all other child semantics.
 * Unkeyed Fragments are transparent, so adding or removing one does not remount a keyed child.
 * Keyed Fragments are explicit identity boundaries, so all nested leaves receive an
 * ancestor-scoped key even when their leaf key is globally unique. Occurrence suffixes are the
 * fallback for duplicate local identities. Direct keyed elements retain their original key.
 */
export const flattenFragmentChildren = (children: ReactNode): ReactNode[] => {
  const flattened: { child: ReactNode; isDirect: boolean; ancestorScope: string[] }[] = [];

  const visitChild = (child: ReactNode, isDirect: boolean, ancestorScope: string[]) => {
    if (child === null || child === undefined || typeof child === 'boolean') return;

    if (isReactNodeIterable(child)) {
      visitChildren(child, false, ancestorScope);
      return;
    }

    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      const fragmentScope =
        child.key === null ? ancestorScope : [...ancestorScope, `fragment:${String(child.key)}`];
      visitChildren(child.props.children, false, fragmentScope);
      return;
    }

    flattened.push({ child, isDirect, ancestorScope });
  };

  const visitChildren = (
    nodes: ReactNode | Iterable<ReactNode>,
    isDirect: boolean,
    ancestorScope: string[],
  ) => {
    if (isReactNodeIterable(nodes as ReactNode)) {
      for (const child of materializeReactNodeIterable(nodes as Iterable<ReactNode>)) {
        visitChild(child, isDirect, ancestorScope);
      }
      return;
    }

    visitChild(nodes as ReactNode, isDirect, ancestorScope);
  };

  visitChildren(children, true, []);

  const reservedKeys = new Set(
    flattened.flatMap(({ child }) =>
      isValidElement(child) && child.key !== null ? [String(child.key)] : [],
    ),
  );
  const keyCounts = new Map<string, number>();
  for (const { child } of flattened) {
    if (isValidElement(child) && child.key !== null) {
      const key = String(child.key);
      keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
    }
  }
  const assignedKeys = new Set<string>();
  const occurrences = new Map<string, number>();
  return flattened.map(({ child, isDirect, ancestorScope }) => {
    if (!isValidElement(child)) return child;

    if (isDirect && child.key !== null) {
      assignedKeys.add(String(child.key));
      return child;
    }
    if (
      child.key !== null &&
      ancestorScope.length === 0 &&
      keyCounts.get(String(child.key)) === 1
    ) {
      assignedKeys.add(String(child.key));
      return cloneElement(child, { key: child.key });
    }

    const identity = child.key === null ? 'unkeyed' : `key:${String(child.key)}`;
    const stableScope = ancestorScope.length > 0 ? ancestorScope : [];
    const occurrenceIdentity = JSON.stringify([identity, stableScope]);
    const occurrence = occurrences.get(occurrenceIdentity) ?? 0;
    occurrences.set(occurrenceIdentity, occurrence + 1);

    let collision = 0;
    let key = getFlattenedKey(identity, stableScope, occurrence, collision);
    while (reservedKeys.has(key) || assignedKeys.has(key)) {
      collision += 1;
      key = getFlattenedKey(identity, stableScope, occurrence, collision);
    }
    assignedKeys.add(key);
    return cloneElement(child, { key });
  });
};
