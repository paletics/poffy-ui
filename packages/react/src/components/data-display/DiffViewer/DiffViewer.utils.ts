import { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { DiffHunk } from './DiffViewer.types';

export const isDiffViewerAsChildHost = (children: ReactNode): children is ReactElement =>
  isValidElement(children) && typeof children.type === 'string' && children.type === 'figure';

export const limitDiffViewerHunks = (hunks: DiffHunk[], maxRows: number) => {
  if (maxRows === Infinity) return { hunks, omittedRows: 0 };
  let remaining = maxRows;
  let omittedRows = 0;
  const visibleHunks = hunks.flatMap((hunk) => {
    if (remaining <= 0) {
      omittedRows += hunk.lines.length;
      return [];
    }
    const lines = hunk.lines.slice(0, remaining);
    remaining -= lines.length;
    omittedRows += hunk.lines.length - lines.length;
    return lines.length > 0 ? [{ ...hunk, lines }] : [];
  });
  return { hunks: visibleHunks, omittedRows };
};
