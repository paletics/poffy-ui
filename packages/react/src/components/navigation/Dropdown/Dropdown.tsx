'use client';

import type { DropdownRootProps } from './Dropdown.types';
import { FloatingNode, useFloatingNodeId } from '@floating-ui/react';
import { FloatingTreeBoundary } from '@/components/overlay/shared/FloatingTreeBoundary';
import { DropdownContext } from './DropdownContext';
import { useDropdown } from './useDropdown';


const DropdownRoot = (props: DropdownRootProps) => {
  const { children } = props;
  const nodeId = useFloatingNodeId();
  const dropdownState = useDropdown(props, nodeId);

  return (
    <FloatingNode id={nodeId}>
      <DropdownContext.Provider value={dropdownState}>{children}</DropdownContext.Provider>
    </FloatingNode>
  );
};

/** Root Dropdown provider that also coordinates nested overlay dismissal. */
export const Dropdown = (props: DropdownRootProps) => (
  <FloatingTreeBoundary>
    <DropdownRoot {...props} />
  </FloatingTreeBoundary>
);

Dropdown.displayName = 'Dropdown.Root';
