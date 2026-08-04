'use client';

import { useEffect } from 'react';

type FormControlMessageRegister = (id: string) => () => void;

/**
 * Registers a mounted FormControl message ID and reliably removes it when the
 * ID, registration callback, or enabled state changes.
 */
export const useFormControlMessageRegistration = (
  register: FormControlMessageRegister | undefined,
  id: string,
  enabled = true,
) => {
  useEffect(() => (enabled ? register?.(id) : undefined), [enabled, id, register]);
};
