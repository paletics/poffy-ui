'use client';

import { cx } from '@/styled-system/css';
import { scrollArea } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import type { ScrollAreaProps } from './ScrollArea.types';
import { ScrollAreaScrollbar } from './ScrollAreaScrollbar';
import { useScrollArea } from './useScrollArea';
import { useOverflowFocusability } from '@/components/shared/useOverflowFocusability';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';

/**
 * Provides styled vertical, horizontal, or two-axis overflow with draggable scrollbars. An
 * overflowing viewport becomes a named keyboard-scrollable region; pass `aria-label` or
 * `aria-labelledby` to replace its localized fallback name. `asChild` is not supported because the
 * component owns a viewport and sibling scrollbar elements.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>((props, ref) => {
  const {
    children,
    className,
    orientation = 'vertical',
    size,
    focusMode = 'auto',
    viewportTabIndex,
    onScroll,
    onScrollCapture,
    asChild: _unsupportedAsChild,
    role: _managedRole,
    tabIndex: _managedTabIndex,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = props as ScrollAreaProps & {
    asChild?: boolean;
    role?: unknown;
    tabIndex?: unknown;
  };

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
  const [overflowRef, overflowTabIndex] = useOverflowFocusability({
    axis: orientation,
    explicitTabIndex: viewportTabIndex,
    focusMode,
  });
  const mergedViewportRef = useMergeRefs(viewportRef, overflowRef);
  const hasAccessibleName = ariaLabel ? true : Boolean(ariaLabelledBy);
  const hasScrollableRegionRole = overflowTabIndex !== undefined ? true : hasAccessibleName;
  const messages = getCommonMessages(useOptionalLocale()?.locale);

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
        ref={mergedViewportRef}
        className={classes.viewport}
        role={hasScrollableRegionRole ? 'region' : undefined}
        aria-label={
          ariaLabel ??
          (ariaLabelledBy
            ? undefined
            : hasScrollableRegionRole
              ? messages.scrollableContent
              : undefined)
        }
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={overflowTabIndex}
        onScroll={onScroll}
        onScrollCapture={onScrollCapture}
      >
        {children}
      </div>
      {showVertical && (
        <ScrollAreaScrollbar
          orientation="vertical"
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
