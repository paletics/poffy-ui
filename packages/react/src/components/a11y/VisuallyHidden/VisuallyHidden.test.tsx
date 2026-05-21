import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden Utility', () => {
  it('renders content correctly in the DOM', () => {
    render(<VisuallyHidden>Hidden Text</VisuallyHidden>);
    expect(screen.getByText('Hidden Text')).toBeInTheDocument();
  });

  it('applies a generated screen-reader-only class', () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const element = container.firstChild as HTMLElement;
    expect(element.className).not.toHaveLength(0);
  });

  it('supports custom HTML elements via asChild pattern', () => {
    const { container } = render(
      <VisuallyHidden asChild>
        <div>Hidden Div</div>
      </VisuallyHidden>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('defaults to a "span" element', () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<VisuallyHidden>Screen reader text</VisuallyHidden>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
