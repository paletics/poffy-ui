import type { GetTreeViewKeyboardIntentOptions, TreeViewKeyboardIntent } from './tree-view.types';

/** Resolves a tree-item key into a framework-neutral navigation or activation intent. */
export const getTreeViewKeyboardIntent = ({
  hasChildren,
  isExpanded,
  isRtl,
  isSelectable,
  key,
}: GetTreeViewKeyboardIntentOptions): TreeViewKeyboardIntent | undefined => {
  if (key === 'ArrowDown') return 'next';
  if (key === 'ArrowUp') return 'previous';
  if (key === 'Home') return 'first';
  if (key === 'End') return 'last';

  const forwardKey = isRtl ? 'ArrowLeft' : 'ArrowRight';
  const backwardKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
  if (key === forwardKey) {
    if (!hasChildren) return undefined;
    return isExpanded ? 'child' : 'expand';
  }
  if (key === backwardKey) {
    if (hasChildren && isExpanded) return 'collapse';
    return 'parent';
  }
  if (key === 'Enter' && hasChildren) return 'toggle';
  if (key === ' ') return isSelectable ? 'select' : hasChildren ? 'toggle' : undefined;
  return undefined;
};
