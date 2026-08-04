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
 * Selected-file list for a `FileUploader` root.
 *
 * It is absent when no files are selected. Image files receive an object-URL preview; other file
 * types receive a decorative placeholder. Removal actions are disabled whenever the root is
 * disabled or read-only.
 */
export const FileUploaderList = forwardRef<HTMLDivElement, FileUploaderListProps>((props, ref) => {
  const { className, ...rest } = props;
  const { fileItems, classes, removeFile, messages, isDisabled, isReadOnly } =
    useFileUploaderContext();

  if (fileItems.length === 0) return null;

  return (
    <div
      ref={ref}
      role="list"
      aria-label={messages.selectedFiles}
      className={cx(classes.fileList, className)}
      {...rest}
    >
      <ReorderTransition className={fileItemTransitionClass} animationType="fade">
        {fileItems.map(({ id, file }, index) => (
          <ReorderTransition.Item key={id} role="listitem" className={classes.fileItem}>
            {file.type.startsWith('image/') ? (
              <FilePreview file={file} className={classes.preview} />
            ) : (
              <div className={classes.previewPlaceholder} aria-hidden="true">
                📄
              </div>
            )}

            <div className={classes.fileInfo}>
              <div className={classes.fileName}>{file.name}</div>
              <div className={classes.fileSize}>{formatFileSize(file.size)}</div>
            </div>

            <CloseButton
              className={classes.removeButton}
              disabled={isDisabled || isReadOnly}
              onClick={() => removeFile(index)}
              aria-label={messages.removeFile(file.name)}
              data-file-uploader-remove=""
              size="sm"
            />
          </ReorderTransition.Item>
        ))}
      </ReorderTransition>
    </div>
  );
});

FileUploaderList.displayName = 'FileUploaderList';
