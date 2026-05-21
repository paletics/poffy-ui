import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { AspectRatio } from './AspectRatio';

describe('AspectRatio Component', () => {
  it('renders children correctly', () => {
    render(<AspectRatio>Content</AspectRatio>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies aspectRatio class', () => {
    const { container } = render(<AspectRatio>Content</AspectRatio>);
    expect(container.firstChild).toHaveClass(/aspect-ratio/);
  });

  it('sets aspectRatio style', () => {
    const { container } = render(<AspectRatio ratio={16 / 9}>Content</AspectRatio>);
    const style = container.firstChild as HTMLElement;
    expect(style.style.aspectRatio).toBeDefined();
  });

  it('preserves consumer style while setting the ratio variable', () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3} style={{ color: 'red' }}>
        Content
      </AspectRatio>,
    );
    const element = container.firstChild as HTMLElement;

    expect(element).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(element.style.getPropertyValue('--aspect-ratio')).toBe(`${4 / 3}`);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<AspectRatio ratio={16 / 9}>Content</AspectRatio>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
