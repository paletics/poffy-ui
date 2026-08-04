import { act, render, screen, waitFor } from '@testing-library/react';
import { forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => ({
    isAnimating: true,
    resolvedMotionStyle: 'standard',
  }),
}));

vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils')>();
  const MockMotionComponent = forwardRef<
    HTMLElement,
    {
      animate?: string;
      children?: ReactNode;
      exit?: string;
      initial?: boolean | string;
      whileInView?: string;
      [key: string]: unknown;
    }
  >(
    (
      {
        animate,
        children,
        custom: _custom,
        exit,
        initial,
        layout: _layout,
        layoutId: _layoutId,
        transition: _transition,
        variants: _variants,
        viewport: _viewport,
        whileInView,
        ...props
      },
      ref,
    ) => (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-animate={animate}
        data-exit={exit}
        data-initial={String(initial)}
        data-while-in-view={whileInView}
        {...props}
      >
        {children}
      </div>
    ),
  );
  MockMotionComponent.displayName = 'MockMotionComponent';

  return {
    ...actual,
    getMotionComponent: () => MockMotionComponent,
  };
});

import { ContentTransition } from './ContentTransition/ContentTransition';
import { OverlayTransition } from './OverlayTransition/OverlayTransition';
import { RevealTransition } from './RevealTransition/RevealTransition';

/**
 * ### Test Strategy: animation entrance wiring
 * - **Focus**: Hydration-safe markup must still attach initial variants to later keyed mounts,
 *   overlay openings, and viewport reveals.
 * - **DON'T**: Do not assert Motion timing or interpolation in jsdom; browser QA covers frames.
 */
describe('animation entrance wiring', () => {
  it('restores the initial variant for keyed content mounted after hydration', async () => {
    const { rerender } = render(
      <ContentTransition transitionKey="a" data-testid="content">
        Content A
      </ContentTransition>,
    );
    await act(async () => undefined);

    rerender(
      <ContentTransition transitionKey="b" data-testid="content">
        Content B
      </ContentTransition>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('content')).toHaveAttribute('data-initial', 'initial');
    });
    expect(screen.getByTestId('content')).toHaveAttribute('data-animate', 'animate');
    expect(screen.getByTestId('content')).toHaveAttribute('data-exit', 'exit');
  });

  it('restores the initial variant when an overlay opens after hydration', async () => {
    const { rerender } = render(
      <OverlayTransition isVisible={false} data-testid="overlay">
        Overlay
      </OverlayTransition>,
    );
    await act(async () => undefined);

    rerender(
      <OverlayTransition isVisible data-testid="overlay">
        Overlay
      </OverlayTransition>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('overlay')).toHaveAttribute('data-initial', 'initial');
    });
    expect(screen.getByTestId('overlay')).toHaveAttribute('data-animate', 'animate');
  });

  it('uses the hidden variant until reveal content enters the viewport', async () => {
    render(<RevealTransition data-testid="reveal">Reveal</RevealTransition>);

    await waitFor(() => {
      expect(screen.getByTestId('reveal')).toHaveAttribute('data-animate', 'hidden');
    });
    expect(screen.getByTestId('reveal')).toHaveAttribute('data-while-in-view', 'visible');
  });
});
