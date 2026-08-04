import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { forwardRef, StrictMode } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Breadcrumbs, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from './index';
import { LocaleProvider } from '@/providers/LocaleProvider';

describe('Breadcrumbs', () => {
  it('reveals an initially clipped current page along the horizontal axis only', () => {
    const scrollBy = vi.fn();
    const setRoot = (node: HTMLElement | null) => {
      if (!node) return;
      Object.defineProperties(node, {
        clientWidth: { configurable: true, value: 200 },
        scrollWidth: { configurable: true, value: 500 },
        scrollLeft: { configurable: true, value: 0, writable: true },
        scrollBy: { configurable: true, value: scrollBy },
      });
      node.getBoundingClientRect = () => ({ left: 10, right: 210, top: 20, bottom: 60 }) as DOMRect;
      const current = node.querySelector<HTMLElement>('[aria-current="page"]');
      if (current) {
        current.getBoundingClientRect = () =>
          ({ left: 430, right: 510, top: 20, bottom: 44 }) as DOMRect;
      }
    };

    render(
      <Breadcrumbs ref={setRoot}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(scrollBy).toHaveBeenCalledOnce();
    expect(scrollBy).toHaveBeenCalledWith({ left: 300, behavior: 'auto' });
  });

  it('preserves a restored horizontal scroll position', () => {
    const scrollBy = vi.fn();
    let rootNode: HTMLElement | null = null;
    const setRoot = (node: HTMLElement | null) => {
      if (!node) return;
      rootNode = node;
      Object.defineProperties(node, {
        clientWidth: { configurable: true, value: 200 },
        scrollWidth: { configurable: true, value: 500 },
        scrollLeft: { configurable: true, value: 24, writable: true },
        scrollBy: { configurable: true, value: scrollBy },
      });
      node.getBoundingClientRect = () => ({ left: 10, right: 210, top: 20, bottom: 60 }) as DOMRect;
    };

    const { rerender } = render(
      <Breadcrumbs ref={setRoot}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(scrollBy).not.toHaveBeenCalled();

    // A later children identity change must not turn the initial-position helper
    // into an ongoing controller after the user returns to inline-start.
    expect(rootNode).not.toBeNull();
    rootNode!.scrollLeft = 0;
    rerender(
      <Breadcrumbs ref={setRoot}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Updated home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it('reveals the current page when a previously wide trail becomes constrained', () => {
    let notifyResize: (() => void) | undefined;
    let runFrame: FrameRequestCallback | undefined;
    const resizeDisconnect = vi.fn();
    const mutationDisconnect = vi.fn();
    class TestResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        notifyResize = () => callback([], this as unknown as ResizeObserver);
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = resizeDisconnect;
    }
    class TestMutationObserver {
      observe = vi.fn();
      disconnect = mutationDisconnect;
    }
    vi.stubGlobal('ResizeObserver', TestResizeObserver);
    vi.stubGlobal('MutationObserver', TestMutationObserver);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      runFrame = callback;
      return 1;
    });

    let constrained = false;
    const scrollBy = vi.fn();
    const setRoot = (node: HTMLElement | null) => {
      if (!node) return;
      Object.defineProperties(node, {
        clientWidth: { configurable: true, get: () => (constrained ? 200 : 500) },
        scrollWidth: { configurable: true, get: () => 500 },
        scrollLeft: { configurable: true, value: 0, writable: true },
        scrollBy: { configurable: true, value: scrollBy },
      });
      node.getBoundingClientRect = () =>
        ({
          left: 10,
          right: constrained ? 210 : 510,
          top: 20,
          bottom: 60,
        }) as DOMRect;
      const current = node.querySelector<HTMLElement>('[aria-current="page"]');
      if (current) {
        current.getBoundingClientRect = () =>
          ({ left: 430, right: 510, top: 20, bottom: 44 }) as DOMRect;
      }
    };

    const result = render(
      <Breadcrumbs ref={setRoot}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(scrollBy).not.toHaveBeenCalled();
    constrained = true;
    act(() => notifyResize?.());
    expect(scrollBy).not.toHaveBeenCalled();
    act(() => runFrame?.(0));
    expect(scrollBy).toHaveBeenCalledWith({ left: 300, behavior: 'auto' });

    result.unmount();
    expect(resizeDisconnect).toHaveBeenCalledOnce();
    expect(mutationDisconnect).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reveals a new current page without reacting to unrelated child updates', async () => {
    let runFrame: FrameRequestCallback | undefined;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      runFrame = callback;
      return 1;
    });
    const scrollBy = vi.fn();
    const setRoot = (node: HTMLElement | null) => {
      if (!node) return;
      Object.defineProperties(node, {
        clientWidth: { configurable: true, value: 200 },
        scrollWidth: { configurable: true, value: 500 },
        scrollLeft: { configurable: true, value: 0, writable: true },
        scrollBy: { configurable: true, value: scrollBy },
      });
      node.getBoundingClientRect = () => ({ left: 10, right: 210, top: 20, bottom: 60 }) as DOMRect;
      const links = node.querySelectorAll<HTMLElement>('a, [aria-current="page"]');
      links.forEach((link) => {
        link.getBoundingClientRect = () =>
          link.textContent === 'Details'
            ? ({ left: 430, right: 510, top: 20, bottom: 44 } as DOMRect)
            : ({ left: 20, right: 100, top: 20, bottom: 44 } as DOMRect);
      });
    };
    const renderTrail = (current: 'home' | 'details', homeLabel = 'Home') => (
      <Breadcrumbs ref={setRoot}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home" isCurrentPage={current === 'home'}>
            {homeLabel}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/details" isCurrentPage={current === 'details'}>
            Details
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>
    );

    const { rerender } = render(renderTrail('home'));
    expect(scrollBy).not.toHaveBeenCalled();

    rerender(renderTrail('home', 'Updated home'));
    await act(async () => undefined);
    expect(scrollBy).not.toHaveBeenCalled();

    rerender(renderTrail('details', 'Updated home'));
    const newCurrent = screen.getByText('Details');
    newCurrent.getBoundingClientRect = () =>
      ({ left: 430, right: 510, top: 20, bottom: 44 }) as DOMRect;
    await waitFor(() => expect(runFrame).toBeDefined());
    act(() => runFrame?.(0));
    expect(scrollBy).toHaveBeenCalledWith({ left: 300, behavior: 'auto' });
  });

  it('creates and cleans observers in the breadcrumb owner document realm', () => {
    const iframe = document.createElement('iframe');
    document.body.append(iframe);
    const ownerDocument = iframe.contentDocument;
    const ownerWindow = ownerDocument?.defaultView;
    if (!ownerDocument || !ownerWindow) throw new Error('Expected an iframe document realm');

    const resizeConstructed = vi.fn();
    const resizeDisconnect = vi.fn();
    class OwnerResizeObserver {
      constructor() {
        resizeConstructed();
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = resizeDisconnect;
    }
    const mutationConstructed = vi.fn();
    const mutationDisconnect = vi.fn();
    class OwnerMutationObserver {
      constructor() {
        mutationConstructed();
      }
      observe = vi.fn();
      disconnect = mutationDisconnect;
    }
    Object.defineProperties(ownerWindow, {
      ResizeObserver: { configurable: true, value: OwnerResizeObserver },
      MutationObserver: { configurable: true, value: OwnerMutationObserver },
    });

    const result = render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
      { container: ownerDocument.body },
    );

    expect(resizeConstructed).toHaveBeenCalledOnce();
    expect(mutationConstructed).toHaveBeenCalledOnce();

    result.unmount();
    expect(resizeDisconnect).toHaveBeenCalledOnce();
    expect(mutationDisconnect).toHaveBeenCalledOnce();
    iframe.remove();
  });

  it('replays generated items during StrictMode rendering', () => {
    function* items() {
      yield <BreadcrumbItem key="home">Home</BreadcrumbItem>;
      yield <BreadcrumbItem key="docs">Docs</BreadcrumbItem>;
    }

    render(
      <StrictMode>
        <Breadcrumbs>{items()}</Breadcrumbs>
      </StrictMode>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('renders links and separators', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/test">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/test">Category</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('renders custom separator', () => {
    render(
      <Breadcrumbs separator=">">
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/category">Category</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByText('>')).toBeInTheDocument();
  });

  it('inserts separators between items nested in fragments', () => {
    const { container } = render(
      <Breadcrumbs>
        <>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Docs</BreadcrumbItem>
        </>
        <BreadcrumbItem>API</BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(2);
    expect(
      Array.from(container.querySelectorAll('ol > li:not([aria-hidden="true"])')).map(
        (item) => item.textContent,
      ),
    ).toEqual(['Home', 'Docs', 'API']);
  });

  it('does not leak unsupported asChild props onto fixed semantic elements', () => {
    const legacyAsChild = { asChild: true };
    const { container } = render(
      <Breadcrumbs {...legacyAsChild}>
        <BreadcrumbItem {...legacyAsChild}>Home</BreadcrumbItem>
        <BreadcrumbSeparator {...legacyAsChild}>/</BreadcrumbSeparator>
      </Breadcrumbs>,
    );

    expect(container.querySelector('nav')).not.toHaveAttribute('aschild');
    expect(
      Array.from(container.querySelectorAll('li')).every(
        (element) => !element.hasAttribute('aschild'),
      ),
    ).toBe(true);
  });

  it('renders a numeric zero separator', () => {
    render(
      <Breadcrumbs separator={0}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('does not render separator elements when separator is false', () => {
    const { container } = render(
      <Breadcrumbs separator={false}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(0);
  });

  it('does not render an empty separator item for a boolean true separator', () => {
    const { container } = render(
      <Breadcrumbs separator>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Current</BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(0);
  });

  it('marks current page with aria-current and renders as span', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    const currentLink = screen.getByText('Current');
    expect(currentLink).toHaveAttribute('aria-current', 'page');
    expect(currentLink.tagName).toBe('SPAN');
  });

  it('does not allow a current page aria-current to be overridden', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage {...({ 'aria-current': 'step' } as never)}>
            Current
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page');
  });

  it('renders nav with accessible label', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('localizes the default navigation label from the nearest provider', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <Breadcrumbs>
          <BreadcrumbItem>現在</BreadcrumbItem>
        </Breadcrumbs>
      </LocaleProvider>,
    );

    expect(screen.getByRole('navigation', { name: 'パンくずリスト' })).toBeInTheDocument();
  });

  it('prefers aria-labelledby over an explicit aria-label and locale fallback', () => {
    render(
      <>
        <span id="breadcrumb-name">Project path</span>
        <Breadcrumbs locale="ja-JP" aria-label="Ignored label" aria-labelledby="breadcrumb-name">
          <BreadcrumbItem>Current</BreadcrumbItem>
        </Breadcrumbs>
      </>,
    );

    const navigation = screen.getByRole('navigation', { name: 'Project path' });
    expect(navigation).toHaveAttribute('aria-labelledby', 'breadcrumb-name');
    expect(navigation).not.toHaveAttribute('aria-label');
  });

  it('renders as span when both asChild and isCurrentPage are true', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink asChild isCurrentPage data-testid="current-link">
            <a href="/current">Current</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    const current = screen.getByTestId('current-link');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('keeps an accessible name from the slotted current-page link', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink asChild isCurrentPage>
            <a aria-label="Current location" href="/current" />
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(screen.getByLabelText('Current location')).toHaveAttribute('aria-current', 'page');
  });

  it('keeps current-page links non-interactive', () => {
    const onClick = vi.fn();
    const onPointerDown = vi.fn();
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink
            isCurrentPage
            {...({ download: 'current.html', tabIndex: 0, onClick, onPointerDown } as never)}
          >
            Current
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    const current = screen.getByText('Current');
    fireEvent.click(current);
    fireEvent.pointerDown(current);
    expect(current).not.toHaveAttribute('download');
    expect(current).not.toHaveAttribute('tabindex');
    expect(onClick).not.toHaveBeenCalled();
    expect(onPointerDown).not.toHaveBeenCalled();
  });

  it('does not apply an interactive consumer role to the current-page span', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage {...({ role: 'button' } as never)}>
            Current
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    const current = screen.getByText('Current');
    expect(current.tagName).toBe('SPAN');
    expect(current).not.toHaveAttribute('role');
    expect(screen.queryByRole('button', { name: 'Current' })).not.toBeInTheDocument();
  });

  it('preserves a consumer role on a non-current breadcrumb link', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/current" role="menuitem">
            Current
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(screen.getByRole('menuitem', { name: 'Current' })).toHaveAttribute('href', '/current');
  });

  it('forwards activation handlers on a non-current breadcrumb link', () => {
    const onClick = vi.fn();
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home" onClick={onClick}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Home' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('falls back to a safe native anchor for an invalid asChild host', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink asChild href="/home">
            <div>
              <button type="button">Home</button>
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    expect(link.querySelector('button')).toBeNull();
  });

  it('keeps a valid slotted router-style link interactive', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(
      ({ children, ...props }, ref) => (
        <a ref={ref} {...props}>
          {children}
        </a>
      ),
    );
    RouterLink.displayName = 'RouterLink';
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink asChild href="/home">
            <RouterLink>Home</RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/home');
  });

  it('sanitizes interactive descendants in breadcrumb links and separators', async () => {
    const { container } = render(
      <Breadcrumbs separator={<button type="button">/</button>}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">
            <button type="button">Home</button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>
            <button type="button">Current</button>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(screen.getByRole('link', { name: 'Home' }).querySelector('button')).toBeNull();
    expect(screen.getByText('Current').querySelector('button')).toBeNull();
    expect(container.querySelector('li[aria-hidden="true"] button')).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('wraps direct native children to preserve ordered-list semantics', () => {
    const { container } = render(
      <Breadcrumbs>
        <a href="/home">Home</a>
        <BreadcrumbItem>Current</BreadcrumbItem>
      </Breadcrumbs>,
    );

    expect(container.querySelector('ol > a')).toBeNull();
    expect(container.querySelector('ol > li > a[href="/home"]')).toBeInTheDocument();
  });

  it('BreadcrumbSeparator renders as li with aria-hidden', () => {
    render(
      <Breadcrumbs separator="→">
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    const separators = screen.getAllByText('→');
    expect(separators.length).toBeGreaterThan(0);
    separators.forEach((el) => {
      expect(el.tagName).toBe('LI');
      expect(el).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('does not allow a manual separator to become exposed to assistive technology', () => {
    render(
      <Breadcrumbs separator={null}>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbSeparator aria-hidden={false}>/</BreadcrumbSeparator>
      </Breadcrumbs>,
    );

    expect(screen.getByText('/')).toHaveAttribute('aria-hidden', 'true');
  });

  it('protects new-window links from opener access', () => {
    render(
      <Breadcrumbs separator={null}>
        <BreadcrumbItem>
          <BreadcrumbLink href="https://example.com" target="_blank" rel="opener">
            Docs
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('normalizes unsafe new-window attributes supplied by an asChild anchor', () => {
    render(
      <Breadcrumbs separator={null}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <a href="https://example.com" target="_blank" rel="opener noreferrer">
              Docs
            </a>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/category">Category</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current Page</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
