'use client';

import { useCallback, useRef, useState } from 'react';

const usePartRegistry = () => {
  const ids = useRef(new Set<string>());
  const [activeId, setActiveId] = useState<string>();

  const register = useCallback((id: string) => {
    ids.current.add(id);
    setActiveId((current) => current ?? id);

    return () => {
      ids.current.delete(id);
      setActiveId((current) => (current === id ? ids.current.values().next().value : current));
    };
  }, []);

  return { activeId, register };
};

/** Registers overlay labels after mount so generated IDREFs never point to duplicate DOM IDs. */
export const useOverlayAriaParts = () => {
  const title = usePartRegistry();
  const description = usePartRegistry();
  const content = usePartRegistry();

  return {
    registeredTitleId: title.activeId,
    registeredDescriptionId: description.activeId,
    registeredContentId: content.activeId,
    registerTitle: title.register,
    registerDescription: description.register,
    registerContent: content.register,
  };
};
