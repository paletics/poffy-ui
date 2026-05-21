import { FileUploaderVariantProps } from '@/styled-system/recipes';
import { type ControlIntent, type InputAppearance, PrimitiveProps } from '@poffy-ui/types';

/**
 * Public FileUploader variant props with shared input appearance and control intent names.
 */
export interface FileUploaderVariantSubset extends Omit<
  FileUploaderVariantProps,
  'appearance' | 'intent'
> {
  /** Surface treatment. */
  appearance?: InputAppearance | 'ghost';
  /** Semantic accent color. */
  intent?: ControlIntent;
}

/**
 * Properties for the FileUploader component.
 * Manages file selection via drag-and-drop or file dialog.
 *
 * ### Notes
 * FileUploader is uncontrolled for the browser file input; use `defaultFiles`
 * for the initial displayed list and `onChange` to mirror accepted files into
 * application state. Provide visible helper text or an accessible label for the
 * drop zone. `accept` follows native input accept syntax and `maxSize` is bytes.
 *
 * Do: validate uploaded files on the server as well.
 * Don't: store File objects in long-lived serialized app state.
 *
 * @example
 * ```tsx
 * import { FileUploader } from '@poffy-ui/react/inputs';
 *
 * <FileUploader accept="image/*" multiple maxSize={5_000_000} onChange={setFiles} />
 * ```
 *
 * Related: FileUploaderVariantSubset for visual variants.
 */
export interface FileUploaderProps
  extends Omit<PrimitiveProps<'div'>, 'onChange'>, FileUploaderVariantSubset {
  /**
   * Accepted file types (e.g., 'image/*', '.pdf', '.docx').
   */
  accept?: string;

  /**
   * Initial set of files to display in the uploader.
   */
  defaultFiles?: File[];

  /**
   * Whether to allow multiple file selections.
   * @defaultValue `false`
   */
  multiple?: boolean;

  /**
   * Maximum allowed file size in bytes.
   */
  maxSize?: number;

  /**
   * Callback fired when the selection of files changes.
   * @param files The current list of selected files.
   */
  onChange?: (files: File[]) => void;

  /**
   * Explanatory text displayed within the drop area.
   * @defaultValue `'Drag & drop files here, or click to select'`
   */
  helperText?: string;
}
