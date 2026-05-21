'use client';

import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism-tomorrow.css';
import { forwardRef, useLayoutEffect, useRef } from 'react';

import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { code } from '@/styled-system/recipes';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { Slot } from '@radix-ui/react-slot';
import { CodeProps } from './Code.types';

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

/**
 * A flexible code component supporting inline snippets and code blocks with syntax highlighting.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: code), Prism.js, Radix Slot
 * ### Design Tokens
 * - padding/gap/font-size: silver-ratio tokens via code recipe
 * ### Variant Logic
 * - inline: For single words or short phrases within paragraphs. block: For multi-line code snippets requiring syntax highlighting.
 * @example Use the inline variant for short tokens and the block variant with
 * `language="typescript"` for syntax-highlighted code blocks.
 * ### Notes
 * Do not nest block-level elements inside the inline variant.
 * ### Accessibility
 * - Ensures semantic HTML tags (`<code>`, `<pre>`) are used appropriately for assistive technologies.
 * ### AI Usage
 * - Use `inline` variant for referencing variables or terminal commands within text.
 * - Use `block` variant to display configuration files or multi-line code blocks.
 * - Set the `language` prop to enable Prism.js syntax highlighting in `block` mode.
 */
export const Code = forwardRef<HTMLElement, CodeProps>((props, ref) => {
  const {
    asChild,
    className,
    children,
    variant = 'inline',
    colorScheme,
    language,
    ...rest
  } = props;

  const codeRef = useRef<HTMLElement>(null);
  const mergedRef = useMergeRefs(codeRef, ref);
  const styles = code({ variant, colorScheme });
  const [cssProps, elementProps] = splitCssProps(rest);

  // Stable dep for Prism re-highlighting: compare by text content rather than ReactNode reference.
  // ReactNode creates new object references on every parent re-render even when content is unchanged.
  const codeContent = typeof children === 'string' ? children : null;

  // Highlight before paint so visual snapshots do not capture unhighlighted code.
  useLayoutEffect(() => {
    if (variant === 'block' && codeRef.current && language) {
      Prism.highlightElement(codeRef.current);
    }
  }, [codeContent, language, variant]);

  if (variant === 'block') {
    if (asChild) {
      const nodeEnv = (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'];

      if (nodeEnv !== 'production') {
        // Prism needs a code-like element to parse language classes correctly.
        console.warn(
          '[Code] block + asChild: the child element must be a <code> element (or <pre><code> structure). ' +
            'Passing other elements will cause Prism.js to highlight incorrectly.',
        );
      }
      return (
        <Slot
          ref={mergedRef}
          className={cx(styles.root, language && `language-${language}`, css(cssProps), className)}
          {...elementProps}
        >
          {children}
        </Slot>
      );
    }

    return (
      <pre className={cx(styles.root, css(cssProps), className)} {...elementProps}>
        <code ref={mergedRef} className={cx(styles.code, language && `language-${language}`)}>
          {children}
        </code>
      </pre>
    );
  }

  const Component = asChild ? Slot : 'code';
  return (
    <Component
      ref={mergedRef}
      className={cx(styles.code, language && `language-${language}`, css(cssProps), className)}
      {...elementProps}
    >
      {children}
    </Component>
  );
});

Code.displayName = 'Code';
