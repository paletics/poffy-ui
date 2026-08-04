import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { OverlayTransition } from './OverlayTransition';

describe('OverlayTransition', () => {
  it('renders correctly when isVisible is true', () => {
    render(<OverlayTransition isVisible>Overlay Content</OverlayTransition>);
    expect(screen.getByText('Overlay Content')).toBeInTheDocument();
  });

  it('unmounts when isVisible is false and keepMounted is false', () => {
    const { queryByText } = render(
      <OverlayTransition isVisible={false} keepMounted={false}>
        Overlay Content
      </OverlayTransition>,
    );
    expect(queryByText('Overlay Content')).not.toBeInTheDocument();
  });

  it('falls back to a div for invalid asChild children', () => {
    const { container } = render(
      <OverlayTransition asChild isVisible>
        <>Fragment content</>
      </OverlayTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(container).toHaveTextContent('Fragment content');
  });

  it('remains in DOM when isVisible is false and keepMounted is true', () => {
    render(
      <OverlayTransition isVisible={false} keepMounted={true} data-testid="overlay">
        Overlay Content
      </OverlayTransition>,
    );
    const element = screen.getByTestId('overlay');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveAttribute('inert');
    expect(element).toHaveAttribute('data-visible', 'false');
    expect(element).toHaveStyle({ pointerEvents: 'none' });
  });

  it('keeps persistent hidden content inert when consumer props conflict', () => {
    const { rerender } = render(
      <OverlayTransition
        isVisible={false}
        keepMounted
        data-testid="overlay"
        inert={false}
        aria-hidden={false}
      >
        Overlay Content
      </OverlayTransition>,
    );

    const element = screen.getByTestId('overlay');
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveAttribute('inert');
    expect(element).toHaveStyle({ pointerEvents: 'none' });

    rerender(
      <OverlayTransition
        isVisible
        keepMounted
        data-testid="overlay"
        inert={false}
        aria-hidden={false}
      >
        Overlay Content
      </OverlayTransition>,
    );

    expect(element).toHaveAttribute('aria-hidden', 'false');
    expect(element).not.toHaveAttribute('inert');
  });

  it('keeps a persistent asChild surface inert when its props conflict', () => {
    render(
      <OverlayTransition asChild isVisible={false} keepMounted>
        <button aria-hidden={false} inert={false} style={{ pointerEvents: 'auto' }}>
          Overlay Content
        </button>
      </OverlayTransition>,
    );

    const element = screen.getByRole('button', { hidden: true });
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveAttribute('inert');
    expect(element).toHaveStyle({ pointerEvents: 'none' });
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <OverlayTransition isVisible>Accessible Overlay</OverlayTransition>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
