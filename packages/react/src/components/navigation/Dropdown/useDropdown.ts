import { useDropdown as useDropdownBehavior } from '@poffy-ui/behavior/dropdown';
import { dropdown } from '@/styled-system/recipes';
import { useMemo } from 'react';
import type {
  UseDropdownOptions,
  UseDropdownReturn as UseDropdownBehaviorReturn,
} from '@poffy-ui/behavior/dropdown';
import type { DropdownRootProps } from './Dropdown.types';

/**
 * Return object from useDropdown with behavior props and generated slot classes.
 */
interface UseDropdownReturn extends UseDropdownBehaviorReturn {
  classes: ReturnType<typeof dropdown>;
  resolvedCollisionPadding: number;
}

/**
 * Custom hook to manage the internal state and accessibility of the Dropdown component.
 * Uses `@floating-ui/react` for positioning and keyboard navigation logic.
 *
 * @returns State and interaction props for the dropdown components.
 */
export const useDropdown = (
  {
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    appearance = 'soft',
    size = 'md',
    placement,
    offset,
    collisionPadding,
    strategy,
    loop,
  }: DropdownRootProps,
  nodeId?: string,
): UseDropdownReturn => {
  const resolvedCollisionPadding =
    typeof collisionPadding === 'number' &&
    Number.isFinite(collisionPadding) &&
    collisionPadding >= 0
      ? collisionPadding
      : 8;
  const dropdownState = useDropdownBehavior({
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    nodeId,
    placement,
    offset,
    collisionPadding: resolvedCollisionPadding,
    strategy,
    loop,
  } as unknown as UseDropdownOptions);

  const classes = useMemo(() => dropdown({ appearance, size }), [appearance, size]);

  return {
    ...dropdownState,
    classes,
    resolvedCollisionPadding,
  };
};
