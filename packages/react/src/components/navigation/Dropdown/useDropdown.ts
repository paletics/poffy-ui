import { useDropdown as useDropdownBehavior } from '@poffy-ui/behavior/dropdown';
import { dropdown } from '@/styled-system/recipes';
import { useMemo } from 'react';
import type { UseDropdownReturn as UseDropdownBehaviorReturn } from '@poffy-ui/behavior/dropdown';
import type { DropdownRootProps } from './Dropdown.types';

/**
 * Return object from useDropdown with behavior props and generated slot classes.
 */
interface UseDropdownReturn extends UseDropdownBehaviorReturn {
  classes: ReturnType<typeof dropdown>;
}

/**
 * Custom hook to manage the internal state and accessibility of the Dropdown component.
 * Uses `@floating-ui/react` for positioning and keyboard navigation logic.
 *
 * @param props - Dropdown root properties.
 * @returns State and interaction props for the dropdown components.
 */
export const useDropdown = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  appearance = 'soft',
  size = 'md',
}: DropdownRootProps): UseDropdownReturn => {
  const dropdownState = useDropdownBehavior({
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
  });

  const classes = useMemo(() => dropdown({ appearance, size }), [appearance, size]);

  return {
    ...dropdownState,
    classes,
  };
};
