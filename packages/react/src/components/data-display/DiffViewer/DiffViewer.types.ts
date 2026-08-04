import type { PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { OverflowFocusMode } from '@/components/shared/useOverflowFocusability';
import type { DiffViewerMessages } from './DiffViewer.locales';

/**
 * Public layout mode for DiffViewer.
 */
export type DiffViewerMode = 'unified' | 'split';

/**
 * Public size for DiffViewer.
 */
export type DiffViewerSize = 'sm' | 'md';

/**
 * Explicit supporting information shown through the DiffViewer caption disclosure.
 *
 * Keep `summary` specific to the hidden information. The disclosure is closed by
 * default and never activates based on caption length or container width.
 */
export interface DiffViewerCaptionDisclosure {
  /** Persistent native disclosure label. */
  summary: ReactNode;
  /** Supporting caption information revealed on request. */
  content: ReactNode;
  /** Whether the native disclosure is initially open. */
  defaultOpen?: boolean;
}

/**
 * Visual meaning of a single diff line.
 */
export type DiffChangeKind = 'added' | 'removed' | 'modified' | 'unchanged';

interface DiffLineBase {
  /** Stable key for rendering a line when the source diff already provides one. */
  id?: string;
  /** Original-side line number. Leave undefined for inserted-only lines. */
  oldLineNumber?: number | string;
  /** New-side line number. Leave undefined for removed-only lines. */
  newLineNumber?: number | string;
}

interface OrdinaryDiffLine extends DiffLineBase {
  /**
   * Semantic change kind used to choose color and sign treatment.
   *
   * @defaultValue `'unchanged'`
   */
  kind?: Exclude<DiffChangeKind, 'modified'>;
  /** Rendered text or inline markup for the line content. */
  content: ReactNode;
  oldContent?: never;
  newContent?: never;
}

interface ModifiedDiffLine extends DiffLineBase {
  kind: 'modified';
  /** Unified-mode representation of the modified line. */
  content: ReactNode;
  /** Original-side content rendered in split mode. */
  oldContent: ReactNode;
  /** Changed-side content rendered in split mode. */
  newContent: ReactNode;
}

/**
 * A single line in a diff hunk. Modified lines must provide both split-side
 * values in addition to their unified representation.
 */
export type DiffLine = OrdinaryDiffLine | ModifiedDiffLine;
/**
 * A grouped diff hunk with optional header text.
 */
export interface DiffHunk {
  /** Stable key for rendering a hunk when the source diff already provides one. */
  id?: string;
  /** Optional header such as `@@ -1,4 +1,5 @@` or a filename label. */
  header?: ReactNode;
  /** Ordered diff lines in this hunk. */
  lines: DiffLine[];
}

/**
 * Properties shared by every DiffViewer caption mode.
 */
interface DiffViewerCommonProps {
  /**
   * Ordered groups of changed lines to display.
   *
   * ### Notes
   * Preserve source order. Do not sort added and removed lines separately.
   */
  hunks: DiffHunk[];
  /**
   * Label for the original side in split mode.
   *
   * @defaultValue `'Old line'`
   */
  oldLabel?: string;
  /**
   * Label for the changed side in split mode.
   *
   * @defaultValue `'New line'`
   */
  newLabel?: string;
  /**
   * Layout mode for rendering hunks.
   *
   * @defaultValue `'unified'`
   */
  mode?: DiffViewerMode;
  /**
   * Compactness of row spacing and text.
   *
   * @defaultValue `'md'`
   */
  size?: DiffViewerSize;
  /**
   * Maximum diff lines rendered before an omission summary. Use `0` to render only the summary
   * or `Infinity` to render all lines. Fractional values are rounded down; negative values,
   * `NaN`, and `-Infinity` use the default limit.
   */
  maxRenderedRows?: number;
  /** Controls whether the scrollable body enters the tab order when it overflows. */
  focusMode?: OverflowFocusMode;
  /** Explicit tab index for the scrollable body. Overrides `focusMode`. */
  bodyTabIndex?: number;
  /** BCP 47 locale overriding the nearest LocaleProvider for default accessible text. */
  locale?: string;
  /** Overrides localized accessible text. */
  messages?: Partial<DiffViewerMessages>;
}

type VisibleDiffViewerCaption = Exclude<ReactNode, boolean | null | undefined>;

/**
 * Base properties for DiffViewer.
 *
 * Supporting disclosure content requires a persistent visible caption. The
 * disclosure must not become the only source of comparison context.
 */
export type DiffViewerBaseProps =
  | (DiffViewerCommonProps & {
      /** Optional accessible caption rendered with the figure. */
      caption?: ReactNode;
      captionDisclosure?: never;
    })
  | (DiffViewerCommonProps & {
      /** Persistent visible caption identifying the compared content. */
      caption: VisibleDiffViewerCaption;
      /**
       * Supporting information rendered as an explicit native disclosure.
       *
       * Use this only for information that is not required to identify or interpret the
       * current diff. Keep essential context in `caption` or the surrounding interface.
       */
      captionDisclosure: DiffViewerCaptionDisclosure;
    });

/**
 * Props for the generic diff display root. `asChild` accepts a native `figure`.
 */
export type DiffViewerProps = PrimitiveProps<'figure', DiffViewerBaseProps>;
