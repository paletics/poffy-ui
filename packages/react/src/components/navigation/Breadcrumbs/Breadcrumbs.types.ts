import { breadcrumbs } from '@/styled-system/recipes';
import { NativeProps, PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Variants for the Breadcrumbs component based on the Panda CSS recipe.
 */
export type BreadcrumbsVariants = NonNullable<Parameters<typeof breadcrumbs>[0]>;

/**
 * Props for the Breadcrumbs root component.
 *
 * @example
 * ```tsx
 * import { BreadcrumbItem, BreadcrumbLink, Breadcrumbs } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * Required structure: render `BreadcrumbItem` children inside `Breadcrumbs`, with
 * `BreadcrumbLink isCurrentPage` on the last item when it represents the current page.
 * Root, item, and separator elements are fixed semantic elements.
 *
 * Related: `BreadcrumbItemProps`
 * Related: `BreadcrumbSeparatorProps`
 */
export interface BreadcrumbsRootProps extends NativeProps<'nav', BreadcrumbsVariants> {
  /** BCP 47 locale overriding the nearest LocaleProvider for the default navigation label. */
  locale?: string;
  /**
   * Separator element between breadcrumb items.
   *
   * **Auto-injection mode (default):** Pass visible `ReactNode` content (e.g. `"/"`,
   * `<ChevronIcon />`). Boolean values do not render separators.
   * Separators are automatically inserted between `<BreadcrumbItem>` elements.
   *
   * **Manual mode:** Pass `null` to disable auto-injection, then place
   * `<BreadcrumbSeparator>` between items yourself for per-item control.
   *
   * @defaultValue `"/"`
   * @example Auto-injection
   * ```tsx
   * <Breadcrumbs separator=">">...</Breadcrumbs>
   * ```
   * @example Manual mode
   * ```tsx
   * <Breadcrumbs separator={null}>
   *   <BreadcrumbItem>...</BreadcrumbItem>
   *   <BreadcrumbSeparator>-</BreadcrumbSeparator>
   *   <BreadcrumbItem>...</BreadcrumbItem>
   * </Breadcrumbs>
   * ```
   */
  separator?: ReactNode | null;
}

/**
 * Props for the individual BreadcrumbItem.
 *
 * ### Notes
 * Use one item per path segment.
 */
export type BreadcrumbItemProps = NativeProps<'li'>;

/**
 * Props for the BreadcrumbLink.
 */
type BreadcrumbLinkNativeProps = PrimitiveProps<'a'>;
type CurrentPageNativeProps = NativeProps<'span'> & Pick<BreadcrumbLinkNativeProps, 'asChild'>;

type CurrentPageInteractiveProp =
  | 'aria-current'
  | 'contentEditable'
  | 'href'
  | 'onAuxClick'
  | 'onAuxClickCapture'
  | 'onClick'
  | 'onClickCapture'
  | 'onContextMenu'
  | 'onContextMenuCapture'
  | 'onDoubleClick'
  | 'onDoubleClickCapture'
  | 'onKeyDown'
  | 'onKeyDownCapture'
  | 'onKeyPress'
  | 'onKeyPressCapture'
  | 'onKeyUp'
  | 'onKeyUpCapture'
  | 'onMouseDown'
  | 'onMouseDownCapture'
  | 'onMouseUp'
  | 'onMouseUpCapture'
  | 'onPointerDown'
  | 'onPointerDownCapture'
  | 'onPointerUp'
  | 'onPointerUpCapture'
  | 'onTouchCancel'
  | 'onTouchCancelCapture'
  | 'onTouchEnd'
  | 'onTouchEndCapture'
  | 'onTouchStart'
  | 'onTouchStartCapture'
  | 'rel'
  | 'role'
  | 'tabIndex'
  | 'target';

type CurrentPageInteractiveProps = {
  [K in CurrentPageInteractiveProp]?: never;
};

interface CurrentPageBreadcrumbLinkProps
  extends Omit<CurrentPageNativeProps, CurrentPageInteractiveProp>, CurrentPageInteractiveProps {
  /** Renders a non-interactive current-page span with `aria-current="page"`. */
  isCurrentPage: true;
}

interface NavigableBreadcrumbLinkProps extends BreadcrumbLinkNativeProps {
  /** Renders a navigable breadcrumb link. @defaultValue `false` */
  isCurrentPage?: false;
}

/**
 * A navigable breadcrumb link or a non-interactive current-page indicator.
 * `asChild` remains available on current-page items to preserve accessible
 * naming content from router anchors, but it never delegates the rendered span.
 */
export type BreadcrumbLinkProps = CurrentPageBreadcrumbLinkProps | NavigableBreadcrumbLinkProps;

/** Props for a manual Breadcrumb separator; use only when `separator={null}` disables injection. */
export interface BreadcrumbSeparatorProps extends NativeProps<'li'> {
  /**
   * Content of the separator.
   * Defaults to the parent `<Breadcrumbs separator>` value via context.
   */
  children?: ReactNode;
}
