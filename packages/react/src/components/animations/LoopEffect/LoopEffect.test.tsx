import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { LoopEffect } from './LoopEffect';

describe('LoopEffect', () => {
  it('renders children correctly', () => {
    render(<LoopEffect>Test Content</LoopEffect>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders as a custom element', () => {
    render(
      <LoopEffect asChild>
        <span>Span Content</span>
      </LoopEffect>,
    );
    const element = screen.getByText('Span Content');
    expect(element.tagName).toBe('SPAN');
  });

  it('applies className correctly', () => {
    render(<LoopEffect className="test-class">Content</LoopEffect>);
    const element = screen.getByText('Content');
    expect(element).toHaveClass('test-class');
  });

  it('passes extra props to the element', () => {
    render(<LoopEffect data-testid="test-element">Content</LoopEffect>);
    expect(screen.getByTestId('test-element')).toBeInTheDocument();
  });

  it('renders with default float animation type', () => {
    render(<LoopEffect>Default Animation</LoopEffect>);
    expect(screen.getByText('Default Animation')).toBeInTheDocument();
  });

  it('renders correctly with pulse animation type', () => {
    render(<LoopEffect animationType="pulse">Pulse</LoopEffect>);
    expect(screen.getByText('Pulse')).toBeInTheDocument();
  });

  it('renders correctly with spin animation type', () => {
    render(<LoopEffect animationType="spin">Spin</LoopEffect>);
    expect(screen.getByText('Spin')).toBeInTheDocument();
  });

  it('renders correctly with shake animation type', () => {
    render(<LoopEffect animationType="shake">Shake</LoopEffect>);
    expect(screen.getByText('Shake')).toBeInTheDocument();
  });

  it('renders correctly with bounce animation type', () => {
    render(<LoopEffect animationType="bounce">Bounce</LoopEffect>);
    expect(screen.getByText('Bounce')).toBeInTheDocument();
  });

  it('renders correctly with none animation type', () => {
    render(<LoopEffect animationType="none">No Animation</LoopEffect>);
    expect(screen.getByText('No Animation')).toBeInTheDocument();
  });

  it('handles isPaused prop correctly', () => {
    render(
      <LoopEffect isPaused data-testid="paused-element">
        Paused Content
      </LoopEffect>,
    );
    const element = screen.getByTestId('paused-element');
    expect(element).toBeInTheDocument();
  });

  it('renders as a button with proper attributes', () => {
    const handleClick = () => undefined;
    render(
      <LoopEffect asChild onClick={handleClick}>
        <button disabled>Button Content</button>
      </LoopEffect>,
    );
    const button = screen.getByText('Button Content');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('disabled');
  });

  it('merges inline styles correctly', () => {
    render(
      <LoopEffect style={{ backgroundColor: 'red' }} data-testid="styled-element">
        Styled Content
      </LoopEffect>,
    );
    const element = screen.getByTestId('styled-element');
    expect(element).toBeInTheDocument();
  });

  it('handles customData prop without errors', () => {
    render(
      <LoopEffect customData={{ duration: 3, floatDistance: 10 }} animationType="float">
        Custom Data
      </LoopEffect>,
    );
    expect(screen.getByText('Custom Data')).toBeInTheDocument();
  });

  it('handles custom duration prop', () => {
    render(
      <LoopEffect duration={2.5} animationType="pulse">
        Custom Duration
      </LoopEffect>,
    );
    expect(screen.getByText('Custom Duration')).toBeInTheDocument();
  });

  it('handles combined isPaused and animationType props', () => {
    render(
      <LoopEffect animationType="bounce" isPaused={true} data-testid="paused-bounce">
        Paused Bounce
      </LoopEffect>,
    );
    const element = screen.getByTestId('paused-bounce');
    expect(element).toBeInTheDocument();
  });

  it('renders correctly when isPaused is false', () => {
    render(
      <LoopEffect animationType="float" isPaused={false}>
        Active Animation
      </LoopEffect>,
    );
    expect(screen.getByText('Active Animation')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<LoopEffect>Accessible Loop</LoopEffect>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
