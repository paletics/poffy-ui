/**
 * Copies text through the Clipboard API, with a document-scoped legacy selection fallback.
 *
 * Use `CopyToClipboardOptions.ownerDocument` when the triggering control belongs to an iframe.
 */
export { copyToClipboard } from './clipboard';

/** Options for selecting the document realm used by {@link copyToClipboard}. */
export type { CopyToClipboardOptions } from './clipboard';
