'use client';

import { createContext, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import type {
  DirectionContextType,
  DirectionProviderProps,
  PoffyDirection,
} from './DirectionProvider.types';

/**
 * Public direction provider context and direction value types.
 */
export type { PoffyDirection, DirectionContextType } from './DirectionProvider.types';

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

/**
 * Injects the active text direction (`'ltr'` / `'rtl'`) into the component tree
 * and optionally syncs the `dir` attribute on `document.documentElement`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: App Root — place once in `_app.tsx` or `layout.tsx`
 * - **SSR Safety**: No side effects on first render — `dir` is set in a `useEffect` guard.
 *   Safe for server rendering without hydration mismatch.
 *
 * ### AI Usage
 * - **DO**: Consume `useDirection()` in components that need to mirror layout for RTL scripts
 *   (e.g. icon flipping, scroll direction, `margin-inline-start` vs `margin-inline-end`).
 * - **DO**: Prefer CSS logical properties (`margin-inline-start`, `padding-block`) over
 *   directional ones so they respond to `dir` automatically without reading context.
 * - **DON'T**: Do not nest two `DirectionProvider` instances — the inner one silently overrides the outer.
 * - **DON'T**: Hard-code `dir="ltr"` on elements — always inherit from the provider.
 *
 * @example Global direction (default)
 * ```tsx
 * import { DirectionProvider } from '@poffy-ui/react';
 *
 * // app/layout.tsx
 * <DirectionProvider defaultDir="rtl">
 *   <App />
 * </DirectionProvider>
 * ```
 *
 * @example Scoped RTL widget — does not touch document.documentElement
 * ```tsx
 * import { DirectionProvider } from '@poffy-ui/react';
 *
 * <DirectionProvider defaultDir="rtl" global={false}>
 *   <ArabicWidget />
 * </DirectionProvider>
 * ```
 */
export const DirectionProvider = ({
  children,
  defaultDir = 'ltr',
  global = true,
}: DirectionProviderProps): ReactElement => {
  const [dir, setDir] = useState<PoffyDirection>(defaultDir);

  useEffect(() => {
    if (!global) return;
    document.documentElement.setAttribute('dir', dir);
  }, [dir, global]);

  const contextValue = useMemo(() => ({ dir, setDir }), [dir]);

  return <DirectionContext.Provider value={contextValue}>{children}</DirectionContext.Provider>;
};

/**
 * Returns the current text direction and its setter from the nearest `DirectionProvider`.
 *
 * ### AI Usage
 * - **DON'T**: Do not call outside a `DirectionProvider` tree — throws at runtime
 *
 * @returns `{ dir, setDir }`
 *
 * @example
 * ```tsx
 * import { useDirection } from '@poffy-ui/react';
 *
 * const { dir, setDir } = useDirection();
 * // dir === 'rtl' → flip chevron icon, reverse scroll, etc.
 * ```
 */
export const useDirection = (): DirectionContextType => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider.');
  }
  return context;
};
