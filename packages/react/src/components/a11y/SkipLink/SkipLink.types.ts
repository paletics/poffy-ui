import type { NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';

export interface SkipLinkOwnProps {
  /** Fragment destination owned by the host document, such as `#main-content`. */
  href: `#${string}`;
  /** Accessible action text. Applications localize this text. */
  children: ReactNode;
}

/** Public props for SkipLink. */
export type SkipLinkProps = Omit<
  NativeProps<'a', SkipLinkOwnProps>,
  'children' | 'download' | 'href' | 'rel' | 'target'
> &
  SkipLinkOwnProps;
