'use client';

import { createContext, useContext } from 'react';
import { ButtonGroupProps } from './ButtonGroup.types';

/**
 * Shared ButtonGroup defaults applied to child buttons.
 */
interface ButtonGroupContextValue {
  orientation?: ButtonGroupProps['orientation'];
  spacing?: ButtonGroupProps['spacing'];
  connected?: ButtonGroupProps['connected'];
  fullWidth?: ButtonGroupProps['fullWidth'];
}

/**
 * React context carrying ButtonGroup child defaults.
 */
export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

/**
 * Returns the nearest ButtonGroup context when a button is inside a group.
 */
export const useButtonGroup = () => {
  const context = useContext(ButtonGroupContext);
  return context;
};
