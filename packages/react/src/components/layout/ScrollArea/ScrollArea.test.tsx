import { fireEvent, render, screen } from '@testing-library/react';
import type { UIEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children inside the viewport', () => {
    render(
      <ScrollArea style={{ height: '100px' }}>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText('Scrollable content')).toBeInTheDocument();
  });

  it('keeps role, focus, and scroll events on the owned viewport', () => {
    let scrollTarget: EventTarget | null = null;
    const onScroll = vi.fn((event: UIEvent<HTMLDivElement>) => {
      scrollTarget = event.currentTarget;
    });
    const { container } = render(
      <ScrollArea
        {...({ role: 'region', tabIndex: 4 } as never)}
        aria-label="Logs"
        viewportTabIndex={0}
        onScroll={onScroll}
      >
        Logs
      </ScrollArea>,
    );

    const root = container.firstElementChild;
    const viewport = screen.getByRole('region', { name: 'Logs' });
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
    expect(viewport).toHaveAttribute('tabindex', '0');
    fireEvent.scroll(viewport);
    expect(onScroll).toHaveBeenCalledTimes(1);
    expect(scrollTarget).toBe(viewport);
  });

  it('renders a vertical scrollbar by default', () => {
    render(
      <ScrollArea style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    const scrollbar = document.querySelector('[data-orientation="vertical"][aria-hidden="true"]');
    expect(scrollbar).toBeInTheDocument();
  });

  it('renders a horizontal scrollbar when orientation is horizontal', () => {
    render(
      <ScrollArea orientation="horizontal" style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    const scrollbar = document.querySelector('[data-orientation="horizontal"][aria-hidden="true"]');
    expect(scrollbar).toBeInTheDocument();
  });

  it('renders both scrollbars when orientation is both', () => {
    render(
      <ScrollArea orientation="both" style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    expect(
      document.querySelector('[data-orientation="vertical"][aria-hidden="true"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-orientation="horizontal"][aria-hidden="true"]'),
    ).toBeInTheDocument();
  });

  it('forwards className to the root element', () => {
    const { container } = render(
      <ScrollArea className="custom-class" style={{ height: '100px' }}>
        <p>content</p>
      </ScrollArea>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes accessibility checks', async () => {
    const { container } = render(
      <ScrollArea focusMode="always" style={{ height: '200px' }} aria-label="Scrollable region">
        <p>Accessible scrollable content</p>
      </ScrollArea>,
    );
    expect(await axe(container)).toHaveNoViolations();
    expect(screen.getByRole('region', { name: 'Scrollable region' })).toHaveAttribute(
      'tabindex',
      '0',
    );
  });

  it('names an automatically focusable viewport when no label is supplied', async () => {
    const { container } = render(
      <ScrollArea focusMode="always" style={{ height: '200px' }}>
        <p>Accessible scrollable content</p>
      </ScrollArea>,
    );

    expect(screen.getByRole('region', { name: 'Scrollable content' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('updates its thumb when an observed content element changes size', () => {
    const resizeCallbacks: ResizeObserverCallback[] = [];
    const observe = vi.fn();
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        resizeCallbacks.push(callback);
      }
      observe = observe;
      disconnect = vi.fn();
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    try {
      const { container } = render(
        <ScrollArea aria-label="Scrollable content" style={{ height: '100px' }}>
          <div data-testid="content">Scrollable content</div>
        </ScrollArea>,
      );
      const viewport = screen.getByRole('region', { name: 'Scrollable content' });
      const scrollbar = container.querySelector(
        '[data-orientation="vertical"][aria-hidden="true"]',
      ) as HTMLDivElement;
      const thumb = scrollbar.firstElementChild as HTMLDivElement;
      const content = screen.getByTestId('content');

      Object.defineProperties(viewport, {
        clientHeight: { configurable: true, value: 100 },
        scrollHeight: { configurable: true, value: 400 },
      });
      Object.defineProperty(scrollbar, 'clientHeight', { configurable: true, value: 100 });

      resizeCallbacks.forEach((callback) => callback([], {} as ResizeObserver));

      expect(observe).toHaveBeenCalledWith(content);
      expect(scrollbar).toHaveAttribute('data-visible', '');
      expect(thumb).toHaveStyle({ height: '25px' });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('uses the viewport document for resize and thumb drag events', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    const frameWindow = frame.contentWindow;
    if (!frameDocument || !frameWindow)
      throw new Error('The test environment did not create an iframe realm.');
    const mountNode = frameDocument.createElement('div');
    frameDocument.body.append(mountNode);

    const addEventListener = vi.spyOn(frameWindow, 'addEventListener');
    const removeEventListener = vi.spyOn(frameWindow, 'removeEventListener');

    try {
      const { container, unmount } = render(
        <ScrollArea aria-label="Iframe scroll area" style={{ height: '100px' }}>
          <p>Scrollable content</p>
        </ScrollArea>,
        { baseElement: frameDocument.body, container: mountNode },
      );
      const viewport = container.querySelector('[role="region"]') as HTMLDivElement;
      const scrollbar = container.querySelector(
        '[data-orientation="vertical"][aria-hidden="true"]',
      ) as HTMLDivElement;
      const thumb = scrollbar.firstElementChild as HTMLDivElement;

      Object.defineProperties(viewport, {
        clientHeight: { configurable: true, value: 100 },
        scrollHeight: { configurable: true, value: 400 },
      });
      Object.defineProperty(scrollbar, 'clientHeight', { configurable: true, value: 100 });

      expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      const pointerDown = new frameWindow.Event('pointerdown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperties(pointerDown, {
        button: { value: 0 },
        clientY: { value: 0 },
        isPrimary: { value: true },
        pointerId: { value: 1 },
      });
      thumb.dispatchEvent(pointerDown);
      expect(addEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function));

      const pointerMove = new frameWindow.Event('pointermove');
      Object.defineProperties(pointerMove, {
        clientY: { value: 75 },
        pointerId: { value: 1 },
      });
      frameWindow.dispatchEvent(pointerMove);

      expect(viewport.scrollTop).toBeGreaterThan(0);
      unmount();
      expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeEventListener).toHaveBeenCalledWith('pointermove', expect.any(Function));
      mountNode.remove();
    } finally {
      frame.remove();
    }
  });
});
