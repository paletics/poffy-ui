'use client';

import { useControllableState } from '@poffy-ui/behavior/hooks';
import { useCallback } from 'react';

interface UseDialogOpenStateOptions<TArgs extends unknown[]> {
  defaultOpen: boolean;
  onOpenChange?: (open: boolean, ...args: TArgs) => void;
  open?: boolean;
}

/** Private controlled/uncontrolled adapter shared by dialog-style overlay roots. */
export const useDialogOpenState = <TArgs extends unknown[] = unknown[]>({
  defaultOpen,
  onOpenChange: controlledOnOpenChange,
  open: controlledOpen,
}: UseDialogOpenStateOptions<TArgs>) => {
  const resolvedOnOpenChange =
    typeof controlledOnOpenChange === 'function' ? controlledOnOpenChange : undefined;
  const {
    value: open,
    isControlled,
    setValue: setInternalOpen,
  } = useControllableState({
    value: controlledOpen,
    defaultValue: defaultOpen,
  });

  const onOpenChange = useCallback(
    (nextOpen: boolean, ...args: TArgs) => {
      if (!isControlled) setInternalOpen(nextOpen);
      resolvedOnOpenChange?.(nextOpen, ...args);
    },
    [isControlled, resolvedOnOpenChange, setInternalOpen],
  );

  return { onOpenChange, open };
};
