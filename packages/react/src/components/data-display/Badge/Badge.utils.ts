import { isAsChildHost } from '@/components/shared/asChild';
import type { ReactElement, ReactNode } from 'react';

const badgeRootAsChildHostNames = new Set([
  'a',
  'article',
  'button',
  'div',
  'label',
  'li',
  'p',
  'section',
  'span',
]);

export const isBadgeRootAsChildHost = (
  child: ReactNode,
): child is ReactElement<{ children?: ReactNode }> => {
  if (!isAsChildHost(child, badgeRootAsChildHostNames)) return false;
  return typeof child.type === 'string' ? true : child.props.children != null;
};

export const isBadgeIndicatorAsChildHost = (
  child: ReactNode,
): child is ReactElement<{ children?: ReactNode }> =>
  typeof child === 'object' &&
  child !== null &&
  isAsChildHost(child, new Set(['span', 'small', 'strong', 'em', 'i', 'b'])) &&
  typeof child.type === 'string';
