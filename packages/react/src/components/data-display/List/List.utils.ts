import { isAsChildHost } from '@/components/shared/asChild';
import { isValidElement, type ReactElement, type ReactNode } from 'react';

interface ListAsChildHostProps {
  children?: ReactNode;
}

const unorderedListHostNames = new Set(['ul']);
const orderedListHostNames = new Set(['ol']);
const iconHostNames = new Set(['div', 'span', 'svg']);

export const isListRootAsChildHost = (
  child: ReactNode,
  variant: 'plain' | 'marker' | 'ordered' | 'menu',
): child is ReactElement<ListAsChildHostProps> =>
  isValidElement<ListAsChildHostProps>(child) &&
  typeof child.type === 'string' &&
  (variant === 'ordered' ? orderedListHostNames : unorderedListHostNames).has(child.type);

export const isListIconAsChildHost = (
  child: ReactNode,
): child is ReactElement<ListAsChildHostProps> => isAsChildHost(child, iconHostNames);
