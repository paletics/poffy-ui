import { scrollArea } from '@/styled-system/recipes';
import { RecipeVariantProps } from '@/styled-system/types';
import { NativeProps } from '@poffy-ui/types';
import type { ReactNode, UIEventHandler } from 'react';
import type { OverflowFocusMode } from '@/components/shared/useOverflowFocusability';

/** Recipe-backed scrollbar size options. */
export type ScrollAreaVariants = RecipeVariantProps<typeof scrollArea>;

/**
 * Scroll direction(s) to enable custom scrollbars for.
 *
 * ### Notes
 * The content can still overflow naturally; this controls which custom
 * scrollbar controls are rendered.
 */
export type ScrollOrientation = 'vertical' | 'horizontal' | 'both';


type ScrollAreaNativeProps = NativeProps<
  'div',
  ScrollAreaVariants & {
    /** Content to be scrolled. */
    children: ReactNode;
    /**
     * Which direction(s) to enable custom scrollbars for.
     * @defaultValue 'vertical'
     */
    orientation?: ScrollOrientation;
    /**
     * Controls whether the owned viewport enters the tab order. `auto` adds `tabIndex=0` only
     * when the selected axis overflows; `always` always adds it; `never` omits it.
     *
     * @defaultValue `'auto'`
     */
    focusMode?: OverflowFocusMode;
    /** Explicit tab index for the owned viewport. Overrides `focusMode`, including negative values. */
    viewportTabIndex?: number;
  }
>;

/** Public props for ScrollArea. */
export type ScrollAreaProps = Omit<
  ScrollAreaNativeProps,
  'onScroll' | 'onScrollCapture' | 'role' | 'tabIndex'
> & {
  /** Scroll event emitted by the owned viewport, not the outer root. */
  onScroll?: UIEventHandler<HTMLDivElement>;
  /** Capture-phase scroll event emitted by the owned viewport, not the outer root. */
  onScrollCapture?: UIEventHandler<HTMLDivElement>;
  /** The owned viewport manages a region role when named or keyboard-scrollable. */
  role?: never;
  /** Use `viewportTabIndex` to control the owned viewport's tab stop. */
  tabIndex?: never;
};
