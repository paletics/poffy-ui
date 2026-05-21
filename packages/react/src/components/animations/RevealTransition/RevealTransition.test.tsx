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

  it('passes extra props to the underlying element', () => {
    render(<RevealTransition data-testid="reveal-box">Test</RevealTransition>);
    expect(screen.getByTestId('reveal-box')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<RevealTransition>Accessible Reveal</RevealTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
