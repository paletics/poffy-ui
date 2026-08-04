'use client';

import { Slot } from '@radix-ui/react-slot';
import { hasAccessibleCaptionContent } from '@/components/data-display/CodeViewer/CodeViewer.utils';
import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';
import { cx } from '@/styled-system/css';
import { diffViewer } from '@/styled-system/recipes';
import { cloneElement, ElementType, forwardRef, useId, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { DiffViewerRow } from './DiffViewerRow';
import type { DiffViewerProps } from './DiffViewer.types';
import { useOverflowFocusability } from '@/components/shared/useOverflowFocusability';
import { isDiffViewerAsChildHost, limitDiffViewerHunks } from './DiffViewer.utils';
import { getDiffViewerMessages } from './DiffViewer.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { handleHorizontalOverflowKeyDown } from '@/components/shared/handleHorizontalOverflowKeyDown';
import type { DiffViewerCaptionDisclosure as DiffViewerCaptionDisclosureOptions } from './DiffViewer.types';

interface DiffViewerHostProps {
  children?: ReactNode;
}

const DiffViewerCaptionDisclosure = ({
  classes,
  content,
  defaultOpen = false,
  summary,
}: DiffViewerCaptionDisclosureOptions & {
  classes: ReturnType<typeof diffViewer>;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      className={classes.captionDisclosure}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className={classes.captionDisclosureSummary}>{summary}</summary>
      <div className={classes.captionDisclosureContent}>{content}</div>
    </details>
  );
};

/**
 * Renders a read-only unified or split comparison as an accessible table.
 *
 * `maxRenderedRows` truncates whole hunks as needed and adds a localized
 * omitted-row summary. A visible accessible caption labels the table;
 * otherwise it receives a localized diff label. `captionDisclosure` is
 * rendered only with that caption. The scrollable body manages overflow focus
 * and supports horizontal arrow-key scrolling. `asChild` accepts a `figure`.
 */
export const DiffViewer = forwardRef<HTMLElement, DiffViewerProps>(
  (
    {
      asChild,
      hunks,
      caption,
      captionDisclosure,
      mode = 'unified',
      size,
      oldLabel,
      newLabel,
      locale: localeProp,
      messages: messageOverrides,
      maxRenderedRows = 2_000,
      focusMode = 'auto',
      bodyTabIndex,
      children,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const providerLocale = useOptionalLocale()?.locale;
    const messages = getDiffViewerMessages(localeProp ?? providerLocale, messageOverrides);
    const resolvedOldLabel = oldLabel ?? messages.oldLine;
    const resolvedNewLabel = newLabel ?? messages.newLine;
    const classes = diffViewer({ mode, size });
    const [bodyRef, bodyTabIndexValue] = useOverflowFocusability({
      explicitTabIndex: bodyTabIndex,
      focusMode,
    });
    const normalizedMaxRows =
      maxRenderedRows === Infinity || (Number.isFinite(maxRenderedRows) && maxRenderedRows >= 0)
        ? Math.floor(maxRenderedRows)
        : 2_000;
    const { hunks: visibleHunks, omittedRows } = limitDiffViewerHunks(hunks, normalizedMaxRows);
    const captionId = useId();
    const hasCaption = caption != null;
    const hasAccessibleCaption = hasAccessibleCaptionContent(caption);
    const renderedCaptionDisclosure = hasAccessibleCaption ? captionDisclosure : undefined;
    if (process.env['NODE_ENV'] !== 'production' && captionDisclosure && !hasAccessibleCaption) {
      console.warn(
        'DiffViewer: captionDisclosure requires a visible accessible caption. The disclosure was omitted.',
      );
    }
    const bodyLabel = resolveAccessibleLabel({
      ariaLabel,
      ariaLabelledBy,
      autoLabelledBy: hasAccessibleCaption ? captionId : undefined,
      fallbackLabel: messages.diff,
    });
    const canUseAsChild = asChild && isDiffViewerAsChildHost(children);
    const Component = (canUseAsChild ? Slot : 'figure') as ElementType;
    const bodyRole = 'table' as const;
    const content = (
      <>
        {hasCaption ? (
          <figcaption id={captionId} className={classes.caption}>
            {caption}
          </figcaption>
        ) : null}
        {renderedCaptionDisclosure ? (
          <DiffViewerCaptionDisclosure classes={classes} {...renderedCaptionDisclosure} />
        ) : null}
        <div
          ref={bodyRef}
          className={classes.body}
          role={bodyRole}
          tabIndex={bodyTabIndexValue}
          aria-label={bodyLabel.ariaLabel}
          aria-labelledby={bodyLabel.ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          onKeyDown={handleHorizontalOverflowKeyDown}
        >
          {visibleHunks.map((hunk, hunkIndex) => (
            <div className={classes.hunk} role="rowgroup" key={hunk.id ?? hunkIndex}>
              {hunk.header ? (
                <div className={classes.hunkHeader} role="row">
                  <span role="cell" aria-colspan={mode === 'split' ? 5 : 4}>
                    {hunk.header}
                  </span>
                </div>
              ) : null}
              {hunk.lines.map((line, lineIndex) => (
                <DiffViewerRow
                  key={line.id ?? lineIndex}
                  line={line}
                  mode={mode}
                  classes={classes}
                  oldLabel={resolvedOldLabel}
                  newLabel={resolvedNewLabel}
                  changeLabel={messages.change}
                />
              ))}
            </div>
          ))}
          {omittedRows > 0 ? (
            <div className={classes.hunkHeader} role="row">
              <span role="cell" aria-colspan={mode === 'split' ? 5 : 4}>
                {messages.omittedRows(omittedRows)}
              </span>
            </div>
          ) : null}
        </div>
      </>
    );
    const slottedChild = canUseAsChild
      ? cloneElement(children as ReactElement<DiffViewerHostProps>, { children: content })
      : null;

    return (
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {canUseAsChild ? slottedChild : content}
      </Component>
    );
  },
);

DiffViewer.displayName = 'DiffViewer';
