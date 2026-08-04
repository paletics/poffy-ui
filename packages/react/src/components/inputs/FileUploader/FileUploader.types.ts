import { FileUploaderVariantProps } from '@/styled-system/recipes';
import type {
  FileUploadRejection,
  FileUploadSelectionRejectionReason,
} from '@poffy-ui/behavior/file-upload';
import { type ControlIntent, type InputAppearance, NativeProps } from '@poffy-ui/types';

/**
 * Public FileUploader variant props with shared input appearance and control intent names.
 */
export interface FileUploaderVariantSubset extends Omit<
  FileUploaderVariantProps,
  'appearance' | 'intent'
> {
  /** Surface treatment. @defaultValue `'outline'` */
  appearance?: InputAppearance | 'ghost';
  /** Semantic accent color. @defaultValue `'primary'` */
  intent?: ControlIntent;
}

/** Reasons a candidate file may be rejected before it enters the owned file list. */
export type FileUploaderRejectionReason = FileUploadSelectionRejectionReason;

/** A rejected File paired with every applicable acceptance, size, or single-file reason. */
export type FileUploaderRejection = FileUploadRejection<File>;

/** Localizable text used by FileUploader's default composition. */
export interface FileUploaderMessages {
  /** Default explanatory text displayed in the drop zone. */
  helperText: string;
  /** Accessible name for the managed native file input. */
  selectFiles: string;
  /** Accessible name for the selected-file list. */
  selectedFiles: string;
  /** Accessible name for a file's remove action. */
  removeFile: (fileName: string) => string;
  /** Formats one rejected file for the polite live region. */
  formatRejection: (rejection: FileUploaderRejection) => string;
}

/** Public props for FileUploaderRoot. */
export interface FileUploaderRootProps
  extends Omit<NativeProps<'div'>, 'onChange' | 'name' | 'form'>, FileUploaderVariantSubset {
  /** Form field name used when appending selected files at form submission. */
  name?: string;
  /** ID of an associated form outside the uploader's DOM subtree. */
  form?: string;
  /** Whether file selection and form submission participation are disabled. */
  disabled?: boolean;
  /**
   * Prevents selecting, dropping, or removing files while preserving existing
   * file values for form submission.
   */
  readOnly?: boolean;
  /** Whether the associated form requires at least one selected file. */
  required?: boolean;
  /** BCP 47 locale used for default messages. Overrides the nearest LocaleProvider. */
  locale?: string;

  /** Component-local overrides for visible, accessible, and rejection-announcement text. */
  messages?: Partial<FileUploaderMessages>;

  /**
   * Accepted file types (e.g., `image/*`, `.pdf`, `.docx`).
   *
   * The same constraint is applied to picker selections, dropped files, initial
   * files, and later constraint changes.
   */
  accept?: string;

  /**
   * Initial uncontrolled file list, normalized against active constraints and
   * restored when the associated form resets.
   */
  defaultFiles?: File[];

  /**
   * Whether to allow multiple file selections.
   * @defaultValue `false`
   */
  multiple?: boolean;

  /**
   * Maximum allowed file size in bytes. Non-finite and non-positive values do
   * not impose a size limit.
   */
  maxSize?: number;

  /**
   * Called whenever the owned list changes; this includes accepted selections,
   * removals, form reset, and later constraint changes. This does not control it.
   * @param files The current list of selected files.
   */
  onChange?: (files: File[]) => void;

  /**
   * Callback fired for files rejected by type, size, or the single-file limit.
   * Rejections do not change the accepted file list.
   */
  onReject?: (rejections: FileUploaderRejection[]) => void;
}

/**
 * Props for the default shorthand composition.
 *
 * The shorthand owns Zone and List placement and therefore does not accept children. Its omitted
 * helper text comes from the resolved FileUploader locale (exact locale, base language, then
 * English), rather than always using English.
 */
export interface FileUploaderProps extends Omit<FileUploaderRootProps, 'children'> {
  /**
   * Explanatory text displayed within the shorthand drop area. When omitted,
   * uses the resolved locale message.
   */
  helperText?: string;
  /** Shorthand composition owns its Zone and List children. */
  children?: never;
}
