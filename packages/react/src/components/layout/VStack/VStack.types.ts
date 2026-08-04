import type { StackAsChildProps, StackDefaultProps } from '../Stack/Stack.types';
import type { ReactElement, RefAttributes } from 'react';

/**
 * Props for the fixed vertical Stack alias.
 *
 * Use `Stack` when the direction must be configurable or responsive.
 */
export type VStackDefaultProps = Omit<StackDefaultProps, 'direction'>;
export type VStackAsChildProps = Omit<StackAsChildProps, 'direction'>;
/** Public props for VStack. */
export type VStackProps = VStackDefaultProps | VStackAsChildProps;

export interface VStackComponent {
  (props: VStackDefaultProps & RefAttributes<HTMLDivElement>): ReactElement | null;
  (props: VStackAsChildProps & RefAttributes<Element>): ReactElement | null;
  (
    props:
      | (VStackDefaultProps & RefAttributes<HTMLDivElement>)
      | (VStackAsChildProps & RefAttributes<Element>),
  ): ReactElement | null;
}
