'use client';

import { forwardRef } from 'react';
import type { FileUploaderProps } from './FileUploader.types';
import { FileUploaderRoot } from './FileUploaderRoot';
import { FileUploaderZone } from './FileUploaderZone';
import { FileUploaderList } from './FileUploaderList';

const FileUploaderBase = forwardRef<HTMLDivElement, FileUploaderProps>((props, ref) => {
  const { helperText, ...rest } = props;

  return (
    <FileUploaderRoot ref={ref} {...rest}>
      <FileUploaderZone helperText={helperText} />
      <FileUploaderList />
    </FileUploaderRoot>
  );
});

FileUploaderBase.displayName = 'FileUploader';

/**
 * Default FileUploader composition of Root, Zone, and selected-file List.
 *
 * Use the compound parts when the picker trigger or file presentation must be placed differently;
 * the shorthand owns those children and therefore does not accept `children`.
 */
export const FileUploader = Object.assign(FileUploaderBase, {
  Root: FileUploaderRoot,
  Zone: FileUploaderZone,
  List: FileUploaderList,
});
