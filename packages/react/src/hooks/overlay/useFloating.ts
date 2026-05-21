import {
  arrow,
  autoUpdate,
  flip,
  MiddlewareData,
  offset,
  Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  VirtualElement,
  ReferenceType,
} from '@floating-ui/react';
import type { CSSProperties, HTMLProps } from 'react';
import { useMemo } from 'react';

// Hooks for floating elements (tooltips, popovers, menus, context menus) via @floating-ui/react.
// These wrap Floating UI to provide a simplified API for common positioning and interaction needs.

/**
 * Props for `useAnchorPosition`.
 *
 * Shared positioning hook for anchored overlays such as Popover, Tooltip, and
 * listbox popovers. The caller owns the controlled `open` state and receives
 * state changes through `onOpenChange`.
 *
 * ### Notes
 * This hook is controlled. It never stores open state internally, and
 * it always returns `transform: false` floating styles so consumers can compose
 * positioning with transform-based animation wrappers.
 *
 * ### AI Usage
 * - **DO**: Use for anchored overlays with a trigger/reference element.
 * - **DO**: Pass `virtualRef` for context menus, chart tooltips, and canvas coordinates.
 * - **DON'T**: Use for fixed modal or drawer surfaces; use `useOverlay`.
 *
 * Related: import('@poffy-ui/react/overlay').PopoverProps
 * Related: import('@poffy-ui/react/overlay').TooltipProps
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
  /** Ref to the arrow element, if applicable. */
  arrowElement?: Element | null;
  /** Virtual element to act as the anchor point, if not using a physical DOM element. */
  virtualRef?: VirtualElement | null;
}

/**
 * Floating UI positioning primitives returned by useAnchorPosition.
 *
 * ### Notes
 * Attach `refs.setReference` to the trigger/anchor and
 * `refs.setFloating` to the positioned surface. Apply `floatingStyles` to the
 * floating element before animation styles.
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
 * @param props - Configuration properties for positioning.
 * @returns Floating UI context and position data.
 */
export const useAnchorPosition = <T extends ReferenceType>({
  open,
  onOpenChange,
  placement = 'bottom',
  offset: offsetValue = 8,
  arrowElement,
  virtualRef,
}: UseAnchorPositionProps): UseAnchorPositionReturn<T> => {
  const { refs, floatingStyles, context, middlewareData } = useFloating<T>({
    open,
    onOpenChange,
    placement,
    whileElementsMounted: autoUpdate,
    transform: false,
    middleware: [
      offset(offsetValue),
      flip(),
      shift(),
      size({
        apply({ elements, rects }) {
          elements.floating.style.setProperty(
            '--floating-reference-width',
            `${rects.reference.width}px`,
          );
        },
      }),
      ...(arrowElement ? [arrow({ element: arrowElement })] : []),
    ],
    ...(virtualRef ? { elements: { reference: virtualRef as Element } } : {}),
  });

  return { refs, floatingStyles, context, middlewareData };
};

/**
 * Props for `useOverlay`.
 *
 * Shared fixed-overlay hook for Modal and Drawer. The caller owns the
 * controlled `open` state and receives dismiss requests through
 * `onOpenChange`.
 *
 * ### Notes
 * This hook manages Floating UI interactions and dialog role props,
 * but it does not render portals, backdrops, focus traps, or scroll locking.
 *
 * ### AI Usage
 * - **DO**: Use for fixed overlays where position is not anchored to a trigger.
 * - **DON'T**: Use for Popover, Tooltip, Select, or ContextMenu surfaces.
 *
 * Related: import('@poffy-ui/react/overlay').ModalProps
 * Related: import('@poffy-ui/react/overlay').DrawerProps
 */
export interface UseOverlayProps {
  /** Whether the overlay is currently open. */
  open: boolean;
  /** Callback triggered when the open state changes. */
  onOpenChange: (open: boolean) => void;
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
 * generated content component. Do not use this for coordinate-positioned
 * popovers or tooltips.
 *
 * @example
 * ```tsx
 * import { useOverlay } from '@poffy-ui/react';
 *
 * const { refs, getReferenceProps, getFloatingProps } = useOverlay({ open, onOpenChange });
 * ```
 *
 * @param props - Configuration properties for the overlay.
 * @returns Ref handlers and transition context.
 */
export const useOverlay = <T extends ReferenceType>({
  open,
  onOpenChange,
}: UseOverlayProps): UseOverlayReturn<T> => {
  const { refs, context } = useFloating<T>({
    open,
    onOpenChange,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown', bubbles: false });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return { refs, context, getReferenceProps, getFloatingProps };
};

/**
 * Creates a virtual anchor element from viewport coordinates.
 *
 * Useful for ContextMenu and canvas/chart tooltips where no stable DOM anchor
 * exists. Returns null until both coordinates are available.
 *
 * ### Notes
 * Pass the returned virtual element to `useAnchorPosition` as
 * `virtualRef`. The coordinate object is read by value (`x`, `y`) so callers can
 * reuse object identities without stale placement.
 *
 * ### AI Usage
 * - **DO**: Use for right-click menus and pointer-positioned inspection UI.
 * - **DON'T**: Use when a real DOM reference exists; real refs preserve size and collision data.
 *
 * @example
 * ```tsx
 * import { useAnchorPosition, useVirtualAnchor } from '@poffy-ui/react';
 *
 * const virtualRef = useVirtualAnchor(pointerPosition);
 * const floating = useAnchorPosition({ open, onOpenChange, virtualRef });
 * ```
 *
 * @param position - The x and y coordinates for the anchor.
 * @param contextElement - Optional reference element for coordinate calculation.
 * @returns A Floating UI VirtualElement or null.
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
