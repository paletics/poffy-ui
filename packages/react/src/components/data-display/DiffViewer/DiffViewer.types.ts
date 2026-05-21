import type { PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';

/**
 * Public layout mode for DiffViewer.
 */
export type DiffViewerMode = 'unified' | 'split';

/**
 * Public size for DiffViewer.
 */
export type DiffViewerSize = 'sm' | 'md';

/**
 * Visual meaning of a single diff line.
 */
export type DiffChangeKind = 'added' | 'removed' | 'modified' | 'unchanged';

/**
 * A single line in a diff hunk.
 */
export interface DiffLine {
  /** Stable key for rendering a line when the source diff already provides one. */
  id?: string;
  /**
   * Semantic change kind used to choose color and sign treatment.
   *
   * @defaultValue `'unchanged'`
   */
  kind?: DiffChangeKind;
  /** Original-side line number. Leave undefined for inserted-only lines. */
  oldLineNumber?: number | string;
  /** New-side line number. Leave undefined for removed-only lines. */
  newLineNumber?: number | string;
  /** Rendered text or inline markup for the line content. */
  content: ReactNode;
}

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
 * Base properties for DiffViewer.
 */
export interface DiffViewerBaseProps {
  /**
   * Ordered groups of changed lines to display.
   *
   * ### Notes
   * Preserve source order. Do not sort added and removed lines separately.
   */
  hunks: DiffHunk[];
  /** Optional accessible caption rendered with the figure. */
  caption?: ReactNode;
  /**
   * Label for the original side in split mode.
   *
   * @defaultValue `'Before'`
   */
  oldLabel?: string;
  /**
   * Label for the changed side in split mode.
   *
   * @defaultValue `'After'`
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
}

/**
 * Props for the generic diff display root.
 */
export type DiffViewerProps = PrimitiveProps<'figure', DiffViewerBaseProps>;
