'use client';

import { Code } from '@/components/typography/Code';
import { getCommonMessages } from '@/components/shared/common.locales';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { cx } from '@/styled-system/css';
import { codeViewer } from '@/styled-system/recipes';
import { forwardRef, useId } from 'react';
import type { CodeViewerProps } from './CodeViewer.types';
import { useOverflowFocusability } from '@/components/shared/useOverflowFocusability';
import { hasAccessibleCaptionContent } from './CodeViewer.utils';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { handleHorizontalOverflowKeyDown } from '@/components/shared/handleHorizontalOverflowKeyDown';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const DEFAULT_MAX_HIGHLIGHTED_CHARACTERS = 100_000;
const DEFAULT_MAX_LINE_NUMBER_COUNT = 10_000;
const DEFAULT_MAX_LINE_NUMBER_CHARACTERS = 100_000;

function normalizeLimit(value: number | undefined, fallback: number): number {
  return value === Infinity
    ? Infinity
    : Number.isFinite(value) && value! >= 0
      ? Math.floor(value!)
      : fallback;
}

function isWithinLimit(length: number, limit: number): boolean {
  if (limit === Infinity) return true;
  return limit > 0 && length <= limit;
}

function countLines(source: string, limit: number): number {
  let count = 1;
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== '\n' && source[index] !== '\r') continue;
    if (source[index] === '\r' && source[index + 1] === '\n') index += 1;
    count += 1;
    if (count > limit) return count;
  }
  return count;
}

/**
 * Renders read-only source, configuration, or log text in a labelled region.
 *
 * The optional caption labels the region when it has accessible content;
 * otherwise a localized source-code label is used unless the caller supplies
 * an ARIA label. Highlighting and line numbers are independently skipped when
 * their bounded character or line limits are exceeded. The scrollable body can
 * enter the tab order according to `focusMode` or `bodyTabIndex`.
 */
export const CodeViewer = forwardRef<HTMLElement, CodeViewerProps>(
  (
    {
      children,
      caption,
      language,
      showLineNumbers = false,
      maxHighlightedCharacters,
      maxLineNumberCount,
      maxLineNumberCharacters,
      focusMode = 'auto',
      bodyTabIndex,
      size,
      wrap,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const classes = codeViewer({ size, wrap });
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const [bodyRef, bodyTabIndexValue] = useOverflowFocusability({
      explicitTabIndex: bodyTabIndex,
      focusMode,
    });
    const generatedCaptionId = useId();
    const materializedCaption = materializeReactNodeTree(caption);
    const shouldRenderCaption = caption != null;
    const hasAccessibleCaption = hasAccessibleCaptionContent(materializedCaption);
    const bodyLabel = resolveAccessibleLabel({
      ariaLabel,
      ariaLabelledBy,
      autoLabelledBy: hasAccessibleCaption ? generatedCaptionId : undefined,
      fallbackLabel: messages.sourceCode,
    });
    const highlightLimit = normalizeLimit(
      maxHighlightedCharacters,
      DEFAULT_MAX_HIGHLIGHTED_CHARACTERS,
    );
    const lineNumberLimit = normalizeLimit(maxLineNumberCount, DEFAULT_MAX_LINE_NUMBER_COUNT);
    const lineNumberCharacterLimit = normalizeLimit(
      maxLineNumberCharacters,
      DEFAULT_MAX_LINE_NUMBER_CHARACTERS,
    );
    const canHighlight = isWithinLimit(children.length, highlightLimit);
    const canMeasureLineNumbers =
      showLineNumbers &&
      lineNumberLimit > 0 &&
      isWithinLimit(children.length, lineNumberCharacterLimit);
    const measuredLineCount = canMeasureLineNumbers ? countLines(children, lineNumberLimit) : 0;
    const shouldShowLineNumbers = canMeasureLineNumbers && measuredLineCount <= lineNumberLimit;
    const lineCount = shouldShowLineNumbers ? measuredLineCount : 0;
    const numbers = Array.from({ length: lineCount }, (_, index) => String(index + 1)).join('\n');
    const bodyRole = 'region' as const;

    return (
      <figure ref={ref} className={cx(classes.root, className)} {...rest}>
        {shouldRenderCaption ? (
          <figcaption
            id={hasAccessibleCaption ? generatedCaptionId : undefined}
            className={classes.caption}
          >
            {materializedCaption}
          </figcaption>
        ) : null}
        <div
          ref={bodyRef}
          className={classes.body}
          data-line-numbers={shouldShowLineNumbers ? 'true' : undefined}
          tabIndex={bodyTabIndexValue}
          role={bodyRole}
          aria-label={bodyLabel.ariaLabel}
          aria-labelledby={bodyLabel.ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          onKeyDown={handleHorizontalOverflowKeyDown}
        >
          {shouldShowLineNumbers ? (
            <div className={classes.gutter} aria-hidden="true">
              <span className={classes.numbers}>{numbers}</span>
            </div>
          ) : null}
          <div className={classes.source}>
            <Code variant="block" language={canHighlight ? language : undefined} tabIndex={-1}>
              {children}
            </Code>
          </div>
        </div>
      </figure>
    );
  },
);

CodeViewer.displayName = 'CodeViewer';
