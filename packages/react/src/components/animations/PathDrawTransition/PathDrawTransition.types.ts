import type { MotionProps } from 'motion/react';
import type { SVGProps } from 'react';
import { CustomData } from '../types';
import { PathDrawTransitionType } from './PathDrawTransition.presets';

/**
 * Public preset names supported by `PathDrawTransition`.
 */
export type PathDrawAnimationType = PathDrawTransitionType;

/**
 * Base props for the `PathDrawTransition` SVG root.
 *
 * ### Notes
 * Root props provide defaults to child `Path`, `Line`, and `Polyline`
 * primitives through context. The parent owns `isVisible`; this component only
 * animates the current drawing state.
 *
 * ### AI Usage
 * - **DO**: Use with stroked SVG primitives.
 * - **DON'T**: Use for filled icons unless they also expose a meaningful stroke path.
 *
 * ### Generic Parameters
 * - **C**: Custom data shape accepted by preset resolvers.
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
export type PathDrawTransitionProps<C extends CustomData = CustomData> = Omit<
  SVGProps<SVGSVGElement>,
  keyof PathDrawTransitionBaseProps<C>
> &
  MotionProps &
  PathDrawTransitionBaseProps<C>;

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
export type PathDrawPathProps<C extends CustomData = CustomData> = Omit<
  SVGProps<SVGPathElement>,
  keyof PathDrawPrimitiveBaseProps<C>
> &
  MotionProps &
  PathDrawPrimitiveBaseProps<C>;

/**
 * Props for `PathDrawTransition.Line`.
 */
export type PathDrawLineProps<C extends CustomData = CustomData> = Omit<
  SVGProps<SVGLineElement>,
  keyof PathDrawPrimitiveBaseProps<C>
> &
  MotionProps &
  PathDrawPrimitiveBaseProps<C>;

/**
 * Props for `PathDrawTransition.Polyline`.
 */
export type PathDrawPolylineProps<C extends CustomData = CustomData> = Omit<
  SVGProps<SVGPolylineElement>,
  keyof PathDrawPrimitiveBaseProps<C>
> &
  MotionProps &
  PathDrawPrimitiveBaseProps<C>;
