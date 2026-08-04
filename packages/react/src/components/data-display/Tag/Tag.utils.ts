import {
  isAsChildHost,
  isButtonAsChildHost,
  isPotentiallyInteractiveAsChildHost,
} from '@/components/shared/asChild';
import { cloneElement, Fragment, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

const tagRootAsChildHostNames = new Set(['article', 'div', 'li', 'section', 'span']);
const tagLabelAsChildHostNames = new Set([
  'abbr',
  'b',
  'cite',
  'code',
  'em',
  'i',
  'mark',
  's',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
]);

export const isTagRootAsChildHost = (
  child: ReactNode,
): child is ReactElement<{ children?: ReactNode }> => isAsChildHost(child, tagRootAsChildHostNames);

export const isInteractiveTagRootAsChildHost = (child: ReactNode): boolean =>
  isValidElement(child) && isPotentiallyInteractiveAsChildHost(child);

export const isTagLabelAsChildHost = (
  child: ReactNode,
): child is ReactElement<{ children?: ReactNode }> =>
  isAsChildHost(child, tagLabelAsChildHostNames);

export const isTagCloseButtonAsChildHost = (
  child: ReactNode,
): child is ReactElement<Record<string, unknown>> =>
  isButtonAsChildHost(child) && typeof child.type === 'string';

/** Returns phrasing content safe to render in Tag's inline fallback wrappers. */
export const getTagInlineFallbackChildren = (children: ReactNode): ReactNode => {
  if (Array.isArray(children)) return children.map(getTagInlineFallbackChildren);
  if (!isValidElement<{ children?: ReactNode }>(children)) return children;
  if (children.type === Fragment) return getTagInlineFallbackChildren(children.props.children);
  if (typeof children.type !== 'string') {
    const displayName = (children.type as unknown as { displayName?: unknown }).displayName;
    return displayName === 'Tag.CloseButton'
      ? children
      : getTagInlineFallbackChildren(children.props.children);
  }
  if (!tagLabelAsChildHostNames.has(children.type)) {
    return getTagInlineFallbackChildren(children.props.children);
  }

  return cloneElement(children, undefined, getTagInlineFallbackChildren(children.props.children));
};
