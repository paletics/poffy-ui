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

  it('remains in DOM when isVisible is false and keepMounted is true', () => {
    render(
      <OverlayTransition isVisible={false} keepMounted={true} data-testid="overlay">
        Overlay Content
      </OverlayTransition>,
    );
    const element = screen.getByTestId('overlay');
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveAttribute('data-visible', 'false');
    expect(element).toHaveStyle({ pointerEvents: 'none' });
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <OverlayTransition isVisible>Accessible Overlay</OverlayTransition>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
