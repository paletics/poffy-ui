import { describe, expect, it, vi } from 'vitest';

vi.unmock('@/providers');

import { applyMotionStyle } from './motionStyle';
import { isPoffyMotionStyle } from './index';

describe('applyMotionStyle', () => {
  it('exports the motion-style guard as a runtime provider API', () => {
    expect(isPoffyMotionStyle('subtle')).toBe(true);
    expect(isPoffyMotionStyle('standard')).toBe(true);
    expect(isPoffyMotionStyle('pop')).toBe(true);
    expect(isPoffyMotionStyle('none')).toBe(true);
    expect(isPoffyMotionStyle('playful')).toBe(false);
    expect(isPoffyMotionStyle(null)).toBe(false);
  });

  it('reduces transform magnitude and adds damping for subtle motion', () => {
    const motion = applyMotionStyle(
      {
        hidden: { x: 20, rotate: 8, scale: 0.8 },
        transition: { type: 'spring', stiffness: 400, damping: 20 },
      },
      'subtle',
    );

    expect(motion.hidden).toEqual({ x: 10, rotate: 2, scale: 0.9 });
    expect(motion.transition).toMatchObject({ stiffness: 300, damping: 27 });
  });

  it('increases transform magnitude while preserving timing ratios for pop motion', () => {
    const motion = applyMotionStyle({ x: 20, scale: 0.8, ease: [0.2, 0.8], times: [0, 1] }, 'pop');

    expect(motion).toEqual({ x: 25, scale: 0.75, ease: [0.2, 0.8], times: [0, 1] });
  });

  it('adapts percentage x and y transforms while preserving other CSS values', () => {
    expect(applyMotionStyle({ x: '100%', y: '-40%', filter: 'blur(4px)' }, 'subtle')).toEqual({
      x: '50%',
      y: '-20%',
      filter: 'blur(4px)',
    });
    expect(applyMotionStyle({ x: 'calc(100% - 1rem)' }, 'pop')).toEqual({
      x: 'calc(100% - 1rem)',
    });
  });

  it('scales and clamps drag elasticity with the selected profile', () => {
    expect(applyMotionStyle({ dragElastic: 0.8 }, 'subtle')).toEqual({ dragElastic: 0.4 });
    expect(applyMotionStyle({ dragElastic: { left: 0.8, right: 1 } }, 'pop')).toEqual({
      dragElastic: { left: 1, right: 1 },
    });
  });

  it('preserves standard motion definitions', () => {
    const motion = { transition: { duration: 0.2 }, y: -10 };

    expect(applyMotionStyle(motion, 'standard')).toEqual(motion);
  });

  it('preserves none definitions and adapts function-based transitions', () => {
    const transition = applyMotionStyle(
      (duration: number) => ({ duration, delay: 0.1, repeatDelay: 0.3, staggerChildren: 0.2 }),
      'subtle',
    );

    const resolvedTransition = transition(1);
    expect(resolvedTransition.duration).toBeCloseTo(0.8);
    expect(resolvedTransition.delay).toBeCloseTo(0.08);
    expect(resolvedTransition.repeatDelay).toBeCloseTo(0.24);
    expect(resolvedTransition.staggerChildren).toBeCloseTo(0.16);
    expect(applyMotionStyle({ opacity: [0, 1] }, 'none')).toEqual({ opacity: [0, 1] });
  });

  it('makes nested variant transitions instantaneous for none', () => {
    expect(
      applyMotionStyle(
        {
          exit: {
            opacity: 0,
            transition: {
              delay: 0.141,
              repeat: Infinity,
              delayChildren: 0.4,
              staggerChildren: 0.2,
              opacity: { type: 'spring', delay: 0.1, duration: 0.2, repeatDelay: 0.3 },
            },
          },
        },
        'none',
      ),
    ).toEqual({
      exit: {
        opacity: 0,
        transition: {
          type: 'tween',
          duration: 0,
          delay: 0,
          repeat: 0,
          repeatDelay: 0,
          delayChildren: 0,
          staggerChildren: 0,
          opacity: {
            type: 'tween',
            duration: 0,
            delay: 0,
            repeat: 0,
            repeatDelay: 0,
            delayChildren: 0,
            staggerChildren: 0,
          },
        },
      },
    });
  });
});
