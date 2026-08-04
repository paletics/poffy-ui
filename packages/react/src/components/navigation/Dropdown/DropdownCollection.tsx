'use client';

import type { DropdownCollectionItem } from '@poffy-ui/behavior/dropdown';
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface CollectionRecord extends Omit<DropdownCollectionItem, 'label'> {
  id: string;
  order: number;
  textValue?: string;
}

interface CollectionSnapshotRecord extends DropdownCollectionItem {
  id: string;
}

interface RootObserver {
  observer: MutationObserver;
  target: Node;
}

interface DropdownCollectionContextValue {
  indexById: Map<string, number>;
  register: (id: string, element: HTMLElement) => () => void;
  update: (id: string, disabled: boolean, textValue?: string) => void;
}

const DropdownCollectionContext = createContext<DropdownCollectionContextValue | null>(null);

const DOCUMENT_POSITION_PRECEDING = 2;
const DOCUMENT_POSITION_FOLLOWING = 4;

const hasSameIndexes = (left: Map<string, number>, right: Map<string, number>) =>
  left.size === right.size && [...left].every(([id, index]) => right.get(id) === index);

const normalizeLabel = (value: string | null | undefined) => {
  const normalized = value?.trim();
  if (!normalized) return null;
  return normalized;
};

const sortByDomPosition = (left: CollectionRecord, right: CollectionRecord) => {
  if (left.element.getRootNode() !== right.element.getRootNode()) {
    return left.order - right.order;
  }
  const position = left.element.compareDocumentPosition(right.element);
  if (position & DOCUMENT_POSITION_FOLLOWING) return -1;
  if (position & DOCUMENT_POSITION_PRECEDING) return 1;
  return left.order - right.order;
};

const hasSameSnapshot = (
  left: CollectionSnapshotRecord[] | null,
  right: CollectionSnapshotRecord[],
) =>
  left?.length === right.length &&
  right.every((record, index) => {
    const current = left[index];
    return (
      current?.id === record.id &&
      current.element === record.element &&
      current.disabled === record.disabled &&
      current.label === record.label
    );
  });

const findObservationTarget = (records: CollectionRecord[], treeRoot: Node) => {
  let candidate: Node | null = records[0]?.element.parentNode ?? treeRoot;
  while (
    candidate &&
    !records.every((record) => candidate === record.element || candidate?.contains(record.element))
  ) {
    candidate = candidate.parentNode;
  }
  return candidate ?? treeRoot;
};

export const DropdownCollectionProvider = ({
  children,
  reconcileItems,
}: {
  children: ReactNode;
  reconcileItems: (items: DropdownCollectionItem[]) => void;
}) => {
  const recordsRef = useRef(new Map<string, CollectionRecord>());
  const nextOrderRef = useRef(0);
  const rootObserversRef = useRef(new Map<Node, RootObserver>());
  const reconcileItemsRef = useRef(reconcileItems);
  const lastSnapshotRef = useRef<CollectionSnapshotRecord[] | null>(null);
  const forcePublishRef = useRef(false);
  const activeRef = useRef(false);
  const generationRef = useRef(0);
  const queuedGenerationRef = useRef<number | null>(null);
  const flushRef = useRef<() => void>(() => undefined);
  const [indexById, setIndexById] = useState(new Map<string, number>());

  const markDirty = useCallback(() => {
    if (!activeRef.current) return;
    const generation = generationRef.current;
    if (queuedGenerationRef.current === generation) return;
    queuedGenerationRef.current = generation;
    queueMicrotask(() => {
      if (
        !activeRef.current ||
        generationRef.current !== generation ||
        queuedGenerationRef.current !== generation
      ) {
        return;
      }
      queuedGenerationRef.current = null;
      flushRef.current();
    });
  }, []);

  flushRef.current = () => {
    if (!activeRef.current) return;
    const ordered = [...recordsRef.current.values()]
      .filter((record) => record.element.isConnected)
      .sort(sortByDomPosition);

    const recordsByRoot = new Map<Node, CollectionRecord[]>();
    ordered.forEach((record) => {
      const treeRoot = record.element.getRootNode();
      const rootRecords = recordsByRoot.get(treeRoot) ?? [];
      rootRecords.push(record);
      recordsByRoot.set(treeRoot, rootRecords);
    });

    rootObserversRef.current.forEach(({ observer }, treeRoot) => {
      if (recordsByRoot.has(treeRoot)) return;
      observer.disconnect();
      rootObserversRef.current.delete(treeRoot);
    });
    recordsByRoot.forEach((rootRecords, treeRoot) => {
      const target = findObservationTarget(rootRecords, treeRoot);
      const current = rootObserversRef.current.get(treeRoot);
      if (current?.target === target) return;
      current?.observer.disconnect();
      const MutationObserverConstructor =
        rootRecords[0]?.element.ownerDocument.defaultView?.MutationObserver;
      if (!MutationObserverConstructor) return;
      const observer = new MutationObserverConstructor(markDirty);
      observer.observe(target, { characterData: true, childList: true, subtree: true });
      rootObserversRef.current.set(treeRoot, { observer, target });
    });

    const nextSnapshot = ordered.map(({ id, element, disabled, textValue }) => ({
      id,
      element,
      disabled,
      label: disabled
        ? null
        : textValue === undefined
          ? normalizeLabel(element.textContent)
          : normalizeLabel(textValue),
    }));
    const snapshotChanged = !hasSameSnapshot(lastSnapshotRef.current, nextSnapshot);
    const shouldPublish = snapshotChanged || forcePublishRef.current;
    forcePublishRef.current = false;
    if (!shouldPublish) return;

    lastSnapshotRef.current = nextSnapshot;
    reconcileItemsRef.current(
      nextSnapshot.map(({ element, disabled, label }) => ({ element, disabled, label })),
    );
    const nextIndexes = new Map(nextSnapshot.map((record, index) => [record.id, index]));
    setIndexById((current) => (hasSameIndexes(current, nextIndexes) ? current : nextIndexes));
  };

  useLayoutEffect(() => {
    reconcileItemsRef.current = reconcileItems;
    forcePublishRef.current = true;
    markDirty();
  }, [markDirty, reconcileItems]);

  useLayoutEffect(() => {
    activeRef.current = true;
    generationRef.current += 1;
    markDirty();

    return () => {
      activeRef.current = false;
      generationRef.current += 1;
      queuedGenerationRef.current = null;
      rootObserversRef.current.forEach(({ observer }) => observer.disconnect());
      rootObserversRef.current.clear();
      recordsRef.current.clear();
      lastSnapshotRef.current = null;
    };
  }, [markDirty]);

  const register = useCallback(
    (id: string, element: HTMLElement) => {
      const existing = recordsRef.current.get(id);
      recordsRef.current.set(id, {
        id,
        element,
        disabled: element.getAttribute('aria-disabled') === 'true',
        order: existing?.order ?? nextOrderRef.current++,
      });
      markDirty();

      return () => {
        if (recordsRef.current.get(id)?.element !== element) return;
        recordsRef.current.delete(id);
        markDirty();
      };
    },
    [markDirty],
  );

  const update = useCallback(
    (id: string, disabled: boolean, textValue?: string) => {
      const current = recordsRef.current.get(id);
      if (!current || (current.disabled === disabled && current.textValue === textValue)) return;
      recordsRef.current.set(id, { ...current, disabled, textValue });
      markDirty();
    },
    [markDirty],
  );

  const value = useMemo(() => ({ indexById, register, update }), [indexById, register, update]);

  return (
    <DropdownCollectionContext.Provider value={value}>
      {children}
    </DropdownCollectionContext.Provider>
  );
};

export const useDropdownCollectionItem = ({
  id,
  node,
  disabled,
  textValue,
}: {
  id: string;
  node: HTMLElement | null;
  disabled: boolean;
  textValue?: string;
}) => {
  const context = useContext(DropdownCollectionContext);
  if (!context) throw new Error('DropdownItem must be used within DropdownMenu.');
  const { indexById, register, update } = context;

  useLayoutEffect(() => {
    if (!node) return;
    return register(id, node);
  }, [id, node, register]);

  useLayoutEffect(() => {
    if (!node) return;
    update(id, disabled, textValue);
  }, [disabled, id, node, textValue, update]);

  return indexById.get(id) ?? -1;
};
