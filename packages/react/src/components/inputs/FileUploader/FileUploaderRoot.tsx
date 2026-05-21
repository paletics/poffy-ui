'use client';

import { forwardRef, useMemo, useState } from 'react';
import { cx } from '@/styled-system/css';
import { fileUploader } from '@/styled-system/recipes';
import type { FileUploaderProps } from './FileUploader.types';
import { FileUploaderContext, type FileUploaderItem } from './FileUploaderContext';

const createFileItems = (
  files: File[],
  startingId: number,
  previousItems: FileUploaderItem[] = [],
): { fileItems: FileUploaderItem[]; nextFileId: number } => {
  const idsByFile = new Map<File, string[]>();
  let nextFileId = startingId;

  for (const item of previousItems) {
    idsByFile.set(item.file, [...(idsByFile.get(item.file) ?? []), item.id]);
  }

  return {
    fileItems: files.map((file) => ({
      id: idsByFile.get(file)?.shift() ?? `file-${nextFileId++}`,
      file,
    })),
    nextFileId,
  };
};

/**
 * State root for FileUploader compound components.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`fileUploader` slot recipe), React context
 * - **Props**: `FileUploaderProps`
 *
 * ### Design Tokens
 * - **spacing**: drop zone padding and list gaps are defined by the file uploader recipe
 * - **color**: border, drag-active, and intent colors use semantic tokens
 *
 * ### Variant Logic
 * - **appearance="outline"**: Standard upload region with a visible boundary.
 * - **appearance="ghost"**: Lower-emphasis upload area on already framed surfaces.
 * - **intent**: Adjusts drag-active and accent colors for primary or semantic contexts.
 *
 * ### Accessibility
 * - **Role**: generic container; `FileUploaderZone` provides the interactive button semantics.
 * - **Pattern**: File picker with drag-and-drop enhancement.
 * - **Keyboard**: Delegated to `FileUploaderZone`.
 * - **Required**: Provide clear helper text or an accessible label on the zone.
 *
 * ### AI Usage
 * - **DO**: Use as `FileUploader.Root` when composing a custom zone or list.
 * - **DON'T**: Do not render `FileUploader.Zone` outside this root.
 *
 * @example Composable usage
 * ```tsx
 * <FileUploader.Root accept="image/*" multiple>
 *   <FileUploader.Zone />
 *   <FileUploader.List />
 * </FileUploader.Root>
 * ```
 *
 * @example Size validation
 * ```tsx
 * <FileUploader.Root maxSize={2_000_000} onChange={setFiles}>
 *   <FileUploader.Zone helperText="Upload images under 2 MB" />
 * </FileUploader.Root>
 * ```
 */
export const FileUploaderRoot = forwardRef<HTMLDivElement, FileUploaderProps>((props, ref) => {
  const {
    accept,
    maxSize,
    multiple = false,
    onChange,
    defaultFiles = [],
    appearance = 'outline',
    intent = 'primary',
    className,
    children,
    ...rest
  } = props;

  const classes = fileUploader({ appearance, intent });
  const [fileState, setFileState] = useState(() => createFileItems(defaultFiles, 0));
  const [isDragging, setIsDragging] = useState(false);
  const { fileItems } = fileState;
  const files = useMemo(() => fileItems.map((item) => item.file), [fileItems]);

  const setFiles = (nextFiles: File[]) => {
    setFileState((currentState) =>
      createFileItems(nextFiles, currentState.nextFileId, currentState.fileItems),
    );
  };

  const removeFile = (index: number) => {
    const updatedFiles = fileItems.filter((_, i) => i !== index).map((item) => item.file);
    setFileState((currentState) =>
      createFileItems(updatedFiles, currentState.nextFileId, currentState.fileItems),
    );
    onChange?.(updatedFiles);
  };

  const contextValue = {
    fileItems,
    files,
    setFiles,
    isDragging,
    setIsDragging,
    accept,
    maxSize,
    multiple,
    onChange,
    classes,
    removeFile,
  };

  return (
    <FileUploaderContext.Provider value={contextValue}>
      <div ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </div>
    </FileUploaderContext.Provider>
  );
});

FileUploaderRoot.displayName = 'FileUploaderRoot';
