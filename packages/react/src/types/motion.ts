import { HTMLMotionProps } from 'motion/react';
import type { MotionProps } from 'motion/react';
import type {
  CSSProperties,
  DOMAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
  SVGProps,
} from 'react';

/** Motion driver props owned by Poffy transition wrappers and presets. */
export const CONTROLLED_MOTION_PROP_KEYS = [
  'initial',
  'animate',
  'exit',
  'variants',
  'transition',
  'custom',
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileInView',
  'whileDrag',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'dragTransition',
  'dragControls',
  'dragListener',
  'dragSnapToOrigin',
  'dragDirectionLock',
  'dragPropagation',
  'onMeasureDragConstraints',
  '_dragX',
  '_dragY',
  'layout',
  'layoutId',
  'layoutDependency',
  'layoutScroll',
  'layoutRoot',
  'layoutCrossfade',
  'layoutAnchor',
  'values',
  'transformTemplate',
  'inherit',
  'propagate',
  'globalTapTarget',
  'ignoreStrict',
] as const;

export type ControlledMotionProp = (typeof CONTROLLED_MOTION_PROP_KEYS)[number];

const controlledMotionPropKeySet = new Set<string>(CONTROLLED_MOTION_PROP_KEYS);
const slotOnlyMotionPropKeys = new Set<string>([
  'onAnimationStart',
  'onAnimationComplete',
  'onUpdate',
  'onBeforeLayoutMeasure',
  'onLayoutMeasure',
  'onLayoutAnimationStart',
  'onLayoutAnimationComplete',
  'onPan',
  'onPanSessionStart',
  'onPanStart',
  'onPanEnd',
  'onTap',
  'onTapStart',
  'onTapCancel',
  'onHoverStart',
  'onHoverEnd',
  'onViewportEnter',
  'onViewportLeave',
  'onDirectionLock',
  'onDrag',
  'onDragStart',
  'onDragEnd',
  'onDragTransitionEnd',
  'viewport',
  'data-framer-appear-id',
]);

/** Converts a potentially unsafe runtime style object to static DOM CSS values only. */
export const sanitizeStaticStyle = (style: unknown): CSSProperties | undefined => {
  if (!style || typeof style !== 'object' || Array.isArray(style)) return undefined;

  return Object.fromEntries(
    Object.entries(style).filter(([, value]) => {
      if (value === null) return true;
      if (value === undefined) return true;
      if (typeof value === 'string') return true;
      return typeof value === 'number';
    }),
  );
};

/** Produces static DOM styles that cannot retain CSS-driven motion. */
export const createNoMotionStyle = (style?: unknown): CSSProperties => ({
  ...sanitizeStaticStyle(style),
  animation: 'none',
  transition: 'none',
  scrollBehavior: 'auto',
});

/** Removes externally supplied animation drivers before a controlled wrapper forwards props. */
export const sanitizeControlledMotionProps = <T extends object>(props: T) => {
  const sanitized = Object.fromEntries(
    Object.entries(props)
      .filter(([key]) => !controlledMotionPropKeySet.has(key))
      .map(([key, value]) => [key, key === 'style' ? sanitizeStaticStyle(value) : value]),
  );

  return sanitized as Omit<T, Extract<keyof T, ControlledMotionProp>>;
};

/** Removes Motion-only props before forwarding an `asChild` wrapper to a DOM Slot. */
export const sanitizeMotionPropsForSlot = <T extends object>(props: T) =>
  Object.fromEntries(
    Object.entries(sanitizeControlledMotionProps(props)).filter(
      ([key]) => !slotOnlyMotionPropKeys.has(key),
    ),
  ) as Omit<T, Extract<keyof T, ControlledMotionProp>>;


export type MotionPrimitiveProps<T extends keyof HTMLElementTagNameMap = 'div', P = object> = Omit<
  HTMLMotionProps<T>,
  keyof P | 'asChild' | 'style' | ControlledMotionProp
> &
  P & {
    /** Static DOM CSS only. MotionValues are not accepted by controlled wrappers. */
    style?: CSSProperties;
    /**
     * When true, the component will not render its own DOM element.
     * Instead, it merges its props onto its immediate child.
     */
    asChild?: boolean;
  };

type ReactDomEventKey = Exclude<keyof DOMAttributes<Element>, keyof MotionProps>;
type StaticMotionPropKey = Exclude<keyof MotionProps, 'style'>;

/**
 * Delegated motion props whose React DOM events follow the Slot host while
 * Motion-owned callbacks keep Motion's signatures.
 */
export type RetargetedMotionAsChildHostProps<
  TProps extends { asChild?: boolean },
  THost extends Element,
> = Omit<TProps, 'asChild' | 'ref' | ReactDomEventKey> &
  Pick<DOMAttributes<THost>, ReactDomEventKey> & {
    asChild: true;
  };

/**
 * Delegated host props for motion-backed components that intentionally strip all
 * Motion callbacks and gesture drivers before reaching a plain DOM Slot.
 */
export type StaticMotionAsChildHostProps<
  TProps extends object,
  THost extends Element,
  TChild extends ReactElement = ReactElement,
> = Omit<
  TProps,
  'asChild' | 'children' | 'ref' | StaticMotionPropKey | keyof DOMAttributes<Element>
> &
  Pick<DOMAttributes<THost>, ReactDomEventKey> & {
    asChild: true;
    children: TChild;
  };

type MotionSlotEventTarget<
  TDefault extends Element,
  TDelegated extends Element,
  TAsChild extends boolean | undefined,
> = true extends TAsChild ? TDelegated : TDefault;

type MotionSlotRefTarget<
  TDefault extends Element,
  TDelegated extends Element,
  TAsChild extends boolean | undefined,
> = true extends TAsChild ? TDelegated : TDefault;

/**
 * Public call signature for a motion shell whose `asChild` host can differ from its default root.
 * The default root retains its precise ref type; delegated roots safely expose `Element`.
 */
export interface MotionSlotComponent<
  TDefault extends Element,
  TProps extends { asChild?: boolean },
  TDelegated extends Element = Element,
> {
  <TAsChild extends boolean | undefined = undefined>(
    props: Omit<TProps, 'asChild' | 'ref' | ReactDomEventKey> &
      Pick<
        DOMAttributes<MotionSlotEventTarget<TDefault, TDelegated, TAsChild>>,
        ReactDomEventKey
      > & {
        asChild?: TAsChild;
      } & RefAttributes<MotionSlotRefTarget<TDefault, TDelegated, TAsChild>>,
  ): ReactElement | null;
  readonly $$typeof: symbol;
  displayName?: string;
}

/** Adds the truthful `asChild` ref signature at the single `forwardRef` boundary. */
export const defineMotionSlotComponent = <
  TDefault extends Element,
  TProps extends { asChild?: boolean },
  TDelegated extends Element = Element,
>(
  component: ForwardRefExoticComponent<PropsWithoutRef<TProps> & RefAttributes<TDefault>>,
): MotionSlotComponent<TDefault, TProps, TDelegated> =>
  component as unknown as MotionSlotComponent<TDefault, TProps, TDelegated>;

/** Controlled counterpart for SVG motion primitives. */
export type MotionSvgPrimitiveProps<T extends SVGElement, P = object> = Omit<
  SVGProps<T>,
  keyof P | 'style' | ControlledMotionProp
> &
  Omit<MotionProps, keyof P | ControlledMotionProp> &
  P & { style?: CSSProperties };
