import type {
  FileUploaderMessages,
  FileUploaderRejection,
  FileUploaderRejectionReason,
} from './FileUploader.types';

const formatEnglishReason = (reason: FileUploaderRejectionReason) => {
  if (reason === 'accept') return 'file type is not accepted';
  if (reason === 'max-size') return 'file is too large';
  return 'only one file can be selected';
};

const formatJapaneseReason = (reason: FileUploaderRejectionReason) => {
  if (reason === 'accept') return '対応していないファイル形式です';
  if (reason === 'max-size') return 'ファイルサイズが大きすぎます';
  return '選択できるファイルは1件のみです';
};

const formatRejection = (
  rejection: FileUploaderRejection,
  formatReason: (reason: FileUploaderRejectionReason) => string,
  separator: string,
  formatMessage: (fileName: string, details: string) => string,
) => formatMessage(rejection.file.name, rejection.reasons.map(formatReason).join(separator));

const DEFAULT_FILE_UPLOADER_LOCALES: Record<string, FileUploaderMessages> = {
  'en-US': {
    helperText: 'Drag & drop files here, or click to select',
    selectFiles: 'Select files',
    selectedFiles: 'Selected files',
    removeFile: (fileName) => `Remove ${fileName}`,
    formatRejection: (rejection) =>
      formatRejection(
        rejection,
        formatEnglishReason,
        ' and ',
        (fileName, details) => `${fileName} was not added: ${details}.`,
      ),
  },
  'ja-JP': {
    helperText: 'ファイルをドラッグ＆ドロップするか、クリックして選択',
    selectFiles: 'ファイルを選択',
    selectedFiles: '選択したファイル',
    removeFile: (fileName) => `${fileName}を削除`,
    formatRejection: (rejection) =>
      formatRejection(
        rejection,
        formatJapaneseReason,
        '、',
        (fileName, details) => `${fileName}は追加されませんでした：${details}。`,
      ),
  },
};

/** Resolves messages by exact locale, base language, then English, before applying overrides. */
export const getFileUploaderMessages = (
  locale = 'en-US',
  overrides?: Partial<FileUploaderMessages>,
): FileUploaderMessages => {
  const normalizedLocale = locale.toLowerCase();
  const language = normalizedLocale.split('-')[0];
  const defaults =
    Object.entries(DEFAULT_FILE_UPLOADER_LOCALES).find(
      ([key]) => key.toLowerCase() === normalizedLocale,
    )?.[1] ??
    Object.entries(DEFAULT_FILE_UPLOADER_LOCALES).find(
      ([key]) => key.toLowerCase().split('-')[0] === language,
    )?.[1] ??
    DEFAULT_FILE_UPLOADER_LOCALES['en-US'];

  return { ...defaults, ...overrides };
};
