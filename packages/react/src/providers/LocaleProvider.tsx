'use client';

import { createContext, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import type { LocaleContextType, LocaleProviderProps, PoffyLocale } from './LocaleProvider.types';

/**
 * Public locale provider context and locale value types.
 */
export type { PoffyLocale, LocaleContextType } from './LocaleProvider.types';

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

/**
 * Injects the active BCP 47 locale into the component tree and optionally syncs
 * the `lang` attribute on `document.documentElement` for accessibility and SEO.
 *
 * ### AI Context & Architecture
 * - **Tier**: Provider / Infrastructure
 * - **Scope**: App Root — place once in `_app.tsx` or `layout.tsx`
 * - **SSR Safety**: No `localStorage` reads — locale is determined by props only.
 *   Safe for server rendering without hydration mismatch.
 *
 * ### AI Usage
 * - **DO**: Consume `useLocale()` in components that format dates, numbers, or relative times
 *   via `Intl.*` APIs (e.g. `Pagination`, `DatePicker`, `NumberInput`).
 * - **DON'T**: Do not nest two `LocaleProvider` instances — the inner one silently overrides the outer.
 * - **DON'T**: Use raw `navigator.language` in components — always read from `useLocale()` for consistency.
 *
 * @example Global locale (default)
 * ```tsx
 * import { LocaleProvider } from '@poffy-ui/react';
 *
 * // app/layout.tsx
 * <LocaleProvider defaultLocale="ja-JP">
 *   <App />
 * </LocaleProvider>
 * ```
 *
 * @example Scoped locale — does not touch document.documentElement
 * ```tsx
 * import { LocaleProvider } from '@poffy-ui/react';
 *
 * <LocaleProvider defaultLocale="ar-SA" global={false}>
 *   <Widget />
 * </LocaleProvider>
 * ```
 */
export const LocaleProvider = ({
  children,
  defaultLocale = 'en-US',
  global = true,
}: LocaleProviderProps): ReactElement => {
  const [locale, setLocale] = useState<PoffyLocale>(defaultLocale);

  useEffect(() => {
    if (!global) return;
    document.documentElement.setAttribute('lang', locale);
  }, [locale, global]);

  const contextValue = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>;
};

/**
 * Returns the current locale and its setter from the nearest `LocaleProvider`.
 *
 * ### AI Usage
 * - **DON'T**: Do not call outside a `LocaleProvider` tree — throws at runtime
 *
 * @returns `{ locale, setLocale }`
 *
 * @example
 * ```tsx
 * import { useLocale } from '@poffy-ui/react';
 *
 * const { locale, setLocale } = useLocale();
 * const formatted = new Intl.DateTimeFormat(locale).format(new Date());
 * ```
 */
export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider.');
  }
  return context;
};
