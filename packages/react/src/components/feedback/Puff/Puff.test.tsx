import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Puff } from './Puff';
import { PuffProvider, usePuff } from './hooks/usePuffContext';

vi.mock('@/components/animations', () => ({
  OverlayTransition: ({
    children,
    className,
    isVisible = true,
    onAnimationComplete,
  }: {
    children: ReactNode;
    className?: string;
    isVisible?: boolean;
    onAnimationComplete?: (definition: string) => void;
  }) => {
    useEffect(() => {
      if (!isVisible) {
        onAnimationComplete?.('exit');
      }
    }, [isVisible, onAnimationComplete]);

    return isVisible ? (
      <div className={className} data-testid="overlay-transition">
        {children}
      </div>
    ) : null;
  },
}));

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

  it('calls onClose and removePuff after duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const removePuff = vi.fn();

    render(
      <Puff
        id="test-id"
        title="Timer Test"
        duration={3000}
        onClose={onClose}
        removePuff={removePuff}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalled();
    expect(removePuff).toHaveBeenCalledWith('test-id');

    vi.useRealTimers();
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
});
