import '@testing-library/jest-dom';
import React from 'react';
import { expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
import type { AxeMatchers } from 'vitest-axe/matchers';

expect.extend(matchers);

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  export interface Assertion<T = any> extends AxeMatchers {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

// IntersectionObserver Mock
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: readonly number[] = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// ResizeObserver Mock
class ResizeObserverMock {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// matchMedia Mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// motion/react: replace AnimatePresence with a pass-through so exit animations
// complete synchronously in JSDOM (avoids elements staying in DOM after unmount).
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Theme Hooks Mock
vi.mock('@/providers', () => ({
  useBrand: vi.fn(() => ({ brand: 'pome' })),
  useColorMode: vi.fn(() => ({ colorMode: 'light', resolvedColorMode: 'light' })),
  ColorModeProvider: ({ children }: { children: React.ReactNode }) => children,
  PoffyBrandProvider: ({ children }: { children: React.ReactNode }) => children,
}));
