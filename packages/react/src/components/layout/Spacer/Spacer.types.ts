import type { BoxDefaultProps } from '../Box/Box.types';

/** Props for a contentless flex spacer that is always hidden from assistive technology. */
export type SpacerProps = Omit<
  BoxDefaultProps,
  'aria-hidden' | 'asChild' | 'children' | 'contentEditable' | 'role' | 'tabIndex'
> & {
  /** Spacer has a fixed div host. */
  asChild?: never;
  /** Spacer is decorative and cannot contain content. */
  children?: never;
  /** Accessibility-tree ownership is managed by Spacer. */
  'aria-hidden'?: never;
  role?: never;
  tabIndex?: never;
  contentEditable?: never;
};
