/** Options for clipboard copying in a document-aware UI. */
export interface CopyToClipboardOptions {
  /**
   * Document whose clipboard realm, focus, and selection should be used. `null` prevents use of an
   * ambient document and therefore disables the selection fallback; omit it for the global realm.
   */
  ownerDocument?: Document | null;
}

const resolveOwnerDocument = (options: CopyToClipboardOptions | undefined) => {
  if (options?.ownerDocument !== undefined) return options.ownerDocument;
  return globalThis.document;
};

const copyWithSelectionFallback = (
  text: string,
  documentRef: Document | null | undefined,
): void => {
  if (!documentRef?.body || typeof documentRef.execCommand !== 'function') {
    throw new Error('Clipboard API is not available');
  }

  const activeElement = documentRef.activeElement;
  const ownerWindow = documentRef.defaultView;
  const activeTextControl =
    ownerWindow &&
    (activeElement instanceof ownerWindow.HTMLInputElement ||
      activeElement instanceof ownerWindow.HTMLTextAreaElement)
      ? activeElement
      : null;
  const selectionStart = activeTextControl?.selectionStart;
  const selectionEnd = activeTextControl?.selectionEnd;
  const selection = documentRef.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : [];

  const textArea = documentRef.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  textArea.style.left = '-9999px';

  documentRef.body.appendChild(textArea);
  textArea.select();

  try {
    if (!documentRef.execCommand('copy')) {
      throw new Error('Clipboard copy command failed');
    }
  } finally {
    textArea.remove();
    if (activeTextControl?.isConnected) {
      activeTextControl.focus();
      if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
        activeTextControl.setSelectionRange(selectionStart, selectionEnd);
      }
    } else if (
      ownerWindow &&
      activeElement instanceof ownerWindow.HTMLElement &&
      activeElement.isConnected
    ) {
      activeElement.focus();
    }
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach((range) => selection.addRange(range));
    }
  }
};

/**
 * Copies text to the system clipboard.
 *
 * Falls back to the legacy selection copy command when the Clipboard API is
 * unavailable or denied by embedded browser contexts. Pass `ownerDocument` for an iframe or
 * other document realm; the fallback uses that realm and restores its prior focus and selection.
 * The promise rejects when neither clipboard strategy is available or the fallback command fails.
 */
export const copyToClipboard = async (
  text: string,
  options?: CopyToClipboardOptions,
): Promise<void> => {
  const documentRef = resolveOwnerDocument(options);
  let navigatorRef = documentRef?.defaultView?.navigator;
  if (!navigatorRef && options?.ownerDocument === undefined) navigatorRef = globalThis.navigator;
  const clipboard = navigatorRef?.clipboard;

  if (clipboard) {
    try {
      await clipboard.writeText(text);
      return;
    } catch {
      copyWithSelectionFallback(text, documentRef);
      return;
    }
  }

  copyWithSelectionFallback(text, documentRef);
};
