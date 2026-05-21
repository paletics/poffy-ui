import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders with content', () => {
    render(
      <Badge content="99">
        <div>Child</div>
      </Badge>,
    );
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('renders zero content', () => {
    render(
      <Badge content={0}>
        <div>Child</div>
      </Badge>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders styles based on intent', () => {
    const { container } = render(
      <Badge content="Test" intent="danger">
        Child
      </Badge>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain('badge__root');
  });

  it('supports polymorphism via asChild', () => {
    render(
      <Badge asChild content="Poly">
        <span data-testid="poly-child">Child</span>
      </Badge>,
    );
    const child = screen.getByTestId('poly-child');
    expect(child).toBeInTheDocument();
    expect(child.tagName).toBe('SPAN');
    expect(screen.getByText('Poly')).toBeInTheDocument();
  });

  it('renders zero content with asChild', () => {
    render(
      <Badge asChild content={0}>
        <span data-testid="poly-child">Child</span>
      </Badge>,
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders properly without children', () => {
    render(<Badge content="Standalone" />);
    expect(screen.getByText('Standalone')).toBeInTheDocument();
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <Badge content="1">
        <button>Button</button>
      </Badge>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
