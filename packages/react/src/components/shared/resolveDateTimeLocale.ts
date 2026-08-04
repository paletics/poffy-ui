/**
 * Returns a canonical locale supported by DateTimeFormat, or a stable fallback.
 * This keeps date and time inputs resilient to malformed locale props or providers.
 */
export const resolveDateTimeLocale = (locale: string): string => {
  try {
    const canonicalLocale = Intl.getCanonicalLocales(locale)[0];
    return canonicalLocale && Intl.DateTimeFormat.supportedLocalesOf([canonicalLocale]).length > 0
      ? canonicalLocale
      : 'en-US';
  } catch {
    return 'en-US';
  }
};
