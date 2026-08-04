'use client';

import { createContext, ReactElement, useContext, useMemo, useState } from 'react';
import type { LocaleContextType, LocaleProviderProps, PoffyLocale } from './LocaleProvider.types';
import { createGlobalDocumentOwnerStack } from './globalDocumentOwnership';
import { ProviderScope } from './ProviderScope';
import { useGlobalDocumentOwner } from './useGlobalDocumentOwner';

/**
 * Public locale provider context and locale value types.
 */
export type { PoffyLocale, LocaleContextType } from './LocaleProvider.types';

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const localeOwnerStack = createGlobalDocumentOwnerStack<PoffyLocale, string | null>({
  capture: (targetDocument) => targetDocument.documentElement.getAttribute('lang'),
  apply: (targetDocument, locale) => targetDocument.documentElement.setAttribute('lang', locale),
  restore: (targetDocument, locale) => {
    if (locale === null) targetDocument.documentElement.removeAttribute('lang');
    else targetDocument.documentElement.setAttribute('lang', locale);
  },
});

/**
 * Provides a BCP 47 locale to a subtree. At the application root, `global` synchronizes `lang` to
 * the owner document; with `global={false}` and `scope`, it applies only to the local subtree.
 */
export const LocaleProvider = ({
  children,
  defaultLocale = 'en-US',
  global = true,
  ownerDocument,
  scope = false,
}: LocaleProviderProps): ReactElement => {
  const [locale, setLocale] = useState<PoffyLocale>(defaultLocale);
  useGlobalDocumentOwner(localeOwnerStack, locale, global, ownerDocument);

  const contextValue = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <LocaleContext.Provider value={contextValue}>
      {!global && scope ? <ProviderScope locale={locale}>{children}</ProviderScope> : children}
    </LocaleContext.Provider>
  );
};

/** Returns the nearest locale and setter, or throws when no provider is present. */
export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider.');
  }
  return context;
};

/** Returns the nearest locale context when one exists. */
export const useOptionalLocale = (): LocaleContextType | undefined => useContext(LocaleContext);
