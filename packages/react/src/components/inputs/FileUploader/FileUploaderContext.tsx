'use client';

import { fileUploader } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';
import type { FileUploaderMessages } from './FileUploader.types';
import type { FileUploadItem } from '@poffy-ui/behavior/file-upload';

/**
 * Shared FileUploader state and actions for zone, list, and item parts.
 */
interface FileUploaderContextValue {
  fileItems: FileUploaderItem[];
  files: File[];
  selectFiles: (files: FileList | null) => void;
  openFileDialog: () => void;
  registerZone: (zone: HTMLDivElement | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  messages: FileUploaderMessages;
  classes: ReturnType<typeof fileUploader>;
  removeFile: (index: number) => void;
  inputId?: string;
  form?: string;
  labelId?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  describedBy?: string;
  errorMessage?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
}

/**
 * Internal selected-file record with a stable animation identity.
 */
export type FileUploaderItem = FileUploadItem<File>;

/**
 * React context carrying FileUploader files, validation, and actions.
 */
export const FileUploaderContext = createContext<FileUploaderContextValue | null>(null);

/**
 * Returns the nearest FileUploader context and validates compound component usage.
 */
export const useFileUploaderContext = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error('FileUploader sub-components must be used within a FileUploader');
  }
  return context;
};
