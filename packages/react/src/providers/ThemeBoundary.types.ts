import type { ReactNode } from 'react';

/**
 * Props for the ThemeBoundary component.
 *
 * ### Notes
 * `ThemeBoundary` is not a provider. It reads provider context and
 * mirrors brand, color mode, locale, and direction attributes onto a local DOM
 * node for scoped token resolution.
 *
 * ### AI Usage
 * - **DO**: Use only inside a provider tree.
 * - **DON'T**: Use at the app root instead of `ThemeProvider`.
 */
export interface ThemeBoundaryProps {
  /** The content to render inside the themed boundary. */
  children: ReactNode;
  /** Additional CSS class names merged with the boundary's base Panda CSS styles via `cx()`. */
  className?: string;
}
