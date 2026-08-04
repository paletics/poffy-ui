import type { FileUploadCandidate, FileUploadItem, FileUploadRejection } from './file-upload';
import type { RefObject } from 'react';

/** File acceptance, mutation policy, and callbacks for an uncontrolled file-upload collection. */
export interface UseFileUploadStateOptions<TFile extends FileUploadCandidate> {
  accept?: string;
  defaultFiles: TFile[];
  disabled?: boolean;
  /**
   * Reads disabledness at mutation time when it can change outside React,
   * such as through an ancestor fieldset.
   */
  isInteractionDisabled?: () => boolean;
  maxSize?: number;
  multiple?: boolean;
  onChange?: (files: TFile[]) => void;
  onReject?: (rejections: FileUploadRejection<TFile>[]) => void;
  readOnly?: boolean;
}

/** Accepted files, rejected candidates, and operations that apply the configured mutation policy. */
export interface UseFileUploadStateReturn<TFile extends FileUploadCandidate> {
  fileItems: FileUploadItem<TFile>[];
  files: TFile[];
  lastRejections: FileUploadRejection<TFile>[];
  removeFile: (index: number) => boolean;
  resetFiles: () => void;
  selectFiles: (files: Iterable<TFile> | null) => void;
  submissionFilesRef: RefObject<TFile[]>;
}
