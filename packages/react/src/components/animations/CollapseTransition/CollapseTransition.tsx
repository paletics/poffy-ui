'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence, type Variants } from 'motion/react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import {
  forwardRef,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { composeRefs, getMotionComponent } from '../utils';
import { collapseVariants } from './CollapseTransition.presets';
import { CollapseAnimationType, CollapseTransitionProps } from './CollapseTransition.types';

const getMeasurementElement = (node: HTMLElement): HTMLElement => {
  const firstChild = node.firstElementChild;
  return firstChild instanceof HTMLElement ? firstChild : node;
};

/**
 * A controlled collapse wrapper for open/closed content regions.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (`AnimatePresence`), Radix Slot
 * ### Design Tokens
 * - transition: Uses Silver Ratio motion presets from `collapseVariants`.
 * ### Variant Logic
 * - `height`: animates only block height.
 * - `height-fade`: combines height and opacity for standard disclosure panels.
 * - `scale-y`: uses transform-based expansion for lightweight menus or indicators.
 * @example
 * ```tsx
 * import { CollapseTransition } from '@poffy-ui/react';
 *
 * <CollapseTransition isOpen={isExpanded}>
 *   <div id="details">Details</div>
 * </CollapseTransition>
 * ```
 * ### Notes
 * Use `keepMounted` when the controlled region must remain in the DOM for measurement
 * or parent exit propagation. Closed persistent content receives `aria-hidden`.
 * ### Accessibility
 * - Respects `prefers-reduced-motion`.
 * - Does not create disclosure semantics by itself; pair with a trigger that owns
 *   `aria-expanded` and, when applicable, `aria-controls`.
 * ### AI Usage
 * - Use for Accordion content, TreeView nested groups, Stepper bodies, and any vertical
 *   region whose height changes between open and closed states.
 */
export const CollapseTransition = forwardRef<HTMLDivElement, CollapseTransitionProps>(
  (
    {
      asChild,
      isOpen,
      animationType = 'height-fade',
      keepMounted = false,
      initial = false,
      customData,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const { isAnimating } = useOptionalAnimation();
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const variants = collapseVariants[animationType as CollapseAnimationType];
    const shouldMeasureHeight = ['height', 'height-fade'].includes(animationType);
    const nodeRef = useRef<HTMLElement | null>(null);
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const measureNode = useCallback((node: HTMLElement | null) => {
      nodeRef.current = node;
      if (node) {
        setMeasuredHeight(getMeasurementElement(node).scrollHeight);
      }
    }, []);
    const mergedRef = useMemo(
      () => composeRefs<HTMLElement>(measureNode, ref as React.Ref<HTMLElement>),
      [measureNode, ref],
    );
    const transition = useMemo(
      () =>
        typeof variants.transition === 'function'
          ? variants.transition(customData)
          : variants.transition,
      [variants, customData],
    );
    const reducedTransition = isAnimating ? transition : { duration: 0 };
    const openTarget = useMemo(() => {
      if (!shouldMeasureHeight) return variants.animate;

      return {
        ...variants.animate,
        height: measuredHeight > 0 ? measuredHeight : 'auto',
        ...(animationType === 'height-fade' ? { opacity: 1 } : {}),
      };
    }, [animationType, measuredHeight, shouldMeasureHeight, variants]);
    const closedTarget = useMemo(() => {
      if (!shouldMeasureHeight) return variants.exit;

      return {
        ...variants.exit,
        height: 0,
        ...(animationType === 'height-fade' ? { opacity: 1 } : {}),
      };
    }, [animationType, shouldMeasureHeight, variants]);
    const initialTarget = useMemo(
      () =>
        shouldMeasureHeight
          ? {
              ...variants.initial,
              height: 0,
              ...(animationType === 'height-fade' ? { opacity: 1 } : {}),
            }
          : variants.initial,
      [animationType, shouldMeasureHeight, variants],
    );

    useLayoutEffect(() => {
      if (!shouldMeasureHeight) return;
      const node = nodeRef.current;
      if (!node) return;
      const measurementElement = getMeasurementElement(node);

      const updateHeight = () => {
        setMeasuredHeight(measurementElement.scrollHeight);
      };

      updateHeight();

      if (typeof ResizeObserver === 'undefined') return;

      const observer = new ResizeObserver(updateHeight);
      observer.observe(measurementElement);

      return () => {
        observer.disconnect();
      };
    }, [children, shouldMeasureHeight]);

    const motionVariants = shouldMeasureHeight
      ? undefined
      : !isAnimating
        ? undefined
        : (variants as unknown as Variants);

    if (keepMounted) {
      return (
        // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
        <Component
          ref={mergedRef}
          className={className}
          style={style}
          data-state={isOpen ? 'open' : 'closed'}
          aria-hidden={!isOpen}
          inert={!isOpen ? true : undefined}
          initial={false}
          animate={isOpen ? openTarget : closedTarget}
          variants={motionVariants}
          transition={reducedTransition}
          custom={customData}
          {...rest}
        >
          {children as ReactNode}
        </Component>
      );
    }

    return (
      <AnimatePresence initial={initial}>
        {isOpen && (
          // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
          <Component
            ref={mergedRef}
            className={className}
            style={style}
            data-state="open"
            initial={isAnimating ? initialTarget : false}
            animate={openTarget}
            exit={closedTarget}
            variants={motionVariants}
            transition={reducedTransition}
            custom={customData}
            {...rest}
          >
            {children as ReactNode}
          </Component>
        )}
      </AnimatePresence>
    );
  },
);

CollapseTransition.displayName = 'CollapseTransition';
