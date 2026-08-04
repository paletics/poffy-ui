'use client';

import Prism from 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-markup.js'; // HTML
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-typescript.js';
import { forwardRef, isValidElement, useLayoutEffect, useRef } from 'react';
import type { AriaRole, KeyboardEvent, ReactNode } from 'react';

import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { code } from '@/styled-system/recipes';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { Slot } from '@radix-ui/react-slot';
import { CodeProps } from './Code.types';
import { useOverflowFocusability } from '@/components/shared/useOverflowFocusability';
import { handleHorizontalOverflowKeyDown } from '@/components/shared/handleHorizontalOverflowKeyDown';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

const isCodeAsChildHost = (children: ReactNode) =>
  isValidElement<{ children?: ReactNode }>(children) && children.type === 'code';

const getCodeFallbackChildren = (children: ReactNode): ReactNode => {
  if (!isValidElement<{ children?: ReactNode }>(children)) return children;
  if (
    children.type === 'pre' &&
    isValidElement<{ children?: ReactNode }>(children.props.children)
  ) {
    return children.props.children.props.children;
  }
  return children.props.children;
};

/**
 * Renders inline code or a keyboard-scrollable code block. Block mode uses `language` for syntax
 * highlighting and owns the `pre > code` structure; inline mode is for phrasing content only.
 * Overflowing blocks become focusable and support horizontal keyboard scrolling. `asChild` only
 * slots an inline `code` host; block mode deliberately falls back to its owned structure so Prism
 * can update the inner code element.
 */
export const Code = forwardRef<HTMLElement, CodeProps>((props, ref) => {
  const {
    asChild,
    className,
    children,
    variant = 'inline',
    colorScheme,
    language,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props as CodeProps & { asChild?: boolean; role?: AriaRole };

  const codeRef = useRef<HTMLElement>(null);
  const mergedRef = useMergeRefs(codeRef, ref);
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const styles = code({ variant, colorScheme });
  const [cssProps, elementProps] = splitCssProps(rest);
  const [preRef, overflowTabIndex] = useOverflowFocusability<HTMLPreElement>({
    axis: 'both',
    explicitTabIndex: elementProps.tabIndex,
  });
  const canUseInlineAsChild = asChild && isCodeAsChildHost(children);
  const fallbackChildren = asChild ? getCodeFallbackChildren(children) : children;
  const normalizedAriaLabel = ariaLabel?.trim() ? ariaLabel : undefined;
  const normalizedAriaLabelledBy = ariaLabelledBy?.trim() ? ariaLabelledBy : undefined;
  const blockRole = 'group' as const;
  const blockKeyboardProps = {
    onKeyDown: (event: KeyboardEvent<HTMLPreElement>) => {
      elementProps.onKeyDown?.(event);
      handleHorizontalOverflowKeyDown(event);
    },
  };

  // Stable dep for Prism re-highlighting: compare by text content rather than ReactNode reference.
  // ReactNode creates new object references on every parent re-render even when content is unchanged.
  const codeContent = typeof fallbackChildren === 'string' ? fallbackChildren : null;

  // Highlight before paint so visual snapshots do not capture unhighlighted code.
  useLayoutEffect(() => {
    if (variant !== 'block' || !codeRef.current) return;

    if (language) {
      Prism.highlightElement(codeRef.current);
    } else if (codeContent !== null) {
      codeRef.current.textContent = codeContent;
    }
  }, [codeContent, fallbackChildren, language, variant]);

  if (variant === 'block') {
    if (asChild) {
      const nodeEnv = (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'];

      if (nodeEnv !== 'production') {
        // Prism owns the inner code node, so block asChild safely falls back to pre > code.
        console.warn(
          '[Code] block + asChild currently falls back to the native <pre><code> structure to preserve Prism highlighting.',
        );
      }
    }

    return (
      <pre
        ref={preRef}
        className={cx(styles.root, css(cssProps), className)}
        tabIndex={overflowTabIndex}
        aria-label={
          normalizedAriaLabelledBy ? undefined : (normalizedAriaLabel ?? messages.codeBlock)
        }
        aria-labelledby={normalizedAriaLabelledBy}
        {...elementProps}
        role={blockRole}
        {...blockKeyboardProps}
      >
        <code ref={mergedRef} className={cx(styles.code, language && `language-${language}`)}>
          {fallbackChildren}
        </code>
      </pre>
    );
  }

  const Component = canUseInlineAsChild ? Slot : 'code';
  return (
    <Component
      ref={mergedRef}
      role={role}
      className={cx(styles.code, language && `language-${language}`, css(cssProps), className)}
      {...elementProps}
    >
      {canUseInlineAsChild ? children : fallbackChildren}
    </Component>
  );
});

Code.displayName = 'Code';
