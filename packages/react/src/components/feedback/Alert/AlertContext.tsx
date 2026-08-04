'use client';

import { createContext, useContext } from 'react';
import { AlertBaseProps } from '@/components/feedback/Alert/Alert.types';

/**
 * Shared alert status and generated class names for alert compound parts.
 */
type AlertContextValue = {
  classes: Record<'root' | 'icon' | 'title' | 'description', string>;
  status: AlertBaseProps['status'];
} | null;

/**
 * React context carrying Alert styling state for icon, title, and description parts.
 */
export const AlertContext = createContext<AlertContextValue>(null);

/**
 * Returns the nearest Alert context and validates compound component usage.
 *
 * @throws {Error} `Alert sub-components must be used within Alert`
 */
export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('Alert sub-components must be used within Alert');
  }
  return context;
};
