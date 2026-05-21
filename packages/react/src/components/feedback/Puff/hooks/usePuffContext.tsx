'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import {
  PuffContextType,
  PuffBaseProps,
  PuffContainerItem,
  PuffProviderProps,
} from '../Puff.types';
import { PuffContainer } from '../PuffContainer';

const PuffContext = createContext<PuffContextType | undefined>(undefined);

/**
 * Provider for managing puff notifications globally or within a sub-tree.
 * Maintains the state of active puffs and renders `PuffContainer` to display them.
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: App Root or sub-tree — wrap with `<PuffProvider>` where notifications are needed
 *
 * ### AI Usage
 * - **DO**: Place at app root to enable global notifications.
 * - **DO**: Use standalone for scoped notifications within a sub-tree.
 * - **DON'T**: Do not nest two `PuffProvider` instances — the inner one silently overrides the outer.
 *
 * @example
 * ```tsx
 * import { PuffProvider } from '@poffy-ui/react/feedback';
 *
 * <PuffProvider point="top-right">
 *   <App />
 * </PuffProvider>
 * ```
 */
export const PuffProvider = ({ point = 'top-right', children }: PuffProviderProps) => {
  const [puffs, setPuffs] = useState<PuffContainerItem[]>([]);

  const removePuff = useCallback((id: string) => {
    setPuffs((prevPuffs) =>
      prevPuffs.map((puff) => (puff.id === id ? { ...puff, isVisible: false } : puff)),
    );
  }, []);

  const finalizePuffRemoval = useCallback((id: string) => {
    setPuffs((prevPuffs) => prevPuffs.filter((puff) => puff.id !== id));
  }, []);

  const addPuff = useCallback((options: PuffBaseProps) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const {
      id: _ignoredId,
      isVisible: _ignoredVisible,
      onExitComplete: _ignoredExit,
      ...rest
    } = options;

    const newPuff: PuffContainerItem = {
      id,
      isVisible: true,
      ...rest,
    };

    setPuffs((prevPuffs) => [newPuff, ...prevPuffs]);
  }, []);

  return (
    <PuffContext.Provider value={{ addPuff, removePuff }}>
      {children}
      <PuffContainer
        point={point}
        puffs={puffs}
        removePuff={removePuff}
        finalizePuffRemoval={finalizePuffRemoval}
      />
    </PuffContext.Provider>
  );
};

/**
 * Returns puff controls from the nearest `PuffProvider`.
 *
 * ### AI Usage
 * - **DON'T**: Do not call outside a `PuffProvider` tree — throws at runtime
 *
 * @throws {Error} `usePuff must be used within a PuffProvider`
 * @returns `{ addPuff, removePuff }`
 */
export const usePuff = () => {
  const context = useContext(PuffContext);
  if (context === undefined) {
    throw new Error('usePuff must be used within a PuffProvider');
  }
  return context;
};
