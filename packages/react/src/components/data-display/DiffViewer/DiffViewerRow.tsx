import { diffViewer } from '@/styled-system/recipes';
import type { DiffChangeKind, DiffLine, DiffViewerProps } from './DiffViewer.types';

const markerByKind: Record<DiffChangeKind, string> = {
  added: '+',
  removed: '-',
  modified: '~',
  unchanged: ' ',
};

const lineNumber = (value: DiffLine['oldLineNumber'] | DiffLine['newLineNumber']) =>
  value === undefined || value === null ? '' : String(value);

interface DiffViewerRowProps {
  line: DiffLine;
  mode: NonNullable<DiffViewerProps['mode']>;
  classes: ReturnType<typeof diffViewer>;
  oldLabel: string;
  newLabel: string;
  changeLabel: (kind: DiffChangeKind) => string;
}

/**
 * Renders one DiffViewer row in unified or split mode.
 */
export const DiffViewerRow = ({
  line,
  mode,
  classes,
  oldLabel,
  newLabel,
  changeLabel,
}: DiffViewerRowProps) => {
  const kind = line.kind ?? 'unchanged';
  const oldNumber = lineNumber(line.oldLineNumber);
  const newNumber = lineNumber(line.newLineNumber);
  const oldContent =
    kind === 'added' ? '' : kind === 'modified' ? (line.oldContent ?? line.content) : line.content;
  const newContent =
    kind === 'removed'
      ? ''
      : kind === 'modified'
        ? (line.newContent ?? line.content)
        : line.content;

  if (mode === 'split') {
    return (
      <div className={classes.row} role="row" data-change={kind} aria-label={changeLabel(kind)}>
        <span className={classes.gutter} role="cell" aria-label={`${oldLabel} ${oldNumber}`}>
          {oldNumber}
        </span>
        <span className={classes.marker} role="cell" aria-hidden="true">
          {kind === 'added' ? ' ' : markerByKind[kind]}
        </span>
        <code className={classes.content} role="cell">
          {oldContent}
        </code>
        <span className={classes.gutter} role="cell" aria-label={`${newLabel} ${newNumber}`}>
          {newNumber}
        </span>
        <code className={classes.content} role="cell">
          {newContent}
        </code>
      </div>
    );
  }

  return (
    <div className={classes.row} role="row" data-change={kind} aria-label={changeLabel(kind)}>
      <span className={classes.gutter} role="cell" aria-label={`${oldLabel} ${oldNumber}`}>
        {oldNumber}
      </span>
      <span className={classes.gutter} role="cell" aria-label={`${newLabel} ${newNumber}`}>
        {newNumber}
      </span>
      <span className={classes.marker} role="cell" aria-hidden="true">
        {markerByKind[kind]}
      </span>
      <code className={classes.content} role="cell">
        {line.content}
      </code>
    </div>
  );
};
