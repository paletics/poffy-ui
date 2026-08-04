'use client';

import { type MotionProps } from 'motion/react';
import { type ComponentType, type ReactNode, type Ref } from 'react';
import { useExitPresenceIsolation, type PresenceSafeRest } from '../presenceIsolation';

type MotionComponent = ComponentType<MotionProps & Record<string, unknown>>;

interface SelectionTransitionPresenceProps {
  Component: MotionComponent;
  children: ReactNode;
  className?: string;
  customData?: Record<string, unknown>;
  isolateAsChild: boolean;
  ref: Ref<HTMLSpanElement>;
  safeRest: PresenceSafeRest;
  shouldAnimate: boolean;
  staticStyle: MotionProps['style'];
  transition: MotionProps['transition'];
  variants: MotionProps['variants'];
}

/** Makes exit-presence nodes non-interactive before their removal animation completes. */
export const SelectionTransitionPresence = ({
  Component,
  children,
  className,
  customData,
  isolateAsChild,
  ref,
  safeRest,
  shouldAnimate,
  staticStyle,
  transition,
  variants,
}: SelectionTransitionPresenceProps) => {
  const { isPresent, renderedChildren } = useExitPresenceIsolation(children, isolateAsChild);
  const inertValue = safeRest.inert;
  const exitingStyle = {
    ...staticStyle,
    pointerEvents: isPresent ? staticStyle?.pointerEvents : 'none',
  };
  return (
    <Component
      ref={ref}
      className={className}
      {...safeRest}
      style={exitingStyle}
      data-selected={isPresent ? '' : undefined}
      initial={shouldAnimate ? 'initial' : false}
      animate={shouldAnimate ? 'animate' : undefined}
      exit={shouldAnimate ? 'exit' : undefined}
      variants={shouldAnimate ? variants : undefined}
      transition={shouldAnimate ? transition : undefined}
      custom={customData}
      aria-hidden={isPresent ? safeRest['aria-hidden'] : true}
      inert={isPresent ? inertValue : true}
    >
      {renderedChildren}
    </Component>
  );
};
