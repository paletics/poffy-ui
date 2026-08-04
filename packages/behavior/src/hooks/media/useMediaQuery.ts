'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { UseMediaQueryOptions } from './useMediaQuery.types';

interface MediaQueryStore {
  query: string;
  targetWindow?: Window;
  mediaQuery?: MediaQueryList;
  subscribers: Set<() => void>;
  removeNativeListener?: () => void;
}

interface MediaQueryHolder {
  query: string;
  targetWindow?: Window;
  mediaQuery?: MediaQueryList;
  store?: MediaQueryStore;
}

const storesByWindow = new WeakMap<Window, Map<string, MediaQueryStore>>();

const getWindowStores = (targetWindow: Window) => {
  const existing = storesByWindow.get(targetWindow);
  if (existing) return existing;
  const stores = new Map<string, MediaQueryStore>();
  storesByWindow.set(targetWindow, stores);
  return stores;
};

const getMediaQuery = (store: MediaQueryStore): MediaQueryList | undefined => {
  if (typeof store.targetWindow?.matchMedia !== 'function') return undefined;
  store.mediaQuery ??= store.targetWindow.matchMedia(store.query);
  return store.mediaQuery;
};

const getCanonicalStore = (holder: MediaQueryHolder): MediaQueryStore => {
  const stores = holder.targetWindow ? getWindowStores(holder.targetWindow) : undefined;
  const canonicalStore = stores?.get(holder.query);
  if (canonicalStore) {
    holder.store = canonicalStore;
    holder.mediaQuery = undefined;
    return canonicalStore;
  }

  const store =
    holder.store ??
    ({
      query: holder.query,
      targetWindow: holder.targetWindow,
      mediaQuery: holder.mediaQuery,
      subscribers: new Set(),
    } satisfies MediaQueryStore);
  holder.store = store;
  holder.mediaQuery = undefined;
  stores?.set(holder.query, store);
  return store;
};

const getHolderMediaQuery = (holder: MediaQueryHolder): MediaQueryList | undefined => {
  if (holder.store) return getMediaQuery(holder.store);
  if (holder.targetWindow) {
    const canonicalStore = getWindowStores(holder.targetWindow).get(holder.query);
    if (canonicalStore) {
      holder.store = canonicalStore;
      return getMediaQuery(canonicalStore);
    }
  }
  if (typeof holder.targetWindow?.matchMedia !== 'function') return undefined;
  holder.mediaQuery ??= holder.targetWindow.matchMedia(holder.query);
  return holder.mediaQuery;
};

const subscribe = (holder: MediaQueryHolder, subscriber: () => void): (() => void) => {
  const store = getCanonicalStore(holder);
  store.subscribers.add(subscriber);
  const mediaQuery = getMediaQuery(store);

  if (store.subscribers.size === 1 && mediaQuery) {
    const notify = () => [...store.subscribers].forEach((current) => current());
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', notify);
      store.removeNativeListener = () => mediaQuery.removeEventListener('change', notify);
    } else {
      mediaQuery.addListener(notify);
      store.removeNativeListener = () => mediaQuery.removeListener(notify);
    }
  }

  return () => {
    store.subscribers.delete(subscriber);
    if (store.subscribers.size !== 0) return;
    store.removeNativeListener?.();
    store.removeNativeListener = undefined;
    if (store.targetWindow) getWindowStores(store.targetWindow).delete(store.query);
  };
};

/**
 * Subscribes to a media query through one shared native listener per Window and query.
 *
 * During SSR, and when the chosen window has no `matchMedia`, the hook returns `defaultMatches`.
 * Omit `targetWindow` to observe the global window; pass `null` to disable native observation.
 * The shared listener is released once the last hook using the same window and query unmounts.
 */
export const useMediaQuery = (
  query: string,
  { defaultMatches = false, targetWindow }: UseMediaQueryOptions = {},
): boolean => {
  const resolvedWindow =
    targetWindow === undefined
      ? typeof window === 'undefined'
        ? undefined
        : window
      : (targetWindow ?? undefined);
  const holder = useMemo<MediaQueryHolder>(
    () => ({ query, targetWindow: resolvedWindow }),
    [query, resolvedWindow],
  );
  const subscribeToStore = useCallback(
    (subscriber: () => void) => subscribe(holder, subscriber),
    [holder],
  );
  const getSnapshot = useCallback(
    () => getHolderMediaQuery(holder)?.matches ?? defaultMatches,
    [defaultMatches, holder],
  );
  const getServerSnapshot = useCallback(() => defaultMatches, [defaultMatches]);

  return useSyncExternalStore(subscribeToStore, getSnapshot, getServerSnapshot);
};
