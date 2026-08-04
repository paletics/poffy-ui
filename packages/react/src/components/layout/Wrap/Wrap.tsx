import { forwardRef, type ReactElement, type RefAttributes } from 'react';
import { Flex } from '../Flex';
import type { FlexProps } from '../Flex/Flex.types';
import type { WrapComponent, WrapProps } from './Wrap.types';

const FlexWithElementRef = Flex as unknown as (
  props: FlexProps & RefAttributes<Element>,
) => ReactElement | null;


const WrapImpl = forwardRef<Element, WrapProps>((props, ref) => {
  return <FlexWithElementRef ref={ref} {...(props as FlexProps)} wrap="wrap" />;
});

WrapImpl.displayName = 'Wrap';

/** Enforces wrapping for a Flex layout while retaining its direction and alignment options. */
export const Wrap = WrapImpl as WrapComponent;
