/**
 * Formats a file size in a compact human-readable form.
 *
 * ### Notes
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
 * ### Notes
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
 * ### Notes
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

const parseAcceptTokens = (accept?: string): string[] =>
  accept
    ?.split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean) ?? [];

/**
 * Returns true when a file passes the same accept/max-size rules used by the uploader.
 *
 * ### Notes
 * An omitted or empty `accept` string accepts every MIME type/extension. Token
 * matching is case-insensitive and supports extension, exact MIME, and wildcard
 * MIME-family tokens.
 */
export const acceptsFileUpload = (
  file: FileUploadCandidate,
  { accept, maxSize }: FileUploadAcceptOptions = {},
): boolean => {
  if (maxSize !== undefined && file.size > maxSize) return false;

  const acceptTokens = parseAcceptTokens(accept);
  if (acceptTokens.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return acceptTokens.some((token) => {
    if (token.startsWith('.')) return fileName.endsWith(token);
    if (token.endsWith('/*')) return fileType.startsWith(token.slice(0, -1));
    return fileType === token;
  });
};

/**
 * Filters a list of selected or dropped files by accept/max-size rules.
 *
 * ### Notes
 * The original iterable order is preserved, and rejected files are omitted
 * rather than reported. Components that need rejection messaging should compare
 * the source iterable with the returned array.
 */
export const filterAcceptedFiles = <TFile extends FileUploadCandidate>(
  files: Iterable<TFile>,
  options: FileUploadAcceptOptions = {},
): TFile[] => Array.from(files).filter((file) => acceptsFileUpload(file, options));
