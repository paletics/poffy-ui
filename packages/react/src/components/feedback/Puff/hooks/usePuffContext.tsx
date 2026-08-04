'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { PuffContextType, PuffOptions, PuffContainerItem, PuffProviderProps } from '../Puff.types';
import { PuffContainer } from '../PuffContainer';

const PuffContext = createContext<PuffContextType | undefined>(undefined);

/**
 * Owns a transient notification queue and renders its portalled container for a subtree.
 *
 * Nesting is supported: `usePuff` resolves to the nearest provider. `removePuff` first starts the
 * exit animation; the provider removes the item after that animation completes.
 */
export const PuffProvider = ({
  point = 'top-right',
  portalContainer,
  ownerDocument,
  children,
}: PuffProviderProps) => {
  const [puffs, setPuffs] = useState<PuffContainerItem[]>([]);

  const removePuff = useCallback((id: string) => {
    setPuffs((prevPuffs) =>
      prevPuffs.map((puff) => (puff.puffId === id ? { ...puff, isVisible: false } : puff)),
    );
  }, []);

  const finalizePuffRemoval = useCallback((id: string) => {
    setPuffs((prevPuffs) => prevPuffs.filter((puff) => puff.puffId !== id));
  }, []);

  const addPuff = useCallback((options: PuffOptions) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const {
      id: _ignoredId,
      puffId: _ignoredPuffId,
      isVisible: _ignoredVisible,
      removePuff: _ignoredRemovePuff,
      onExitComplete: _ignoredExit,
      ...rest
    } = options as PuffOptions & {
      id?: string;
      puffId?: string;
      isVisible?: boolean;
      removePuff?: (id: string) => void;
      onExitComplete?: (id: string) => void;
    };

    const newPuff: PuffContainerItem = {
      ...rest,
      puffId: id,
      isVisible: true,
    };

    setPuffs((prevPuffs) => [newPuff, ...prevPuffs]);
    return id;
  }, []);

  return (
    <PuffContext.Provider value={{ addPuff, removePuff }}>
      {children}
      <PuffContainer
        point={point}
        puffs={puffs}
        removePuff={removePuff}
        finalizePuffRemoval={finalizePuffRemoval}
        portalContainer={portalContainer}
        ownerDocument={ownerDocument}
      />
    </PuffContext.Provider>
  );
};

/** Returns controls for the nearest PuffProvider, or throws when none is present. */
export const usePuff = () => {
  const context = useContext(PuffContext);
  if (context === undefined) {
    throw new Error('usePuff must be used within a PuffProvider');
  }
  return context;
};
