import { sanitizeNavigationUrl } from '../url';

/**
 * Sanitizes a Markdown destination after trimming authoring whitespace and allowing `mailto:`.
 *
 * @deprecated This Markdown-specific policy remains for `parseMarkdown`; use
 * `sanitizeNavigationUrl` for non-Markdown navigation, where whitespace and `mailto:` require an
 * explicit caller policy.
 */
export const sanitizeMarkdownUrl = (href: string): string | undefined =>
  sanitizeNavigationUrl(href.trim(), { allowMailto: true });
