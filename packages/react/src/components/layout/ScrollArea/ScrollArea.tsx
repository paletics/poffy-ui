'use client';

import { cx } from '@/styled-system/css';
import { scrollArea } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import type { ScrollAreaProps } from './ScrollArea.types';
import { ScrollAreaScrollbar } from './ScrollAreaScrollbar';
import { useScrollArea } from './useScrollArea';

/**
 * A cross-platform scrollable container that replaces native OS scrollbars with
 * consistently styled, interactive custom scrollbars (draggable thumb, hover reveal).
 * Supports vertical, horizontal, or both-axis scrolling via the `orientation` prop.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: scrollArea — SVA), custom `useScrollArea` hook.
 * - **Props**: ScrollAreaProps
 *
 * ### Design Tokens
 * - **spacing**: size: Silver Ratio token (`sm`/`md`/`lg`) controls scrollbar track and thumb width.
 * - **duration**: Thumb opacity and transition use Silver Ratio timing values.
 *
 * ### Variant Logic
 * - **orientation="vertical"**: (default) Vertical scrollbar only — standard long-form content.
 * - **orientation="horizontal"**: Horizontal scrollbar — wide tables or horizontal carousels.
 * - **orientation="both"**: Both axes — 2D scrolling for CAD-like or spreadsheet UIs.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: The viewport `<div>` has `tabIndex={0}` to allow keyboard focus. Users can then scroll with arrow/Page Up/Page Down keys. Pass `aria-label` to the root to describe the scroll region.
 *
 * ### AI Usage
 * - **DO**: Use whenever content may overflow its container and custom scrollbar styling is required.
 * - **DO**: Wrap `<ScrollArea>` around long lists, code blocks, chat histories, or data tables.
 * - **DON'T**: Do NOT use `overflow: auto` with raw CSS — always use `<ScrollArea>` in this design system.
 *
 * @example Vertical scroll (default)
 * ```tsx
 * <ScrollArea height="300px">
 *   <LongContent />
 * </ScrollArea>
 * ```
 *
 * @example Both-axis scroll with explicit size
 * ```tsx
 * <ScrollArea height="400px" width="600px" orientation="both" size="lg">
 *   <WideSpreadsheet />
 * </ScrollArea>
 * ```
 *
 * ### Notes
 * `asChild` is accepted by the prop type (via `PrimitiveProps`) but is intentionally
 * NOT forwarded to Slot. The component injects a viewport `<div>` and scrollbar `<div>` siblings
 * inside the root, which is structurally incompatible with Slot's single-child prop-merge contract.
 * Do NOT attempt to use `asChild` on this component.
 * Thumb state is updated via direct DOM mutations (not React state) to eliminate scroll jank.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>((props, ref) => {
  const { children, className, orientation = 'vertical', size, asChild: _asChild, ...rest } = props;

  const classes = scrollArea({ size });
  const {
    viewportId,
    viewportRef,
    vScrollbarRef,
    hScrollbarRef,
    vThumbRef,
    hThumbRef,
    getThumbPointerDown,
  } = useScrollArea();

  const showVertical = ['vertical', 'both'].includes(orientation);
  const showHorizontal = ['horizontal', 'both'].includes(orientation);

  return (
    <div
      ref={ref}
      {...rest}
      data-group=""
      data-orientation={orientation}
      className={cx(classes.root, className)}
    >
      <div
        id={viewportId}
        ref={viewportRef}
        className={classes.viewport}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- viewport must be focusable so keyboard users can scroll the custom scroll region.
        tabIndex={0}
      >
        {children}
      </div>
      {showVertical && (
        <ScrollAreaScrollbar
          orientation="vertical"
          viewportId={viewportId}
          scrollbarRef={vScrollbarRef}
          thumbRef={vThumbRef}
          scrollbarClass={classes.scrollbar}
          thumbClass={classes.thumb}
          onThumbPointerDown={getThumbPointerDown('vertical')}
        />
      )}
      {showHorizontal && (
        <ScrollAreaScrollbar
          orientation="horizontal"
          viewportId={viewportId}
          scrollbarRef={hScrollbarRef}
          thumbRef={hThumbRef}
          scrollbarClass={classes.scrollbar}
          thumbClass={classes.thumb}
          onThumbPointerDown={getThumbPointerDown('horizontal')}
        />
      )}
    </div>
  );
});

ScrollArea.displayName = 'ScrollArea';
