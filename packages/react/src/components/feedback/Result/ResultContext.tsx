'use client';

import { createContext, useContext } from 'react';

type ResultStatus = 'success' | 'error' | 'warning' | 'info';

interface ResultContextValue {
  status: ResultStatus;
}

/**
 * React context carrying Result status to nested icon and text parts.
 */
export const ResultContext = createContext<ResultContextValue>({ status: 'info' });

/**
 * Returns the nearest Result status context.
 */
export const useResultContext = () => useContext(ResultContext);
