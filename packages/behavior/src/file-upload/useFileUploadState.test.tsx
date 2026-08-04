import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createFileUploadItems, resolveFileUploadSelection } from './file-upload';
import { useFileUploadState } from './useFileUploadState';
import type { FileUploadCandidate } from './file-upload';
import type { UseFileUploadStateReturn } from './useFileUploadState.types';

const candidate = (name: string, size = 1, type = 'text/plain') => ({ name, size, type });

describe('file upload state', () => {
  it('keeps item ids stable for retained candidate identities', () => {
    const first = candidate('first.txt');
    const second = candidate('second.txt');
    const initial = createFileUploadItems([first, second], 0);
    const updated = createFileUploadItems(
      [second, first, candidate('third.txt')],
      initial.nextFileId,
      initial.fileItems,
    );

    expect(updated.fileItems.map(({ id }) => id)).toEqual(['file-1', 'file-0', 'file-2']);
  });

  it('reports metadata and single-selection rejections together', () => {
    const pdf = candidate('document.pdf', 10, 'application/pdf');
    const first = candidate('first.png', 1, 'image/png');
    const second = candidate('second.png', 1, 'image/png');

    expect(
      resolveFileUploadSelection([pdf, first, second], {
        accept: 'image/png',
        maxSize: 5,
        multiple: false,
      }),
    ).toEqual({
      acceptedFiles: [first],
      rejections: [
        { file: pdf, reasons: ['max-size', 'accept'] },
        { file: second, reasons: ['too-many-files'] },
      ],
    });
  });

  it('updates submission state before notifying a selection change', () => {
    const selected = candidate('selected.txt');
    let submittedAtChange: unknown;
    const stateRef: { current?: UseFileUploadStateReturn<FileUploadCandidate> } = {};
    const { result } = renderHook(() => {
      const state = useFileUploadState<FileUploadCandidate>({
        defaultFiles: [],
        onChange: () => {
          submittedAtChange = stateRef.current?.submissionFilesRef.current;
        },
      });
      stateRef.current = state;
      return state;
    });

    act(() => result.current.selectFiles([selected]));

    expect(submittedAtChange).toEqual([selected]);
    expect(result.current.files).toEqual([selected]);
  });

  it('checks dynamic disabledness at every interactive mutation entry', () => {
    const initial = candidate('initial.txt');
    const selected = candidate('selected.txt');
    const onChange = vi.fn();
    const onReject = vi.fn();
    let disabledNow = false;
    const { result } = renderHook(() =>
      useFileUploadState<FileUploadCandidate>({
        defaultFiles: [initial],
        isInteractionDisabled: () => disabledNow,
        onChange,
        onReject,
      }),
    );

    disabledNow = true;
    let removed = true;
    act(() => result.current.selectFiles([selected]));
    act(() => {
      removed = result.current.removeFile(0);
    });

    expect(removed).toBe(false);
    expect(result.current.files).toEqual([initial]);
    expect(result.current.submissionFilesRef.current).toEqual([initial]);
    expect(onChange).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();

    disabledNow = false;
    act(() => result.current.selectFiles([selected]));

    expect(result.current.files).toEqual([selected]);
    expect(onChange).toHaveBeenLastCalledWith([selected]);
  });

  it('reconciles changed constraints in a microtask and uses the latest defaults on reset', async () => {
    const text = candidate('document.txt', 3, 'text/plain');
    const image = candidate('image.png', 1, 'image/png');
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ accept, defaultFiles }) =>
        useFileUploadState<FileUploadCandidate>({
          accept,
          defaultFiles,
          multiple: true,
          onChange,
        }),
      { initialProps: { accept: undefined as string | undefined, defaultFiles: [text] } },
    );

    rerender({ accept: 'image/png', defaultFiles: [image] });
    await act(async () => Promise.resolve());
    expect(result.current.files).toEqual([]);
    expect(onChange).toHaveBeenLastCalledWith([]);

    act(() => result.current.resetFiles());
    expect(result.current.files).toEqual([image]);
    expect(onChange).toHaveBeenLastCalledWith([image]);
  });

  it('retains detailed rejections when accepted candidates are also selected', () => {
    const onReject = vi.fn();
    const pdf = candidate('document.pdf', 1, 'application/pdf');
    const png = candidate('image.png', 1, 'image/png');
    const { result } = renderHook(() =>
      useFileUploadState<FileUploadCandidate>({
        accept: 'image/png',
        defaultFiles: [],
        multiple: true,
        onReject,
      }),
    );

    act(() => result.current.selectFiles([pdf, png]));

    expect(result.current.files).toEqual([png]);
    expect(result.current.lastRejections).toEqual([{ file: pdf, reasons: ['accept'] }]);
    expect(onReject).toHaveBeenCalledWith([{ file: pdf, reasons: ['accept'] }]);
  });
});
