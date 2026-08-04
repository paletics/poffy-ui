import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { RevealTransition } from './RevealTransition';

describe('RevealTransition', () => {
  it('renders children correctly', () => {
    render(<RevealTransition>Reveal Content</RevealTransition>);
    expect(screen.getByText('Reveal Content')).toBeInTheDocument();
  });

  it('renders as a custom element', () => {
    render(
      <RevealTransition asChild>
        <section>Section Content</section>
      </RevealTransition>,
    );
    const element = screen.getByText('Section Content');
    expect(element.tagName).toBe('SECTION');
  });

  it('falls back to a div for invalid asChild children', () => {
    const { container } = render(
      <RevealTransition asChild>
        <>Fragment content</>
      </RevealTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(container).toHaveTextContent('Fragment content');
  });

  it('applies custom className', () => {
    render(<RevealTransition className="custom-reveal">Content</RevealTransition>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass('custom-reveal');
  });

  it('accepts threshold and once props without type errors', () => {
    render(
      <RevealTransition threshold={0.5} once={false}>
        Threshold Content
      </RevealTransition>,
    );
    expect(screen.getByText('Threshold Content')).toBeInTheDocument();
  });

  it('accepts blur preset overrides', () => {
    render(
      <RevealTransition animationType="blur" blurAmount={18} duration={0.6}>
        Blurred content
      </RevealTransition>,
    );
    expect(screen.getByText('Blurred content')).toBeInTheDocument();
  });

  it('falls back to the default preset for unknown runtime values', () => {
    render(<RevealTransition animationType={'unknown' as never}>Content</RevealTransition>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('passes extra props to the underlying element', () => {
    render(<RevealTransition data-testid="reveal-box">Test</RevealTransition>);
    expect(screen.getByTestId('reveal-box')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<RevealTransition>Accessible Reveal</RevealTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
