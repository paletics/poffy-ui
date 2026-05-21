import { renderHook, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { useImage } from './useImage';

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin?: string;
  src = '';

  constructor() {
    setTimeout(() => {
      if (this.src.includes('broken')) {
        this.onerror?.();
      } else if (this.src) {
        this.onload?.();
      }
    }, 0);
  }
}

describe('useImage', () => {
  beforeAll(() => {
    vi.stubGlobal('Image', MockImage);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('starts pending without a src', () => {
    const { result } = renderHook(() => useImage({}));

    expect(result.current.status).toBe('pending');
  });

  it('reports loaded and calls onLoad', async () => {
    const onLoad = vi.fn();
    const { result } = renderHook(() => useImage({ src: 'image.jpg', onLoad }));

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('loaded'));
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('reports failed and calls onError', async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useImage({ src: 'broken.jpg', onError }));

    await waitFor(() => expect(result.current.status).toBe('failed'));
    expect(onError).toHaveBeenCalledTimes(1);
  });
});
