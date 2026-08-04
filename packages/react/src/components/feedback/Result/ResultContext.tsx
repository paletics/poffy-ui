'use client';

import { createContext, useContext } from 'react';
import { result } from '@/styled-system/recipes';

type ResultStatus = 'success' | 'error' | 'warning' | 'info';

interface ResultContextValue {
  status: ResultStatus;
  classes: ReturnType<typeof result>;
}

const defaultResultClasses = result({ status: 'info' });

/**
 * React context carrying Result status to nested icon and text parts.
 */
export const ResultContext = createContext<ResultContextValue>({
  status: 'info',
  classes: defaultResultClasses,
});

/**
 * Returns the nearest Result status context.
 */
export const useResultContext = () => useContext(ResultContext);
