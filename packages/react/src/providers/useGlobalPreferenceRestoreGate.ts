'use client';

import { useEffect, useRef, useState } from 'react';

/** Configuration for restoring preferences before global document ownership begins. */
interface GlobalPreferenceRestoreGateOptions {
  enabled: boolean;
  restore: () => void;
  restoreKey?: unknown;
}

/**
 * Delays global document ownership until restored preference state has committed.
 * `restore` must synchronously schedule any state updates and handle storage errors.
 */
export const useGlobalPreferenceRestoreGate = ({
  enabled,
  restore,
  restoreKey,
}: GlobalPreferenceRestoreGateOptions): boolean => {
  const restoredKeyRef = useRef<unknown>(Symbol('unrestored'));
  const [restoreRevision, setRestoreRevision] = useState(0);
  const minimumCommittedRevisionRef = useRef(enabled ? 1 : 0);

  const canOwnDocument =
    enabled &&
    restoredKeyRef.current === restoreKey &&
    restoreRevision >= minimumCommittedRevisionRef.current;

  useEffect(() => {
    if (!enabled) {
      restoredKeyRef.current = Symbol('unrestored');
      minimumCommittedRevisionRef.current = 0;
      return;
    }
    if (restoredKeyRef.current === restoreKey) return;

    restoredKeyRef.current = restoreKey;
    minimumCommittedRevisionRef.current = restoreRevision + 1;
    try {
      restore();
    } finally {
      setRestoreRevision((revision) => revision + 1);
    }
  }, [enabled, restore, restoreKey, restoreRevision]);

  return canOwnDocument;
};
