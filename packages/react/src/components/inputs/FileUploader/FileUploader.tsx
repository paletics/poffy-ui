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
 * A shorthand molecule that composes `FileUploaderRoot`, `FileUploaderZone`,
 * and `FileUploaderList` into a single drop-ready component.
 * For advanced layouts, use the sub-components directly via `FileUploader.Root`, etc.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (via `FileUploaderRoot`)
 * - **Sub-components**: `Root`, `Zone`, `List` (all re-exported)
 *
 * ### Design Tokens
 * - Zone border / background -> `neutral.border` / `neutral.surface` (via `FileUploaderZone` recipe)
 * - Drag-active state color -> `brand.subtle`
 *
 * ### Variant Logic
 * - No standalone variants. `FileUploaderRoot` manages `accept`, `multiple`, `maxSize` constraints.
 *
 * ### Accessibility
 * - Drop zone: `role="button"` with `aria-label` from `FileUploaderZone`
 * - File list items have accessible remove buttons with `aria-label="Remove {filename}"`
 * - Keyboard: Tab -> focus zone | Enter / Space: open file dialog
 *
 * ### AI Usage
 * - **DO**: Use for drag-and-drop or click-to-select file input workflows.
 *
 * @example Simple
 * ```tsx
 * <FileUploader accept="image/*" multiple onChange={(files) => upload(files)} />
 * ```
 *
 * @example Composable (advanced)
 * ```tsx
 * <FileUploader.Root accept=".pdf" onChange={handleFiles}>
 *   <FileUploader.Zone helperText="Drop PDF here" />
 *   <FileUploader.List />
 * </FileUploader.Root>
 * ```
 */
export const FileUploader = Object.assign(FileUploaderBase, {
  Root: FileUploaderRoot,
  Zone: FileUploaderZone,
  List: FileUploaderList,
});
