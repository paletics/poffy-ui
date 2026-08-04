'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { useAnchorPosition } from '@/hooks/overlay/useFloating';
import { cx } from '@/styled-system/css';
import { tooltip } from '@/styled-system/recipes';
import { useControllableState } from '@poffy-ui/behavior/hooks';
import {
  FloatingArrow,
  FloatingNode,
  useDismiss,
  useFocus,
  useFloatingNodeId,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  Fragment,
  forwardRef,
  isValidElement,
  type KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getSafeTooltipContent } from './TooltipContent';
import type { TooltipComponent, TooltipProps } from './Tooltip.types';
import { FloatingTreeBoundary } from '../shared/FloatingTreeBoundary';
import { FloatingPortalScope } from '../Portal/FloatingPortalScope';
import { handleCancellableEscapeKeyDown } from '../shared/handleCancellableEscapeKeyDown';
import { useWarnUnpairedControlledOpen } from '../shared/useWarnUnpairedControlledOpen';


const TooltipRoot = forwardRef<Element, TooltipProps>((props, ref) => {
  const {
    children,
    content,
    placement = 'top',
    theme: propTheme,
    disabled,
    delay = 200,
    showArrow = true,
    brand: propBrand,
    virtualRef,
    className,
    asChild,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    portalContainer,
    onKeyDown: consumerKeyDown,
    ...rest
  } = props;
  const resolvedOnOpenChange =
    typeof controlledOnOpenChange === 'function' ? controlledOnOpenChange : undefined;
  const controlsOpen = controlledOpen !== undefined && resolvedOnOpenChange !== undefined;
  const {
    value: open,
    isControlled,
    setValue: setUncontrolledOpen,
  } = useControllableState({
    value: controlsOpen ? controlledOpen : undefined,
    defaultValue: !controlsOpen && controlledOpen !== undefined ? controlledOpen : false,
  });
  const [arrowEl, setArrowEl] = useState<SVGSVGElement | null>(null);
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;

  useWarnUnpairedControlledOpen('Tooltip', controlledOpen, controlsOpen);

  useEffect(() => {
    if (disabled && !isControlled) setUncontrolledOpen(false);
  }, [disabled, isControlled, setUncontrolledOpen]);

  const isOpen = !disabled && open;
  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      // Only update internal state when uncontrolled to avoid unnecessary re-renders
      // and prevent internal state pollution if the consumer later removes the `open` prop.
      if (!isControlled) setUncontrolledOpen(nextOpen);
      resolvedOnOpenChange?.(nextOpen);
    },
    [isControlled, resolvedOnOpenChange, setUncontrolledOpen],
  );

  const nodeId = useFloatingNodeId();
  const { refs, floatingStyles, context } = useAnchorPosition({
    open: isOpen,
    onOpenChange: onOpenChange,
    placement,
    arrowElement: showArrow ? arrowEl : null,
    virtualRef,
    nodeId,
  });

  const { setReference, setFloating } = refs;

  const hover = useHover(context, {
    move: false,
    delay: { open: delay, close: 0 },
    enabled: !disabled && !virtualRef,
  });
  const focus = useFocus(context, { enabled: !disabled && !virtualRef });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const classes = tooltip({ theme: propTheme });

  const mergedReferenceRef = useMergeRefs([setReference, ref]);
  const hasElementTrigger =
    isValidElement<{
      'aria-describedby'?: string;
      onKeyDown?: KeyboardEventHandler<HTMLElement>;
    }>(children) && children.type !== Fragment;
  const { onKeyDown: floatingReferenceKeyDown, ...referenceProps } = getReferenceProps(rest);
  const referenceDescribedBy = referenceProps['aria-describedby'];
  const mergeDescribedBy = (existing: string | undefined) => {
    const merged = [
      existing,
      typeof referenceDescribedBy === 'string' ? referenceDescribedBy : undefined,
    ]
      .filter(Boolean)
      .join(' ');
    return merged.length > 0 ? merged : undefined;
  };
  const handleReferenceKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    handleCancellableEscapeKeyDown(event, {
      onKeyDown: consumerKeyDown,
      onFloatingKeyDown: floatingReferenceKeyDown as KeyboardEventHandler<HTMLElement>,
    });
    if (
      event.defaultPrevented ||
      !isOpen ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }

    const floatingElement =
      typeof referenceDescribedBy === 'string'
        ? event.currentTarget.ownerDocument.getElementById(referenceDescribedBy)
        : null;
    if (!floatingElement) return;
    const maxScrollTop = Math.max(0, floatingElement.scrollHeight - floatingElement.clientHeight);
    if (maxScrollTop === 0) return;

    const pageStep = Math.max(1, Math.floor(floatingElement.clientHeight * 0.8));
    let nextScrollTop: number;
    switch (event.key) {
      case 'Home':
        nextScrollTop = 0;
        break;
      case 'End':
        nextScrollTop = maxScrollTop;
        break;
      case 'PageUp':
        nextScrollTop = Math.max(0, floatingElement.scrollTop - pageStep);
        break;
      case 'PageDown':
        nextScrollTop = Math.min(maxScrollTop, floatingElement.scrollTop + pageStep);
        break;
      default:
        return;
    }

    floatingElement.scrollTop = nextScrollTop;
    event.preventDefault();
  };
  const triggerChildren = hasElementTrigger
    ? cloneElement(children, {
        'aria-describedby': mergeDescribedBy(children.props['aria-describedby']),
        onKeyDown: (event) => {
          children.props.onKeyDown?.(event);
          handleReferenceKeyDown(event);
        },
      })
    : children;
  const asChildReferenceProps = hasElementTrigger
    ? {
        ...referenceProps,
        'aria-describedby': mergeDescribedBy(children.props['aria-describedby']),
      }
    : referenceProps;

  return (
    <FloatingNode id={nodeId}>
      {!virtualRef &&
        children &&
        (asChild && hasElementTrigger ? (
          <Slot
            ref={mergedReferenceRef}
            {...asChildReferenceProps}
            className={classes.trigger}
            onKeyDown={handleReferenceKeyDown}
          >
            {children}
          </Slot>
        ) : hasElementTrigger ? (
          <div ref={mergedReferenceRef} {...referenceProps} className={classes.trigger}>
            {triggerChildren}
          </div>
        ) : (
          <div ref={mergedReferenceRef} {...referenceProps} className={classes.trigger}>
            {children}
          </div>
        ))}
      {/* FloatingPortal is always rendered so OverlayTransition's AnimatePresence
          can play exit animations when isOpen transitions true → false. */}
      <FloatingPortalScope
        portalContainer={portalContainer}
        // A virtual reference has no commit-phase DOM ref. Its optional context element
        // already supplies the owning document, so waiting for refs.reference would leave
        // context-less virtual tooltips without a portal indefinitely.
        referenceRef={virtualRef ? undefined : refs.reference}
        ownerDocument={virtualRef?.contextElement?.ownerDocument}
      >
        <OverlayTransition
          isVisible={isOpen}
          animationType="fade"
          ref={setFloating}
          // Floating UI computes runtime position styles for the controlled element.
          style={floatingStyles}
          data-brand={propBrand ?? currentBrand ?? 'blue'}
          data-theme={propTheme ?? resolvedColorMode ?? 'light'}
          className={cx(classes.content, className)}
          {...getFloatingProps()}
          tabIndex={-1}
        >
          {getSafeTooltipContent(content)}
          {showArrow && (
            <FloatingArrow
              ref={setArrowEl}
              context={context}
              className={classes.arrow}
              fill="currentColor"
            />
          )}
        </OverlayTransition>
      </FloatingPortalScope>
    </FloatingNode>
  );
});

TooltipRoot.displayName = 'TooltipRoot';

/** Internal root that coordinates positioning and nested overlay dismissal. */
const TooltipImpl = forwardRef<Element, TooltipProps>((props, ref) => (
  <FloatingTreeBoundary>
    <TooltipRoot {...props} ref={ref} />
  </FloatingTreeBoundary>
));

TooltipImpl.displayName = 'Tooltip';

/**
 * Announces supplemental, non-interactive text for a trigger.
 *
 * It opens on hover or focus after `delay`, closes on dismissal, and connects
 * the trigger with `aria-describedby`. Disabled tooltips stay closed. Content
 * is sanitized to avoid interactive controls; use Popover for actions or rich
 * guidance. A virtual reference renders no physical trigger. Long overflow can
 * be scrolled from the focused trigger with Home, End, PageUp, and PageDown.
 */

export const Tooltip = TooltipImpl as TooltipComponent;
