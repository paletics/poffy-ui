/**
 * Formats a file size in a compact human-readable form.
 *
 * Uses binary 1024-byte units and at most one decimal place. Values above the
 * largest declared unit continue to scale numerically against the last unit.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';

  const kilo = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(kilo)), sizes.length - 1);

  return `${parseFloat((bytes / kilo ** index).toFixed(1))} ${sizes[index]}`;
};

/**
 * Minimal shape required for file acceptance checks.
 *
 * This mirrors the File fields used by FileUploader behavior and allows tests or
 * server-provided file records to reuse the same accept/max-size checks.
 */
export interface FileUploadCandidate {
  name: string;
  size: number;
  type: string;
}

/**
 * Options used to decide whether a selected or dropped file should be accepted.
 *
 * `accept` uses native input accept tokens such as `"image/*"`, `".pdf"`, or
 * `"application/json"`. `maxSize` is inclusive and measured in bytes. These
 * helpers only validate file metadata; React upload components should still
 * render status, errors, keyboard-accessible browse controls, and form
 * integration.
 */
export interface FileUploadAcceptOptions {
  accept?: string;
  maxSize?: number;
}

/** Reasons a file can be rejected by the uploader constraints. */
export type FileUploadRejectionReason = 'accept' | 'max-size';

/** Rejection reasons produced while reconciling one uploader selection. */
export type FileUploadSelectionRejectionReason = FileUploadRejectionReason | 'too-many-files';

/** A rejected candidate and every constraint that rejected it. */
export interface FileUploadRejection<TFile extends FileUploadCandidate = FileUploadCandidate> {
  file: TFile;
  reasons: FileUploadSelectionRejectionReason[];
}

/** Candidate plus stable UI identity retained while the same object remains selected. */
export interface FileUploadItem<TFile extends FileUploadCandidate = FileUploadCandidate> {
  file: TFile;
  id: string;
}

/**
 * Stable file-item identities and the next monotonic ID returned by `createFileUploadItems`.
 * Pass both values into the next reconciliation so repeated candidate references retain their IDs.
 */
export interface FileUploadItemState<TFile extends FileUploadCandidate = FileUploadCandidate> {
  fileItems: FileUploadItem<TFile>[];
  nextFileId: number;
}

/**
 * Returns every configured constraint that rejects a file.
 *
 * Invalid maximum sizes are treated as an omitted constraint so a transient
 * invalid configuration does not reject every user-selected file.
 */
export const getFileUploadRejectionReasons = (
  file: FileUploadCandidate,
  { accept, maxSize }: FileUploadAcceptOptions = {},
): FileUploadRejectionReason[] => {
  const reasons: FileUploadRejectionReason[] = [];
  const normalizedMaxSize =
    typeof maxSize === 'number' && Number.isFinite(maxSize) && maxSize >= 0 ? maxSize : undefined;

  if (normalizedMaxSize !== undefined && file.size > normalizedMaxSize) {
    reasons.push('max-size');
  }

  const acceptTokens = parseAcceptTokens(accept);
  if (acceptTokens.length === 0) return reasons;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  const isAccepted = acceptTokens.some((token) => {
    if (token.startsWith('.')) return fileName.endsWith(token);
    if (token.endsWith('/*')) return fileType.startsWith(token.slice(0, -1));
    return fileType === token;
  });

  if (!isAccepted) reasons.push('accept');
  return reasons;
};

const parseAcceptTokens = (accept?: string): string[] =>
  accept
    ?.split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean) ?? [];

/**
 * Returns true when a file passes the same accept/max-size rules used by the uploader.
 *
 * An omitted or empty `accept` string accepts every MIME type/extension. Token
 * matching is case-insensitive and supports extension, exact MIME, and wildcard
 * MIME-family tokens.
 */
export const acceptsFileUpload = (
  file: FileUploadCandidate,
  options: FileUploadAcceptOptions = {},
): boolean => getFileUploadRejectionReasons(file, options).length === 0;

/**
 * Filters a list of selected or dropped files by accept/max-size rules.
 *
 * The original iterable order is preserved, and rejected files are omitted
 * rather than reported. Components that need rejection messaging should compare
 * the source iterable with the returned array.
 */
export const filterAcceptedFiles = <TFile extends FileUploadCandidate>(
  files: Iterable<TFile>,
  options: FileUploadAcceptOptions = {},
): TFile[] => Array.from(files).filter((file) => acceptsFileUpload(file, options));

/**
 * Creates stable item identities, reusing ids for retained candidate objects.
 *
 * Repeated references to the same candidate reuse prior ids in occurrence order; newly observed
 * occurrences receive monotonically increasing `file-N` ids beginning at `startingId`.
 */
export const createFileUploadItems = <TFile extends FileUploadCandidate>(
  files: TFile[],
  startingId: number,
  previousItems: FileUploadItem<TFile>[] = [],
): FileUploadItemState<TFile> => {
  const idsByFile = new Map<TFile, string[]>();
  let nextFileId = startingId;

  for (const item of previousItems) {
    idsByFile.set(item.file, [...(idsByFile.get(item.file) ?? []), item.id]);
  }

  return {
    fileItems: files.map((file) => ({
      file,
      id: idsByFile.get(file)?.shift() ?? `file-${nextFileId++}`,
    })),
    nextFileId,
  };
};

/**
 * Applies type, size, and multiplicity constraints to an existing selection.
 *
 * Rejected files are discarded without rejection details. Use `resolveFileUploadSelection` when
 * the caller must surface individual rejection reasons.
 */
export const normalizeFileUploadCandidates = <TFile extends FileUploadCandidate>(
  files: Iterable<TFile>,
  options: FileUploadAcceptOptions & { multiple: boolean },
): TFile[] => {
  const acceptedFiles = filterAcceptedFiles(files, options);
  return options.multiple ? acceptedFiles : acceptedFiles.slice(0, 1);
};

/**
 * Splits a new selection into accepted candidates and detailed rejections.
 *
 * Candidates that pass metadata constraints but exceed single-file multiplicity are returned as
 * `too-many-files` rejections; the first accepted candidate remains selected.
 */
export const resolveFileUploadSelection = <TFile extends FileUploadCandidate>(
  candidates: Iterable<TFile>,
  options: FileUploadAcceptOptions & { multiple: boolean },
): { acceptedFiles: TFile[]; rejections: FileUploadRejection<TFile>[] } => {
  const files = Array.from(candidates);
  const acceptedFiles = filterAcceptedFiles(files, options);
  const rejections: FileUploadRejection<TFile>[] = files.flatMap((file) => {
    const reasons = getFileUploadRejectionReasons(file, options);
    return reasons.length > 0 ? [{ file, reasons }] : [];
  });

  if (!options.multiple && acceptedFiles.length > 1) {
    rejections.push(
      ...acceptedFiles.slice(1).map((file) => ({
        file,
        reasons: ['too-many-files'] as FileUploadSelectionRejectionReason[],
      })),
    );
  }

  return {
    acceptedFiles: options.multiple ? acceptedFiles : acceptedFiles.slice(0, 1),
    rejections,
  };
};
