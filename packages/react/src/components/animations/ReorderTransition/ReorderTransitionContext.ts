import { createContext } from 'react';
import type { OrderItemAnimationType } from './ReorderTransition.presets';

/** Context for inherited ReorderTransition item animation defaults. */
export const OrderContext = createContext<{ animationType: OrderItemAnimationType }>({
  animationType: 'pop',
});
