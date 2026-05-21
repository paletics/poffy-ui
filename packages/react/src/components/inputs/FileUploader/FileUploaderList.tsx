'use client';

import { formatFileSize } from '@poffy-ui/behavior/file-upload';
import { ReorderTransition } from '@/components/animations';
import { CloseButton } from '@/components/inputs/CloseButton';
import { css, cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { FilePreview } from './FilePreview';
import { useFileUploaderContext } from './FileUploaderContext';

/**
 * Props for the list container that renders selected FileUploader files.
 */
export type FileUploaderListProps = React.HTMLAttributes<HTMLDivElement>;

const fileItemTransitionClass = css({
  display: 'contents',
});

/**
 * Selected-file list for FileUploader with previews and remove actions.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`fileUploader` slot recipe), `CloseButton`, file-upload behavior helpers
 * - **Props**: native `div` attributes
 *
 * ### Design Tokens
 * - **spacing**: list gap, preview size, and item padding come from the recipe
 * - **color**: file metadata and item surface use semantic text and surface tokens
 *
 * ### Variant Logic
 * - **image files**: Render object URL previews.
 * - **non-image files**: Render a placeholder preview and formatted file size.
 *
 * ### Accessibility
 * - **Role**: generic list container with per-file remove buttons.
 * - **Pattern**: File selection review list.
 * - **Keyboard**: Remove buttons are keyboard-focusable through `CloseButton`.
 * - **Required**: Keep remove buttons labeled for screen readers.
 *
 * ### AI Usage
 * - **DO**: Use with `FileUploader.Zone` to show selected files.
 * - **DON'T**: Do not use as a standalone file storage source; state lives in `FileUploaderRoot`.
 *
 * @example Standard usage
 * ```tsx
 * <FileUploader.Root multiple>
 *   <FileUploader.Zone />
 *   <FileUploader.List />
 * </FileUploader.Root>
 * ```
 *
 * @example Custom wrapper
 * ```tsx
 * <FileUploader.List aria-label="Selected files" />
 * ```
 */
export const FileUploaderList = forwardRef<HTMLDivElement, FileUploaderListProps>((props, ref) => {
  const { className, ...rest } = props;
  const { fileItems, classes, removeFile } = useFileUploaderContext();

  if (fileItems.length === 0) return null;

  return (
    <div ref={ref} className={cx(classes.fileList, className)} {...rest}>
      <ReorderTransition className={fileItemTransitionClass} animationType="fade">
        {fileItems.map(({ id, file }, index) => (
          <ReorderTransition.Item key={id} className={classes.fileItem}>
            {file.type.startsWith('image/') ? (
              <FilePreview file={file} className={classes.preview} />
            ) : (
              <div className={classes.previewPlaceholder}>📄</div>
            )}

            <div className={classes.fileInfo}>
              <div className={classes.fileName}>{file.name}</div>
              <div className={classes.fileSize}>{formatFileSize(file.size)}</div>
            </div>

            <CloseButton
              className={classes.removeButton}
              onClick={() => removeFile(index)}
              aria-label="Remove file"
              size="sm"
            />
          </ReorderTransition.Item>
        ))}
      </ReorderTransition>
    </div>
  );
});

FileUploaderList.displayName = 'FileUploaderList';
