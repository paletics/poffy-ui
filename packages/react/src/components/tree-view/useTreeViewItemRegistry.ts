'use client';

import { useCallback, useRef, useState } from 'react';
import {
  getDeepActiveElement,
  getDOMTreeRoot,
  type DOMTreeRoot,
} from '@poffy-ui/behavior/hooks';

interface RegisteredTreeItem {
  id: string;
  instanceId: string;
  isFocusable: boolean;
  node: HTMLLIElement;
}

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

const isStructurallyVisible = (item: RegisteredTreeItem) =>
  item.isFocusable &&
  item.node.isConnected &&
  !item.node.closest('[data-state="closed"], [hidden], [aria-hidden="true"], [inert]');

const getAmbiguousInstanceIds = (items: readonly RegisteredTreeItem[]) => {
  const idCounts = new Map<string, number>();
  for (const item of items) idCounts.set(item.id, (idCounts.get(item.id) ?? 0) + 1);
  return new Set(
    items.flatMap((item) => ((idCounts.get(item.id) ?? 0) > 1 ? [item.instanceId] : [])),
  );
};

const areSetsEqual = (first: ReadonlySet<string>, second: ReadonlySet<string>) =>
  first.size === second.size && [...first].every((value) => second.has(value));

const canRestoreFocus = (source: Element, treeRoot: DOMTreeRoot) => {
  const activeElement = getDeepActiveElement(treeRoot);
  if (activeElement === source || (activeElement !== null && source.contains(activeElement)))
    return true;
  if (source.isConnected) return false;

  const ownerDocument = source.ownerDocument;
  if (!('host' in treeRoot)) return activeElement === ownerDocument.body;
  if (activeElement !== null) return false;
  const documentActiveElement = getDeepActiveElement(ownerDocument);
  return (
    documentActiveElement === null ||
    documentActiveElement === treeRoot.host ||
    documentActiveElement === ownerDocument.body
  );
};

const scheduleFocusRestoration = (
  source: RegisteredTreeItem,
  destination: RegisteredTreeItem | undefined,
) => {
  const focusRoot = getDOMTreeRoot(source.node);
  if (!source.node.contains(getDeepActiveElement(focusRoot))) return;
  const tree = source.node.closest<HTMLElement>('[role="tree"]');

  queueMicrotask(() => {
    if (!canRestoreFocus(source.node, focusRoot)) return;
    if (destination) return destination.node.focus();
    if (!tree) return;
    const previousTabIndex = tree.getAttribute('tabindex');
    tree.tabIndex = -1;
    tree.focus();
    if (previousTabIndex === null) tree.removeAttribute('tabindex');
    else tree.setAttribute('tabindex', previousTabIndex);
  });
};

export const useTreeViewItemRegistry = (knownAmbiguousIds: ReadonlySet<string>) => {
  const [activeItem, setActiveItemState] = useState<RegisteredTreeItem | null>(null);
  const [ambiguousInstanceIds, setAmbiguousInstanceIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const itemsRef = useRef<RegisteredTreeItem[]>([]);
  const warnedIdsRef = useRef(new Set<string>());

  const registerActiveItem = useCallback(
    (instanceId: string, id: string, node: HTMLLIElement, isFocusable: boolean) => {
      const currentItems = itemsRef.current;
      const existingIndex = currentItems.findIndex((item) => item.instanceId === instanceId);
      const item = { id, instanceId, isFocusable, node };
      const nextItems =
        existingIndex === -1
          ? [...currentItems, item]
          : currentItems.map((current, index) => (index === existingIndex ? item : current));
      const nextAmbiguousIds = getAmbiguousInstanceIds(nextItems);
      const isAmbiguous = (candidate: RegisteredTreeItem) =>
        knownAmbiguousIds.has(candidate.id) || nextAmbiguousIds.has(candidate.instanceId);
      const focusedAmbiguousItem = nextItems.find(
        (candidate) =>
          isAmbiguous(candidate) &&
          candidate.node.contains(getDeepActiveElement(getDOMTreeRoot(candidate.node))),
      );
      if (focusedAmbiguousItem) {
        const focusedIndex = nextItems.indexOf(focusedAmbiguousItem);
        const destination = [
          ...nextItems.slice(focusedIndex + 1),
          ...nextItems.slice(0, focusedIndex),
        ].find((candidate) => !isAmbiguous(candidate) && isStructurallyVisible(candidate));
        scheduleFocusRestoration(focusedAmbiguousItem, destination);
      }
      itemsRef.current = nextItems;
      setAmbiguousInstanceIds((current) =>
        areSetsEqual(current, nextAmbiguousIds) ? current : nextAmbiguousIds,
      );

      if (
        nextItems.some((current) => current.instanceId !== instanceId && current.id === id) &&
        !warnedIdsRef.current.has(id)
      ) {
        warnedIdsRef.current.add(id);
        if ((globalThis as RuntimeEnv).process?.env?.NODE_ENV !== 'production') {
          console.warn(
            `[TreeView] Item ids must be unique within a TreeView root. Duplicate id "${id}" is ambiguous, so every instance was disabled until the id becomes unique.`,
          );
        }
      }

      setActiveItemState((current) => {
        const currentItem = current
          ? nextItems.find((candidate) => candidate.instanceId === current.instanceId)
          : undefined;
        if (currentItem && !isAmbiguous(currentItem) && isStructurallyVisible(currentItem))
          return currentItem;
        return (
          nextItems.find(
            (candidate) => !isAmbiguous(candidate) && isStructurallyVisible(candidate),
          ) ?? null
        );
      });
    },
    [knownAmbiguousIds],
  );

  const unregisterActiveItem = useCallback(
    (instanceId: string) => {
      const currentItems = itemsRef.current;
      const removedIndex = currentItems.findIndex((item) => item.instanceId === instanceId);
      if (removedIndex === -1) return;
      const nextItems = currentItems.filter((item) => item.instanceId !== instanceId);
      const nextAmbiguousIds = getAmbiguousInstanceIds(nextItems);
      const isAmbiguous = (candidate: RegisteredTreeItem) =>
        knownAmbiguousIds.has(candidate.id) || nextAmbiguousIds.has(candidate.instanceId);
      const nextItem = [
        ...nextItems.slice(removedIndex),
        ...nextItems.slice(0, removedIndex).reverse(),
      ].find((candidate) => !isAmbiguous(candidate) && isStructurallyVisible(candidate));
      scheduleFocusRestoration(currentItems[removedIndex], nextItem);
      itemsRef.current = nextItems;
      setAmbiguousInstanceIds((current) =>
        areSetsEqual(current, nextAmbiguousIds) ? current : nextAmbiguousIds,
      );
      setActiveItemState((current) => {
        if (current?.instanceId !== instanceId) {
          if (
            current &&
            !isAmbiguous(current) &&
            nextItems.some((item) => item.instanceId === current.instanceId)
          )
            return current;
        }
        return nextItem ?? null;
      });
    },
    [knownAmbiguousIds],
  );

  const setActiveItem = useCallback(
    (instanceId: string, id: string) => {
      if (knownAmbiguousIds.has(id) || ambiguousInstanceIds.has(instanceId)) return;
      setActiveItemState(
        itemsRef.current.find(
          (item) => item.instanceId === instanceId && item.id === id,
        ) ?? null,
      );
    },
    [ambiguousInstanceIds, knownAmbiguousIds],
  );

  return {
    activeItem,
    ambiguousItemInstanceIds: ambiguousInstanceIds,
    registerActiveItem,
    setActiveItem,
    unregisterActiveItem,
  };
};
