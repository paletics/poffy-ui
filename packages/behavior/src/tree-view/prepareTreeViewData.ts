/** Default traversal depth used to bound tree preparation. */
export const DEFAULT_MAX_TREE_VIEW_DATA_DEPTH = 100;

interface PendingTreeNode<TNode> {
  type: 'visit';
  node: TNode;
  depth: number;
  destination: TNode[];
}

interface ExitTreeNode<TNode> {
  type: 'exit';
  node: TNode;
}

type PendingTask<TNode> = PendingTreeNode<TNode> | ExitTreeNode<TNode>;

/** Finite render data and duplicate IDs removed while preparing a tree. */
export interface PreparedTreeViewData<TNode> {
  /** Finite cloned tree structure containing the accepted input branches. */
  data: TNode[];
  /** IDs removed because more than one reachable occurrence owned them. */
  duplicateIds: string[];
}

/**
 * Minimum recursive data shape accepted by tree preparation helpers.
 * Additional payload fields are retained on accepted cloned nodes.
 */
export interface TreeViewDataNode {
  /** Stable identity; any duplicate reachable id causes every occurrence to be omitted. */
  id: string;
  /** Optional descendant records. Payload fields beyond this minimal contract are retained. */
  children?: readonly TreeViewDataNode[];
}

const getReachableTreeIdCounts = <TNode extends TreeViewDataNode>(
  nodes: readonly TNode[],
  maxDepth: number,
): Map<string, number> => {
  const counts = new Map<string, number>();
  const tasks: (Omit<PendingTreeNode<TNode>, 'destination'> | ExitTreeNode<TNode>)[] = nodes
    .slice()
    .reverse()
    .map((node) => ({ type: 'visit', node, depth: 1 }));
  const activeAncestors = new Set<TNode>();

  while (tasks.length > 0) {
    const current = tasks.pop();
    if (!current) continue;
    if (current.type === 'exit') {
      activeAncestors.delete(current.node);
      continue;
    }
    if (current.depth > maxDepth || activeAncestors.has(current.node)) continue;

    counts.set(current.node.id, (counts.get(current.node.id) ?? 0) + 1);
    activeAncestors.add(current.node);
    tasks.push({ type: 'exit', node: current.node });
    if (current.depth === maxDepth || !Array.isArray(current.node.children)) continue;
    const children = current.node.children as readonly TNode[];
    for (let index = children.length - 1; index >= 0; index -= 1) {
      tasks.push({
        type: 'visit',
        node: children[index],
        depth: current.depth + 1,
      });
    }
  }

  return counts;
};

/**
 * Produces a finite, immutable tree for TreeView renderers.
 *
 * Cyclic branches and descendants beyond `maxDepth` are omitted. Every occurrence
 * of a duplicated id is omitted so identity never depends on input order. Pass `Infinity` to opt
 * into unbounded-depth processing for data that is already trusted to be finite.
 *
 * @param nodes Source roots. Accepted nodes and child arrays are cloned without mutating input.
 * @param maxDepth Maximum root-inclusive depth; defaults to {@link DEFAULT_MAX_TREE_VIEW_DATA_DEPTH}.
 */
export const prepareTreeViewDataWithMetadata = <TNode extends TreeViewDataNode>(
  nodes: readonly TNode[],
  maxDepth: number = DEFAULT_MAX_TREE_VIEW_DATA_DEPTH,
): PreparedTreeViewData<TNode> => {
  const prepared: TNode[] = [];
  const idCounts = getReachableTreeIdCounts(nodes, maxDepth);
  const duplicateIds = [...idCounts].flatMap(([id, count]) => (count > 1 ? [id] : []));
  const duplicateIdSet = new Set(duplicateIds);
  const pending: PendingTask<TNode>[] = nodes
    .slice()
    .reverse()
    .map((node) => ({ type: 'visit', node, depth: 1, destination: prepared }));
  const activeAncestors = new Set<TNode>();
  const seenIds = new Set<string>();

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;
    if (current.type === 'exit') {
      activeAncestors.delete(current.node);
      continue;
    }
    if (
      current.depth > maxDepth ||
      activeAncestors.has(current.node) ||
      seenIds.has(current.node.id) ||
      duplicateIdSet.has(current.node.id)
    ) {
      continue;
    }

    activeAncestors.add(current.node);
    seenIds.add(current.node.id);
    const { children, ...nodeWithoutChildren } = current.node;
    const childNodes = (Array.isArray(children) ? children : []) as TNode[];
    const nextNode = { ...nodeWithoutChildren } as TNode;
    current.destination.push(nextNode);

    pending.push({ type: 'exit', node: current.node });
    if (childNodes.length === 0 || current.depth === maxDepth) continue;

    const nextChildren: TNode[] = [];
    (nextNode as TreeViewDataNode).children = nextChildren;
    for (let index = childNodes.length - 1; index >= 0; index -= 1) {
      pending.push({
        type: 'visit',
        node: childNodes[index],
        depth: current.depth + 1,
        destination: nextChildren,
      });
    }
  }

  return { data: prepared, duplicateIds };
};

/**
 * Returns only the finite tree produced by `prepareTreeViewDataWithMetadata`.
 *
 * @param nodes Source roots to clone and validate.
 * @param maxDepth Maximum root-inclusive depth; `Infinity` opts into unbounded processing.
 */
export const prepareTreeViewData = <TNode extends TreeViewDataNode>(
  nodes: readonly TNode[],
  maxDepth: number = DEFAULT_MAX_TREE_VIEW_DATA_DEPTH,
): TNode[] => prepareTreeViewDataWithMetadata(nodes, maxDepth).data;
