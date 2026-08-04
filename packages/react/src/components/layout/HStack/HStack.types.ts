import type { StackAsChildProps, StackDefaultProps } from '../Stack/Stack.types';
import type { ReactElement, RefAttributes } from 'react';

/**
 * Props for the fixed horizontal Stack alias.
 *
 * Use `Stack` when the direction must be configurable or responsive.
 */
export type HStackDefaultProps = Omit<StackDefaultProps, 'direction'>;
export type HStackAsChildProps = Omit<StackAsChildProps, 'direction'>;
/** Public props for HStack. */
export type HStackProps = HStackDefaultProps | HStackAsChildProps;

export interface HStackComponent {
  (props: HStackDefaultProps & RefAttributes<HTMLDivElement>): ReactElement | null;
  (props: HStackAsChildProps & RefAttributes<Element>): ReactElement | null;
  (
    props:
      | (HStackDefaultProps & RefAttributes<HTMLDivElement>)
      | (HStackAsChildProps & RefAttributes<Element>),
  ): ReactElement | null;
}
