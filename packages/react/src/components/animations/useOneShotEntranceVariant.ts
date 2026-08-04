'use client';

import { useCallback, useState } from 'react';
import { useHydrated } from './useHydrated';

interface OneShotEntranceVariantOptions<T extends string> {
  enabled: boolean;
  enter: T;
  entranceIdentity?: unknown;
  settled: T;
  shouldEnter?: boolean;
}

interface EntranceSnapshot<T extends string> {
  enabled: boolean;
  entranceIdentity: unknown;
  hydrated: boolean;
  isSettling: boolean;
  ownsEntrance: boolean;
  shouldEnter: boolean;
  target: T | undefined;
}

/**
 * Keeps a declarative entrance target stable across async Motion feature loading,
 * then permanently settles an existing mount when animation policy is disabled.
 */
export const useOneShotEntranceVariant = <T extends string>({
  enabled,
  enter,
  entranceIdentity,
  settled,
  shouldEnter = true,
}: OneShotEntranceVariantOptions<T>) => {
  const isHydrated = useHydrated();
  const [snapshot, setSnapshot] = useState<EntranceSnapshot<T>>(() => ({
    enabled,
    entranceIdentity,
    hydrated: isHydrated,
    isSettling: false,
    ownsEntrance: isHydrated && enabled && shouldEnter,
    shouldEnter,
    target: isHydrated ? (enabled && shouldEnter ? enter : settled) : undefined,
  }));

  if (
    snapshot.enabled !== enabled ||
    !Object.is(snapshot.entranceIdentity, entranceIdentity) ||
    snapshot.hydrated !== isHydrated ||
    snapshot.shouldEnter !== shouldEnter
  ) {
    const isFirstHydratedRender = isHydrated && !snapshot.hydrated;
    const entranceChanged = !Object.is(snapshot.entranceIdentity, entranceIdentity);
    const ownsEntrance = isFirstHydratedRender ? enabled && shouldEnter : snapshot.ownsEntrance;
    const shouldSettle =
      snapshot.target === enter && [!enabled, !shouldEnter, entranceChanged].includes(true);
    const target = !isHydrated
      ? undefined
      : isFirstHydratedRender
        ? enabled && shouldEnter
          ? enter
          : settled
        : shouldSettle
          ? settled
          : (snapshot.target ?? settled);

    setSnapshot({
      enabled,
      entranceIdentity,
      hydrated: isHydrated,
      isSettling: shouldSettle ? true : snapshot.isSettling,
      ownsEntrance,
      shouldEnter,
      target,
    });
  }

  const settleEntrance = useCallback(() => {
    setSnapshot((current) =>
      current.target === enter ? { ...current, isSettling: true, target: settled } : current,
    );
  }, [enter, settled]);

  const completeSettlement = useCallback(() => {
    setSnapshot((current) => (current.isSettling ? { ...current, isSettling: false } : current));
  }, []);

  return {
    isHydrated,
    isSettling: snapshot.isSettling,
    ownsEntrance: snapshot.ownsEntrance,
    completeSettlement,
    settleEntrance,
    target: snapshot.target,
  };
};
