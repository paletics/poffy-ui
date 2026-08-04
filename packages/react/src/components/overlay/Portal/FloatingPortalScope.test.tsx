import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PortalProvider } from '@/providers/PortalProvider';
import { useCallback, useRef, useState } from 'react';
import { FloatingPortalScope } from './FloatingPortalScope';

describe('FloatingPortalScope', () => {
  it('falls back to the ambient document after a reference owner remains unavailable', async () => {
    const referenceRef = { current: null };

    render(
      <FloatingPortalScope allowUnanchoredFallback referenceRef={referenceRef}>
        <span>Reference-free floating content</span>
      </FloatingPortalScope>,
    );

    expect(await screen.findByText('Reference-free floating content')).toBeInTheDocument();
  });

  it('uses the supplied owner document body when no container is configured', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');

    render(
      <FloatingPortalScope ownerDocument={frameDocument}>
        <span>Iframe floating content</span>
      </FloatingPortalScope>,
    );

    await waitFor(() => expect(frameDocument.body).toHaveTextContent('Iframe floating content'));
    expect(document.body).not.toHaveTextContent('Iframe floating content');
    frame.remove();
  });

  it('suppresses an explicit null owner only when no container is configured', async () => {
    const providerTarget = document.createElement('div');
    document.body.append(providerTarget);
    const { rerender } = render(
      <FloatingPortalScope ownerDocument={null}>
        <span>Suppressed owner content</span>
      </FloatingPortalScope>,
    );

    expect(screen.queryByText('Suppressed owner content')).not.toBeInTheDocument();

    rerender(
      <PortalProvider container={providerTarget}>
        <FloatingPortalScope ownerDocument={null}>
          <span>Provider beats null owner</span>
        </FloatingPortalScope>
      </PortalProvider>,
    );
    await waitFor(() => expect(providerTarget).toHaveTextContent('Provider beats null owner'));
    providerTarget.remove();
  });

  it('moves a portal when a stable reference ref changes owner document', async () => {
    const frame = document.createElement('iframe');
    const firstReference = document.createElement('button');
    document.body.append(frame, firstReference);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');
    const secondReference = frameDocument.createElement('button');
    frameDocument.body.append(secondReference);
    const referenceRef = { current: firstReference };

    const { rerender } = render(
      <FloatingPortalScope referenceRef={referenceRef}>
        <span>Movable floating content</span>
      </FloatingPortalScope>,
    );
    await waitFor(() => expect(document.body).toHaveTextContent('Movable floating content'));

    referenceRef.current = secondReference;
    rerender(
      <FloatingPortalScope referenceRef={referenceRef}>
        <span>Movable floating content</span>
      </FloatingPortalScope>,
    );

    await waitFor(() => expect(frameDocument.body).toHaveTextContent('Movable floating content'));
    expect(document.body).not.toHaveTextContent('Movable floating content');
    frame.remove();
    firstReference.remove();
  });

  it('uses a reference shadow root as the default portal target', async () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const reference = document.createElement('button');
    shadowRoot.append(reference);
    document.body.append(host);

    render(
      <FloatingPortalScope referenceRef={{ current: reference }}>
        <span>Shadow floating content</span>
      </FloatingPortalScope>,
    );

    await waitFor(() => expect(shadowRoot).toHaveTextContent('Shadow floating content'));
    expect(document.body).not.toHaveTextContent('Shadow floating content');
    host.remove();
  });

  it('prefers a provider container over the supplied owner document', async () => {
    const frame = document.createElement('iframe');
    const providerTarget = document.createElement('div');
    document.body.append(frame, providerTarget);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');

    render(
      <PortalProvider container={providerTarget}>
        <FloatingPortalScope ownerDocument={frameDocument}>
          <span>Provider floating content</span>
        </FloatingPortalScope>
      </PortalProvider>,
    );

    await waitFor(() => expect(providerTarget).toHaveTextContent('Provider floating content'));
    expect(frameDocument.body).not.toHaveTextContent('Provider floating content');
    frame.remove();
    providerTarget.remove();
  });

  it('does not reuse a parent portal when owner documents differ', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');

    render(
      <FloatingPortalScope ownerDocument={document}>
        <span>Parent document content</span>
        <FloatingPortalScope ownerDocument={frameDocument}>
          <span>Iframe nested content</span>
        </FloatingPortalScope>
      </FloatingPortalScope>,
    );

    await waitFor(() => expect(frameDocument.body).toHaveTextContent('Iframe nested content'));
    expect(document.body).toHaveTextContent('Parent document content');
    expect(document.body).not.toHaveTextContent('Iframe nested content');
    frame.remove();
  });

  it('keeps nested portals in the parent Floating UI portal for one provider scope', async () => {
    const target = document.createElement('div');
    document.body.appendChild(target);

    render(
      <PortalProvider container={target}>
        <FloatingPortalScope>
          <span>Outer floating content</span>
          <FloatingPortalScope>
            <span>Inner floating content</span>
          </FloatingPortalScope>
        </FloatingPortalScope>
      </PortalProvider>,
    );

    const inner = await screen.findByText('Inner floating content');
    const outerPortal = screen
      .getByText('Outer floating content')
      .closest<HTMLElement>('[data-floating-ui-portal]');
    const innerPortal = inner.closest<HTMLElement>('[data-floating-ui-portal]');

    expect(outerPortal).not.toBeNull();
    expect(innerPortal).not.toBe(outerPortal);
    expect(outerPortal).toContainElement(innerPortal);
    expect(target).toContainElement(outerPortal);
    target.remove();
  });

  it('reroutes at a nested provider boundary', async () => {
    const outerTarget = document.createElement('div');
    const innerTarget = document.createElement('div');
    document.body.append(outerTarget, innerTarget);

    render(
      <PortalProvider container={outerTarget}>
        <FloatingPortalScope>
          <span>Outer provider floating content</span>
          <PortalProvider container={innerTarget}>
            <FloatingPortalScope>
              <span>Inner provider floating content</span>
            </FloatingPortalScope>
          </PortalProvider>
        </FloatingPortalScope>
      </PortalProvider>,
    );

    await waitFor(() => expect(innerTarget).toHaveTextContent('Inner provider floating content'));
    expect(outerTarget).toHaveTextContent('Outer provider floating content');
    expect(outerTarget).not.toHaveTextContent('Inner provider floating content');
    outerTarget.remove();
    innerTarget.remove();
  });

  it('prefers an explicit target and suppresses an explicit null target', async () => {
    const providerTarget = document.createElement('div');
    const explicitTarget = document.createElement('div');
    document.body.append(providerTarget, explicitTarget);

    render(
      <PortalProvider container={providerTarget}>
        <FloatingPortalScope portalContainer={explicitTarget}>
          <span>Explicit floating content</span>
        </FloatingPortalScope>
        <FloatingPortalScope portalContainer={null}>
          <span>Suppressed floating content</span>
        </FloatingPortalScope>
      </PortalProvider>,
    );

    await waitFor(() => expect(explicitTarget).toHaveTextContent('Explicit floating content'));
    expect(providerTarget).toBeEmptyDOMElement();
    expect(screen.queryByText('Suppressed floating content')).not.toBeInTheDocument();
    providerTarget.remove();
    explicitTarget.remove();
  });

  it('resolves a stable explicit target after it mounts on a later commit', async () => {
    const DeferredFloatingPortal = () => {
      const [showTarget, setShowTarget] = useState(false);
      const targetRef = useRef<HTMLDivElement | null>(null);
      const resolveTarget = useCallback(() => targetRef.current, []);

      return (
        <>
          <button type="button" onClick={() => setShowTarget(true)}>
            Mount floating target
          </button>
          {showTarget ? <div ref={targetRef} data-testid="late-floating-target" /> : null}
          <FloatingPortalScope portalContainer={resolveTarget}>
            <span>Late floating content</span>
          </FloatingPortalScope>
        </>
      );
    };
    render(<DeferredFloatingPortal />);

    expect(screen.queryByText('Late floating content')).not.toBeInTheDocument();
    screen.getByRole('button', { name: 'Mount floating target' }).click();

    const target = await screen.findByTestId('late-floating-target');
    await waitFor(() => expect(target).toHaveTextContent('Late floating content'));
  });
});
