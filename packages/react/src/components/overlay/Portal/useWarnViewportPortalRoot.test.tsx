import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWarnViewportPortalRoot } from './useWarnViewportPortalRoot';

/**
 * ### Test Strategy: viewport portal diagnostics
 * - **Focus**: Warn for configured roots beneath fixed-position containing blocks,
 *   including ShadowRoot hosts, without warning for viewport-compatible roots.
 * - **DON'T**: Do not assert browser layout bounds; transformed fixed positioning is
 *   covered by overlay browser tests.
 */
describe('useWarnViewportPortalRoot', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it('warns once for a transformed portal ancestor', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const ancestor = document.createElement('div');
    ancestor.style.transform = 'translateZ(0)';
    const target = document.createElement('div');
    ancestor.append(target);
    document.body.append(ancestor);

    const { rerender } = renderHook(
      ({ root }) =>
        useWarnViewportPortalRoot({
          componentName: 'TestViewportOverlay',
          enabled: true,
          target: root,
        }),
      { initialProps: { root: target as Element | DocumentFragment | null } },
    );
    rerender({ root: target });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('viewport-scoped'));
  });

  it('checks the host ancestry for a shadow portal root', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const host = document.createElement('div');
    host.style.contain = 'paint';
    const shadowRoot = host.attachShadow({ mode: 'open' });
    document.body.append(host);

    renderHook(() =>
      useWarnViewportPortalRoot({
        componentName: 'TestShadowViewportOverlay',
        enabled: true,
        target: shadowRoot,
      }),
    );

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('crosses a shadow boundary when the configured target is an element', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const ancestor = document.createElement('div');
    ancestor.style.transform = 'translateZ(0)';
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const target = document.createElement('div');
    shadowRoot.append(target);
    ancestor.append(host);
    document.body.append(ancestor);

    renderHook(() =>
      useWarnViewportPortalRoot({
        componentName: 'TestShadowElementViewportOverlay',
        enabled: true,
        target,
      }),
    );

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['container-type', { containerType: 'inline-size' }],
    ['content-visibility', { contentVisibility: 'auto' }],
  ])('warns for a %s fixed containing block', (_property, styleOverride) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const target = document.createElement('div');
    document.body.append(target);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      transform: 'none',
      perspective: 'none',
      filter: 'none',
      backdropFilter: 'none',
      contain: 'none',
      willChange: 'auto',
      containerType: 'normal',
      contentVisibility: 'visible',
      ...styleOverride,
    } as CSSStyleDeclaration);

    renderHook(() =>
      useWarnViewportPortalRoot({
        componentName: `Test${_property}ViewportOverlay`,
        enabled: true,
        target,
      }),
    );

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('does not warn for a viewport-compatible root', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const target = document.createElement('div');
    document.body.append(target);

    renderHook(() =>
      useWarnViewportPortalRoot({
        componentName: 'TestSafeViewportOverlay',
        enabled: true,
        target,
      }),
    );

    expect(warn).not.toHaveBeenCalled();
  });
});
