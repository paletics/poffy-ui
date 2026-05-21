'use client';

import { IconSwapTransition } from '@/components/animations';
import { IconButton } from '@/components/inputs/IconButton';
import { CheckIcon } from '@/components/media/Icon/icons/CheckIcon';
import { CopyIcon } from '@/components/media/Icon/icons/CopyIcon';
import { copyToClipboard } from '@poffy-ui/behavior/clipboard';
import { forwardRef, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { css, cx } from '@/styled-system/css';
import { copyButton } from '@/styled-system/recipes';
import type { CopyButtonProps } from './CopyButton.types';

const iconSwapClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * An icon button that copies text to the clipboard, then shows a temporary success state.
 * Wraps `IconButton` and animates between a `CopyIcon` and a `CheckIcon`
 * for the configured `timeout` (default 2 s).
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`copyButton` recipe), `IconButton`, `IconSwapTransition`, `copyToClipboard` util
 * - **Props**: `CopyButtonProps`
 *
 * ### Design Tokens
 * - Inherits all tokens from `IconButton` (size / variant / shape)
 * - Success icon color: `success.main` semantic token
 *
 * ### Variant Logic
 * - No dedicated visual variants — inherits `IconButton` variants.
 * - State is communicated via icon swap (`CopyIcon` → `CheckIcon`) and `aria-label` update.
 *
 * ### Accessibility
 * - **Role**: `button` (implicit via `IconButton`)
 * - **`aria-label`**: Switches from the consumer-provided label to `'Copied'` after a successful copy.
 * - **Keyboard**: Tab: focus | Enter / Space: copy
 *
 * @example
 * ```tsx
 * <CopyButton value="npm install poffy-ui" timeout={3000} />
 * ```
 */
export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      timeout = 2000,
      onCopy,
      'aria-label': ariaLabel = 'Copy to clipboard',
      className,
      asChild,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const [hasCopied, setHasCopied] = useState(false);
    const recipeClass = copyButton();

    useEffect(() => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      if (hasCopied) {
        timeoutId = setTimeout(() => {
          setHasCopied(false);
        }, timeout);
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [hasCopied, timeout]);

    const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) return;

      try {
        await copyToClipboard(value);
        setHasCopied(true);
        onCopy?.();
      } catch (error) {
        console.error('Failed to copy text:', error);
      }
    };

    const icon = (
      <IconSwapTransition
        transitionKey={hasCopied ? 'copied' : 'copy'}
        animationType="pop"
        className={iconSwapClass}
      >
        {hasCopied ? <CheckIcon /> : <CopyIcon />}
      </IconSwapTransition>
    );

    return (
      <IconButton
        ref={ref}
        asChild={asChild}
        aria-label={hasCopied ? 'Copied' : ariaLabel}
        onClick={handleCopy}
        icon={icon}
        className={cx(recipeClass, className)}
        {...rest}
      />
    );
  },
);

CopyButton.displayName = 'CopyButton';
