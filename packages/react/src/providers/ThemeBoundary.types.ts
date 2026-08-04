import type { ReactNode } from 'react';
import type { ThemeTokenOverrides } from './theme-token-overrides';

/** Props for a local DOM boundary that mirrors nearest theme-provider state. */
export interface ThemeBoundaryProps {
  /** The content to render inside the themed boundary. */
  children: ReactNode;
  /** Additional CSS class names merged with the boundary's base Panda CSS styles via `cx()`. */
  className?: string;
  /** Runtime values for `--poffy-*` CSS custom properties in this subtree. */
  tokenOverrides?: ThemeTokenOverrides;
}
