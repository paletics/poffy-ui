import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RevealTransition } from './RevealTransition';

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => ({ isAnimating: true, resolvedMotionStyle: 'standard' }),
}));

vi.mock('../useHydrated', () => ({ useHydrated: () => true }));

vi.mock('../utils', async () => {
  const React = await import('react');

  return {
    resolvePresetKey: <T extends Record<string, unknown>, K extends keyof T & string>(
      presets: T,
      value: unknown,
      fallback: K,
    ): K => (typeof value === 'string' && Object.hasOwn(presets, value) ? (value as K) : fallback),
    getMotionComponent: (Component: React.ElementType) => {
      const MockMotionComponent = React.forwardRef<HTMLElement, Record<string, unknown>>(
        (
          {
            children,
            initial: _initial,
            animate: _animate,
            whileInView: _whileInView,
            variants: _variants,
            transition: _transition,
            custom: _custom,
            viewport,
            onViewportEnter,
            onViewportLeave,
            ...props
          },
          ref,
        ) => {
          const viewportOptions = viewport as { once?: boolean } | undefined;
          const handleViewportEnter = onViewportEnter as
            | ((entry: IntersectionObserverEntry | null) => void)
            | undefined;
          const handleViewportLeave = onViewportLeave as
            | ((entry: IntersectionObserverEntry | null) => void)
            | undefined;

          return React.createElement(
            Component,
            {
              ...props,
              ref,
              'data-viewport-once': String(viewportOptions?.once),
              onMouseEnter: () => handleViewportEnter?.(null),
              onMouseLeave: () => handleViewportLeave?.(null),
            },
            children,
          );
        },
      );
      MockMotionComponent.displayName = 'MockMotionComponent';
      return MockMotionComponent;
    },
  };
});

describe('RevealTransition viewport lifecycle', () => {
  it('preserves visible pointerEvents and composes consumer viewport callbacks once', () => {
    const onViewportEnter = vi.fn();
    const onViewportLeave = vi.fn();
    render(
      <RevealTransition
        data-testid="reveal"
        style={{ color: 'red', pointerEvents: 'auto' }}
        onViewportEnter={onViewportEnter}
        onViewportLeave={onViewportLeave}
      >
        Content
      </RevealTransition>,
    );

    const reveal = screen.getByTestId('reveal');
    expect(reveal.style.color).toBe('red');
    expect(reveal.style.pointerEvents).toBe('none');

    fireEvent.mouseEnter(reveal);
    expect(onViewportEnter).toHaveBeenCalledOnce();
    expect(reveal.style.color).toBe('red');
    expect(reveal.style.pointerEvents).toBe('auto');

    fireEvent.mouseLeave(reveal);
    expect(onViewportLeave).toHaveBeenCalledOnce();
    expect(reveal.style.pointerEvents).toBe('auto');
  });

  it('re-isolates on leave and reveals again when effective once is false', () => {
    const onViewportEnter = vi.fn();
    const onViewportLeave = vi.fn();
    render(
      <RevealTransition
        asChild
        once
        viewport={{ once: false }}
        onViewportEnter={onViewportEnter}
        onViewportLeave={onViewportLeave}
      >
        <button style={{ pointerEvents: 'auto' }}>Replay reveal</button>
      </RevealTransition>,
    );

    const reveal = screen.getByText('Replay reveal');
    expect(reveal).toHaveAttribute('data-viewport-once', 'false');
    expect(reveal).toHaveAttribute('aria-hidden', 'true');
    expect(reveal.style.pointerEvents).toBe('none');

    fireEvent.mouseEnter(reveal);
    expect(onViewportEnter).toHaveBeenCalledOnce();
    expect(reveal).not.toHaveAttribute('aria-hidden', 'true');
    expect(reveal.style.pointerEvents).toBe('auto');

    fireEvent.mouseLeave(reveal);
    expect(onViewportLeave).toHaveBeenCalledOnce();
    expect(reveal).toHaveAttribute('aria-hidden', 'true');
    expect(reveal.style.pointerEvents).toBe('none');

    fireEvent.mouseEnter(reveal);
    expect(onViewportEnter).toHaveBeenCalledTimes(2);
    expect(reveal).not.toHaveAttribute('aria-hidden', 'true');
    expect(reveal.style.pointerEvents).toBe('auto');
  });
});
