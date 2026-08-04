'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type RefCallback,
} from 'react';
import {
  subscribeToFormAssociatedEvent,
  subscribeToFormReset,
  type FormAssociatedElement,
  type FormAssociatedEventType,
} from '@poffy-ui/behavior/hooks';

interface FormParticipationSnapshot {
  associatedForm: HTMLFormElement | null;
  effectivelyDisabled: boolean;
  treeRoot: Node | null;
}

interface FormParticipationStore {
  listeners: Map<FormControlBridgeElement, Set<() => void>>;
  observer: MutationObserver;
  selectorListeners: Set<() => void>;
}

type FormControlBridgeElement = HTMLFieldSetElement | HTMLInputElement | HTMLSelectElement;

const stores = new WeakMap<Node, FormParticipationStore>();
const emptySnapshot: FormParticipationSnapshot = {
  associatedForm: null,
  effectivelyDisabled: false,
  treeRoot: null,
};
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const readSnapshot = (anchor: FormControlBridgeElement | null): FormParticipationSnapshot => {
  if (!anchor) return emptySnapshot;
  return {
    associatedForm: anchor.form,
    effectivelyDisabled: anchor.matches(':disabled'),
    treeRoot: anchor.getRootNode(),
  };
};

const getOrCreateStore = (anchor: FormControlBridgeElement) => {
  const treeRoot = anchor.getRootNode();
  const MutationObserverConstructor = anchor.ownerDocument.defaultView?.MutationObserver;
  if (!MutationObserverConstructor) return undefined;

  let store = stores.get(treeRoot);
  if (!store) {
    const listeners = new Map<FormControlBridgeElement, Set<() => void>>();
    const selectorListeners = new Set<() => void>();
    const observer = new MutationObserverConstructor(() => {
      listeners.forEach((anchorListeners) => {
        anchorListeners.forEach((anchorListener) => anchorListener());
      });
      selectorListeners.forEach((selectorListener) => selectorListener());
    });
    observer.observe(treeRoot, {
      attributeFilter: ['disabled', 'form', 'id'],
      attributes: true,
      childList: true,
      subtree: true,
    });
    store = { listeners, observer, selectorListeners };
    stores.set(treeRoot, store);
  }
  return { store, treeRoot };
};

const disconnectEmptyStore = (treeRoot: Node, store: FormParticipationStore) => {
  if (store.listeners.size > 0 || store.selectorListeners.size > 0) return;
  store.observer.disconnect();
  stores.delete(treeRoot);
};

const subscribeToTree = (anchor: FormControlBridgeElement, listener: () => void) => {
  const participationStore = getOrCreateStore(anchor);
  if (!participationStore) return () => undefined;
  const { store, treeRoot } = participationStore;
  const anchorListeners = store.listeners.get(anchor) ?? new Set<() => void>();
  anchorListeners.add(listener);
  store.listeners.set(anchor, anchorListeners);

  return () => {
    const currentStore = stores.get(treeRoot);
    if (!currentStore) return;
    const currentListeners = currentStore.listeners.get(anchor);
    currentListeners?.delete(listener);
    if (currentListeners?.size === 0) currentStore.listeners.delete(anchor);
    disconnectEmptyStore(treeRoot, currentStore);
  };
};

const subscribeToTreeSelector = (anchor: FormControlBridgeElement, listener: () => void) => {
  const participationStore = getOrCreateStore(anchor);
  if (!participationStore) return () => undefined;
  const { store, treeRoot } = participationStore;
  store.selectorListeners.add(listener);
  return () => {
    const currentStore = stores.get(treeRoot);
    if (!currentStore) return;
    currentStore.selectorListeners.delete(listener);
    disconnectEmptyStore(treeRoot, currentStore);
  };
};

/**
 * Invalidates a consumer only when its selected native form-participation value changes.
 * The selector shares the same tree-root observer as `useFormControlBridge`.
 */
export const useFormParticipationInvalidation = <Snapshot>(
  anchor: FormControlBridgeElement | null,
  read: () => Snapshot,
  synchronizationKey: unknown,
  isEqual: (current: Snapshot, next: Snapshot) => boolean = Object.is,
) => {
  const readRef = useRef(read);
  const isEqualRef = useRef(isEqual);
  const snapshotRef = useRef<Snapshot | undefined>(undefined);
  const hasSnapshotRef = useRef(false);
  const [, invalidate] = useReducer((version: number) => version + 1, 0);
  const treeRoot = anchor?.getRootNode() ?? null;
  readRef.current = read;
  isEqualRef.current = isEqual;

  const checkForChange = useCallback(() => {
    const nextSnapshot = readRef.current();
    if (
      hasSnapshotRef.current &&
      isEqualRef.current(snapshotRef.current as Snapshot, nextSnapshot)
    ) {
      return;
    }
    snapshotRef.current = nextSnapshot;
    hasSnapshotRef.current = true;
    invalidate();
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!anchor) {
      hasSnapshotRef.current = false;
      snapshotRef.current = undefined;
      return undefined;
    }
    snapshotRef.current = readRef.current();
    hasSnapshotRef.current = true;
    return subscribeToTreeSelector(anchor, checkForChange);
  }, [anchor, checkForChange, treeRoot]);

  useIsomorphicLayoutEffect(() => {
    if (!anchor) return;
    snapshotRef.current = readRef.current();
    hasSnapshotRef.current = true;
  }, [anchor, synchronizationKey, treeRoot]);
};

interface UseFormControlBridgeOptions {
  disabled?: boolean;
  form?: string;
}

/**
 * Tracks native form ownership and effective disabledness for composite controls.
 * Composite controls spread `anchorProps` onto a hidden fieldset inside the root.
 * Native controls may merge `anchorRef` into their existing form-associated element.
 */
export const useFormControlBridge = <
  AnchorElement extends FormControlBridgeElement = HTMLFieldSetElement,
>({ disabled = false, form }: UseFormControlBridgeOptions = {}) => {
  const anchorRef = useRef<AnchorElement | null>(null);
  const [anchor, setAnchor] = useState<AnchorElement | null>(null);
  const [snapshot, setSnapshot] = useState<FormParticipationSnapshot>(emptySnapshot);

  const refresh = useCallback(() => {
    const nextSnapshot = readSnapshot(anchorRef.current);
    setSnapshot((currentSnapshot) =>
      currentSnapshot.associatedForm === nextSnapshot.associatedForm &&
      currentSnapshot.effectivelyDisabled === nextSnapshot.effectivelyDisabled &&
      currentSnapshot.treeRoot === nextSnapshot.treeRoot
        ? currentSnapshot
        : nextSnapshot,
    );
  }, []);
  const setAnchorRef = useCallback<RefCallback<AnchorElement>>((node) => {
    anchorRef.current = node;
    setAnchor(node);
  }, []);

  useIsomorphicLayoutEffect(refresh);
  useIsomorphicLayoutEffect(() => {
    if (!anchor) return undefined;
    refresh();
    return subscribeToTree(anchor, refresh);
  }, [anchor, refresh, snapshot.treeRoot]);

  const isEffectivelyDisabledNow = useCallback(
    () => [disabled, anchorRef.current?.matches(':disabled')].some(Boolean),
    [disabled],
  );
  const anchorProps = useMemo(
    () => ({
      'aria-hidden': true,
      'data-form-control-anchor': '',
      disabled,
      form,
      hidden: true,
      ref: setAnchorRef,
    }),
    [disabled, form, setAnchorRef],
  );

  return {
    anchorRef: setAnchorRef,
    anchorProps,
    associatedForm: snapshot.associatedForm,
    effectivelyDisabled: [disabled, snapshot.effectivelyDisabled].some(Boolean),
    isEffectivelyDisabledNow,
    participationAnchor: anchor,
  };
};

export const useFormAssociatedEventRef = <TAnchor extends FormAssociatedElement>(
  type: FormAssociatedEventType,
  listener: ((event: Event) => void) | undefined,
): RefCallback<TAnchor> => {
  const listenerRef = useRef(listener);
  const subscriptionRef = useRef<{
    anchor: TAnchor | null;
    eventType: FormAssociatedEventType | null;
    generation: number;
    pendingDetach: boolean;
    treeRoot: Node | null;
    unsubscribe?: () => void;
  }>({
    anchor: null,
    eventType: null,
    generation: 0,
    pendingDetach: false,
    treeRoot: null,
  });
  useIsomorphicLayoutEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  return useCallback(
    (anchor) => {
      const subscription = subscriptionRef.current;
      if (anchor) {
        const treeRoot = anchor.getRootNode();
        subscription.generation += 1;
        subscription.pendingDetach = false;
        if (
          subscription.anchor === anchor &&
          subscription.eventType === type &&
          subscription.treeRoot === treeRoot &&
          subscription.unsubscribe
        ) {
          return;
        }

        subscription.unsubscribe?.();
        subscription.anchor = anchor;
        subscription.eventType = type;
        subscription.treeRoot = treeRoot;
        subscription.unsubscribe = subscribeToFormAssociatedEvent(anchor, type, (event) => {
          const current = subscriptionRef.current;
          if (current.anchor === anchor && !current.pendingDetach) {
            listenerRef.current?.(event);
          }
        });
        return;
      }

      if (!subscription.anchor) return;
      const detachedAnchor = subscription.anchor;
      const generation = ++subscription.generation;
      subscription.pendingDetach = true;
      queueMicrotask(() => {
        const current = subscriptionRef.current;
        if (
          current.generation !== generation ||
          current.anchor !== detachedAnchor ||
          !current.pendingDetach
        ) {
          return;
        }
        current.unsubscribe?.();
        current.anchor = null;
        current.eventType = null;
        current.pendingDetach = false;
        current.treeRoot = null;
        current.unsubscribe = undefined;
      });
    },
    [type],
  );
};

export const useFormReset = <TAnchor extends FormAssociatedElement>(
  onReset: (() => void) | undefined,
): RefCallback<TAnchor> => {
  const onResetRef = useRef(onReset);
  const subscriptionRef = useRef<{
    anchor: TAnchor | null;
    generation: number;
    pendingDetach: boolean;
    treeRoot: Node | null;
    unsubscribe?: () => void;
  }>({ anchor: null, generation: 0, pendingDetach: false, treeRoot: null });
  useIsomorphicLayoutEffect(() => {
    onResetRef.current = onReset;
  }, [onReset]);

  return useCallback((anchor) => {
    const subscription = subscriptionRef.current;
    if (anchor) {
      const treeRoot = anchor.getRootNode();
      subscription.generation += 1;
      subscription.pendingDetach = false;
      if (
        subscription.anchor === anchor &&
        subscription.treeRoot === treeRoot &&
        subscription.unsubscribe
      ) {
        return;
      }

      subscription.unsubscribe?.();
      subscription.anchor = anchor;
      subscription.treeRoot = treeRoot;
      subscription.unsubscribe = subscribeToFormReset(anchor, () => {
        const current = subscriptionRef.current;
        if (current.anchor === anchor && !current.pendingDetach) onResetRef.current?.();
      });
      return;
    }

    if (!subscription.anchor) return;
    const detachedAnchor = subscription.anchor;
    const generation = ++subscription.generation;
    subscription.pendingDetach = true;
    queueMicrotask(() => {
      const current = subscriptionRef.current;
      if (
        current.generation !== generation ||
        current.anchor !== detachedAnchor ||
        !current.pendingDetach
      ) {
        return;
      }
      current.unsubscribe?.();
      current.anchor = null;
      current.pendingDetach = false;
      current.treeRoot = null;
      current.unsubscribe = undefined;
    });
  }, []);
};
