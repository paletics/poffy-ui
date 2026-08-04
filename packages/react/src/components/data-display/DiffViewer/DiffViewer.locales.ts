import type { DiffChangeKind } from './DiffViewer.types';

/** Localized labels and formatters used by DiffViewer's accessible structure. */
export interface DiffViewerMessages {
  diff: string;
  oldLine: string;
  newLine: string;
  change: (kind: DiffChangeKind) => string;
  omittedRows: (count: number) => string;
}

const ENGLISH_MESSAGES: DiffViewerMessages = {
  diff: 'Diff',
  oldLine: 'Old line',
  newLine: 'New line',
  change: (kind) =>
    `${{ added: 'Added', removed: 'Removed', modified: 'Modified', unchanged: 'Unchanged' }[kind]} change`,
  omittedRows: (count) => `${count} diff rows omitted`,
};

const JAPANESE_MESSAGES: DiffViewerMessages = {
  diff: '差分',
  oldLine: '変更前の行',
  newLine: '変更後の行',
  change: (kind) =>
    `${{ added: '追加', removed: '削除', modified: '変更', unchanged: '変更なし' }[kind]}行`,
  omittedRows: (count) => `${count}行の差分を省略`,
};

export const getDiffViewerMessages = (
  locale = 'en-US',
  overrides?: Partial<DiffViewerMessages>,
): DiffViewerMessages => {
  const normalized = locale.toLowerCase();
  const defaults =
    normalized === 'ja' || normalized.startsWith('ja-') ? JAPANESE_MESSAGES : ENGLISH_MESSAGES;
  return { ...defaults, ...overrides };
};
