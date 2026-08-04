import type { SupportedLanguage } from '@/components/typography/Code';
import type { CodeViewerVariantProps } from '@/styled-system/recipes';
import type { NativeProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { OverflowFocusMode } from '@/components/shared/useOverflowFocusability';

/** Shared base props for CodeViewer. */
export interface CodeViewerBaseProps extends CodeViewerVariantProps {
  /** Source text to display. */
  children: string;
  /** Optional visible caption for the source block. */
  caption?: ReactNode;
  /** Syntax highlighting language, applied only while the source is within `maxHighlightedCharacters`. */
  language?: SupportedLanguage;
  /** Show a visual line-number gutter when both line-number limits permit it. */
  showLineNumbers?: boolean;
  /**
   * Maximum source characters to syntax-highlight. Use `0` to disable highlighting or `Infinity`
   * to always highlight. Fractional values are rounded down; negative values, `NaN`, and
   * `-Infinity` use the default limit.
   */
  maxHighlightedCharacters?: number;
  /**
   * Maximum source lines for which to render the visual gutter. Use `0` to disable it or
   * `Infinity` for all lines. Fractional values are rounded down; negative values, `NaN`, and
   * `-Infinity` use the default limit.
   */
  maxLineNumberCount?: number;
  /**
   * Maximum source characters inspected to render the visual line-number gutter. Use `0` to
   * disable it or `Infinity` to inspect all source. Fractional values are rounded down; negative
   * values, `NaN`, and `-Infinity` use the default limit.
   */
  maxLineNumberCharacters?: number;
  /** Controls whether the scrollable body enters the tab order when it overflows. */
  focusMode?: OverflowFocusMode;
  /** Explicit tab index for the scrollable body. Overrides `focusMode`. */
  bodyTabIndex?: number;
}

/** Public props for CodeViewer. */
export type CodeViewerProps = NativeProps<'figure', CodeViewerBaseProps>;
