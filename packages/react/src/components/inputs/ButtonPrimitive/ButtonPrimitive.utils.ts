import { isButtonAsChildHost, shouldEmulateButtonHost } from '@/components/shared/asChild';
import type { ReactElement, ReactNode } from 'react';

type ButtonPrimitiveChildProps = Record<string, unknown>;

/** Returns whether a host can safely receive ButtonPrimitive button semantics. */
export const isButtonPrimitiveAsChildHost = (
  child: ReactNode,
): child is ReactElement<ButtonPrimitiveChildProps> => isButtonAsChildHost(child);

/** Returns whether ButtonPrimitive must emulate button semantics for a static asChild host. */
export const shouldProvideButtonPrimitiveSemantics = (child: ReactNode): boolean => {
  if (!isButtonPrimitiveAsChildHost(child)) return false;

  const element = child as ReactElement<{ href?: unknown }>;
  if (typeof element.type !== 'string') return true;
  if (element.type === 'button') return false;
  return shouldEmulateButtonHost(child);
};
