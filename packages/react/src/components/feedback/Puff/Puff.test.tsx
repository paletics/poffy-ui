import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode, useEffect, useRef } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { css } from '@/styled-system/css';
import { ManagedPuff, Puff } from './Puff';
import { PuffProvider, usePuff } from './hooks/usePuffContext';
import type { PuffOptions } from './Puff.types';

const animationState = vi.hoisted(() => ({ isAnimating: true, emitExit: true }));

vi.mock('@/providers/AnimationProvider', () => ({
  useOptionalAnimation: () => ({ isAnimating: animationState.isAnimating }),
}));

vi.mock('@/components/animations', () => ({
  OverlayTransition: ({
    children,
    className,
    isVisible = true,
    asChild,
    animationType: _animationType,
    layout: _layout,
    onAnimationComplete,
    ...rest
  }: {
    children: ReactNode;
    className?: string;
    isVisible?: boolean;
    asChild?: boolean;
    animationType?: string;
    layout?: boolean;
    onAnimationComplete?: (definition: string) => void;
  }) => {
    useEffect(() => {
      if (!isVisible && animationState.isAnimating && animationState.emitExit) {
        onAnimationComplete?.('exit');
      }
    }, [isVisible, onAnimationComplete]);

    return isVisible ? (
      <div className={className} data-testid="overlay-transition" data-as-child={asChild} {...rest}>
        {children}
      </div>
    ) : null;
  },
}));

beforeEach(() => {
  animationState.isAnimating = true;
  animationState.emitExit = true;
});

vi.mock('@/styled-system/recipes', () => ({
  puff: () => ({
    root: 'puff-root',
    simple: 'puff-simple',
    title: 'puff-title',
    content: 'puff-content',
    spacer: 'puff-spacer',
    container: 'puff-container',
  }),
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  LayoutGroup: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

describe('Puff Component', () => {
  it('renders with title and content', () => {
    render(<Puff title="Test Title">Test Content</Puff>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('announces standalone puffs by default', () => {
    render(<Puff>Standalone notification</Puff>);
    const puff = screen.getByTestId('overlay-transition');
    expect(puff).toHaveAttribute('role', 'status');
    expect(puff).not.toHaveAttribute('aria-live');
  });

  it('ignores runtime attempts to inject provider-managed lifecycle into standalone puffs', () => {
    const removePuff = vi.fn();
    const onExitComplete = vi.fn();
    render(
      <Puff
        {...({
          managedLifecycle: {
            isVisible: false,
            onExitComplete,
            puffId: 'external-id',
            removePuff,
          },
        } as never)}
      >
        Public notification
      </Puff>,
    );

    expect(screen.getByText('Public notification')).toBeInTheDocument();
    expect(removePuff).not.toHaveBeenCalled();
    expect(onExitComplete).not.toHaveBeenCalled();
  });

  it('supports assertive and disabled standalone announcements', () => {
    render(
      <>
        <Puff live="assertive">Critical notification</Puff>
        <Puff live="off">Stable notification</Puff>
      </>,
    );

    expect(screen.getByRole('alert')).not.toHaveAttribute('aria-live');
    expect(
      screen.getByText('Stable notification').closest('[data-testid="overlay-transition"]'),
    ).toHaveAttribute('aria-live', 'off');
  });

  it('does not override the implicit live behavior of an explicit role', () => {
    render(<Puff role="alert">Critical notification</Puff>);
    const puff = screen.getByTestId('overlay-transition');
    expect(puff).toHaveAttribute('role', 'alert');
    expect(puff).not.toHaveAttribute('aria-live');
  });

  it('keeps standalone live-region semantics when an asChild render host conflicts', () => {
    render(
      <Puff
        asChild
        render={() => (
          <div data-testid="rendered-puff" role="presentation" aria-live="off">
            Rendered notification
          </div>
        )}
      />,
    );

    const renderedPuff = screen.getByTestId('rendered-puff');
    expect(renderedPuff).toHaveAttribute('role', 'status');
    expect(renderedPuff).not.toHaveAttribute('aria-live');
  });

  it('falls back from non-native asChild render content', () => {
    const RenderedPuff = () => <div>Rendered notification</div>;

    render(<Puff asChild render={() => <RenderedPuff />} />);

    expect(screen.getByTestId('overlay-transition')).toHaveAttribute('data-as-child', 'false');
  });

  it('falls back from interactive native asChild render content', () => {
    render(<Puff asChild render={() => <button>Retry notification</button>} />);

    expect(screen.getByTestId('overlay-transition')).toHaveAttribute('data-as-child', 'false');
    expect(screen.getByRole('button', { name: 'Retry notification' })).not.toHaveAttribute(
      'role',
      'status',
    );
  });

  it('forwards a standalone id to the DOM host', () => {
    render(<Puff id="standalone-puff">Standalone notification</Puff>);
    expect(screen.getByTestId('overlay-transition')).toHaveAttribute('id', 'standalone-puff');
  });

  it('renders simple variant correctly', () => {
    render(
      <Puff isSimple icon={<span data-testid="icon">Icon</span>}>
        Simple Content
      </Puff>,
    );
    expect(screen.getByText('Simple Content')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders action button', async () => {
    const user = userEvent.setup();
    const onActionClick = vi.fn();
    render(<Puff title="Action Test" action={<button onClick={onActionClick}>Click Me</button>} />);

    await user.click(screen.getByText('Click Me'));
    expect(onActionClick).toHaveBeenCalled();
  });

  it('adds a nested live override around default standalone actions', () => {
    render(<Puff title="Action Test" action={<button>Undo</button>} />);

    expect(
      screen.getByRole('button', { name: 'Undo' }).closest('[aria-live="off"]'),
    ).not.toBeNull();
  });

  it('wraps block standalone actions in a valid nested live override', () => {
    render(
      <>
        <Puff action={<div data-testid="standard-action">Undo</div>} />
        <Puff isSimple action={<div data-testid="simple-action">Undo</div>} />
      </>,
    );

    for (const action of [
      screen.getByTestId('standard-action'),
      screen.getByTestId('simple-action'),
    ]) {
      const container = action.parentElement;
      expect(container?.tagName).toBe('DIV');
      expect(container).toHaveAttribute('aria-live', 'off');
    }
  });

  it('calls onClose after a standalone duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Puff id="test-id" title="Timer Test" duration={3000} onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('pauses auto-close while the puff is focused', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Puff duration={1000} onClose={onClose} action={<button>Continue</button>} />);

    const puff = screen.getByTestId('overlay-transition');
    fireEvent.focusIn(puff);
    act(() => vi.advanceTimersByTime(1000));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.focusOut(puff, { relatedTarget: null });
    act(() => vi.advanceTimersByTime(1000));
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('keeps auto-close paused when focus remains after the pointer leaves', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Puff duration={1000} onClose={onClose} action={<button>Continue</button>} />);

    const puff = screen.getByTestId('overlay-transition');
    fireEvent.focusIn(puff);
    fireEvent.mouseEnter(puff);
    fireEvent.mouseLeave(puff);
    act(() => vi.advanceTimersByTime(1000));

    expect(onClose).not.toHaveBeenCalled();
    fireEvent.focusOut(puff, { relatedTarget: null });
    act(() => vi.advanceTimersByTime(1000));
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('resumes auto-close with the remaining duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Puff duration={1000} onClose={onClose} action={<button>Continue</button>} />);

    const puff = screen.getByTestId('overlay-transition');
    act(() => vi.advanceTimersByTime(400));
    fireEvent.focusIn(puff);
    act(() => vi.advanceTimersByTime(1000));
    fireEvent.focusOut(puff, { relatedTarget: null });
    act(() => vi.advanceTimersByTime(599));
    expect(onClose).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('cancels the auto-close timer when the puff is hidden', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const removePuff = vi.fn();
    const { rerender } = render(
      <ManagedPuff
        puffId="test-id"
        duration={3000}
        isVisible
        onClose={onClose}
        removePuff={removePuff}
        onExitComplete={vi.fn()}
      />,
    );

    rerender(
      <ManagedPuff
        puffId="test-id"
        duration={3000}
        isVisible={false}
        onClose={onClose}
        removePuff={removePuff}
        onExitComplete={vi.fn()}
      />,
    );
    act(() => vi.advanceTimersByTime(3000));

    expect(onClose).not.toHaveBeenCalled();
    expect(removePuff).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('does not auto-close for a non-finite duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Puff duration={Number.POSITIVE_INFINITY} onClose={onClose} />);
    act(() => vi.advanceTimersByTime(10_000));
    expect(onClose).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('completes a hidden puff once when animation is disabled', () => {
    animationState.isAnimating = false;
    const onExitComplete = vi.fn();
    const { rerender } = render(
      <ManagedPuff
        puffId="test-id"
        isVisible={false}
        onExitComplete={onExitComplete}
        removePuff={vi.fn()}
      />,
    );

    rerender(
      <ManagedPuff
        puffId="test-id"
        isVisible={false}
        onExitComplete={onExitComplete}
        removePuff={vi.fn()}
      />,
    );

    expect(onExitComplete).toHaveBeenCalledTimes(1);
    expect(onExitComplete).toHaveBeenCalledWith('test-id');
  });

  it('completes an initially hidden puff without waiting for an exit animation', () => {
    animationState.emitExit = false;
    const onExitComplete = vi.fn();

    render(
      <ManagedPuff
        puffId="test-id"
        isVisible={false}
        onExitComplete={onExitComplete}
        removePuff={vi.fn()}
      />,
    );

    expect(onExitComplete).toHaveBeenCalledTimes(1);
    expect(onExitComplete).toHaveBeenCalledWith('test-id');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(<Puff title="A11y Test">Accessible content</Puff>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no a11y violations in simple variant', async () => {
    const { container } = render(<Puff isSimple>Simple accessible content</Puff>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('PuffProvider Integration', () => {
  const externalRemovePuff = vi.fn();
  const externalExitComplete = vi.fn();
  const TestComponent = () => {
    const { addPuff } = usePuff();
    return (
      <button
        onClick={() =>
          addPuff({ title: 'Provider Puff', children: 'Provider Content', duration: 1000 })
        }
      >
        Trigger Puff
      </button>
    );
  };

  const DismissablePuff = () => {
    const { addPuff, removePuff } = usePuff();
    const puffId = useRef('');
    return (
      <>
        <button onClick={() => (puffId.current = addPuff({ title: 'Dismissable' }))}>Add</button>
        <button onClick={() => removePuff(puffId.current)}>Dismiss</button>
      </>
    );
  };

  const UnsafeOptionsPuff = () => {
    const { addPuff, removePuff } = usePuff();
    const puffId = useRef('');
    return (
      <>
        <button
          onClick={() => {
            puffId.current = addPuff({
              id: 'external-id',
              puffId: 'external-managed-id',
              isVisible: false,
              removePuff: externalRemovePuff,
              onExitComplete: externalExitComplete,
              title: 'Owned by provider',
            } as unknown as PuffOptions);
          }}
        >
          Add unsafe
        </button>
        <button onClick={() => removePuff(puffId.current)}>Dismiss unsafe</button>
      </>
    );
  };

  const PriorityPuffs = () => {
    const { addPuff } = usePuff();
    return (
      <>
        <button
          onClick={() =>
            addPuff({
              title: 'Saved',
              children: 'Project changes',
              action: <button>Undo</button>,
            })
          }
        >
          Add polite
        </button>
        <button
          onClick={() =>
            addPuff({
              live: 'assertive',
              announcement: 'Upload failed',
              title: 'Failure',
              children: <span>Opaque visual details</span>,
            })
          }
        >
          Add assertive
        </button>
        <button onClick={() => addPuff({ live: 'off', title: 'Silent update' })}>Add silent</button>
        <button
          onClick={() => {
            addPuff({ title: 'Batch first' });
            addPuff({ title: 'Batch second' });
          }}
        >
          Add polite batch
        </button>
      </>
    );
  };

  it('portals notifications into an explicitly owned iframe document', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Expected an iframe document');

    const view = render(
      <PuffProvider ownerDocument={() => frameDocument}>
        <TestComponent />
      </PuffProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Trigger Puff' }));

    await waitFor(() => expect(frameDocument.body).toHaveTextContent('Provider Puff'));
    expect(document.body).not.toHaveTextContent('Provider Puff');

    view.unmount();
    frame.remove();
  });

  it('keeps persistent priority lanes separate from visual notifications', async () => {
    render(
      <PuffProvider>
        <PriorityPuffs />
      </PuffProvider>,
    );

    const politeLane = document.querySelector('[data-puff-announcer="polite"]');
    const assertiveLane = document.querySelector('[data-puff-announcer="assertive"]');
    expect(politeLane).toBeInTheDocument();
    expect(assertiveLane).toBeInTheDocument();
    expect(politeLane).toHaveClass(css({ srOnly: true }));
    expect(assertiveLane).toHaveClass(css({ srOnly: true }));
    expect(politeLane).toBeEmptyDOMElement();
    expect(assertiveLane).toBeEmptyDOMElement();

    fireEvent.click(screen.getByRole('button', { name: 'Add polite' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add assertive' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add silent' }));

    await waitFor(() => expect(politeLane).toHaveTextContent('Saved Project changes'));
    expect(politeLane).not.toHaveTextContent('Undo');
    expect(assertiveLane).toHaveTextContent('Upload failed');
    expect(assertiveLane).not.toHaveTextContent('Opaque visual details');
    expect(politeLane).not.toHaveTextContent('Silent update');
    expect(assertiveLane).not.toHaveTextContent('Silent update');
    fireEvent.click(screen.getByRole('button', { name: 'Add polite batch' }));
    await waitFor(() => expect(politeLane).toHaveTextContent('Batch first'));
    expect(politeLane).toHaveTextContent('Batch second');
    expect(politeLane?.children).toHaveLength(3);
    for (const puff of screen.getAllByTestId('overlay-transition')) {
      expect(puff).not.toHaveAttribute('role');
      expect(puff).not.toHaveAttribute('aria-live');
    }
  });

  it('adds and removes puffs via context', async () => {
    vi.useFakeTimers();

    render(
      <PuffProvider>
        <TestComponent />
      </PuffProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Puff'));

    expect(screen.getByText('Provider Puff')).toBeInTheDocument();
    expect(screen.getByText('Provider Content')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.queryByText('Provider Puff')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('removes puffs after their timer when animation is disabled', () => {
    vi.useFakeTimers();
    animationState.isAnimating = false;

    render(
      <PuffProvider>
        <TestComponent />
      </PuffProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Puff'));
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(screen.queryByText('Provider Puff')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  it('returns an ID that can dismiss a provider-managed puff', () => {
    render(
      <PuffProvider>
        <DismissablePuff />
      </PuffProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByTestId('overlay-transition')).toHaveTextContent('Dismissable');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByTestId('overlay-transition')).not.toBeInTheDocument();
  });

  it('owns lifecycle fields even when runtime options contain internal keys', () => {
    externalRemovePuff.mockClear();
    externalExitComplete.mockClear();
    render(
      <PuffProvider>
        <UnsafeOptionsPuff />
      </PuffProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add unsafe' }));
    expect(screen.getByTestId('overlay-transition')).toHaveTextContent('Owned by provider');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss unsafe' }));
    expect(screen.queryByTestId('overlay-transition')).not.toBeInTheDocument();
    expect(externalRemovePuff).not.toHaveBeenCalled();
    expect(externalExitComplete).not.toHaveBeenCalled();
  });
});
