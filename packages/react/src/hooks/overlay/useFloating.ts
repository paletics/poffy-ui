import {
  arrow,
  autoUpdate,
  flip,
  MiddlewareData,
  offset,
  Placement,
  Strategy,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type FloatingNodeType,
  VirtualElement,
  ReferenceType,
} from '@floating-ui/react';
import type { CSSProperties, HTMLProps } from 'react';
import { useEffect, useMemo } from 'react';

/**
 * Props for controlled positioning of an overlay anchored to a reference or virtual element.
 * The hook reports state changes through `onOpenChange`; callers retain the open state.
 */
export interface UseAnchorPositionProps {
  /** Whether the floating element is currently open. */
  open: boolean;
  /** Callback triggered when the open state changes. */
  onOpenChange: (open: boolean) => void;
  /**
   * The desired placement of the floating element.
   *
   * @defaultValue `'bottom'`
   */
  placement?: Placement;
  /**
   * The offset distance from the anchor element.
   *
   * @defaultValue `8`
   */
  offset?: number;
  /**
   * CSS positioning strategy. Use `fixed` for viewport-constrained portalled surfaces.
   *
   * @defaultValue `'absolute'`
   */
  strategy?: Strategy;
  /** Ref to the arrow element, if applicable. */
  arrowElement?: Element | null;
  /** Virtual element to act as the anchor point, if not using a physical DOM element. */
  virtualRef?: VirtualElement | null;
  /** Internal Floating UI node ID used to coordinate nested overlay dismissal. */
  nodeId?: FloatingNodeType['id'];
}

/**
 * Floating UI positioning primitives returned by useAnchorPosition.
 *
 * ### Notes
 * Attach `refs.setReference` to the trigger/anchor and
 * `refs.setFloating` to the positioned surface. Apply `floatingStyles` to the
 * floating element before animation styles. Positioning also sets
 * `--floating-reference-width`, `--floating-available-width`, and
 * `--floating-available-height` on the floating element for CSS sizing rules.
 */
export interface UseAnchorPositionReturn<T extends ReferenceType> {
  refs: ReturnType<typeof useFloating<T>>['refs'];
  floatingStyles: CSSProperties;
  context: ReturnType<typeof useFloating<T>>['context'];
  middlewareData: MiddlewareData;
}

/**
 * Positions a floating element relative to a DOM or virtual anchor.
 *
 * Use for anchored overlays. Do not use for fixed modal/drawer surfaces; use
 * `useOverlay` for those.
 *
 * @example
 * ```tsx
 * import { useAnchorPosition } from '@poffy-ui/react';
 *
 * const floating = useAnchorPosition({ open, onOpenChange, placement: 'bottom-start' });
 * ```
 *
 * @returns Floating UI context and position data.
 */
export const useAnchorPosition = <T extends ReferenceType>({
  open,
  onOpenChange,
  placement = 'bottom',
  offset: offsetValue = 8,
  strategy = 'absolute',
  arrowElement,
  virtualRef,
  nodeId,
}: UseAnchorPositionProps): UseAnchorPositionReturn<T> => {
  const { refs, floatingStyles, context, middlewareData } = useFloating<T>({
    open,
    onOpenChange,
    placement,
    strategy,
    whileElementsMounted: autoUpdate,
    transform: false,
    middleware: [
      offset(offsetValue),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ availableHeight, availableWidth, elements, rects }) {
          elements.floating.style.setProperty(
            '--floating-reference-width',
            `${rects.reference.width}px`,
          );
          elements.floating.style.setProperty(
            '--floating-available-width',
            `${Math.max(0, availableWidth)}px`,
          );
          elements.floating.style.setProperty(
            '--floating-available-height',
            `${Math.max(0, availableHeight)}px`,
          );
        },
      }),
      ...(arrowElement ? [arrow({ element: arrowElement })] : []),
    ],
    nodeId,
  });

  useEffect(() => {
    if (!virtualRef) return;
    refs.setPositionReference(virtualRef);
    return () => refs.setPositionReference(refs.domReference.current);
  }, [refs, virtualRef]);

  return { refs, floatingStyles, context, middlewareData };
};

/**
 * Props for a controlled fixed overlay; rendering, focus traps, and scroll locking remain
 * caller-owned. The returned trigger props use click interaction, and dismissal reports through
 * `onOpenChange`.
 */
export interface UseOverlayProps {
  /** Whether the overlay is currently open. */
  open: boolean;
  /** Callback triggered when the open state changes. */
  onOpenChange: (open: boolean) => void;
  /** Role exposed through Floating UI's role interaction. */
  role?: 'dialog' | 'alertdialog';
  /**
   * Whether a mousedown outside the overlay should close it.
   *
   * @defaultValue `true`
   */
  outsidePress?: boolean;
  /** Internal Floating UI node ID used to coordinate nested overlay dismissal. */
  nodeId?: FloatingNodeType['id'];
}

/**
 * Floating UI refs, context, and prop getters returned by useOverlay.
 *
 * ### Notes
 * Spread `getReferenceProps` onto the trigger and `getFloatingProps`
 * onto the overlay surface so click, dismiss, and role behavior remain wired.
 */
export interface UseOverlayReturn<T extends ReferenceType> {
  refs: ReturnType<typeof useFloating<T>>['refs'];
  context: ReturnType<typeof useFloating<T>>['context'];
  getReferenceProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>;
  getFloatingProps: (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;
}

/**
 * Manages fixed-position overlays such as Modal and Drawer.
 *
 * Provides Floating UI refs, dismiss behavior, and dialog role props for the
 * generated content component. Do not use this for coordinate-positioned popovers or tooltips;
 * the hook intentionally does not provide positioning styles.
 *
 * @example
 * ```tsx
 * import { useOverlay } from '@poffy-ui/react';
 *
 * const { refs, getReferenceProps, getFloatingProps } = useOverlay({ open, onOpenChange });
 * ```
 *
 * @returns Ref handlers and transition context.
 */
export const useOverlay = <T extends ReferenceType>({
  open,
  onOpenChange,
  role: roleName = 'dialog',
  outsidePress = true,
  nodeId,
}: UseOverlayProps): UseOverlayReturn<T> => {
  const { refs, context } = useFloating<T>({
    open,
    onOpenChange,
    nodeId,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress,
    outsidePressEvent: 'mousedown',
    bubbles: false,
  });
  const role = useRole(context, { role: roleName });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return { refs, context, getReferenceProps, getFloatingProps };
};

/**
 * Creates a memoized virtual floating-element anchor from viewport coordinates, or `null` until
 * both coordinates exist. Pass `contextElement` when the coordinates belong to a specific DOM
 * context, such as a scroll container.
 */
export const useVirtualAnchor = (
  position?: { x: number; y: number } | null,
  contextElement?: Element | null,
) => {
  const x = position?.x;
  const y = position?.y;

  return useMemo<VirtualElement | null>(() => {
    if (x == null || y == null) return null;

    return {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x,
        y,
        top: y,
        left: x,
        right: x,
        bottom: y,
      }),
      contextElement: contextElement ?? undefined,
    };
  }, [x, y, contextElement]);
};
