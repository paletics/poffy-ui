import type { MotionPrimitiveProps } from '@/types/motion';
import { CustomData } from '../types';
import { StaggerTransitionType, StaggerItemType } from './StaggerTransition.presets';

/** Named stagger container transition preset. */
export type StaggerAnimationType = StaggerTransitionType;

/** Named stagger item transition preset. */
export type StaggerItemAnimationType = StaggerItemType;

/**
 * Props for coordinated entrance animation of child elements.
 */
export interface StaggerTransitionBaseProps {
  /**
   * Stagger preset to apply.
   *
   * @defaultValue `'base'`
   */
  animationType?: StaggerAnimationType;

  /**
   * Item animation preset.
   *
   * @defaultValue `'fade'`
   */
  itemAnimationType?: StaggerItemAnimationType;

  /**
   * Delay before the first item starts animating.
   *
   * @defaultValue `0`
   */
  delay?: number;

  /**
   * Time between each child animation.
   * Overrides the preset stagger timing.
   */
  stagger?: number;

  /**
   * Custom data for animation parameters.
   */
  customData?: CustomData;

  /**
   * Whether to trigger animation on mount.
   *
   * @defaultValue `true`
   */
  initial?: boolean;
}

/**
 * StaggerTransition Props
 */
export type StaggerTransitionProps = MotionPrimitiveProps<'div', StaggerTransitionBaseProps>;

/**
 * Base props for `StaggerTransition.Item`.
 *
 * ### Notes
 * Must be rendered under `StaggerTransition` to inherit the configured
 * item animation preset.
 */
export interface StaggerTransitionItemBaseProps {
  /**
   * Animation preset to apply.
   * If not provided, inherits from parent StaggerTransition.
   */
  animationType?: StaggerItemAnimationType;

  /**
   * Custom data for animation parameters.
   */
  customData?: CustomData;
}

/**
 * StaggerTransitionItem Props
 */
export type StaggerTransitionItemProps = MotionPrimitiveProps<
  'div',
  StaggerTransitionItemBaseProps
>;
