'use client';

import { forwardRef, useCallback, useId, useMemo, useRef, useState } from 'react';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import { css, cx } from '@/styled-system/css';
import { fileUploader } from '@/styled-system/recipes';
import {
  hasAriaInvalid,
  resolveFormControlAria,
} from '@/components/inputs/FormControl/formControlAria';
import { useFormControl } from '@/components/inputs/FormControl/useFormControl';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import type { FileUploaderRootProps } from './FileUploader.types';
import { FileUploaderContext } from './FileUploaderContext';
import { getFileUploaderMessages } from './FileUploader.locales';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useFileUploaderFocus } from './useFileUploaderFocus';
import { useFileUploaderFormBridge } from './useFileUploaderFormBridge';
import { useFormControlBridge } from '@/components/inputs/shared/useFormControlBridge';
import { useFileUploadState } from '@poffy-ui/behavior/file-upload/react';

/**
 * Internal-state root for `FileUploader` compound parts.
 *
 * Accepted selections update the owned file list and notify `onChange`; rejected candidates leave
 * that list unchanged and are announced through a polite live region. Disabled/read-only state
 * blocks picking, dropping, and removal. With `name`, selected files are appended to the
 * associated form on submission, while reset restores `defaultFiles`.
 */
export const FileUploaderRoot = forwardRef<HTMLDivElement, FileUploaderRootProps>((props, ref) => {
  const {
    accept,
    maxSize,
    multiple = false,
    onChange,
    onReject,
    defaultFiles = [],
    appearance = 'outline',
    intent = 'primary',
    className,
    children,
    name,
    form,
    disabled,
    readOnly,
    required,
    id: idProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-invalid': ariaInvalid,
    asChild: _legacyAsChild,
    helperText: _legacyHelperText,
    locale: localeProp,
    messages: messageOverrides,
    ...rest
  } = props as FileUploaderRootProps & { asChild?: unknown; helperText?: unknown };
  void _legacyAsChild;
  void _legacyHelperText;

  const formControl = useFormControl();
  const providerLocale = useOptionalLocale()?.locale;
  const messages = useMemo(
    () => getFileUploaderMessages(localeProp ?? providerLocale ?? 'en-US', messageOverrides),
    [localeProp, messageOverrides, providerLocale],
  );
  const explicitDisabled = disabled ?? formControl.isDisabled ?? false;
  const formBridge = useFormControlBridge({ disabled: explicitDisabled, form });
  const isDisabled = formBridge.effectivelyDisabled;
  const isReadOnly = readOnly ?? formControl.isReadOnly ?? false;
  const isRequired = required ?? formControl.isRequired ?? false;
  const requiredDescriptionId = useId();
  const requiredMessage = getCommonMessages(localeProp ?? providerLocale).required;
  const isInvalid = formControl.isInvalid;
  const hasExplicitInvalid = hasAriaInvalid(ariaInvalid);
  const shouldAssociateErrorMessage = isInvalid || hasExplicitInvalid;
  const { describedBy, errorMessage } = resolveFormControlAria({
    ariaDescribedBy,
    ariaErrorMessage,
    errorMessageIds: formControl.errorMessageIds,
    helperTextIds: formControl.helperTextIds,
    isInvalid: shouldAssociateErrorMessage,
  });
  const inputId = idProp ?? formControl.id;

  const classes = fileUploader({ appearance, intent });
  const [isDragging, setIsDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergeRefs(rootRef, ref);
  const {
    fileItems,
    files,
    lastRejections,
    removeFile: removeFileFromState,
    resetFiles,
    selectFiles: selectFileCandidates,
    submissionFilesRef,
  } = useFileUploadState<File>({
    accept,
    defaultFiles,
    disabled: isDisabled,
    isInteractionDisabled: formBridge.isEffectivelyDisabledNow,
    maxSize,
    multiple,
    onChange,
    onReject,
    readOnly: isReadOnly,
  });
  const selectFiles = useCallback(
    (fileList: FileList | null) => selectFileCandidates(fileList ? Array.from(fileList) : null),
    [selectFileCandidates],
  );
  const { focusAfterRemoval, focusFirstZone, inputRef, registerZone } =
    useFileUploaderFocus(rootRef);
  const formEventRef = useFileUploaderFormBridge({
    filesRef: submissionFilesRef,
    isEffectivelyDisabledNow: formBridge.isEffectivelyDisabledNow,
    name,
    onReset: resetFiles,
  });
  const formAnchorRef = useMergeRefs(formBridge.anchorRef, formEventRef);
  const resolvedLabelledBy = ariaLabelledBy ?? formControl.labelId;
  const resolvedInputAriaLabel = resolvedLabelledBy
    ? undefined
    : (ariaLabel ?? messages.selectFiles);
  const joinedInputDescribedBy = [describedBy, isRequired ? requiredDescriptionId : undefined]
    .filter(Boolean)
    .join(' ');
  const inputDescribedBy = joinedInputDescribedBy.length > 0 ? joinedInputDescribedBy : undefined;

  const openFileDialog = () => {
    if (isDisabled || isReadOnly) return;
    inputRef.current?.click();
  };

  const removeFile = (index: number) => {
    if (!removeFileFromState(index)) return;
    focusAfterRemoval(index);
  };

  const rejectionMessage = useMemo(
    () => lastRejections.map(messages.formatRejection).join(' '),
    [lastRejections, messages],
  );

  const contextValue = {
    fileItems,
    files,
    selectFiles,
    openFileDialog,
    registerZone,
    isDragging: [isDisabled, isReadOnly].some(Boolean) ? false : isDragging,
    setIsDragging,
    messages,
    classes,
    removeFile,
    inputId,
    form,
    labelId: formControl.labelId,
    ariaLabel,
    ariaLabelledBy,
    describedBy: inputDescribedBy,
    errorMessage,
    isDisabled,
    isReadOnly,
    isRequired,
    isInvalid: shouldAssociateErrorMessage,
  };

  return (
    <FileUploaderContext.Provider value={contextValue}>
      <div
        ref={mergedRef}
        className={cx(classes.root, className)}
        data-disabled={isDisabled ? '' : undefined}
        data-readonly={isReadOnly ? '' : undefined}
        {...rest}
      >
        <fieldset {...formBridge.anchorProps} ref={formAnchorRef} />
        <input
          ref={inputRef}
          type="file"
          id={inputId}
          className={classes.input}
          aria-label={resolvedInputAriaLabel}
          aria-labelledby={resolvedLabelledBy}
          aria-describedby={inputDescribedBy}
          aria-errormessage={errorMessage}
          aria-invalid={shouldAssociateErrorMessage ? true : undefined}
          accept={accept}
          multiple={multiple}
          disabled={[isDisabled, isReadOnly].some(Boolean)}
          onChange={(event) => {
            selectFiles(event.target.files);
            event.currentTarget.value = '';
          }}
          data-testid="file-input"
        />
        {isRequired ? (
          <VisuallyHidden id={requiredDescriptionId}>{requiredMessage}</VisuallyHidden>
        ) : null}
        {isRequired && (
          <input
            aria-hidden="true"
            className={css({ srOnly: true })}
            data-file-uploader-validation-proxy=""
            disabled={[isDisabled, isReadOnly].some(Boolean)}
            form={form}
            onChange={() => undefined}
            onInvalid={() => queueMicrotask(focusFirstZone)}
            required
            tabIndex={-1}
            type="text"
            value={files.length > 0 ? 'selected' : ''}
          />
        )}
        {children}
        <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
          {rejectionMessage}
        </VisuallyHidden>
      </div>
    </FileUploaderContext.Provider>
  );
});

FileUploaderRoot.displayName = 'FileUploaderRoot';
