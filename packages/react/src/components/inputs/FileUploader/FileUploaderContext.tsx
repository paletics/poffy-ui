'use client';

import { fileUploader } from '@/styled-system/recipes';
import { createContext, useContext } from 'react';

/**
 * Shared FileUploader state and actions for zone, list, and item parts.
 */
interface FileUploaderContextValue {
  fileItems: FileUploaderItem[];
  files: File[];
  setFiles: (files: File[]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onChange?: (files: File[]) => void;
  classes: ReturnType<typeof fileUploader>;
  removeFile: (index: number) => void;
}

/**
 * Internal selected-file record with a stable animation identity.
 */
export interface FileUploaderItem {
  id: string;
  file: File;
}

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
