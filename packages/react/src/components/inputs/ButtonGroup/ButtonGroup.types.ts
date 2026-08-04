import { ActionMotionType } from '@/components/animations/ActionMotion';
import { PrimitiveProps } from '@poffy-ui/types';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Layout and motion options shared by `ButtonGroup` and `ButtonGroup.Root`. */
export interface ButtonGroupVariants {
  /**
   * Group layout direction.
   *
   * @defaultValue `'horizontal'`
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Gap between actions when `connected` is false.
   *
   * @defaultValue `'md'`
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Joins adjacent actions visually and disables wrapping.
   *
   * @defaultValue `false`
   */
  connected?: boolean;
  /**
   * Stretches the group and its direct button children to the available width.
   *
   * @defaultValue `false`
   */
  fullWidth?: boolean;
  /**
   * Allow non-connected horizontal buttons to move to another row instead of
   * compressing their labels below their natural width. This is a no-op for
   * vertical or connected groups.
   *
   * @defaultValue `false`
   */
  wrap?: boolean;
  /**
   * Physics-based orchestration preset applied to child buttons via `ActionMotion`.
   * - `'stagger'`: Sequential reveal of children on mount (default).
   * - Other presets apply a shared animation to the entire group.
   * @defaultValue 'stagger'
   */
  animationType?: ActionMotionType;
}

type ButtonGroupNativeProps = Omit<PrimitiveProps<'div', ButtonGroupVariants>, 'role'>;
/** Props for ButtonGroup's owned div host. */
export type ButtonGroupDefaultProps = DefaultHostProps<ButtonGroupNativeProps>;
/** Native hosts accepted by ButtonGroup when `asChild` is enabled. */
type ButtonGroupAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;
/** Props for ButtonGroup delegated to an asChild host. */
export type ButtonGroupAsChildProps = RetargetedAsChildHostProps<
  ButtonGroupNativeProps,
  HTMLElement,
  ButtonGroupAsChildElement
>;
/** Props accepted by ButtonGroup's owned or constrained delegated host. */
export type ButtonGroupProps = ButtonGroupDefaultProps | ButtonGroupAsChildProps;
/** Ref-forwarding public component signature for ButtonGroup and ButtonGroup.Root. */
export type ButtonGroupComponent = PolymorphicAsChildComponent<
  ButtonGroupDefaultProps,
  ButtonGroupAsChildProps,
  HTMLDivElement,
  HTMLElement
>;
