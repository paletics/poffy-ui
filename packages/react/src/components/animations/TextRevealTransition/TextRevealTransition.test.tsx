import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { TextRevealTransition } from './TextRevealTransition';

describe('TextRevealTransition', () => {
  it('renders text correctly', () => {
    const text = 'Hello';
    render(<TextRevealTransition>{text}</TextRevealTransition>);
    expect(screen.getByLabelText(text)).toBeInTheDocument();
  });

  it('splits text into characters for bounce animation', () => {
    const text = 'ABC';
    const { container } = render(
      <TextRevealTransition animationType="bounce">{text}</TextRevealTransition>,
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThanOrEqual(text.length);
    expect(container.textContent).toContain(text);
  });

  it('splits text into words for word-pop animation', () => {
    const text = 'Hello World';
    const { container } = render(
      <TextRevealTransition animationType="word-pop">{text}</TextRevealTransition>,
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThanOrEqual(2);
    expect(container.textContent).toContain('Hello');
    expect(container.textContent).toContain('World');
  });

  it('renders as a custom element', () => {
    render(
      <TextRevealTransition asChild>
        <h1>Heading</h1>
      </TextRevealTransition>,
    );
    const element = screen.getByLabelText('Heading');
    expect(element.tagName).toBe('H1');
  });

  it('applies custom className', () => {
    const { container } = render(
      <TextRevealTransition className="custom-test-class">Text</TextRevealTransition>,
    );
    expect(container.firstChild).toHaveClass('custom-test-class');
  });

  it('has no a11y violations', async () => {
    const text = 'Accessible Text';
    const { container } = render(<TextRevealTransition>{text}</TextRevealTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
