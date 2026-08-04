import { forwardRef, type ComponentType, type RefAttributes } from 'react';
import { Stack } from '../Stack';
import type { VStackComponent, VStackProps } from './VStack.types';

const StackWithElementRef = Stack as unknown as ComponentType<
  Record<string, unknown> & RefAttributes<Element>
>;


const VStackImpl = forwardRef<Element, VStackProps>((props, ref) => {
  const { align = 'stretch', ...rest } = props;
  return (
    <StackWithElementRef
      {...(rest as unknown as Record<string, unknown>)}
      ref={ref}
      align={align}
      direction="column"
    />
  );
});

VStackImpl.displayName = 'VStack';

/** Arranges children vertically using the shared Stack spacing contract, stretched cross-axis by default. */
export const VStack = VStackImpl as VStackComponent;
