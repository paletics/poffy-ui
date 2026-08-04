'use client';

import { render, screen } from '@testing-library/react';
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

  it('delegates to a safe child element when scroll locking is disabled', () => {
    const { container } = render(
      <Backdrop asChild lockScroll={false}>
        <section data-testid="custom-root">Content</section>
      </Backdrop>,
    );

    const root = container.querySelector('section');
    expect(root).toBeInTheDocument();
    expect(root).not.toHaveAttribute('lockscroll');
    expect(root).not.toHaveAttribute('lockScroll');
  });

  it('falls back to FloatingOverlay when asChild needs scroll locking', () => {
    render(
      <Backdrop asChild data-testid="backdrop-root">
        <section data-testid="custom-root">Content</section>
      </Backdrop>,
    );

    const root = screen.getByTestId('backdrop-root');
    expect(root.tagName).toBe('DIV');
    expect(root).toContainElement(screen.getByTestId('custom-root'));
  });

  it('falls back to FloatingOverlay for an interactive asChild host', () => {
    render(
      <Backdrop asChild lockScroll={false} data-testid="backdrop-root">
        <button>Unsafe backdrop host</button>
      </Backdrop>,
    );

    expect(screen.getByTestId('backdrop-root').tagName).toBe('DIV');
    expect(screen.getByRole('button', { name: 'Unsafe backdrop host' })).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Backdrop ref={ref}>
        <div />
      </Backdrop>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('locks the body belonging to the rendered backdrop', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');
    const mountNode = frameDocument.createElement('div');
    frameDocument.body.append(mountNode);
    const parentOverflow = document.body.style.overflow;

    const { unmount } = render(<Backdrop data-testid="frame-backdrop" />, {
      baseElement: frameDocument.body,
      container: mountNode,
    });

    expect(frameDocument.body.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe(parentOverflow);

    unmount();
    expect(frameDocument.body.style.overflow).toBe('');
    frame.remove();
  });

  it('keeps same-document scrolling locked until the final backdrop closes', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');
    const mountNode = frameDocument.createElement('div');
    frameDocument.body.append(mountNode);

    const { rerender, unmount } = render(
      <>
        <Backdrop />
        <Backdrop />
      </>,
      { baseElement: frameDocument.body, container: mountNode },
    );
    expect(frameDocument.body.style.overflow).toBe('hidden');

    rerender(<Backdrop />);
    expect(frameDocument.body.style.overflow).toBe('hidden');

    unmount();
    expect(frameDocument.body.style.overflow).toBe('');
    frame.remove();
  });

  it('restores pre-existing body styles after unlocking', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');
    const mountNode = frameDocument.createElement('div');
    frameDocument.body.append(mountNode);
    frameDocument.body.style.setProperty('overflow', 'scroll', 'important');
    frameDocument.body.style.setProperty('padding-right', '7px');
    const ownerWindow = frameDocument.defaultView;
    if (!ownerWindow) throw new Error('Expected an iframe window');
    const scrollbarWidth = ownerWindow.innerWidth - frameDocument.documentElement.clientWidth;

    const { unmount } = render(<Backdrop />, {
      baseElement: frameDocument.body,
      container: mountNode,
    });
    expect(Number.parseFloat(frameDocument.body.style.paddingRight)).toBe(7 + scrollbarWidth);
    unmount();

    expect(frameDocument.body.style.getPropertyValue('overflow')).toBe('scroll');
    expect(frameDocument.body.style.getPropertyPriority('overflow')).toBe('important');
    expect(frameDocument.body.style.paddingRight).toBe('7px');
    frame.remove();
  });

  it('keeps locks in separate documents independent', () => {
    const frame = document.createElement('iframe');
    const parentMount = document.createElement('div');
    document.body.append(frame, parentMount);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');
    const frameMount = frameDocument.createElement('div');
    frameDocument.body.append(frameMount);

    const parentRender = render(<Backdrop />, { container: parentMount });
    const frameRender = render(<Backdrop />, {
      baseElement: frameDocument.body,
      container: frameMount,
    });
    expect(document.body.style.overflow).toBe('hidden');
    expect(frameDocument.body.style.overflow).toBe('hidden');

    frameRender.unmount();
    expect(frameDocument.body.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('hidden');

    parentRender.unmount();
    expect(document.body.style.overflow).toBe('');
    frame.remove();
    parentMount.remove();
  });
});
