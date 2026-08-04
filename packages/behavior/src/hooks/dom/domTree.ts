/**
 * A DOM tree scope that supports scoped ID lookup and active-element access.
 *
 * Shadow roots are retained instead of being collapsed to their owner document so callers do not
 * accidentally cross a component boundary when resolving ARIA relationships or focus.
 */
export type DOMTreeRoot = Document | ShadowRoot;

const isDOMTreeRoot = (node: Node): node is DOMTreeRoot => {
  if (node.nodeType === 9) return true;
  return node.nodeType === 11 && 'host' in node;
};

/** Returns the Document or ShadowRoot tree scope that owns a node. */
export const getDOMTreeRoot = (node: Node): DOMTreeRoot => {
  const root = node.getRootNode();
  if (isDOMTreeRoot(root)) return root;
  return node.ownerDocument ?? (node as Document);
};

/** Finds an ID in the node's own Document or ShadowRoot tree scope. */
export const getTreeElementById = <T extends Element = HTMLElement>(
  node: Node,
  id: string,
): T | null => getDOMTreeRoot(node).getElementById(id) as T | null;

/** Resolves focus through nested open shadow roots. */
export const getDeepActiveElement = (root: DOMTreeRoot): Element | null => {
  let activeElement = root.activeElement;
  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }
  return activeElement;
};
