'use client';

import { type MotionProps } from 'motion/react';
import { type ComponentType, type ReactNode, type Ref } from 'react';
import { useExitPresenceIsolation, type PresenceSafeRest } from '../presenceIsolation';

type MotionComponent = ComponentType<MotionProps & Record<string, unknown>>;
interface ContentTransitionPresenceProps {
  children: ReactNode;
  className?: string;
  Component: MotionComponent;
  customData?: Record<string, unknown>;
  isAsChild: boolean;
  ref: Ref<HTMLDivElement>;
  safeRest: PresenceSafeRest;
  shouldAnimate: boolean;
  staticStyle: MotionProps['style'];
  transition: MotionProps['transition'];
  variants: MotionProps['variants'];
}

/** Isolates exiting content while AnimatePresence keeps it in the DOM. */
export const ContentTransitionPresence = ({
  children,
  className,
  Component,
  customData,
  isAsChild,
  ref,
  safeRest,
  shouldAnimate,
  staticStyle,
  transition,
  variants,
}: ContentTransitionPresenceProps) => {
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
      custom={customData}
      aria-hidden={isPresent ? safeRest['aria-hidden'] : true}
      inert={isPresent ? safeRest.inert : true}
    >
      {renderedChildren}
    </Component>
  );
};
