import { describe, expect, it } from 'vitest';
import {
  createNoMotionStyle,
  sanitizeControlledMotionProps,
  sanitizeMotionPropsForSlot,
} from './motion';

describe('createNoMotionStyle', () => {
  it('preserves static CSS while overriding CSS-driven motion without mutating the input', () => {
    const motionValue = { get: () => 1, set: () => undefined, on: () => () => undefined };
    const style = {
      color: 'red',
      animation: 'pulse 1s infinite',
      transition: 'opacity 200ms',
      scrollBehavior: 'smooth',
      opacity: motionValue,
    };

    expect(createNoMotionStyle(style)).toEqual({
      color: 'red',
      animation: 'none',
      transition: 'none',
      scrollBehavior: 'auto',
    });
    expect(style.animation).toBe('pulse 1s infinite');
  });
});

describe('sanitizeControlledMotionProps', () => {
  it('removes externally supplied motion drivers without mutating DOM props', () => {
    const props = {
      animate: { opacity: 1 },
      transition: { duration: 1 },
      whileHover: { scale: 1.1 },
      layout: true,
      drag: 'x',
      onMeasureDragConstraints: () => ({ left: 0, right: 10 }),
      globalTapTarget: true,
      propagate: true,
      className: 'surface',
      'data-testid': 'motion-root',
      onClick: () => undefined,
    };

    expect(sanitizeControlledMotionProps(props)).toEqual({
      className: 'surface',
      'data-testid': 'motion-root',
      onClick: props.onClick,
    });
    expect(props.animate).toEqual({ opacity: 1 });
  });

  it('removes MotionValue-like inline styles while preserving static CSS', () => {
    const motionValue = { get: () => 1, set: () => undefined, on: () => () => undefined };

    expect(
      sanitizeControlledMotionProps({
        style: { opacity: 0.5, transform: motionValue, '--custom': 'value' },
      }),
    ).toEqual({ style: { opacity: 0.5, '--custom': 'value' } });
  });

  it('removes Motion-only callbacks before forwarding props to a Slot child', () => {
    const onClick = () => undefined;

    expect(
      sanitizeMotionPropsForSlot({
        onClick,
        onPan: () => undefined,
        onAnimationComplete: () => undefined,
        viewport: { once: true },
        'data-framer-appear-id': 'entry',
      }),
    ).toEqual({ onClick });
  });
});
