import { describe, expect, it } from 'vitest';
import {
  acceptsFileUpload,
  filterAcceptedFiles,
  formatFileSize,
  getFileUploadRejectionReasons,
} from './file-upload';

describe('file-upload behavior helpers', () => {
  it('formats bytes into human-readable labels', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1024 ** 4)).toBe('1024 GB');
  });

  it('accepts files by extension, mime type, wildcard, and max size', () => {
    const png = { name: 'avatar.PNG', size: 4, type: 'image/png' };
    const pdf = { name: 'document.pdf', size: 8, type: 'application/pdf' };

    expect(acceptsFileUpload(png, { accept: '.png' })).toBe(true);
    expect(acceptsFileUpload(png, { accept: 'image/*' })).toBe(true);
    expect(acceptsFileUpload(pdf, { accept: 'application/pdf' })).toBe(true);
    expect(acceptsFileUpload(pdf, { accept: 'image/*' })).toBe(false);
    expect(acceptsFileUpload(pdf, { maxSize: 7 })).toBe(false);
  });

  it('filters accepted files while preserving file instances', () => {
    const files = [
      { name: 'document.pdf', size: 8, type: 'application/pdf' },
      { name: 'small.png', size: 4, type: 'image/png' },
      { name: 'large.png', size: 12, type: 'image/png' },
    ];

    expect(filterAcceptedFiles(files, { accept: 'image/png', maxSize: 5 })).toEqual([files[1]]);
  });

  it('reports every rejection reason and ignores invalid size constraints', () => {
    const pdf = { name: 'document.pdf', size: 8, type: 'application/pdf' };

    expect(getFileUploadRejectionReasons(pdf, { accept: 'image/png', maxSize: 5 })).toEqual([
      'max-size',
      'accept',
    ]);
    expect(acceptsFileUpload(pdf, { maxSize: Number.NaN })).toBe(true);
    expect(acceptsFileUpload(pdf, { maxSize: -1 })).toBe(true);
  });
});
