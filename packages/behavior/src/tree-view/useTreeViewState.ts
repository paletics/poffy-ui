'use client';

import { useCallback, useMemo } from 'react';
import { useControllableState } from '../hooks';
import type { UseTreeViewStateOptions, UseTreeViewStateReturn } from './tree-view.types';

/**
 * Owns TreeView expansion and selection independently from rendered DOM and focus.
 *
 * Expanded and selected IDs are controlled independently when their corresponding props are
 * present; accepted toggles still request their change callbacks in controlled mode. Selection
 * does not traverse tree data: pass descendant IDs to `toggleSelection` when the UI policy should
 * select or clear a node's descendants as well.
 */
export const useTreeViewState = ({
  defaultExpandedIds = [],
  defaultSelectedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedChange,
  onSelectedChange,
  selectedIds: controlledSelectedIds,
}: UseTreeViewStateOptions): UseTreeViewStateReturn => {
  const {
    value: expandedIdList,
    isControlled: isExpandedControlled,
    setValue: setExpandedIdList,
  } = useControllableState<readonly string[]>({
    value: controlledExpandedIds,
    defaultValue: [...defaultExpandedIds],
  });
  const {
    value: selectedIdList,
    isControlled: isSelectedControlled,
    setValue: setSelectedIdList,
  } = useControllableState<readonly string[]>({
    value: controlledSelectedIds,
    defaultValue: [...defaultSelectedIds],
  });
  const expandedIds = useMemo(() => new Set(expandedIdList), [expandedIdList]);
  const selectedIds = useMemo(() => new Set(selectedIdList), [selectedIdList]);

  const toggleNode = useCallback(
    (id: string) => {
      const next = new Set(expandedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      const nextIds = [...next];
      if (!isExpandedControlled) setExpandedIdList(nextIds);
      onExpandedChange?.([...nextIds]);
    },
    [expandedIds, isExpandedControlled, onExpandedChange, setExpandedIdList],
  );

  const toggleSelection = useCallback(
    (id: string, isSelected: boolean, childrenIds: readonly string[] = []) => {
      const next = new Set(selectedIds);
      for (const nextId of [id, ...childrenIds]) {
        if (isSelected) next.add(nextId);
        else next.delete(nextId);
      }
      const nextIds = [...next];
      if (!isSelectedControlled) setSelectedIdList(nextIds);
      onSelectedChange?.([...nextIds]);
    },
    [isSelectedControlled, onSelectedChange, selectedIds, setSelectedIdList],
  );

  return {
    expandedIds,
    isExpandedControlled,
    isSelectedControlled,
    selectedIds,
    toggleNode,
    toggleSelection,
  };
};
