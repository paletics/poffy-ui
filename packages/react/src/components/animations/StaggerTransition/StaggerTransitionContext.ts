import { createContext } from 'react';
import type { StaggerItemType } from './StaggerTransition.presets';

/** Context for inherited StaggerTransition item animation defaults. */
export const StaggerContext = createContext<{ itemAnimationType: StaggerItemType }>({
  itemAnimationType: 'fade',
});
