/**
 * Copies text to the system clipboard when the Clipboard API is available.
 *
 * Rejects when the Clipboard API is unavailable or when the browser denies the write.
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  const clipboard = globalThis.navigator?.clipboard;

  if (!clipboard) {
    throw new Error('Clipboard API is not available');
  }

  await clipboard.writeText(text);
};
