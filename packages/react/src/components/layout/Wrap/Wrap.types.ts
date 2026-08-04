import type { FlexAsChildProps, FlexDefaultProps } from '../Flex/Flex.types';
import type { PolymorphicAsChildComponent } from '@/components/shared/polymorphicAsChild.types';


export type WrapDefaultProps = Omit<FlexDefaultProps, 'wrap'>;
export type WrapAsChildProps = Omit<FlexAsChildProps, 'wrap'>;
/** Public props for Wrap. */
export type WrapProps = WrapDefaultProps | WrapAsChildProps;
export type WrapComponent = PolymorphicAsChildComponent<
  WrapDefaultProps,
  WrapAsChildProps,
  HTMLDivElement
>;
