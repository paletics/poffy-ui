import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { PortalProvider } from '@/providers/PortalProvider';
import { renderToString } from 'react-dom/server';
import { useCallback, useRef, useState } from 'react';
import { Portal } from './Portal';

describe('Portal', () => {
  it('renders children into document.body after mount', async () => {
    const { container } = render(
      <Portal>
        <div>Portalled content</div>
      </Portal>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(await screen.findByText('Portalled content')).toBeInTheDocument();
    expect(screen.getByText('Portalled content').parentElement).toBe(document.body);
  });

  it('renders children into a custom container', async () => {
    const target = document.createElement('div');
    document.body.appendChild(target);

    render(
      <Portal container={target}>
        <div>Custom target content</div>
      </Portal>,
    );

    await waitFor(() => expect(target).toHaveTextContent('Custom target content'));
    target.remove();
  });

  it('uses an owner-document resolver for the default body target', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');

    const { unmount } = render(
      <Portal ownerDocument={() => frameDocument}>
        <div>Iframe body content</div>
      </Portal>,
    );

    await waitFor(() => expect(frameDocument.body).toHaveTextContent('Iframe body content'));
    expect(document.body).not.toHaveTextContent('Iframe body content');
    unmount();
    frame.remove();
  });

  it('does not temporarily render into the global body while an owner document resolves', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');

    const { unmount } = render(
      <Portal ownerDocument={() => frameDocument}>
        <div>Deferred iframe content</div>
      </Portal>,
    );

    expect(document.body).not.toHaveTextContent('Deferred iframe content');
    await waitFor(() => expect(frameDocument.body).toHaveTextContent('Deferred iframe content'));
    unmount();
    frame.remove();
  });

  it('lets an explicit null container suppress an owner-document body', () => {
    render(
      <Portal container={null} ownerDocument={() => document}>
        Suppressed owner content
      </Portal>,
    );

    expect(screen.queryByText('Suppressed owner content')).not.toBeInTheDocument();
  });

  it('uses the nearest provider when no explicit container is supplied', async () => {
    const target = document.createElement('div');
    document.body.appendChild(target);

    render(
      <PortalProvider container={target}>
        <Portal>Provider target content</Portal>
      </PortalProvider>,
    );

    await waitFor(() => expect(target).toHaveTextContent('Provider target content'));
    target.remove();
  });

  it('prefers an explicit container over the nearest provider', async () => {
    const providerTarget = document.createElement('div');
    const explicitTarget = document.createElement('div');
    document.body.append(providerTarget, explicitTarget);

    render(
      <PortalProvider container={providerTarget}>
        <Portal container={explicitTarget}>Explicit target content</Portal>
      </PortalProvider>,
    );

    await waitFor(() => expect(explicitTarget).toHaveTextContent('Explicit target content'));
    expect(providerTarget).toBeEmptyDOMElement();
    providerTarget.remove();
    explicitTarget.remove();
  });

  it('lets a null explicit container suppress a provider target', () => {
    const target = document.createElement('div');
    document.body.appendChild(target);

    render(
      <PortalProvider container={target}>
        <Portal container={null}>Suppressed provider content</Portal>
      </PortalProvider>,
    );

    expect(screen.queryByText('Suppressed provider content')).not.toBeInTheDocument();
    target.remove();
  });

  it('uses the nearest nested provider', async () => {
    const outerTarget = document.createElement('div');
    const innerTarget = document.createElement('div');
    document.body.append(outerTarget, innerTarget);

    render(
      <PortalProvider container={outerTarget}>
        <PortalProvider container={innerTarget}>
          <Portal>Nested provider content</Portal>
        </PortalProvider>
      </PortalProvider>,
    );

    await waitFor(() => expect(innerTarget).toHaveTextContent('Nested provider content'));
    expect(outerTarget).toBeEmptyDOMElement();
    outerTarget.remove();
    innerTarget.remove();
  });

  it('does not resolve a lazy provider container during server rendering', () => {
    const resolveTarget = vi.fn(() => document.body);

    expect(
      renderToString(
        <PortalProvider container={resolveTarget}>
          <Portal>Server portal content</Portal>
        </PortalProvider>,
      ),
    ).toBe('');
    expect(resolveTarget).not.toHaveBeenCalled();
  });

  it('keeps disabled portal content inline during server rendering', () => {
    expect(renderToString(<Portal disabled>Inline server content</Portal>)).toContain(
      'Inline server content',
    );
  });

  it('removes portalled children from the target when unmounted', async () => {
    const target = document.createElement('div');
    document.body.appendChild(target);
    const { unmount } = render(
      <Portal container={target}>
        <div>Temporary portal content</div>
      </Portal>,
    );

    await waitFor(() => expect(target).toHaveTextContent('Temporary portal content'));
    unmount();

    expect(target).toBeEmptyDOMElement();
    target.remove();
  });

  it('renders into a document fragment container', async () => {
    const target = document.createDocumentFragment();

    render(
      <Portal container={target}>
        <div>Fragment portal content</div>
      </Portal>,
    );

    await waitFor(() => expect(target.textContent).toBe('Fragment portal content'));
  });

  it('resolves a lazy container function after mount', async () => {
    const target = document.createElement('div');
    document.body.appendChild(target);

    render(
      <Portal container={() => target}>
        <div>Lazy target content</div>
      </Portal>,
    );

    await waitFor(() => expect(target).toHaveTextContent('Lazy target content'));
    target.remove();
  });

  it('resolves a stable lazy container after its target mounts on a later commit', async () => {
    const DeferredPortal = () => {
      const [showTarget, setShowTarget] = useState(false);
      const targetRef = useRef<HTMLDivElement | null>(null);
      const resolveTarget = useCallback(() => targetRef.current, []);

      return (
        <>
          <button type="button" onClick={() => setShowTarget(true)}>
            Mount target
          </button>
          {showTarget ? <div ref={targetRef} data-testid="late-target" /> : null}
          <Portal container={resolveTarget}>Late target content</Portal>
        </>
      );
    };
    render(<DeferredPortal />);

    expect(screen.queryByText('Late target content')).not.toBeInTheDocument();
    screen.getByRole('button', { name: 'Mount target' }).click();

    const target = await screen.findByTestId('late-target');
    await waitFor(() => expect(target).toHaveTextContent('Late target content'));
  });

  it('renders children in place when disabled', () => {
    const { container } = render(
      <Portal disabled>
        <div>Inline content</div>
      </Portal>,
    );

    expect(container).toHaveTextContent('Inline content');
    expect(container.querySelector('[data-animation]')).not.toBeInTheDocument();
  });

  it('bridges provider scopes when scopeProviders is enabled', async () => {
    render(
      <AnimationProvider global={false} defaultAnimationEnabled={false}>
        <Portal scopeProviders>
          <div>Provider-scoped portal</div>
        </Portal>
      </AnimationProvider>,
    );

    const content = await screen.findByText('Provider-scoped portal');
    expect(content.closest('[data-animation]')).toHaveAttribute('data-animation', 'disabled');
  });

  it('renders nothing when the custom container is unavailable', () => {
    render(
      <Portal container={null}>
        <div>Missing target content</div>
      </Portal>,
    );

    expect(screen.queryByText('Missing target content')).not.toBeInTheDocument();
  });

  it('has no accessibility violations for portalled semantic content', async () => {
    render(
      <Portal>
        <div role="status">Portal status</div>
      </Portal>,
    );

    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
