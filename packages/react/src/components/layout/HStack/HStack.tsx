import { forwardRef, type ComponentType, type RefAttributes } from 'react';
import { Stack } from '../Stack';
import type { HStackComponent, HStackProps } from './HStack.types';

const StackWithElementRef = Stack as unknown as ComponentType<
  Record<string, unknown> & RefAttributes<Element>
>;


const HStackImpl = forwardRef<Element, HStackProps>((props, ref) => {
  const { align = 'center', ...rest } = props;
  return (
    <StackWithElementRef
      {...(rest as unknown as Record<string, unknown>)}
      ref={ref}
      align={align}
      direction="row"
    />
  );
});

HStackImpl.displayName = 'HStack';

/** Arranges children horizontally using the shared Stack spacing contract, centered cross-axis by default. */
export const HStack = HStackImpl as HStackComponent;
