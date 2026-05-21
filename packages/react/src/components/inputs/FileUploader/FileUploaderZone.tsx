'use client';

import { filterAcceptedFiles } from '@poffy-ui/behavior/file-upload';
import { DragEvent, forwardRef, useRef } from 'react';
import { UploadIcon } from '@/components/media/Icon/icons';
import { cx } from '@/styled-system/css';
import { useFileUploaderContext } from './FileUploaderContext';

/**
 * Props for the drag-and-drop target used by FileUploader.
 */
export interface FileUploaderZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  helperText?: string;
}

/**
 * Interactive drop zone and file-picker trigger for FileUploader.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`fileUploader` slot recipe), native file input, file-upload behavior helpers
 * - **Props**: native `div` attributes plus `helperText`
 *
 * ### Design Tokens
 * - **spacing**: zone padding, icon gap, and helper text layout come from the recipe
 * - **color**: drag-active border/background and icon color use semantic tokens
 *
 * ### Variant Logic
 * - **appearance/intent**: Inherited from `FileUploaderRoot`.
 * - **multiple**: Inherited from `FileUploaderRoot`; appends accepted files when enabled.
 *
 * ### Accessibility
 * - **Role**: `button` on the visible drop zone.
 * - **Pattern**: File upload button with drag-and-drop enhancement.
 * - **Keyboard**: Enter / Space opens the native file picker.
 * - **Required**: Ensure helper text communicates accepted file constraints when relevant.
 *
 * ### AI Usage
 * - **DO**: Use inside `FileUploader.Root` as the primary file selection target.
 * - **DON'T**: Do not replace the hidden native file input with custom file parsing.
 *
 * @example Standard usage
 * ```tsx
 * <FileUploader.Root accept="image/*">
 *   <FileUploader.Zone helperText="Drop an image or browse" />
 * </FileUploader.Root>
 * ```
 *
 * @example Multiple files
 * ```tsx
 * <FileUploader.Root multiple>
 *   <FileUploader.Zone helperText="Drop files here" />
 *   <FileUploader.List />
 * </FileUploader.Root>
 * ```
 */
export const FileUploaderZone = forwardRef<HTMLDivElement, FileUploaderZoneProps>((props, ref) => {
  const {
    helperText = 'Drag & drop files here, or click to select',
    className,
    onClick,
    onKeyDown,
    onDragOver: onDragOverProp,
    onDragLeave: onDragLeaveProp,
    onDrop: onDropProp,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const {
    files,
    setFiles,
    isDragging,
    setIsDragging,
    accept,
    maxSize,
    multiple,
    onChange,
    classes,
  } = useFileUploaderContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const acceptedFiles = filterAcceptedFiles(newFiles, { accept, maxSize });
    if (acceptedFiles.length === 0) return;

    let updatedFiles: File[];
    if (multiple) {
      updatedFiles = [...files, ...acceptedFiles];
    } else {
      updatedFiles = [acceptedFiles[0]];
    }
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    onDragOverProp?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    onDragLeaveProp?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    onDropProp?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className={classes.input}
        aria-label="Select files"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.currentTarget.value = '';
        }}
        data-testid="file-input"
      />
      <div
        {...rest}
        ref={ref}
        className={cx(classes.dropZone, className)}
        data-drag={isDragging ? '' : undefined}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented) return;
          inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel ?? helperText}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.defaultPrevented) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <UploadIcon className={classes.uploadIcon} />
        <span>{helperText}</span>
      </div>
    </>
  );
});

FileUploaderZone.displayName = 'FileUploaderZone';
