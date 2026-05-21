import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('clipboard behavior helpers', () => {
  const originalClipboard = globalThis.navigator.clipboard;

  afterEach(() => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
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

  it('rejects when the Clipboard API is unavailable', async () => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });

    await expect(copyToClipboard('copied text')).rejects.toThrow('Clipboard API is not available');
  });
});
