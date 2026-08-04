'use client';

import { type MotionProps } from 'motion/react';
import { type ComponentType, type ReactNode, type Ref } from 'react';
import { useExitPresenceIsolation, type PresenceSafeRest } from '../presenceIsolation';

type MotionComponent = ComponentType<MotionProps & Record<string, unknown>>;
interface IconSwapTransitionPresenceProps {
  children: ReactNode;
  className?: string;
  Component: MotionComponent;
  isAsChild: boolean;
  ref: Ref<HTMLSpanElement>;
  safeRest: PresenceSafeRest;
  shouldAnimate: boolean;
  staticStyle: MotionProps['style'];
  transition: MotionProps['transition'];
  variants: MotionProps['variants'];
}

/** Isolates an exiting icon swap from pointer, focus, and accessibility interaction. */
export const IconSwapTransitionPresence = ({
  children,
  className,
  Component,
  isAsChild,
  ref,
  safeRest,
  shouldAnimate,
  staticStyle,
  transition,
  variants,
}: IconSwapTransitionPresenceProps) => {
  const { isPresent, renderedChildren } = useExitPresenceIsolation(children, isAsChild);

  return (
    <Component
      ref={ref}
      className={className}
      {...safeRest}
      style={{ ...staticStyle, pointerEvents: isPresent ? staticStyle?.pointerEvents : 'none' }}
      initial={shouldAnimate ? 'initial' : false}
      animate={shouldAnimate ? 'animate' : undefined}
      exit={shouldAnimate ? 'exit' : undefined}
      variants={shouldAnimate ? variants : undefined}
      transition={shouldAnimate ? transition : undefined}
      aria-hidden={isPresent ? safeRest['aria-hidden'] : true}
      inert={isPresent ? safeRest.inert : true}
    >
      {renderedChildren}
    </Component>
  );
};
