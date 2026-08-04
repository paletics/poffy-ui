import { act, render, renderHook } from '@testing-library/react';
import { createElement, StrictMode, Suspense, type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

interface MockMediaQueryList extends MediaQueryList {
  dispatch: (matches: boolean) => void;
}

const createMediaQueryList = (initialMatches = false, legacy = false): MockMediaQueryList => {
  const listeners = new Set<() => void>();
  let currentMatches = initialMatches;
  const mediaQuery = {
    get matches() {
      return currentMatches;
    },
    media: '(test)',
    onchange: null,
    addEventListener: legacy
      ? undefined
      : vi.fn((_type, listener: () => void) => listeners.add(listener)),
    removeEventListener: legacy
      ? undefined
      : vi.fn((_type, listener: () => void) => listeners.delete(listener)),
    addListener: vi.fn((listener: () => void) => listeners.add(listener)),
    removeListener: vi.fn((listener: () => void) => listeners.delete(listener)),
    dispatchEvent: vi.fn(),
    dispatch(matches: boolean) {
      currentMatches = matches;
      [...listeners].forEach((listener) => listener());
    },
  };
  return mediaQuery as unknown as MockMediaQueryList;
};

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.resolve();
});

describe('useMediaQuery', () => {
  it('shares one native listener for the same query', () => {
    const mediaQueries: MockMediaQueryList[] = [];
    vi.spyOn(window, 'matchMedia').mockImplementation(() => {
      const mediaQuery = createMediaQueryList();
      mediaQueries.push(mediaQuery);
      return mediaQuery;
    });
    const { result, unmount } = renderHook(() => [
      useMediaQuery('(shared)'),
      useMediaQuery('(shared)'),
    ]);

    expect(mediaQueries).not.toHaveLength(0);
    expect(
      mediaQueries.reduce(
        (count, mediaQuery) => count + vi.mocked(mediaQuery.addEventListener).mock.calls.length,
        0,
      ),
    ).toBe(1);

    const canonicalMediaQuery = mediaQueries.find(
      (mediaQuery) => vi.mocked(mediaQuery.addEventListener).mock.calls.length === 1,
    );
    expect(canonicalMediaQuery).toBeDefined();
    act(() => canonicalMediaQuery?.dispatch(true));
    expect(result.current).toEqual([true, true]);

    unmount();
    expect(canonicalMediaQuery?.removeEventListener).toHaveBeenCalledOnce();
  });

  it('releases the canonical store after the last consumer unmounts', () => {
    const mediaQueries: MockMediaQueryList[] = [];
    vi.spyOn(window, 'matchMedia').mockImplementation(() => {
      const mediaQuery = createMediaQueryList();
      mediaQueries.push(mediaQuery);
      return mediaQuery;
    });

    const first = renderHook(() => useMediaQuery('(remount)'));
    first.unmount();
    const second = renderHook(() => useMediaQuery('(remount)'));

    expect(mediaQueries).toHaveLength(2);
    expect(mediaQueries[0]?.removeEventListener).toHaveBeenCalledOnce();
    expect(mediaQueries[1]?.addEventListener).toHaveBeenCalledOnce();
    second.unmount();
  });

  it('does not retain or subscribe an abandoned render', () => {
    const mediaQueries: MockMediaQueryList[] = [];
    vi.spyOn(window, 'matchMedia').mockImplementation(() => {
      const mediaQuery = createMediaQueryList();
      mediaQueries.push(mediaQuery);
      return mediaQuery;
    });
    const pending = new Promise<never>(() => undefined);
    const AbandonedProbe = () => {
      useMediaQuery('(abandoned)');
      throw pending;
    };

    render(
      createElement(
        Suspense,
        { fallback: createElement('span', null, 'fallback') },
        createElement(AbandonedProbe),
      ),
    );

    expect(mediaQueries).not.toHaveLength(0);
    expect(
      mediaQueries.every((mediaQuery) => !vi.mocked(mediaQuery.addEventListener).mock.calls.length),
    ).toBe(true);

    const abandonedCount = mediaQueries.length;
    const committed = renderHook(() => useMediaQuery('(abandoned)'));
    expect(mediaQueries).toHaveLength(abandonedCount + 1);
    expect(mediaQueries.at(-1)?.addEventListener).toHaveBeenCalledOnce();
    committed.unmount();
  });

  it('moves the subscription when the query changes', () => {
    const first = createMediaQueryList();
    const second = createMediaQueryList(true);
    vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
      query === '(first)' ? first : second,
    );
    const { result, rerender, unmount } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(first)' },
    });

    rerender({ query: '(second)' });
    expect(result.current).toBe(true);
    expect(first.removeEventListener).toHaveBeenCalledOnce();
    expect(second.addEventListener).toHaveBeenCalledOnce();
    unmount();
  });

  it('supports legacy MediaQueryList listeners', () => {
    const mediaQuery = createMediaQueryList(false, true);
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery);
    const { result, unmount } = renderHook(() => useMediaQuery('(legacy)'));

    expect(mediaQuery.addListener).toHaveBeenCalledOnce();
    act(() => mediaQuery.dispatch(true));
    expect(result.current).toBe(true);
    unmount();
    expect(mediaQuery.removeListener).toHaveBeenCalledOnce();
  });

  it('keeps native listener setup and cleanup balanced in StrictMode', () => {
    const mediaQuery = createMediaQueryList();
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery);
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(StrictMode, null, children);
    const { unmount } = renderHook(() => useMediaQuery('(strict)'), { wrapper });

    expect(mediaQuery.addEventListener).toHaveBeenCalledTimes(
      vi.mocked(mediaQuery.removeEventListener).mock.calls.length + 1,
    );

    unmount();
    expect(mediaQuery.addEventListener).toHaveBeenCalledTimes(
      vi.mocked(mediaQuery.removeEventListener).mock.calls.length,
    );
  });

  it('uses a per-consumer server snapshot without calling matchMedia', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia');
    matchMedia.mockClear();
    const Probe = ({ defaultMatches }: { defaultMatches: boolean }) =>
      createElement('span', null, String(useMediaQuery('(ssr)', { defaultMatches })));

    expect(renderToString(createElement(Probe, { defaultMatches: false }))).toContain('false');
    expect(renderToString(createElement(Probe, { defaultMatches: true }))).toContain('true');
    expect(matchMedia).not.toHaveBeenCalled();
  });
});
