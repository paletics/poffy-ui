'use client';

import { useButtonKeyboardActivation } from '@poffy-ui/behavior/activation';
import { DragEvent, forwardRef, useRef } from 'react';
import { UploadIcon } from '@/components/media/Icon/icons';
import { cx } from '@/styled-system/css';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { useFileUploaderContext } from './FileUploaderContext';

/**
 * Props for the drag-and-drop target used by FileUploader.
 */
export interface FileUploaderZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  helperText?: string;
}

/**
 * Interactive drop target and dialog trigger for a `FileUploader` root.
 *
 * It is a keyboard-operable button: Enter and Space open the native picker, and accepted drops
 * select files. A consumer drag handler may prevent default to take ownership of that event.
 * Disabled or read-only zones retain their state semantics but do not open the dialog or accept
 * a drop.
 */
export const FileUploaderZone = forwardRef<HTMLDivElement, FileUploaderZoneProps>((props, ref) => {
  const {
    helperText: helperTextProp,
    className,
    onClick,
    onBlur,
    onKeyDown,
    onKeyDownCapture,
    onKeyUp,
    onKeyUpCapture,
    onDragEnter: onDragEnterProp,
    onDragOver: onDragOverProp,
    onDragLeave: onDragLeaveProp,
    onDrop: onDropProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = props;
  const {
    selectFiles,
    openFileDialog,
    registerZone,
    isDragging,
    setIsDragging,
    classes,
    labelId,
    ariaLabel: rootAriaLabel,
    ariaLabelledBy: rootAriaLabelledBy,
    describedBy,
    isDisabled,
    isReadOnly,
    messages,
  } = useFileUploaderContext();
  const helperText = helperTextProp ?? messages.helperText;
  const resolvedRootAriaLabelledBy = rootAriaLabelledBy ?? labelId;
  const resolvedZoneAriaLabelledBy = ariaLabelledBy ?? resolvedRootAriaLabelledBy;
  const resolvedZoneAriaLabel = resolvedZoneAriaLabelledBy
    ? undefined
    : (ariaLabel ?? rootAriaLabel ?? helperText);
  const joinedZoneDescribedBy = [describedBy, ariaDescribedBy].filter(Boolean).join(' ');
  const resolvedZoneDescribedBy =
    joinedZoneDescribedBy.length > 0 ? joinedZoneDescribedBy : undefined;

  const zoneRef = useRef<HTMLDivElement>(null);
  const mergedZoneRef = useMergeRefs(zoneRef, registerZone, ref);
  const dragDepthRef = useRef(0);
  const keyboardActivation = useButtonKeyboardActivation<HTMLDivElement>({
    enabled: !isDisabled && !isReadOnly,
    onBlur,
    onKeyDown,
    onKeyUp,
  });
  const preventInactiveKeyActivation = (event: {
    code?: string;
    key: string;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    if (
      (isDisabled || isReadOnly) &&
      (event.key === 'Enter' || event.key === ' ' || event.code === 'Space')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const handleKeyDownCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDownCapture?.(event);
    preventInactiveKeyActivation(event);
  };
  const handleKeyUpCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyUpCapture?.(event);
    preventInactiveKeyActivation(event);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    onDragOverProp?.(e);
    if (e.defaultPrevented) {
      dragDepthRef.current = 0;
      setIsDragging(false);
      return;
    }
    if (isDisabled || isReadOnly) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    onDragEnterProp?.(e);
    if (e.defaultPrevented) return;
    if (isDisabled || isReadOnly) {
      e.preventDefault();
      return;
    }
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    onDragLeaveProp?.(e);
    const NodeConstructor = e.currentTarget.ownerDocument.defaultView?.Node;
    if (
      NodeConstructor &&
      e.relatedTarget instanceof NodeConstructor &&
      e.currentTarget.contains(e.relatedTarget)
    )
      return;
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current > 0) return;
    setIsDragging(false);
    if (e.defaultPrevented) return;
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    onDropProp?.(e);
    dragDepthRef.current = 0;
    setIsDragging(false);
    if (e.defaultPrevented) return;
    if (isDisabled || isReadOnly) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    selectFiles(e.dataTransfer.files);
  };
  return (
    <>
      <div
        {...rest}
        ref={mergedZoneRef}
        className={cx(classes.dropZone, className)}
        data-drag={isDragging ? '' : undefined}
        data-disabled={isDisabled ? '' : undefined}
        data-readonly={isReadOnly ? '' : undefined}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || isDisabled || isReadOnly) return;
          openFileDialog();
        }}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label={resolvedZoneAriaLabel}
        aria-labelledby={resolvedZoneAriaLabelledBy}
        aria-describedby={resolvedZoneDescribedBy}
        aria-disabled={[isDisabled, isReadOnly].some(Boolean) ? true : undefined}
        onBlur={keyboardActivation.onBlur}
        onKeyDown={keyboardActivation.onKeyDown}
        onKeyDownCapture={handleKeyDownCapture}
        onKeyUp={keyboardActivation.onKeyUp}
        onKeyUpCapture={handleKeyUpCapture}
      >
        <UploadIcon className={classes.uploadIcon} />
        <span>{helperText}</span>
      </div>
    </>
  );
});

FileUploaderZone.displayName = 'FileUploaderZone';
