'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns false for SSR and the first hydration render, then true after mount.
 * This keeps initial motion output identical between server and client.
 */
export const useHydrated = (): boolean => {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
};
