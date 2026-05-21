import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { diffViewer } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import { DiffViewerRow } from './DiffViewerRow';
import type { DiffViewerProps } from './DiffViewer.types';

/**
 * Generic diff display for code, configuration, prose, and audit changes.
 *
 * ### AI Context & Architecture
 * - Tier: Organisms
 * - Stack: Panda CSS (`diffViewer` recipe), Radix Slot
 * - Scope: display-only; review actions and patch application belong in higher-level packages.
 *
 * ### Accessibility
 * - Uses row semantics and readable line labels.
 * - Caption describes the compared content when supplied.
 *
 * @example
 * ```tsx
 * <DiffViewer
 *   caption="Config change"
 *   hunks={[{ lines: [{ kind: 'added', newLineNumber: 1, content: 'enabled: true' }] }]}
 * />
 * ```
 */
export const DiffViewer = forwardRef<HTMLElement, DiffViewerProps>(
  (
    {
      asChild,
      hunks,
      caption,
      mode = 'unified',
      size,
      oldLabel = 'Old line',
      newLabel = 'New line',
      className,
      ...rest
    },
    ref,
  ) => {
    const classes = diffViewer({ mode, size });
    const Component = asChild ? Slot : ('figure' as ElementType);

    return (
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {caption ? <figcaption className={classes.caption}>{caption}</figcaption> : null}
        <div className={classes.body} role="table" aria-label={caption ? undefined : 'Diff'}>
          {hunks.map((hunk, hunkIndex) => (
            <div className={classes.hunk} role="rowgroup" key={hunk.id ?? hunkIndex}>
              {hunk.header ? <div className={classes.hunkHeader}>{hunk.header}</div> : null}
              {hunk.lines.map((line, lineIndex) => (
                <DiffViewerRow
                  key={line.id ?? lineIndex}
                  line={line}
                  mode={mode}
                  classes={classes}
                  oldLabel={oldLabel}
                  newLabel={newLabel}
                />
              ))}
            </div>
          ))}
        </div>
      </Component>
    );
  },
);

DiffViewer.displayName = 'DiffViewer';
