import type { MotionSvgPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { PathDrawTransitionType } from './PathDrawTransition.presets';

/**
 * Public preset names supported by `PathDrawTransition`.
 */
export type PathDrawAnimationType = PathDrawTransitionType;

/**
 * Props for an SVG drawing root that supplies animation defaults to its path children.
 * @typeParam C - Custom data accepted by the selected preset.
 */
export interface PathDrawTransitionBaseProps<C extends CustomData = CustomData> {
  /**
   * Animation preset to apply to child stroke elements.
   *
   * @defaultValue `'draw'`
   */
  animationType?: PathDrawAnimationType;
  /**
   * Whether paths should be drawn.
   *
   * @defaultValue `true`
   */
  isVisible?: boolean;
  /**
   * Custom values passed to the animation variants.
   */
  customData?: C;
}

/**
 * Props for the `PathDrawTransition` SVG root.
 */
export type PathDrawTransitionProps<C extends CustomData = CustomData> = MotionSvgPrimitiveProps<
  SVGSVGElement,
  PathDrawTransitionBaseProps<C>
>;

/**
 * Base props shared by path drawing primitives.
 *
 * ### Notes
 * Omit `animationType` and `customData` to inherit the root
 * `PathDrawTransition` values.
 *
 * ### Generic Parameters
 * - **C**: Custom data shape accepted by preset resolvers.
 */
export interface PathDrawPrimitiveBaseProps<C extends CustomData = CustomData> {
  /**
   * Animation preset. Inherits the parent when omitted.
   */
  animationType?: PathDrawAnimationType;
  /**
   * Custom values passed to the animation variants.
   */
  customData?: C;
}

/**
 * Props for `PathDrawTransition.Path`.
 */
export type PathDrawPathProps<C extends CustomData = CustomData> = MotionSvgPrimitiveProps<
  SVGPathElement,
  PathDrawPrimitiveBaseProps<C>
>;

/**
 * Props for `PathDrawTransition.Line`.
 */
export type PathDrawLineProps<C extends CustomData = CustomData> = MotionSvgPrimitiveProps<
  SVGLineElement,
  PathDrawPrimitiveBaseProps<C>
>;

/**
 * Props for `PathDrawTransition.Polyline`.
 */
export type PathDrawPolylineProps<C extends CustomData = CustomData> = MotionSvgPrimitiveProps<
  SVGPolylineElement,
  PathDrawPrimitiveBaseProps<C>
>;
