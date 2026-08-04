import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Blockquote } from './Blockquote';

/**
 * ### Test Strategy: Blockquote
 * - **Focus**: semantic quote markup, variant class application, polymorphic slot behavior, and a11y.
 * - **DON'T**: Do not test visual token values or browser quote styling.
 */
describe('Blockquote', () => {
  it('renders a semantic blockquote by default', () => {
    const { getByText } = render(<Blockquote>Design is how it works.</Blockquote>);

    expect(getByText('Design is how it works.').tagName).toBe('BLOCKQUOTE');
  });

  it('applies tone variants and class names', () => {
    const { getByText } = render(
      <Blockquote tone="neutral" className="custom-quote">
        Ship small pieces.
      </Blockquote>,
    );

    expect(getByText('Ship small pieces.')).toHaveClass('poffy-blockquote');
    expect(getByText('Ship small pieces.')).toHaveClass('custom-quote');
  });

  it('preserves element children during normal rendering', () => {
    const { getByText } = render(
      <Blockquote>
        <cite>Grace Hopper</cite>
      </Blockquote>,
    );

    expect(getByText('Grace Hopper').tagName).toBe('CITE');
  });

  it('preserves quote semantics when asChild receives a non-quote host', () => {
    const { getByText } = render(
      <Blockquote asChild>
        <figure>Quoted in a figure.</figure>
      </Blockquote>,
    );

    expect(getByText('Quoted in a figure.').tagName).toBe('BLOCKQUOTE');
    expect(getByText('Quoted in a figure.')).toHaveClass('poffy-blockquote');
  });

  it('keeps cite metadata when falling back from an invalid asChild host', () => {
    const { getByText } = render(
      <Blockquote asChild cite="https://example.com/source">
        <div>Quoted source.</div>
      </Blockquote>,
    );

    expect(getByText('Quoted source.')).toHaveAttribute('cite', 'https://example.com/source');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Blockquote>Accessible quote text.</Blockquote>);

    expect(await axe(container)).toHaveNoViolations();
  });
});
