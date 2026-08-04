'use client';

import { IconSwapTransition } from '@/components/animations';
import { IconButton } from '@/components/inputs/IconButton';
import type {
  IconButtonAsChildProps,
  IconButtonDefaultProps,
} from '@/components/inputs/IconButton';
import { CheckIcon } from '@/components/media/Icon/icons/CheckIcon';
import { CopyIcon } from '@/components/media/Icon/icons/CopyIcon';
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden';
import {
  getFallbackChildrenForNativeButton,
  isExclusiveButtonAsChildHost,
  isNonVoidAsChildHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { copyToClipboard } from '@poffy-ui/behavior/clipboard';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ForwardedRef, MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { css, cx } from '@/styled-system/css';
import { copyButton } from '@/styled-system/recipes';
import type { CopyButtonComponent, CopyButtonProps } from './CopyButton.types';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

const iconSwapClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const CopyButtonImpl = forwardRef<HTMLElement, CopyButtonProps>((rawProps, ref) => {
  const {
    value,
    timeout = 2000,
    onCopy,
    onCopyError,
    copiedLabel,
    copyErrorLabel,
    'aria-label': ariaLabel,
    className,
    asChild,
    children,
    onClick,
    type: _type,
    ...rest
  } = rawProps as CopyButtonProps & { type?: unknown };
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const resolvedAriaLabel = ariaLabel?.trim() || messages.copyToClipboard;
  const resolvedCopyErrorLabel = copyErrorLabel?.trim() || messages.copyFailed;
  const [feedback, setFeedback] = useState<'idle' | 'copied' | 'error'>('idle');
  const [feedbackSequence, setFeedbackSequence] = useState(0);
  const latestCopyRequestRef = useRef(0);
  const isMountedRef = useRef(true);
  const recipeClass = copyButton();
  const resolvedTimeout =
    typeof timeout === 'number' && Number.isFinite(timeout) && timeout > 0 ? timeout : 2000;
  const resolvedCopiedLabel = copiedLabel ?? messages.copied(resolvedAriaLabel);
  const canUseAsChild = Boolean(asChild && isExclusiveButtonAsChildHost(children));
  const fallbackChildren =
    asChild && isNonVoidAsChildHost(children) && !canUseAsChild
      ? getFallbackChildrenForNativeButton(children)
      : children;
  const hostProps = asChild ? omitNativeButtonOnlyProps(rest) : rest;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (feedback !== 'idle') {
      timeoutId = setTimeout(() => {
        setFeedback('idle');
      }, resolvedTimeout);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [feedback, feedbackSequence, resolvedTimeout]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleCopy = async (event: MouseEvent<HTMLElement>) => {
    (onClick as MouseEventHandler<HTMLElement> | undefined)?.(event);

    if (event.defaultPrevented) return;

    if (event.currentTarget.tagName !== 'BUTTON') {
      event.preventDefault();
    }

    const requestId = latestCopyRequestRef.current + 1;
    latestCopyRequestRef.current = requestId;
    const ownerDocument = event.currentTarget.ownerDocument;

    try {
      await copyToClipboard(value, { ownerDocument });
    } catch (error) {
      if (isMountedRef.current && requestId === latestCopyRequestRef.current) {
        setFeedback('error');
        setFeedbackSequence((sequence) => sequence + 1);
      }
      onCopyError?.(error);
      return;
    }

    if (isMountedRef.current && requestId === latestCopyRequestRef.current) {
      setFeedback('copied');
      setFeedbackSequence((sequence) => sequence + 1);
    }
    onCopy?.();
  };

  const icon = (
    <IconSwapTransition
      transitionKey={feedback === 'copied' ? 'copied' : 'copy'}
      animationType="pop"
      className={iconSwapClass}
    >
      {feedback === 'copied' ? <CheckIcon /> : <CopyIcon />}
    </IconSwapTransition>
  );
  const iconButtonProps = {
    'aria-label': feedback === 'copied' ? resolvedCopiedLabel : resolvedAriaLabel,
    onClick: handleCopy,
    icon,
    className: cx(recipeClass, className),
    ...hostProps,
  };
  const button = canUseAsChild ? (
    <IconButton
      ref={ref}
      {...({
        ...iconButtonProps,
        asChild: true,
        children: children as ReactElement,
      } as unknown as IconButtonAsChildProps)}
    />
  ) : (
    <IconButton
      ref={ref as ForwardedRef<HTMLButtonElement>}
      {...({
        ...iconButtonProps,
        asChild: false,
        children: fallbackChildren,
      } as IconButtonDefaultProps)}
    />
  );

  return (
    <>
      {button}
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">
        {feedback === 'copied'
          ? resolvedCopiedLabel
          : feedback === 'error'
            ? resolvedCopyErrorLabel
            : ''}
      </VisuallyHidden>
    </>
  );
});

CopyButtonImpl.displayName = 'CopyButton';

/**
 * Copies a string and announces the latest request's result through a polite live region.
 *
 * A consumer `onClick` can cancel copying with `preventDefault()`. The copied/error feedback
 * resets after `timeout`; invalid timeout values use 2000 ms. Overlapping requests still invoke
 * their callbacks, but only the latest completed request may replace visible feedback. `asChild`
 * is restricted to action-only hosts, so links fall back to a native button.
 */

export const CopyButton = CopyButtonImpl as CopyButtonComponent;
