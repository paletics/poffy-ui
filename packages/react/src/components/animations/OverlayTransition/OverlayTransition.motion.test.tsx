import { render, screen } from '@testing-library/react';
import { forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

const animationState = vi.hoisted(() => ({ isAnimating: false, resolvedMotionStyle: 'none' }));

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => animationState,
}));

vi.mock('../utils', async (importOriginal) => {
  const MotionComponent = forwardRef<
    HTMLDivElement,
    {
      children: ReactNode;
      animate?: string;
      variants?: unknown;
      transition?: unknown;
      [key: string]: unknown;
    }
  >(({ children, animate, variants, transition, ...props }, ref) => (
    <div
      ref={ref}
      data-animate={animate}
      data-has-variants={variants === undefined ? undefined : 'true'}
      data-transition={JSON.stringify(transition)}
      {...props}
    >
      {children}
    </div>
  ));
  MotionComponent.displayName = 'MockMotionComponent';

  return {
    ...(await importOriginal<typeof import('../utils')>()),
    getMotionComponent: () => MotionComponent,
  };
});

import { OverlayTransition } from './OverlayTransition';

describe('OverlayTransition no-motion keepMounted behavior', () => {
  it('retains exit variants but makes nested transitions instantaneous', () => {
    const { rerender } = render(
      <OverlayTransition keepMounted isVisible animationType="puff" data-testid="overlay">
        Overlay content
      </OverlayTransition>,
    );

    rerender(
      <OverlayTransition keepMounted isVisible={false} animationType="puff" data-testid="overlay">
        Overlay content
      </OverlayTransition>,
    );

    const overlay = screen.getByTestId('overlay');
    expect(overlay).toHaveAttribute('data-animate', 'exit');
    expect(overlay).toHaveAttribute('data-has-variants', 'true');
    expect(overlay.getAttribute('data-transition')).toContain('"duration":0');
    expect(overlay.getAttribute('data-transition')).toContain('"delay":0');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).toHaveAttribute('inert');
  });
});
