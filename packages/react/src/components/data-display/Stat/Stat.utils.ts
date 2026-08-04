import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import type { ReactElement, ReactNode } from 'react';

const statArrowAsChildHostNames = new Set(['svg']);
const statRootAsChildHostNames = new Set(['article', 'div', 'section']);
const statTextAsChildHostNames = new Set(['div', 'p', 'span']);

export const isStatAsChildHost = (
  child: ReactNode,
): child is ReactElement<Record<string, unknown>> =>
  isNonVoidAsChildHost(child) &&
  typeof child.type === 'string' &&
  statRootAsChildHostNames.has(child.type);

export const isStatTextAsChildHost = (
  child: ReactNode,
): child is ReactElement<Record<string, unknown>> =>
  isNonVoidAsChildHost(child) &&
  typeof child.type === 'string' &&
  statTextAsChildHostNames.has(child.type);

export const isStatArrowAsChildHost = (child: ReactNode) =>
  isNonVoidAsChildHost(child) &&
  typeof child.type === 'string' &&
  statArrowAsChildHostNames.has(child.type);
