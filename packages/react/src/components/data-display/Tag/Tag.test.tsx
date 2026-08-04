import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Tag, TagLabel, TagCloseButton } from './index';

const RouterLink = forwardRef<HTMLAnchorElement, { children?: ReactNode }>(({ children }, ref) => (
  <a ref={ref} href="/filters">
    {children}
  </a>
));
RouterLink.displayName = 'RouterLink';
const ForwardedButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children}
    </button>
  ),
);
ForwardedButton.displayName = 'ForwardedButton';

const TagContentWrapper = ({ children }: { children?: ReactNode }) => <span>{children}</span>;
const Dismiss = () => <TagCloseButton aria-label="Remove" />;
const ForwardedTagRoot = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  (props, ref) => <span ref={ref} {...props} />,
);
ForwardedTagRoot.displayName = 'ForwardedTagRoot';
const ForwardedTagLabel = forwardRef<HTMLElement, ComponentPropsWithoutRef<'em'>>((props, ref) => (
  <em ref={ref} {...props} />
));
ForwardedTagLabel.displayName = 'ForwardedTagLabel';

describe('Tag', () => {
  it('renders correctly', () => {
    render(
      <Tag>
        <TagLabel>Test Tag</TagLabel>
        <TagCloseButton />
      </Tag>,
    );
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('renders as child', () => {
    render(
      <Tag asChild>
        <div data-testid="custom-tag">
          <TagLabel asChild>
            <span data-testid="custom-label">Label</span>
          </TagLabel>
        </div>
      </Tag>,
    );

    expect(screen.getByTestId('custom-tag')).toBeInTheDocument();
    expect(screen.getByTestId('custom-tag').tagName).toBe('DIV');
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByTestId('custom-label').tagName).toBe('SPAN');
  });

  it('supports explicit opaque forwarding hosts for Root and Label', () => {
    render(
      <Tag asChild>
        <ForwardedTagRoot data-testid="forwarded-root">
          <TagLabel asChild>
            <ForwardedTagLabel data-testid="forwarded-label">Label</ForwardedTagLabel>
          </TagLabel>
        </ForwardedTagRoot>
      </Tag>,
    );

    expect(screen.getByTestId('forwarded-root').tagName).toBe('SPAN');
    expect(screen.getByTestId('forwarded-label').tagName).toBe('EM');
  });

  it('forwards delegated refs and exposes the delegated close host to events', () => {
    const rootRef = createRef<HTMLElement>();
    const labelRef = createRef<HTMLElement>();
    const closeRef = createRef<HTMLElement>();
    const currentTargets: HTMLElement[] = [];

    render(
      <>
        <Tag asChild ref={rootRef}>
          <ForwardedTagRoot data-testid="forwarded-root-with-ref">
            <TagLabel asChild ref={labelRef}>
              <ForwardedTagLabel data-testid="forwarded-label-with-ref">Label</ForwardedTagLabel>
            </TagLabel>
          </ForwardedTagRoot>
        </Tag>
        <Tag>
          <TagCloseButton
            asChild
            ref={closeRef}
            onClick={(event) => currentTargets.push(event.currentTarget)}
          >
            <span>Remove</span>
          </TagCloseButton>
        </Tag>
      </>,
    );

    expect(rootRef.current).toBe(screen.getByTestId('forwarded-root-with-ref'));
    expect(labelRef.current).toBe(screen.getByTestId('forwarded-label-with-ref'));

    const close = screen.getByRole('button', { name: /close/i });
    expect(closeRef.current).toBe(close);
    fireEvent.click(close);
    expect(currentTargets).toEqual([close]);
  });

  it('TagCloseButton renders as child', () => {
    render(
      <Tag>
        <TagCloseButton asChild>
          <a href="/test" data-testid="custom-close">
            Close
          </a>
        </TagCloseButton>
      </Tag>,
    );
    const close = screen.getByTestId('custom-close');
    expect(close).toBeInTheDocument();
    expect(close.tagName).toBe('A');
    expect(close).toHaveAttribute('role', 'button');
    expect(close).not.toHaveAttribute('href');
  });

  it('provides keyboard activation and a managed label for non-button close hosts', () => {
    const onClick = vi.fn();
    render(
      <Tag>
        <TagCloseButton asChild aria-label="Remove React" onClick={onClick}>
          <a href="/remove">Remove</a>
        </TagCloseButton>
      </Tag>,
    );

    const close = screen.getByRole('button', { name: 'Remove React' });
    fireEvent.keyDown(close, { key: ' ' });
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.keyUp(close, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('lets an enabled close consumer observe click before blocking delegated navigation', () => {
    const observedDefaultPrevented: boolean[] = [];
    render(
      <Tag>
        <TagCloseButton
          asChild
          onClick={(event) => observedDefaultPrevented.push(event.defaultPrevented)}
        >
          <a href="/remove">Remove</a>
        </TagCloseButton>
      </Tag>,
    );

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const dispatched = screen.getByRole('button', { name: /close/i }).dispatchEvent(event);

    expect(observedDefaultPrevented).toEqual([false]);
    expect(dispatched).toBe(false);
    expect(event.defaultPrevented).toBe(true);
  });

  it('handles close button click', () => {
    const handleClick = vi.fn();
    render(
      <Tag>
        <TagCloseButton onClick={handleClick} />
      </Tag>,
    );
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]!);
    expect(handleClick).toHaveBeenCalled();
  });

  it('does not submit its containing form by default', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Tag>
          <TagCloseButton />
        </Tag>
      </form>,
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit its containing form when conflicting button types are provided', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Tag>
          <TagCloseButton type="submit" />
          <TagCloseButton asChild>
            <button type="submit">Remove child</button>
          </TagCloseButton>
        </Tag>
      </form>,
    );

    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]!);
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[1]!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('falls back safely from a custom button host in a form', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Tag>
          <TagCloseButton asChild>
            <ForwardedButton>Remove custom</ForwardedButton>
          </TagCloseButton>
        </Tag>
      </form>,
    );

    const close = screen.getByRole('button', { name: /close/i });
    expect(close).toHaveTextContent('Remove custom');
    expect(close).toHaveAttribute('type', 'button');
    fireEvent.click(close);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('blocks disabled asChild close actions', () => {
    const onClick = vi.fn();
    render(
      <Tag>
        <TagCloseButton asChild isDisabled>
          <a href="/remove" onClick={onClick}>
            Close
          </a>
        </TagCloseButton>
      </Tag>,
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('blocks disabled asChild auxiliary activation before handlers run', () => {
    const onChildAuxClick = vi.fn();
    const onCloseAuxClick = vi.fn();
    render(
      <Tag>
        <TagCloseButton asChild isDisabled onAuxClick={onCloseAuxClick}>
          <a href="/remove" onAuxClick={onChildAuxClick}>
            Close
          </a>
        </TagCloseButton>
      </Tag>,
    );

    const close = screen.getByRole('button', { name: /close/i });
    expect(
      close.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);
    expect(onChildAuxClick).not.toHaveBeenCalled();
    expect(onCloseAuxClick).not.toHaveBeenCalled();
  });

  it('blocks disabled asChild capture, keyboard, and pointer handlers', () => {
    const onClickCapture = vi.fn();
    const onKeyUpCapture = vi.fn();
    const onPointerDownCapture = vi.fn();
    render(
      <Tag>
        <TagCloseButton asChild isDisabled aria-label="Remove tag">
          <a
            href="/remove"
            aria-disabled={false}
            onClickCapture={onClickCapture}
            onKeyUpCapture={onKeyUpCapture}
            onPointerDownCapture={onPointerDownCapture}
          >
            Remove
          </a>
        </TagCloseButton>
      </Tag>,
    );

    const close = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.click(close);
    fireEvent.keyUp(close, { key: 'Enter' });
    fireEvent.pointerDown(close);
    expect(onClickCapture).not.toHaveBeenCalled();
    expect(onKeyUpCapture).not.toHaveBeenCalled();
    expect(onPointerDownCapture).not.toHaveBeenCalled();
    expect(close).toHaveAttribute('aria-disabled', 'true');
  });

  it('uses one disabled state for isDisabled and native disabled props', () => {
    render(
      <Tag>
        <TagCloseButton isDisabled disabled={false} />
      </Tag>,
    );
    expect(screen.getByRole('button', { name: /close/i })).toBeDisabled();
  });

  it('passes disabled to a native button used as the asChild host', () => {
    render(
      <Tag>
        <TagCloseButton asChild isDisabled>
          <button type="button">Remove</button>
        </TagCloseButton>
      </Tag>,
    );
    expect(screen.getByRole('button', { name: /close/i })).toBeDisabled();
  });

  it('falls back to native hosts for invalid Root and Label asChild children', () => {
    const { container } = render(
      <Tag asChild>
        <>Tag content</>
      </Tag>,
    );
    expect(container.firstChild?.nodeName).toBe('SPAN');

    render(
      <Tag>
        <TagLabel asChild>Label content</TagLabel>
      </Tag>,
    );
    expect(screen.getByText('Label content').tagName).toBe('SPAN');
  });

  it('keeps close buttons out of interactive asChild roots', async () => {
    const { container } = render(
      <Tag asChild>
        <a href="/filters">
          <TagLabel>React</TagLabel>
          <TagCloseButton aria-label="Remove React" />
        </a>
      </Tag>,
    );

    expect(container.firstChild?.nodeName).toBe('SPAN');
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back to inline label content for flow asChild hosts', () => {
    render(
      <Tag>
        <TagLabel asChild>
          <div data-testid="flow-label">React</div>
        </TagLabel>
      </Tag>,
    );

    const label = screen.getByText('React');
    expect(label.tagName).toBe('SPAN');
    expect(label.querySelector('div')).toBeNull();
  });

  it('removes nested flow content from inline label fallbacks', () => {
    render(
      <Tag>
        <TagLabel asChild>
          <div>
            <p>React</p>
          </div>
        </TagLabel>
      </Tag>,
    );

    const label = screen.getByText('React');
    expect(label.tagName).toBe('SPAN');
    expect(label.closest('span')?.querySelector('div, p')).toBeNull();
  });

  it('removes nested flow content from interactive root fallbacks', async () => {
    const { container } = render(
      <Tag asChild>
        <a href="/filters">
          <div>
            <TagCloseButton aria-label="Remove React" />
          </div>
        </a>
      </Tag>,
    );

    expect(container.firstChild?.nodeName).toBe('SPAN');
    expect(container.querySelector('a, div')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps close buttons out of interactive label hosts', async () => {
    const { container } = render(
      <Tag>
        <TagLabel asChild>
          <a href="/filters">
            <TagCloseButton aria-label="Remove React" />
          </a>
        </TagLabel>
      </Tag>,
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps close buttons out of custom link hosts', async () => {
    const { container } = render(
      <Tag asChild>
        <RouterLink>
          <TagCloseButton aria-label="Remove React" />
        </RouterLink>
      </Tag>,
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back from opaque interactive root children that render a close button', async () => {
    const { container } = render(
      <Tag asChild>
        <a href="/filters">
          <Dismiss />
        </a>
      </Tag>,
    );

    expect(container.firstChild?.nodeName).toBe('SPAN');
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps close buttons out of interactive hosts through custom wrappers', async () => {
    const { container } = render(
      <Tag asChild>
        <a href="/filters">
          <TagContentWrapper>
            <TagCloseButton aria-label="Remove React" />
          </TagContentWrapper>
        </a>
      </Tag>,
    );

    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps close buttons out of role, focusable, and editable delegated hosts', async () => {
    const { container } = render(
      <>
        <Tag asChild>
          <section role="button" data-testid="role-root">
            Role root
            <TagCloseButton aria-label="Remove role tag" />
          </section>
        </Tag>
        <Tag asChild>
          <div tabIndex={-1} data-testid="focusable-root">
            Focusable root
            <TagCloseButton aria-label="Remove focusable tag" />
          </div>
        </Tag>
        <Tag>
          <TagLabel asChild>
            <span contentEditable data-testid="editable-label">
              Editable label
              <TagCloseButton aria-label="Remove editable tag" />
            </span>
          </TagLabel>
        </Tag>
      </>,
    );

    expect(screen.queryByTestId('role-root')).not.toBeInTheDocument();
    expect(screen.queryByTestId('focusable-root')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editable-label')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Role root' })).not.toBeInTheDocument();
    expect(container.querySelector('[tabindex], [contenteditable]')).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove role tag' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove focusable tag' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove editable tag' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back safely for incompatible close asChild hosts', async () => {
    const { container, rerender } = render(
      <Tag>
        <TagCloseButton asChild>
          <select aria-label="Dismiss target">
            <option>Remove</option>
          </select>
        </TagCloseButton>
      </Tag>,
    );

    expect(screen.getByRole('button', { name: /close/i })).not.toHaveAttribute('role');
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(await axe(container)).toHaveNoViolations();

    rerender(
      <Tag>
        <TagCloseButton asChild>
          <input aria-label="Dismiss target" />
        </TagCloseButton>
      </Tag>,
    );
    expect(screen.getByRole('button', { name: /close/i }).querySelector('input')).toBeNull();
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Tag ref={ref}>Tag</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <Tag>
        <TagLabel>Accessible Tag</TagLabel>
        <TagCloseButton />
      </Tag>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
