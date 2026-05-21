import type { ReactNode } from 'react';

/**
 * A BCP 47 language tag string (e.g. `'en-US'`, `'ja-JP'`, `'ar-SA'`).
 * Used to drive `Intl.*` APIs and the `lang` attribute on the root element.
 * Pass directly to `Intl.NumberFormat`, `Intl.DateTimeFormat`, or `Intl.RelativeTimeFormat` constructors.
 */
export type PoffyLocale = string;

/**
 * Shape of the value exposed by `LocaleContext`.
 * Use to type the return value of `useLocale()` or when extending the context.
 */
export interface LocaleContextType {
  /** The currently active BCP 47 locale string (e.g. `'en-US'`). */
  locale: PoffyLocale;
  /** Sets the active locale. */
  setLocale: (locale: PoffyLocale) => void;
}

/**
 * Props for the `LocaleProvider` component.
 */
export interface LocaleProviderProps {
  /** The React subtree that receives locale context. */
  children: ReactNode;
  /**
   * The BCP 47 locale string applied on first render.
   *
   * @defaultValue `'en-US'`
   */
  defaultLocale?: PoffyLocale;
  /**
   * When `true`, syncs the `lang` attribute to `document.documentElement`.
   * Set to `false` when scoping locale to a subtree only.
   *
   * @defaultValue `true`
   */
  global?: boolean;
}
