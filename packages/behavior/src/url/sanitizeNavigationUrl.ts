/** Options that extend the conservative navigation URL allowlist. */
export interface SanitizeNavigationUrlOptions {
  /**
   * Whether `mailto:` destinations are permitted in addition to fragments, relative paths, and
   * absolute `http:`/`https:` URLs.
   *
   * @defaultValue `false`
   */
  allowMailto?: boolean;
}

const hasUnsafeUrlCharacter = (value: string) =>
  Array.from(value).some((character) => {
    const code = character.codePointAt(0) ?? 0;
    return character === '\\' ? true : code <= 0x1f ? true : code === 0x7f;
  });

/**
 * Returns an unchanged destination only when it matches the navigation URL allowlist.
 *
 * Fragments, slash-relative paths, and `./` or `../` paths are accepted, as are absolute
 * `http:` and `https:` URLs. `mailto:` requires `allowMailto`. The function rejects surrounding
 * whitespace, control characters, backslashes, protocol-relative URLs, credentials, and all
 * other schemes, returning `undefined`. It does not validate the destination's host or establish
 * that a permitted URL is trustworthy.
 */
export const sanitizeNavigationUrl = (
  href: string,
  { allowMailto = false }: SanitizeNavigationUrlOptions = {},
): string | undefined => {
  if (href !== href.trim() || hasUnsafeUrlCharacter(href)) return undefined;
  if (!href || href.startsWith('//')) return undefined;
  if (
    href.startsWith('#') ||
    href.startsWith('/') ||
    href.startsWith('./') ||
    href.startsWith('../')
  )
    return href;
  try {
    const parsed = new URL(href);
    if (parsed.username || parsed.password) return undefined;
    const { protocol } = parsed;
    return protocol === 'http:' || protocol === 'https:' || (allowMailto && protocol === 'mailto:')
      ? href
      : undefined;
  } catch {
    return undefined;
  }
};
