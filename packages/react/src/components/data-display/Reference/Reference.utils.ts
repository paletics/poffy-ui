import { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

const isNativeHost = (children: ReactNode, tag: string): children is ReactElement =>
  isValidElement(children) && typeof children.type === 'string' && children.type === tag;

export const isReferenceAsChildHost = (children: ReactNode, hasHref: boolean) =>
  isNativeHost(children, hasHref ? 'a' : 'span');

export const isReferenceListAsChildHost = (children: ReactNode) => isNativeHost(children, 'nav');
