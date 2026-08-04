'use client';

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useTreeViewState } from '@poffy-ui/behavior/tree-view';
import { cx } from '@/styled-system/css';
import type { TreeViewRootProps } from './TreeView.types';
import { TreeViewProvider } from './TreeViewContext';
import { treeView } from '@/styled-system/recipes';
import { getFallbackChildrenForNativeContainer, isAsChildHost } from '@/components/shared/asChild';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';
import { useOptionalDirection } from '@/providers/DirectionProvider';
import { getKnownAmbiguousTreeItemIds } from './TreeViewStaticTopology';
import { useTreeViewItemRegistry } from './useTreeViewItemRegistry';

const treeRootAsChildHosts = new Set(['ul']);

const normalizeAriaText = (value: unknown) =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

/**
 * Owns expanded, selected, and roving-focus state for descendant tree items.
 *
 * It renders a labelled `ul[role="tree"]`, adding `aria-multiselectable` when
 * checkbox selection is present. Controlled expanded/selected props require
 * their change callback; an unpaired value becomes uncontrolled initial state
 * and warns in development. `asChild` accepts only `ul`. Duplicate item IDs
 * are treated as ambiguous and disabled rather than selecting unpredictably.
 */
export const TreeViewRoot = forwardRef<HTMLUListElement, TreeViewRootProps>((rawProps, ref) => {
  const {
    children,
    className,
    appearance,
    defaultExpandedIds = [],
    expandedIds: controlledExpandedIds,
    onExpandedChange,
    defaultSelectedIds = [],
    selectedIds: controlledSelectedIds,
    onSelectedChange,
    asChild,
    dir,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-multiselectable': _ariaMultiselectable,
    role: _role,
    ...props
  } = rawProps as TreeViewRootProps & {
    'aria-multiselectable'?: unknown;
    role?: unknown;
  };
  const { variant: _unsupportedVariant, ...safeProps } = props as typeof props & {
    variant?: unknown;
  };
  const materializedChildren = materializeReactNodeTree(children);
  const asChildElement =
    asChild && isAsChildHost(materializedChildren, treeRootAsChildHosts)
      ? materializedChildren
      : null;
  const canUseAsChild = asChildElement !== null;
  const childProps = (asChildElement?.props ?? {}) as {
    'aria-label'?: unknown;
    'aria-labelledby'?: unknown;
    dir?: unknown;
  };
  const providerDirection = useOptionalDirection()?.dir;
  const childDirection =
    typeof childProps.dir === 'string' && childProps.dir.trim() !== ''
      ? childProps.dir.trim()
      : undefined;
  const resolvedDirection = dir ?? childDirection ?? providerDirection;
  const resolvedOnExpandedChange =
    typeof onExpandedChange === 'function' ? onExpandedChange : undefined;
  const hasControlledExpandedPair =
    controlledExpandedIds !== undefined && resolvedOnExpandedChange !== undefined;
  const controlledExpandedIdList = useMemo(
    () =>
      hasControlledExpandedPair && controlledExpandedIds !== undefined
        ? [...controlledExpandedIds]
        : undefined,
    [controlledExpandedIds, hasControlledExpandedPair],
  );

  useEffect(() => {
    if (controlledExpandedIds === undefined || hasControlledExpandedPair) return;
    const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
    if (nodeEnv === 'production') return;
    console.warn(
      '[TreeView] `expandedIds` without `onExpandedChange` falls back to uncontrolled initial state.',
    );
  }, [controlledExpandedIds, hasControlledExpandedPair]);

  const ambiguousItemIdCandidate = getKnownAmbiguousTreeItemIds(materializedChildren);
  const ambiguousItemIdsKey = JSON.stringify([...ambiguousItemIdCandidate].sort());
  const ambiguousItemIds = useMemo<ReadonlySet<string>>(
    () => new Set(JSON.parse(ambiguousItemIdsKey) as string[]),
    [ambiguousItemIdsKey],
  );
  const {
    activeItem,
    ambiguousItemInstanceIds,
    registerActiveItem,
    setActiveItem,
    unregisterActiveItem,
  } = useTreeViewItemRegistry(ambiguousItemIds);
  const resolvedOnSelectedChange =
    typeof onSelectedChange === 'function' ? onSelectedChange : undefined;
  const hasControlledSelectedPair =
    controlledSelectedIds !== undefined && resolvedOnSelectedChange !== undefined;
  const controlledSelectedIdList = useMemo(
    () =>
      hasControlledSelectedPair && controlledSelectedIds !== undefined
        ? [...controlledSelectedIds]
        : undefined,
    [controlledSelectedIds, hasControlledSelectedPair],
  );
  const { expandedIds, selectedIds, toggleNode, toggleSelection } = useTreeViewState({
    expandedIds: controlledExpandedIdList,
    defaultExpandedIds:
      !hasControlledExpandedPair && controlledExpandedIds !== undefined
        ? controlledExpandedIds
        : defaultExpandedIds,
    onExpandedChange: resolvedOnExpandedChange,
    selectedIds: controlledSelectedIdList,
    defaultSelectedIds:
      !hasControlledSelectedPair && controlledSelectedIds !== undefined
        ? controlledSelectedIds
        : defaultSelectedIds,
    onSelectedChange: resolvedOnSelectedChange,
  });
  const [checkboxItemCount, setCheckboxItemCount] = useState(0);
  const registerCheckboxItem = useCallback(() => {
    setCheckboxItemCount((count) => count + 1);
    return () => setCheckboxItemCount((count) => Math.max(0, count - 1));
  }, []);

  useEffect(() => {
    if (controlledSelectedIds === undefined || hasControlledSelectedPair) return;
    const nodeEnv = (globalThis as RuntimeEnv).process?.env?.NODE_ENV;
    if (nodeEnv === 'production') return;
    console.warn(
      '[TreeView] `selectedIds` without `onSelectedChange` falls back to uncontrolled initial state.',
    );
  }, [controlledSelectedIds, hasControlledSelectedPair]);

  const classes = useMemo(() => treeView({ appearance }), [appearance]);

  /* eslint-disable react-hooks/preserve-manual-memoization --
   * Stable context identity is a tested TreeView contract. The behavior hook returns
   * memoized sets and callbacks, but the compiler cannot prove their stability here. */
  const contextValue = useMemo(
    () => ({
      expandedIds,
      toggleNode,
      selectedIds,
      toggleSelection,
      classes,
      activeId: activeItem?.id ?? null,
      activeInstanceId: activeItem?.instanceId ?? null,
      ambiguousItemInstanceIds,
      ambiguousItemIds,
      setActiveItem,
      registerActiveItem,
      unregisterActiveItem,
      registerCheckboxItem,
      hasCheckboxSelection: checkboxItemCount > 0,
      direction: resolvedDirection,
    }),
    [
      expandedIds,
      toggleNode,
      selectedIds,
      toggleSelection,
      classes,
      activeItem,
      ambiguousItemInstanceIds,
      ambiguousItemIds,
      setActiveItem,
      registerActiveItem,
      unregisterActiveItem,
      registerCheckboxItem,
      checkboxItemCount,
      resolvedDirection,
    ],
  );
  /* eslint-enable react-hooks/preserve-manual-memoization */

  const Component = canUseAsChild ? Slot : 'ul';
  const wrapperAriaLabel = normalizeAriaText(ariaLabel);
  const wrapperAriaLabelledBy = normalizeAriaText(ariaLabelledBy);
  const childAriaLabel = normalizeAriaText(childProps['aria-label']);
  const childAriaLabelledBy = normalizeAriaText(childProps['aria-labelledby']);
  const resolvedAriaLabelledBy =
    wrapperAriaLabelledBy ?? (wrapperAriaLabel === undefined ? childAriaLabelledBy : undefined);
  const resolvedAriaLabel =
    resolvedAriaLabelledBy === undefined
      ? (wrapperAriaLabel ?? childAriaLabel ?? (canUseAsChild ? undefined : 'Tree view'))
      : undefined;
  const renderedChildren =
    canUseAsChild && isValidElement<Record<string, unknown>>(materializedChildren)
      ? cloneElement(materializedChildren, {
          dir: resolvedDirection,
          role: 'tree',
          'aria-label': resolvedAriaLabel,
          'aria-labelledby': resolvedAriaLabelledBy,
          'aria-multiselectable': checkboxItemCount > 0 ? true : undefined,
        })
      : asChild && !canUseAsChild
        ? getFallbackChildrenForNativeContainer(materializedChildren)
        : materializedChildren;

  return (
    <TreeViewProvider value={contextValue}>
      <Component
        ref={ref}
        className={cx(classes.root, className)}
        {...safeProps}
        dir={resolvedDirection}
        role="tree"
        aria-label={resolvedAriaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-multiselectable={checkboxItemCount > 0 ? true : undefined}
      >
        {renderedChildren}
      </Component>
    </TreeViewProvider>
  );
});
TreeViewRoot.displayName = 'TreeViewRoot';
