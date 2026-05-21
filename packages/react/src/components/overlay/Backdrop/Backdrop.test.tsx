'use client';

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Backdrop } from './Backdrop';

/**
 * ### Test Strategy
 * - **Focus**: Backdrop must render a fixed overlay container, default to locking scroll,
 *   delegate rendering via `asChild` without leaking `lockScroll` to the DOM,
 *   and pass strict accessibility audits.
 * - **DON'T**: Do not test Floating UI internals, focus only on the integration and DOM output.
 */
describe('Overlay / Backdrop', () => {
  it('renders children and has no accessibility violations', async () => {
    const { container } = render(
      <Backdrop>
        <div>Modal Content</div>
      </Backdrop>,
    );

    expect(container.querySelector('div')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('merges custom className', () => {
    const { container } = render(
      <Backdrop className="custom-backdrop">
        <div />
      </Backdrop>,
    );

    expect(container.firstChild).toHaveClass('custom-backdrop');
  });

  it('delegates to child element when asChild is true and does not leak lockScroll', () => {
    const { container } = render(
      <Backdrop asChild lockScroll>
        <section data-testid="custom-root">Content</section>
      </Backdrop>,
    );

    const root = container.querySelector('section');
    expect(root).toBeInTheDocument();
    expect(root).not.toHaveAttribute('lockscroll');
    expect(root).not.toHaveAttribute('lockScroll');
  });

  it('forwards ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Backdrop ref={ref}>
        <div />
      </Backdrop>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
