'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  createFileUploadItems,
  normalizeFileUploadCandidates,
  resolveFileUploadSelection,
  type FileUploadCandidate,
  type FileUploadRejection,
} from './file-upload';
import type {
  UseFileUploadStateOptions,
  UseFileUploadStateReturn,
} from './useFileUploadState.types';

/**
 * Owns an uncontrolled file selection, normalizes it against active constraints, and reports
 * accepted changes and rejected candidates.
 *
 * In multiple mode, accepted new files append to the current selection; otherwise they replace
 * it. A selection containing only rejected candidates leaves the current files unchanged and
 * records the rejections. Disabled, read-only, or host-blocked `selectFiles` and `removeFile`
 * calls are ignored; `resetFiles` remains available to restore the normalized initial selection.
 * Later constraint changes asynchronously remove now-invalid files and notify `onChange`.
 */
export const useFileUploadState = <TFile extends FileUploadCandidate>({
  accept,
  defaultFiles,
  disabled = false,
  isInteractionDisabled,
  maxSize,
  multiple = false,
  onChange,
  onReject,
  readOnly = false,
}: UseFileUploadStateOptions<TFile>): UseFileUploadStateReturn<TFile> => {
  const constraints = useMemo(() => ({ accept, maxSize, multiple }), [accept, maxSize, multiple]);
  const initialFiles = useMemo(
    () => normalizeFileUploadCandidates(defaultFiles, constraints),
    [constraints, defaultFiles],
  );
  const [fileState, setFileState] = useState(() => createFileUploadItems(initialFiles, 0));
  const [lastRejections, setLastRejections] = useState<FileUploadRejection<TFile>[]>([]);
  const initialFilesRef = useRef(initialFiles);
  const { fileItems } = fileState;
  const files = useMemo(() => fileItems.map((item) => item.file), [fileItems]);
  const submissionFilesRef = useRef(files);

  useLayoutEffect(() => {
    initialFilesRef.current = initialFiles;
  }, [initialFiles]);

  const replaceFiles = useCallback((nextFiles: TFile[]) => {
    submissionFilesRef.current = nextFiles;
    setFileState((currentState) =>
      createFileUploadItems(nextFiles, currentState.nextFileId, currentState.fileItems),
    );
    setLastRejections([]);
  }, []);

  const rejectFiles = useCallback(
    (rejections: FileUploadRejection<TFile>[]) => {
      if (rejections.length === 0) return;
      onReject?.(rejections);
      setLastRejections(rejections);
    },
    [onReject],
  );

  const selectFiles = useCallback(
    (newFiles: Iterable<TFile> | null) => {
      if (disabled || isInteractionDisabled?.() || readOnly || !newFiles) return;
      const { acceptedFiles, rejections } = resolveFileUploadSelection(newFiles, constraints);
      if (acceptedFiles.length === 0) {
        rejectFiles(rejections);
        return;
      }

      const updatedFiles = multiple ? [...files, ...acceptedFiles] : acceptedFiles;
      replaceFiles(updatedFiles);
      onChange?.(updatedFiles);
      rejectFiles(rejections);
    },
    [
      constraints,
      disabled,
      files,
      isInteractionDisabled,
      multiple,
      onChange,
      readOnly,
      rejectFiles,
      replaceFiles,
    ],
  );

  const removeFile = useCallback(
    (index: number) => {
      if (disabled || isInteractionDisabled?.() || readOnly) return false;
      const updatedFiles = fileItems
        .filter((_, itemIndex) => itemIndex !== index)
        .map(({ file }) => file);
      replaceFiles(updatedFiles);
      onChange?.(updatedFiles);
      return true;
    },
    [disabled, fileItems, isInteractionDisabled, onChange, readOnly, replaceFiles],
  );

  const resetFiles = useCallback(() => {
    const nextFiles = initialFilesRef.current;
    replaceFiles(nextFiles);
    onChange?.(nextFiles);
  }, [onChange, replaceFiles]);

  useEffect(() => {
    const normalizedFiles = normalizeFileUploadCandidates(files, constraints);
    const changed = [
      normalizedFiles.length !== files.length,
      normalizedFiles.some((file, index) => file !== files[index]),
    ].some(Boolean);
    if (!changed) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      replaceFiles(normalizedFiles);
      onChange?.(normalizedFiles);
    });
    return () => {
      cancelled = true;
    };
  }, [constraints, files, onChange, replaceFiles]);

  return {
    fileItems,
    files,
    lastRejections,
    removeFile,
    resetFiles,
    selectFiles,
    submissionFilesRef,
  };
};
