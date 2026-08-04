import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { PathDrawTransition } from './PathDrawTransition';

describe('PathDrawTransition', () => {
  it('renders SVG path primitives', () => {
    const { container } = render(
      <PathDrawTransition viewBox="0 0 24 24">
        <PathDrawTransition.Path d="M4 12l5 5 11-11" />
      </PathDrawTransition>,
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('path')).toBeInTheDocument();
  });

  it('renders line and polyline primitives', () => {
    const { container } = render(
      <PathDrawTransition viewBox="0 0 24 24">
        <PathDrawTransition.Line x1="4" y1="12" x2="20" y2="12" />
        <PathDrawTransition.Polyline points="20 6 9 17 4 12" />
      </PathDrawTransition>,
    );
    expect(container.querySelector('line')).toBeInTheDocument();
    expect(container.querySelector('polyline')).toBeInTheDocument();
  });

  it('marks visibility state on the svg root', () => {
    const { container } = render(
      <PathDrawTransition viewBox="0 0 24 24" isVisible={false}>
        <PathDrawTransition.Path d="M4 12l5 5 11-11" />
      </PathDrawTransition>,
    );
    expect(container.querySelector('svg')).toHaveAttribute('data-visible', 'false');
  });

  it('renders the hidden terminal state immediately when animation is disabled', () => {
    const { container } = render(
      <AnimationProvider defaultAnimationEnabled={false}>
        <PathDrawTransition viewBox="0 0 24 24" isVisible={false}>
          <PathDrawTransition.Path d="M4 12l5 5 11-11" />
        </PathDrawTransition>
      </AnimationProvider>,
    );

    expect(container.querySelector('path')).toHaveAttribute('opacity', '0');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <PathDrawTransition viewBox="0 0 24 24" aria-hidden="true">
        <PathDrawTransition.Path d="M4 12l5 5 11-11" />
      </PathDrawTransition>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
