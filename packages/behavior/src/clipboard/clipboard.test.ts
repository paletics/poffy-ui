import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('clipboard behavior helpers', () => {
  const originalClipboard = globalThis.navigator.clipboard;
  const originalExecCommand = globalThis.document.execCommand;

  afterEach(() => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    });
    Object.defineProperty(globalThis.document, 'execCommand', {
      configurable: true,
      value: originalExecCommand,
    });
  });

  it('writes text to the Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    await copyToClipboard('copied text');

    expect(writeText).toHaveBeenCalledWith('copied text');
  });

  it('falls back to selection copy when the Clipboard API is unavailable', async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis.document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });

    await copyToClipboard('copied text');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(globalThis.document.querySelector('textarea')).toBeNull();
  });

  it('restores the active text control and its selection after fallback copy', async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis.document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });
    const input = globalThis.document.createElement('input');
    input.value = 'selected text';
    globalThis.document.body.appendChild(input);
    input.focus();
    input.setSelectionRange(2, 10);

    await copyToClipboard('copied text');

    expect(globalThis.document.activeElement).toBe(input);
    expect(input.selectionStart).toBe(2);
    expect(input.selectionEnd).toBe(10);
    input.remove();
  });

  it('falls back to selection copy when the Clipboard API rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError'));
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(globalThis.document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });

    await copyToClipboard('copied text');

    expect(writeText).toHaveBeenCalledWith('copied text');
    expect(execCommand).toHaveBeenCalledWith('copy');
  });

  it('rejects when both clipboard strategies fail', async () => {
    const execCommand = vi.fn().mockReturnValue(false);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis.document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });

    await expect(copyToClipboard('copied text')).rejects.toThrow('Clipboard copy command failed');
  });

  it('uses the supplied document realm for fallback focus and selection', async () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const ownerDocument = iframe.contentDocument as Document;
    const ownerWindow = iframe.contentWindow as Window;
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(ownerWindow.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(ownerDocument, 'execCommand', {
      configurable: true,
      value: execCommand,
    });
    const input = ownerDocument.createElement('input');
    input.value = 'selected text';
    ownerDocument.body.appendChild(input);
    input.focus();
    input.setSelectionRange(1, 8);

    await copyToClipboard('copied in iframe', { ownerDocument });

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(ownerDocument.querySelector('textarea')).toBeNull();
    expect(ownerDocument.activeElement).toBe(input);
    expect(input.selectionStart).toBe(1);
    expect(input.selectionEnd).toBe(8);
    iframe.remove();
  });

  it('treats an explicitly null owner document as unavailable', async () => {
    await expect(copyToClipboard('copied text', { ownerDocument: null })).rejects.toThrow(
      'Clipboard API is not available',
    );
  });
});
